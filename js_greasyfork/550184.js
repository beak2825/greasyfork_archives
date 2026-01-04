// ==UserScript==
// @name         Kick Auto-Chat Melhorado
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Envia mensagens automáticas no chat da Kick com interface melhorada e detecção de stream corrigida
// @author       KspaceSate
// @match        https://kick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550184/Kick%20Auto-Chat%20Melhorado.user.js
// @updateURL https://update.greasyfork.org/scripts/550184/Kick%20Auto-Chat%20Melhorado.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configurações padrão
    const CONFIG_PADRAO = {
        mensagens: [
            "PELA GLÓRIA DO IMPERADOR! Estou presente nesta batalha, meus camaradas!",
            "Managed Democracy chega a este sistema! Helldiver presente para servir!",
            "PELA ÁGUIA IMPERIAL! Estou vigilante nesta transmissão, prontos para o serviço!",
            "Paranaue parana paranaeue parana",
        ],
        intervaloMinutos: 30,
        contadorMensagens: 0,
        ultimaExecucao: null,
        expiracaoHoras: 24,
    };

    // Chaves para localStorage
    const STORAGE_KEYS = {
        CONFIG: "kick_autochat_config",
        ESTADO: "kick_autochat_estado",
        STREAMS: "kick_autochat_streams",
    };

    // Variáveis globais
    let MENSAGENS = [];
    let INTERVALO_MINUTOS = 30;
    let INTERVALO_MS = 30 * 60 * 1000;

    let intervaloId = null;
    let contadorMensagens = 0;
    let isEnabled = false;
    let proximoEnvio = null;
    let ultimaExecucao = null;
    let isMinimized = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let panel = null;
    let icon = null;
    let editandoMensagens = false;
    let streamAtual = null;
    let observerStream = null;

    // Função melhorada para obter o stream atual
    function obterStreamAtual() {
        try {
            const pathname = window.location.pathname;
            console.log(`[DEBUG] pathname: ${pathname}`);

            const streamMatch = pathname.match(/^\/([^\/\?#]+)/);
            if (
                streamMatch &&
                streamMatch[1] &&
                ![
                    "live",
                    "browse",
                    "search",
                    "categories",
                    "dashboard",
                    "settings",
                    "profile",
                    "",
                ].includes(streamMatch[1])
            ) {
                const stream = streamMatch[1].toLowerCase();
                console.log(`[DEBUG] Stream da URL: ${stream}`);
                return stream;
            }

            const selectors = [
                '[data-testid="username"]',
                ".username",
                '[data-testid="channel-name"]',
                ".channel-name",
                'h1[class*="username"]',
                'span[class*="username"]',
                ".streamer-name",
                ".channel-header-name",
            ];

            for (let selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = (element.textContent || element.innerText || "").trim();
                    console.log(`[DEBUG] Elemento ${selector}: "${text}"`);

                    if (text && text.length > 0 && text.length < 50) {
                        const cleanText = text.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
                        if (cleanText.length > 0) {
                            console.log(`[DEBUG] Stream do elemento: ${cleanText}`);
                            return cleanText;
                        }
                    }
                }
            }

            console.log("[DEBUG] Nenhum stream detectado");
            return null;
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao obter stream atual:", error);
            return null;
        }
    }

    // Função para verificar se o stream mudou
    function verificarMudancaStream() {
        const novoStream = obterStreamAtual();

        if (novoStream && novoStream !== streamAtual) {
            console.log(
                `[Kick AutoChat] Stream mudou: ${streamAtual} -> ${novoStream}`
      );

            if (streamAtual) {
                salvarDadosStream(streamAtual);
            }

            if (intervaloId) {
                pararAutoChat();
            }

            streamAtual = novoStream;
            carregarDadosStream(streamAtual);
            atualizarInterfaceStream();
            salvarEstado();

            return true;
        }

        return false;
    }

    // Função para salvar dados específicos do stream
    function salvarDadosStream(streamNome) {
        if (!streamNome) return;

        try {
            const streamsData = carregarTodosStreams();
            const streamKey = `stream_${streamNome}`;

            streamsData[streamKey] = {
                mensagens: MENSAGENS,
                intervaloMinutos: INTERVALO_MINUTOS,
                contadorMensagens: contadorMensagens,
                ultimaExecucao: ultimaExecucao,
                timestamp: Date.now(),
            };

            localStorage.setItem(STORAGE_KEYS.STREAMS, JSON.stringify(streamsData));
            console.log(`[Kick AutoChat] Dados salvos para stream: ${streamNome}`);
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao salvar dados do stream:", error);
        }
    }

    // Função para carregar dados específicos do stream
    function carregarDadosStream(streamNome) {
        if (!streamNome) {
            carregarConfiguracao();
            return;
        }

        try {
            const streamsData = carregarTodosStreams();
            const streamKey = `stream_${streamNome}`;

            if (streamsData[streamKey]) {
                const streamConfig = streamsData[streamKey];

                MENSAGENS = streamConfig.mensagens || CONFIG_PADRAO.mensagens;
                INTERVALO_MINUTOS =
                    streamConfig.intervaloMinutos || CONFIG_PADRAO.intervaloMinutos;
                INTERVALO_MS = INTERVALO_MINUTOS * 60 * 1000;
                contadorMensagens = streamConfig.contadorMensagens || 0;
                ultimaExecucao = streamConfig.ultimaExecucao
                    ? new Date(streamConfig.ultimaExecucao)
                : null;

                console.log(
                    `[Kick AutoChat] Dados carregados para stream: ${streamNome}`
        );
            } else {
                carregarConfiguracao();
                console.log(
                    `[Kick AutoChat] Novo stream: ${streamNome}, usando padrões`
        );
            }
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao carregar dados do stream:", error);
            carregarConfiguracao();
        }
    }

    // Função para carregar todos os streams salvos
    function carregarTodosStreams() {
        try {
            const streamsSalvos = localStorage.getItem(STORAGE_KEYS.STREAMS);
            return streamsSalvos ? JSON.parse(streamsSalvos) : {};
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao carregar streams:", error);
            return {};
        }
    }

    // Função para atualizar a interface com informações do stream
    function atualizarInterfaceStream() {
        if (!panel) return;

        const streamInfo = document.getElementById("kickAutochatStreamInfo");
        if (!streamInfo) return;

        if (streamAtual) {
            streamInfo.innerHTML = `📺 Stream: <strong style="color: #00ff00;">${streamAtual}</strong>`;
            streamInfo.title = `Stream atual: ${streamAtual}`;
        } else {
            streamInfo.innerHTML =
                '📺 Stream: <strong style="color: #ff4444;">Não identificado</strong>';
            streamInfo.title = "Stream não identificado";
        }
    }

    // Função para iniciar observação de mudanças de stream
    function iniciarObservacaoStream() {
        const streamPagina = obterStreamAtual();
        console.log(
            `[Kick AutoChat] Verificação - Página: ${streamPagina}, Salvo: ${streamAtual}`
    );

        if (streamPagina && streamPagina !== streamAtual) {
            console.log(
                `[Kick AutoChat] Atualizando stream: ${streamAtual} -> ${streamPagina}`
      );

            if (streamAtual) {
                salvarDadosStream(streamAtual);
            }

            if (intervaloId) {
                pararAutoChat();
            }

            streamAtual = streamPagina;
            carregarDadosStream(streamAtual);
        } else if (!streamAtual && streamPagina) {
            streamAtual = streamPagina;
            carregarDadosStream(streamAtual);
            console.log(`[Kick AutoChat] Stream detectado: ${streamAtual}`);
        }

        atualizarInterfaceStream();

        let ultimaURL = window.location.href;
        observerStream = setInterval(() => {
            const urlAtual = window.location.href;
            if (urlAtual !== ultimaURL) {
                ultimaURL = urlAtual;
                setTimeout(() => {
                    verificarMudancaStream();
                }, 1000);
            }
        }, 1000);
    }

    // Função para salvar configurações
    function salvarConfiguracao() {
        const config = {
            mensagens: MENSAGENS,
            intervaloMinutos: INTERVALO_MINUTOS,
            contadorMensagens: contadorMensagens,
            ultimaExecucao: ultimaExecucao,
            timestamp: Date.now(),
        };

        try {
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
            if (streamAtual) {
                salvarDadosStream(streamAtual);
            }
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao salvar configuração:", error);
        }
    }

    // Função para salvar estado atual
    function salvarEstado() {
        const estado = {
            isEnabled: isEnabled,
            proximoEnvio: proximoEnvio,
            isMinimized: isMinimized,
            streamAtual: streamAtual,
            timestamp: Date.now(),
        };

        try {
            localStorage.setItem(STORAGE_KEYS.ESTADO, JSON.stringify(estado));
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao salvar estado:", error);
        }
    }

    // Função para carregar configurações
    function carregarConfiguracao() {
        try {
            const configSalva = localStorage.getItem(STORAGE_KEYS.CONFIG);
            if (configSalva) {
                const config = JSON.parse(configSalva);
                const agora = Date.now();
                const tempoDecorrido = agora - (config.timestamp || 0);
                const tempoExpiracao = 24 * 60 * 60 * 1000;

                if (tempoDecorrido < tempoExpiracao) {
                    MENSAGENS = config.mensagens || CONFIG_PADRAO.mensagens;
                    INTERVALO_MINUTOS =
                        config.intervaloMinutos || CONFIG_PADRAO.intervaloMinutos;
                    INTERVALO_MS = INTERVALO_MINUTOS * 60 * 1000;
                    contadorMensagens = config.contadorMensagens || 0;
                    ultimaExecucao = config.ultimaExecucao
                        ? new Date(config.ultimaExecucao)
                    : null;
                    return true;
                } else {
                    localStorage.removeItem(STORAGE_KEYS.CONFIG);
                }
            }
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao carregar configuração:", error);
        }

        MENSAGENS = [...CONFIG_PADRAO.mensagens];
        INTERVALO_MINUTOS = CONFIG_PADRAO.intervaloMinutos;
        INTERVALO_MS = INTERVALO_MINUTOS * 60 * 1000;
        contadorMensagens = 0;
        ultimaExecucao = null;
        return false;
    }

    // Função para carregar estado
    function carregarEstado() {
        try {
            const estadoSalvo = localStorage.getItem(STORAGE_KEYS.ESTADO);
            if (estadoSalvo) {
                const estado = JSON.parse(estadoSalvo);
                const agora = Date.now();
                const tempoDecorrido = agora - (estado.timestamp || 0);
                const tempoExpiracao = 24 * 60 * 60 * 1000;

                if (tempoDecorrido < tempoExpiracao) {
                    isMinimized = estado.isMinimized || false;

                    if (estado.isEnabled && estado.proximoEnvio) {
                        const proximoEnvioSalvo = new Date(estado.proximoEnvio);
                        if (agora < proximoEnvioSalvo.getTime()) {
                            proximoEnvio = proximoEnvioSalvo;
                            return {
                                continuarExecucao: true,
                                streamSalvo: estado.streamAtual,
                            };
                        }
                    }

                    return {
                        continuarExecucao: false,
                        streamSalvo: estado.streamAtual,
                    };
                }
            }
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao carregar estado:", error);
        }

        return false;
    }

    // Função para obter mensagem aleatória
    function obterMensagemAleatoria() {
        return MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
    }

    // Função para preencher o campo de mensagem
    function preencherMensagem(mensagem) {
        const chatInput = document.querySelector('[data-testid="chat-input"]');
        if (!chatInput) return false;

        try {
            chatInput.focus();
            document.execCommand("selectAll", false, null);
            document.execCommand("insertText", false, mensagem);

            chatInput.dispatchEvent(new Event("input", { bubbles: true }));
            chatInput.dispatchEvent(new Event("change", { bubbles: true }));

            return true;
        } catch (error) {
            console.log("[Kick AutoChat] Erro ao preencher mensagem:", error);
            return false;
        }
    }

    // Função para enviar mensagem
    function enviarMensagem() {
        const chatInput = document.querySelector('[data-testid="chat-input"]');
        const sendButton = document.querySelector("button#send-message-button");

        if (!chatInput || !sendButton) {
            console.log("[Kick AutoChat] Elementos do chat não encontrados");
            return false;
        }

        if (sendButton.disabled) {
            console.log("[Kick AutoChat] Botão de enviar desabilitado");
            return false;
        }

        const mensagem = obterMensagemAleatoria();

        if (!preencherMensagem(mensagem)) {
            console.log("[Kick AutoChat] Erro ao preencher mensagem");
            return false;
        }

        setTimeout(() => {
            try {
                sendButton.click();
                contadorMensagens++;
                ultimaExecucao = new Date();
                const agora = new Date().toLocaleTimeString();
                console.log(
                    `[Kick AutoChat] ${agora} - Mensagem enviada (${contadorMensagens}x): "${mensagem}"`
        );

          atualizarProximoEnvio();
          salvarConfiguracao();
          salvarEstado();
      } catch (error) {
          console.log("[Kick AutoChat] Erro ao enviar mensagem:", error);
      }
    }, 300);

      return true;
  }

    // Função para atualizar horário do próximo envio
    function atualizarProximoEnvio() {
        const agora = new Date();
        proximoEnvio = new Date(agora.getTime() + INTERVALO_MS);
    }

    // Função para formatar horário
    function formatarHorario(data) {
        return data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    // Função para verificar se o chat está disponível
    function chatDisponivel() {
        const chatInput = document.querySelector('[data-testid="chat-input"]');
        const sendButton = document.querySelector("button#send-message-button");
        return !!(chatInput && sendButton && !sendButton.disabled);
    }

    // Função principal do intervalo
    function executarIntervalo() {
        if (!isEnabled) return;

        if (chatDisponivel()) {
            enviarMensagem();
        } else {
            console.log("[Kick AutoChat] Chat não disponível no momento.");
        }
    }

    // Função para atualizar o intervalo
    function atualizarIntervalo(novoIntervalo) {
        if (novoIntervalo && !isNaN(novoIntervalo) && novoIntervalo > 0) {
            const novoIntervaloNum = parseInt(novoIntervalo);

            INTERVALO_MINUTOS = novoIntervaloNum;
            INTERVALO_MS = INTERVALO_MINUTOS * 60 * 1000;

            console.log(
                `[Kick AutoChat] Intervalo atualizado para ${INTERVALO_MINUTOS} minutos`
      );

            if (intervaloId) {
                clearInterval(intervaloId);
                intervaloId = setInterval(executarIntervalo, INTERVALO_MS);
                atualizarProximoEnvio();
            }

            salvarConfiguracao();
            salvarEstado();

            return true;
        }
        return false;
    }

    // Função para salvar mensagens editadas
    function salvarMensagensEditadas() {
        const textarea = document.getElementById("kickAutochatMensagensEditor");
        if (!textarea) return false;

        try {
            const novasMensagens = textarea.value
            .split(";")
            .map((msg) => msg.trim())
            .filter((msg) => msg.length > 0);

            if (novasMensagens.length === 0) {
                alert("É necessário ter pelo menos uma mensagem!");
                return false;
            }

            MENSAGENS = novasMensagens;
            salvarConfiguracao();

            console.log("[Kick AutoChat] Mensagens atualizadas:", MENSAGENS);
            return true;
        } catch (error) {
            console.error("[Kick AutoChat] Erro ao salvar mensagens:", error);
            return false;
        }
    }

    // Função para iniciar
    function iniciarAutoChat() {
        if (intervaloId) {
            console.log("[Kick AutoChat] Já está rodando!");
            return;
        }

        console.log(
            `[Kick AutoChat] Iniciando... Mensagens a cada ${INTERVALO_MINUTOS} minutos`
    );

        isEnabled = true;
        atualizarProximoEnvio();

        intervaloId = setInterval(executarIntervalo, INTERVALO_MS);

        salvarEstado();

        setTimeout(() => {
            if (chatDisponivel()) {
                enviarMensagem();
            } else {
                console.log("[Kick AutoChat] Chat não disponível para envio inicial");
            }
        }, 1000);
    }

    // Função para parar
    function pararAutoChat() {
        if (intervaloId) {
            clearInterval(intervaloId);
            intervaloId = null;
        }
        isEnabled = false;
        proximoEnvio = null;

        salvarEstado();

        console.log("[Kick AutoChat] Parado!");
    }

    // Função para minimizar/restaurar a interface
    function toggleMinimize() {
        isMinimized = !isMinimized;

        if (isMinimized) {
            const rect = panel.getBoundingClientRect();
            panel.setAttribute("data-original-left", rect.left);
            panel.setAttribute("data-original-top", rect.top);

            panel.style.display = "none";

            icon.style.display = "flex";
            icon.style.left = rect.left + 10 + "px";
            icon.style.top = rect.top + 10 + "px";
        } else {
            icon.style.display = "none";

            panel.style.display = "block";
            panel.style.left = panel.getAttribute("data-original-left") + "px";
            panel.style.top = panel.getAttribute("data-original-top") + "px";
        }

        salvarEstado();
    }

    // Função para toggle da edição de mensagens
    function toggleEditarMensagens() {
        editandoMensagens = !editandoMensagens;
        const container = document.getElementById("kickAutochatMensagensContainer");

        if (!container) return;

        if (editandoMensagens) {
            container.innerHTML = `
                <div style="font-size: 11px; margin-bottom: 5px; color: #00ff00;">
                    📝 Editando mensagens (separe com ponto e vírgula):
                </div>
                <textarea id="kickAutochatMensagensEditor"
                    style="width: 100%; height: 80px; background: rgba(255,255,255,0.1);
                    border: 1px solid #00ff00; border-radius: 3px; color: white;
                    padding: 5px; font-size: 10px; resize: vertical; font-family: inherit;">${MENSAGENS.join(
          "; "
      )}</textarea>
                <div style="margin-top: 5px;">
                    <button class="kick-autochat-btn" onclick="salvarEFecharEdicao()" style="font-size: 10px; padding: 3px 6px;">💾 Salvar</button>
                    <button class="kick-autochat-btn stop" onclick="cancelarEdicao()" style="font-size: 10px; padding: 3px 6px;">❌ Cancelar</button>
                </div>
            `;
    } else {
        container.innerHTML = `
                <div id="kickAutochatMensagens" class="kick-autochat-mensagens">
                    ${MENSAGENS.map((msg) => `<div>• ${msg}</div>`).join("")}
                </div>
                <button class="kick-autochat-btn" onclick="toggleEditarMensagens()"
                    style="font-size: 10px; padding: 2px 5px; margin-top: 3px;">✏️ Editar</button>
            `;
    }
  }

    // Função para restaurar estado após recarregar página
    function restaurarEstado() {
        const estadoRestaurado = carregarEstado();

        if (estadoRestaurado && estadoRestaurado.continuarExecucao) {
            isEnabled = true;
            const tempoRestante = proximoEnvio.getTime() - Date.now();

            if (tempoRestante > 0) {
                console.log(
                    `[Kick AutoChat] Restaurando execução - ${Math.floor(
                        tempoRestante / 60000
                    )} minutos restantes`
        );
                intervaloId = setTimeout(() => {
                    if (isEnabled) {
                        executarIntervalo();
                        intervaloId = setInterval(executarIntervalo, INTERVALO_MS);
                    }
                }, tempoRestante);
            } else {
                iniciarAutoChat();
            }
        }

        return estadoRestaurado;
    }

    // API Global
    window.KickAutoChat = {
        iniciar: iniciarAutoChat,
        parar: pararAutoChat,
        toggleMinimize: toggleMinimize,
        configurar: function (novasMensagens, novoIntervalo) {
            if (novasMensagens && Array.isArray(novasMensagens)) {
                MENSAGENS = novasMensagens;
            }
            if (novoIntervalo) {
                atualizarIntervalo(novoIntervalo);
            }
            salvarConfiguracao();
            console.log("[Kick AutoChat] Configurações atualizadas");
        },
        status: function () {
            return {
                rodando: isEnabled,
                mensagensEnviadas: contadorMensagens,
                mensagens: MENSAGENS,
                intervalo: INTERVALO_MINUTOS,
                chatDisponivel: chatDisponivel(),
                proximoEnvio: proximoEnvio ? formatarHorario(proximoEnvio) : null,
                minimized: isMinimized,
                ultimaExecucao: ultimaExecucao ? formatarHorario(ultimaExecucao) : null,
                streamAtual: streamAtual,
            };
        },
        testar: function () {
            console.log("[Kick AutoChat] Testando envio...");
            return enviarMensagem();
        },
        setIntervalo: atualizarIntervalo,
        limparDados: function () {
            localStorage.removeItem(STORAGE_KEYS.CONFIG);
            localStorage.removeItem(STORAGE_KEYS.ESTADO);
            localStorage.removeItem(STORAGE_KEYS.STREAMS);
            console.log("[Kick AutoChat] Dados limpos do localStorage");
        },
        listarStreams: function () {
            const streams = carregarTodosStreams();
            console.log("[Kick AutoChat] Streams salvos:", streams);
            return streams;
        },
        detectarStream: function () {
            const streamAnterior = streamAtual;
            const streamAtualPagina = obterStreamAtual();

            console.log(`Stream anterior: ${streamAnterior}`);
            console.log(`Stream da página: ${streamAtualPagina}`);

            if (streamAtualPagina && streamAtualPagina !== streamAnterior) {
                if (streamAnterior) {
                    salvarDadosStream(streamAnterior);
                }

                if (intervaloId) {
                    pararAutoChat();
                }

                streamAtual = streamAtualPagina;
                carregarDadosStream(streamAtual);
                atualizarInterfaceStream();
                salvarEstado();

                console.log(`Stream atualizado para: ${streamAtual}`);
                return true;
            }

            return false;
        },
    };

    // Funções globais para a interface
    window.toggleEditarMensagens = toggleEditarMensagens;

    window.salvarEFecharEdicao = function () {
        if (salvarMensagensEditadas()) {
            toggleEditarMensagens();
        }
    };

    window.cancelarEdicao = function () {
        toggleEditarMensagens();
    };

    // Interface de usuário
    function criarInterface() {
        const style = document.createElement("style");
        style.textContent = `
            .kick-autochat-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.95);
                border: 2px solid #00ff00;
                padding: 12px;
                border-radius: 8px;
                z-index: 9999;
                font-family: 'Segoe UI', Arial, sans-serif;
                color: white;
                width: 320px;
                cursor: move;
                user-select: none;
                resize: both;
                overflow: auto;
                min-height: 180px;
                max-height: 80vh;
                box-shadow: 0 4px 20px rgba(0,255,0,0.3);
            }
            .kick-autochat-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 8px;
                border-bottom: 1px solid #00ff00;
                margin-bottom: 10px;
                cursor: move;
            }
            .kick-autochat-btn {
                background: #00ff00;
                color: black;
                border: none;
                padding: 6px 12px;
                margin: 2px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 11px;
                transition: all 0.2s;
            }
            .kick-autochat-btn:hover {
                background: #00cc00;
                transform: translateY(-1px);
            }
            .kick-autochat-btn.stop {
                background: #ff4444;
                color: white;
            }
            .kick-autochat-btn.stop:hover {
                background: #cc0000;
            }
            .kick-autochat-btn.minimize {
                background: #4444ff;
                color: white;
                padding: 4px 8px;
                font-size: 14px;
            }
            .kick-autochat-btn.minimize:hover {
                background: #0000cc;
            }
            .kick-autochat-status {
                margin: 6px 0;
                font-size: 12px;
                line-height: 1.4;
                font-weight: bold;
            }
            .kick-autochat-proximo {
                font-size: 11px;
                color: #00ff00;
                margin: 4px 0;
                background: rgba(0,255,0,0.1);
                padding: 3px 6px;
                border-radius: 3px;
                border-left: 3px solid #00ff00;
            }
            .kick-autochat-mensagens {
                font-size: 10px;
                margin: 5px 0;
                max-height: 70px;
                overflow-y: auto;
                background: rgba(255,255,255,0.1);
                padding: 6px;
                border-radius: 4px;
                border: 1px solid #333;
            }
            .kick-autochat-icon {
                position: fixed;
                width: 45px;
                height: 45px;
                background: rgba(0,0,0,0.95);
                border: 2px solid #00ff00;
                border-radius: 50%;
                z-index: 9998;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #00ff00;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 2px 10px rgba(0,255,0,0.5);
                transition: all 0.3s;
            }
            .kick-autochat-icon:hover {
                background: rgba(0,255,0,0.2);
                transform: scale(1.1);
            }
            .kick-autochat-input {
                background: rgba(255,255,255,0.1);
                border: 1px solid #00ff00;
                border-radius: 3px;
                color: white;
                padding: 4px 6px;
                width: 50px;
                margin: 0 5px;
                font-size: 11px;
            }
            .kick-autochat-input:focus {
                outline: none;
                border-color: #00aaff;
                box-shadow: 0 0 5px rgba(0,170,255,0.5);
            }
            .kick-autochat-config {
                font-size: 11px;
                margin: 8px 0;
                display: flex;
                align-items: center;
                background: rgba(255,255,255,0.05);
                padding: 6px;
                border-radius: 4px;
            }
            .kick-autochat-info {
                font-size: 10px;
                margin-top: 8px;
                padding: 4px 6px;
                background: rgba(255,255,255,0.05);
                border-radius: 3px;
                display: flex;
                justify-content: space-between;
            }
            .kick-autochat-actions {
                margin: 8px 0;
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }
            .kick-autochat-stream-info {
                font-size: 10px;
                margin-bottom: 8px;
                padding: 4px 6px;
                background: rgba(0,255,0,0.1);
                border-radius: 3px;
                border-left: 3px solid #00ff00;
            }
        `;
      document.head.appendChild(style);

      // Criar painel principal
      panel = document.createElement("div");
      panel.className = "kick-autochat-panel";
      panel.innerHTML = `
            <div class="kick-autochat-header" id="kickAutochatHeader">
                <strong>🚀 Kick Auto-Chat v2.3</strong>
                <div>
                    <button class="kick-autochat-btn minimize" onclick="KickAutoChat.toggleMinimize()" title="Minimizar">−</button>
                </div>
            </div>
            <div id="kickAutochatContent">
                <div class="kick-autochat-stream-info" id="kickAutochatStreamInfo">📺 Stream: Carregando...</div>
                <div class="kick-autochat-status" id="kickAutochatStatus">⏹️ Parado</div>
                <div class="kick-autochat-proximo" id="kickAutochatProximo">⏰ Próximo: --:--:--</div>
                <div class="kick-autochat-actions">
                    <button class="kick-autochat-btn" onclick="KickAutoChat.iniciar()">▶️ Iniciar</button>
                    <button class="kick-autochat-btn stop" onclick="KickAutoChat.parar()">⏹️ Parar</button>
                    <button class="kick-autochat-btn" onclick="KickAutoChat.testar()">⚡ Testar</button>
                    <button class="kick-autochat-btn" onclick="KickAutoChat.detectarStream()" title="Forçar detecção do stream">🔍 Detectar</button>
                </div>
                <div class="kick-autochat-config">
                    ⏱️ Intervalo:
                    <input type="number" id="kickAutochatIntervaloInput" class="kick-autochat-input" value="${INTERVALO_MINUTOS}" min="1" max="120">
                    min
                    <button class="kick-autochat-btn" onclick="atualizarIntervaloInput()" style="font-size: 10px; padding: 3px 6px; margin-left: 5px;">Aplicar</button>
                </div>
                <div id="kickAutochatMensagensContainer">
                    <div id="kickAutochatMensagens" class="kick-autochat-mensagens">
                        ${MENSAGENS.map((msg) => `<div>• ${msg}</div>`).join(
        ""
    )}
                    </div>
                    <button class="kick-autochat-btn" onclick="toggleEditarMensagens()"
                        style="font-size: 10px; padding: 2px 5px; margin-top: 3px;">✏️ Editar Mensagens</button>
                </div>
                <div class="kick-autochat-info">
                    <span>📨 Enviadas: <span id="kickAutochatCount">${contadorMensagens}</span></span>
                    <span>⏰ Timer: <span id="kickAutochatIntervaloDisplay">${INTERVALO_MINUTOS}</span>min</span>
                </div>
                ${
                  ultimaExecucao
        ? `<div style="font-size: 9px; color: #888; text-align: center; margin-top: 4px;">
                    Última execução: ${formatarHorario(ultimaExecucao)}
                </div>`
                    : ""
  }
            </div>
        `;
      document.body.appendChild(panel);

      // Criar ícone minimizado
      icon = document.createElement("div");
      icon.className = "kick-autochat-icon";
      icon.innerHTML = "🚀";
      icon.title = "Kick Auto-Chat v2.3 (clique para expandir)";
      icon.style.display = "none";
      icon.addEventListener("click", toggleMinimize);
      document.body.appendChild(icon);

      // Atualizar informações do stream
      atualizarInterfaceStream();

      // Função para atualizar o intervalo a partir do input
      window.atualizarIntervaloInput = function () {
          const input = document.getElementById("kickAutochatIntervaloInput");
          if (input && atualizarIntervalo(input.value)) {
              input.style.borderColor = "#00ff00";
              input.style.boxShadow = "0 0 5px rgba(0,255,0,0.5)";
              setTimeout(() => {
                  if (input) {
                      input.style.borderColor = "#00ff00";
                      input.style.boxShadow = "none";
                  }
              }, 1500);
          } else {
              if (input) {
                  input.style.borderColor = "#ff4444";
                  input.style.boxShadow = "0 0 5px rgba(255,68,68,0.5)";
                  setTimeout(() => {
                      if (input) {
                          input.style.borderColor = "#00ff00";
                          input.style.boxShadow = "none";
                      }
                  }, 2000);
              }
          }
      };

      // Adicionar evento de tecla Enter no input
      const intervaloInput = document.getElementById(
          "kickAutochatIntervaloInput"
      );
      if (intervaloInput) {
          intervaloInput.addEventListener("keypress", function (e) {
              if (e.key === "Enter") {
                  atualizarIntervaloInput();
              }
          });
      }

      // Adicionar funcionalidade de arrastar para o painel
      const header = document.getElementById("kickAutochatHeader");
      if (header) {
          header.addEventListener("mousedown", function (e) {
              isDragging = true;
              dragOffset = {
                  x: e.clientX - panel.getBoundingClientRect().left,
                  y: e.clientY - panel.getBoundingClientRect().top,
              };
              panel.style.cursor = "grabbing";
          });

          document.addEventListener("mousemove", function (e) {
              if (isDragging && !isMinimized) {
                  panel.style.left = e.clientX - dragOffset.x + "px";
                  panel.style.top = e.clientY - dragOffset.y + "px";
                  panel.style.right = "auto";
              }
          });

          document.addEventListener("mouseup", function () {
              if (isDragging) {
                  isDragging = false;
                  panel.style.cursor = "move";
                  salvarEstado();
              }
          });
      }

      // Adicionar funcionalidade de arrastar para o ícone
      icon.addEventListener("mousedown", function (e) {
          if (isMinimized) {
              isDragging = true;
              dragOffset = {
                  x: e.clientX - icon.getBoundingClientRect().left,
                  y: e.clientY - icon.getBoundingClientRect().top,
              };
          }
      });

      document.addEventListener("mousemove", function (e) {
          if (isDragging && isMinimized) {
              icon.style.left = e.clientX - dragOffset.x + "px";
              icon.style.top = e.clientY - dragOffset.y + "px";
          }
      });

      document.addEventListener("mouseup", function () {
          if (isDragging && isMinimized) {
              isDragging = false;
              salvarEstado();
          }
      });

      // Aplicar estado minimizado se necessário
      if (isMinimized) {
          panel.style.display = "none";
          icon.style.display = "flex";
      }

      // Atualizar status periodicamente
      setInterval(() => {
          const status = document.getElementById("kickAutochatStatus");
          const count = document.getElementById("kickAutochatCount");
          const intervaloDisplay = document.getElementById(
              "kickAutochatIntervaloDisplay"
          );
          const proximo = document.getElementById("kickAutochatProximo");
          const mensagens = document.getElementById("kickAutochatMensagens");

          if (status) {
              if (isEnabled) {
                  status.innerHTML =
                      '🟢 <strong style="color: #00ff00;">Rodando</strong>';
              } else {
                  status.innerHTML =
                      '⏹️ <strong style="color: #ff4444;">Parado</strong>';
              }
          }

          if (count) {
              count.textContent = contadorMensagens;
          }

          if (intervaloDisplay) {
              intervaloDisplay.textContent = INTERVALO_MINUTOS;
          }

          if (proximo) {
              if (proximoEnvio && isEnabled) {
                  const agora = new Date();
                  const diff = proximoEnvio - agora;
                  if (diff > 0) {
                      const minutos = Math.floor(diff / 60000);
                      const segundos = Math.floor((diff % 60000) / 1000);
                      proximo.innerHTML = `⏰ Próximo: <strong style="color: #00ff00;">${minutos}:${segundos
                          .toString()
                          .padStart(2, "0")}</strong>`;
                  } else {
                      proximo.innerHTML =
                          '⏰ Próximo: <strong style="color: #ffff00;">Executando...</strong>';
                  }
              } else {
                  proximo.innerHTML =
                      '⏰ Próximo: <span style="color: #666;">--:--:--</span>';
              }
          }

          if (mensagens && !editandoMensagens) {
              mensagens.innerHTML = MENSAGENS.map(
                  (msg) => `<div>• ${msg}</div>`
        ).join("");
          }
      }, 1000);
  }

    // Inicializar
    console.log("╔══════════════════════════════════════╗");
    console.log("║     KICK AUTO-CHAT SCRIPT v2.3      ║");
    console.log("║   (DETECÇÃO DE STREAMS CORRIGIDA)   ║");
    console.log("║                                      ║");
    console.log("║ Correções v2.3:                     ║");
    console.log("║ • Prioridade para stream da página  ║");
    console.log("║ • Detecção melhorada                ║");
    console.log('║ • Botão "Detectar" manual           ║');
    console.log("║ • Debug logs melhorados             ║");
    console.log("║                                      ║");
    console.log("║ Comandos disponíveis:                ║");
    console.log("║ • KickAutoChat.iniciar()            ║");
    console.log("║ • KickAutoChat.parar()              ║");
    console.log("║ • KickAutoChat.toggleMinimize()     ║");
    console.log("║ • KickAutoChat.status()             ║");
    console.log("║ • KickAutoChat.configurar(msgs, min)║");
    console.log("║ • KickAutoChat.testar()             ║");
    console.log("║ • KickAutoChat.setIntervalo(min)    ║");
    console.log("║ • KickAutoChat.detectarStream()     ║");
    console.log("║ • KickAutoChat.limparDados()        ║");
    console.log("║ • KickAutoChat.listarStreams()      ║");
    console.log("╚══════════════════════════════════════╝");

    // Carregar estado
    const estadoRestaurado = carregarEstado();
    console.log(
        `[Kick AutoChat] Estado ${estadoRestaurado ? "restaurado" : "novo"}`
  );

    // Se não restaurou estado, carregar configuração padrão
    if (!estadoRestaurado) {
        const configCarregada = carregarConfiguracao();
        console.log(
            `[Kick AutoChat] Configuração ${
        configCarregada ? "restaurada" : "padrão"
            } carregada`
    );
    }

    // Criar interface após um delay
    setTimeout(() => {
        criarInterface();

        // Sempre verificar stream atual da página primeiro
        const streamPagina = obterStreamAtual();
        console.log(
            `[Kick AutoChat] Verificação inicial - Página: ${streamPagina}, Estado: ${
        estadoRestaurado ? estadoRestaurado.streamSalvo : "null"
            }`
    );

        if (streamPagina) {
            if (
                estadoRestaurado &&
                estadoRestaurado.streamSalvo &&
                streamPagina !== estadoRestaurado.streamSalvo
            ) {
                console.log(
                    `[Kick AutoChat] Stream mudou: ${estadoRestaurado.streamSalvo} -> ${streamPagina}`
        );

          if (estadoRestaurado.streamSalvo) {
              const streamAnterior = streamAtual;
              streamAtual = estadoRestaurado.streamSalvo;
              carregarDadosStream(streamAtual);
              salvarDadosStream(streamAtual);
              streamAtual = streamAnterior;
          }

          if (estadoRestaurado.continuarExecucao) {
              estadoRestaurado.continuarExecucao = false;
          }
      }

        streamAtual = streamPagina;
        carregarDadosStream(streamAtual);
        console.log(`[Kick AutoChat] Stream definido: ${streamAtual}`);
    } else if (estadoRestaurado && estadoRestaurado.streamSalvo) {
        streamAtual = estadoRestaurado.streamSalvo;
        carregarDadosStream(streamAtual);
        console.log(`[Kick AutoChat] Usando stream salvo: ${streamAtual}`);
    } else {
        carregarConfiguracao();
        console.log(
            "[Kick AutoChat] Nenhum stream detectado, usando configuração padrão"
        );
    }

      // Iniciar observação
      iniciarObservacaoStream();

      // Restaurar estado de execução se necessário
      if (estadoRestaurado && estadoRestaurado.continuarExecucao) {
          setTimeout(() => {
              restaurarEstado();
              console.log("[Kick AutoChat] Estado da sessão restaurado com sucesso!");
          }, 500);
      }
  }, 2000);

    // Salvar estado antes de sair da página
    window.addEventListener("beforeunload", function () {
        if (isEnabled || proximoEnvio) {
            salvarEstado();
            salvarConfiguracao();

            if (streamAtual) {
                salvarDadosStream(streamAtual);
            }
        }
    });

    // Salvar estado periodicamente (a cada 30 segundos)
    setInterval(() => {
        if (isEnabled || contadorMensagens > 0) {
            salvarEstado();
            salvarConfiguracao();

            if (streamAtual) {
                salvarDadosStream(streamAtual);
            }
        }
    }, 30000);
})();
