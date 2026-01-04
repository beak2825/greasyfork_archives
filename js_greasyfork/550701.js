// ==UserScript==
// @name         Agar.io BR Macro (Maconhasplit) - Otimizado
// @version      2.4
// @description  Macros básicos para agar.io hotkeys/Agariobr com otimizações de performance + Respawn + Seleção de Mouse
// @match        https://agariobr.com.br/*
// @run-at       document-end
// @author       Skillful
// @namespace    Skillful
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agariobr.com.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550701/Agario%20BR%20Macro%20%28Maconhasplit%29%20-%20Otimizado.user.js
// @updateURL https://update.greasyfork.org/scripts/550701/Agario%20BR%20Macro%20%28Maconhasplit%29%20-%20Otimizado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações padrão das teclas (salvas no localStorage)
    let keys = {
        feed: localStorage.getItem('agario_feed') || 'w',
        doubleSplit: localStorage.getItem('agario_doubleSplit') || 'd',
        tripleSplit: localStorage.getItem('agario_tripleSplit') || 'f',
        quadSplit: localStorage.getItem('agario_quadSplit') || 'g',
        trickSplit: localStorage.getItem('agario_trickSplit') || 't',
        centerMouse: localStorage.getItem('agario_centerMouse') || 's',
        toggleAutoRespawn: localStorage.getItem('agario_toggleAutoRespawn') || 'n',
        togglePanel: localStorage.getItem('agario_togglePanel') || 'p',
        toggleOptimizations: localStorage.getItem('agario_toggleOptimizations') || 'o'
    };

    // Configurações do painel
    let panelVisible = localStorage.getItem('agario_panelVisible') !== 'false';
    const panelPosition = JSON.parse(localStorage.getItem('agario_panelPosition') || '{"right": "12px", "bottom": "12px"}');

    // Configurações de otimização
    let optimizationsEnabled = localStorage.getItem('agario_optimizationsEnabled') !== 'false';

    // Configurações do TrickSplit
    const trickSplitConfig = {
        count: 4,
        interval: 40,
    };

    // Variável para controle do respawn automático
    let autoRespawnEnabled = true;
    let respawnCheckInterval;
    let isRespawnInProgress = false;
    let isEditingKey = null;

    // ========== SISTEMA DE FEED CONTÍNUO OTIMIZADO ==========
    let feeding = false;
    let feedInterval;
    let feedCounter = 0;
    let lastFeedTime = 0;
    const FEED_INTERVAL = 10; // 10ms = 100 feeds por segundo (máximo suportado)

    // Função de feed ultra-rápida e contínua
    function startFeed() {
        if (!feeding) {
            feeding = true;
            feedCounter = 0;
            lastFeedTime = 0;

            console.log("🚀 Feed contínuo ativado");

            // Usar requestAnimationFrame para timing mais preciso
            function feedLoop(timestamp) {
                if (!feeding) return;

                if (timestamp - lastFeedTime >= FEED_INTERVAL) {
                    simulateKeyPress('w');
                    feedCounter++;
                    lastFeedTime = timestamp;
                }

                requestAnimationFrame(feedLoop);
            }

            requestAnimationFrame(feedLoop);

            // Backup com setInterval para garantir continuidade
            feedInterval = setInterval(() => {
                if (feeding) {
                    simulateKeyPress('w');
                    feedCounter++;
                }
            }, FEED_INTERVAL);
        }
    }

    function stopFeed() {
        if (feeding) {
            feeding = false;
            clearInterval(feedInterval);
            console.log(`⏹️ Feed contínuo desativado (${feedCounter} feeds executados)`);
        }
    }

    // Função otimizada para simular pressionamento de tecla
    function simulateKeyPress(key) {
        try {
            // Criar eventos mais realistas
            const eventDown = new KeyboardEvent('keydown', {
                key: key,
                code: `Key${key.toUpperCase()}`,
                keyCode: key.charCodeAt(0),
                which: key.charCodeAt(0),
                bubbles: true,
                cancelable: true,
                composed: true
            });

            const eventUp = new KeyboardEvent('keyup', {
                key: key,
                code: `Key${key.toUpperCase()}`,
                keyCode: key.charCodeAt(0),
                which: key.charCodeAt(0),
                bubbles: true,
                cancelable: true,
                composed: true
            });

            // Disparar eventos de forma síncrona
            document.activeElement.dispatchEvent(eventDown);
            document.dispatchEvent(eventDown);
            window.dispatchEvent(eventDown);

            // Keyup muito rápido para simular pressão rápida
            setTimeout(() => {
                document.activeElement.dispatchEvent(eventUp);
                document.dispatchEvent(eventUp);
                window.dispatchEvent(eventUp);
            }, 1);

        } catch (error) {
            console.warn('Erro ao simular tecla:', error);
        }
    }

    // Função original mantida para compatibilidade
    function pressKey(key) {
        simulateKeyPress(key);
    }

    // ========== OTIMIZAÇÕES DE PERFORMANCE ==========

    // Função para aplicar otimizações de performance
    function applyPerformanceOptimizations() {
        if (!optimizationsEnabled) return;

        console.log("🚀 Aplicando otimizações de performance...");

        // 1. Otimizar requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;
        let rafCount = 0;
        let lastRAFTime = 0;

        window.requestAnimationFrame = function(callback) {
            rafCount++;
            const now = Date.now();

            // Limitar RAF a ~60fps máximo
            if (now - lastRAFTime < 16) { // ~60fps
                return originalRAF(() => {
                    callback(now);
                });
            }

            lastRAFTime = now;
            return originalRAF(callback);
        };

        // 2. Reduzir qualidade gráfica do canvas
        function optimizeCanvas() {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                // Reduzir qualidade de renderização
                canvas.style.imageRendering = 'optimizeSpeed';
                canvas.style.imageRendering = '-moz-crisp-edges';
                canvas.style.imageRendering = '-webkit-optimize-contrast';
                canvas.style.imageRendering = 'pixelated';

                // Desativar sombras e efeitos custosos
                canvas.style.willChange = 'auto';
            }
        }

        // 3. Otimizar event listeners
        function optimizeEventListeners() {
            // Limitar frequência de alguns eventos
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                // Limitar eventos de mouse move frequentes
                if (type === 'mousemove' || type === 'scroll') {
                    let lastCall = 0;
                    const throttledListener = function(e) {
                        const now = Date.now();
                        if (now - lastCall >= 32) { // ~30fps para eventos pesados
                            lastCall = now;
                            listener(e);
                        }
                    };
                    return originalAddEventListener.call(this, type, throttledListener, options);
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        }

        // 4. Reduzir consumo de memória
        function optimizeMemoryUsage() {
            // Limpar caches periódicos
            setInterval(() => {
                if (window.gc) {
                    window.gc(); // Force garbage collection se disponível
                }
            }, 30000); // A cada 30 segundos

            // Otimizar intervalos
            const intervals = [];
            const originalSetInterval = window.setInterval;
            window.setInterval = function(callback, delay) {
                if (delay < 16) delay = 16; // Não permitir intervalos muito curtos
                const id = originalSetInterval(callback, delay);
                intervals.push(id);
                return id;
            };
        }

        // 5. Otimizar rede e recursos
        function optimizeNetwork() {
            // Prevenir múltiplas requisições simultâneas
            let pendingRequests = 0;
            const maxPendingRequests = 5;

            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                if (pendingRequests >= maxPendingRequests) {
                    return Promise.reject(new Error('Too many pending requests'));
                }
                pendingRequests++;
                return originalFetch.apply(this, args).finally(() => {
                    pendingRequests--;
                });
            };
        }

        // 6. Otimizar CSS e rendering
        function optimizeRendering() {
            // Forçar hardware acceleration
            const style = document.createElement('style');
            style.textContent = `
                canvas {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    perspective: 1000;
                }
                * {
                    image-rendering: optimizeSpeed;
                }
            `;
            document.head.appendChild(style);
        }

        // 7. Monitorar performance
        function monitorPerformance() {
            let frameCount = 0;
            let lastFpsUpdate = Date.now();
            let currentFps = 0;

            function updateFPS() {
                frameCount++;
                const now = Date.now();
                if (now - lastFpsUpdate >= 1000) {
                    currentFps = frameCount;
                    frameCount = 0;
                    lastFpsUpdate = now;

                    // Log FPS a cada 5 segundos (apenas para debug)
                    if (now % 5000 < 100) {
                        console.log(`🎮 FPS: ${currentFps}`);
                    }
                }
                requestAnimationFrame(updateFPS);
            }
            updateFPS();
        }

        // Aplicar todas as otimizações
        optimizeCanvas();
        optimizeEventListeners();
        optimizeMemoryUsage();
        optimizeRendering();

        // Aplicar otimizações periodicamente (caso novos elementos sejam criados)
        setInterval(optimizeCanvas, 5000);

        console.log("✅ Otimizações de performance aplicadas!");
    }

    // Função para remover otimizações
    function removePerformanceOptimizations() {
        console.log("🔧 Removendo otimizações de performance...");
        location.reload(); // Recarregar é a maneira mais simples de reverter
    }

    // Salvar configurações no localStorage
    function saveKeyConfig() {
        for (const [key, value] of Object.entries(keys)) {
            localStorage.setItem('agario_' + key, value);
        }
        localStorage.setItem('agario_optimizationsEnabled', optimizationsEnabled);
        console.log("💾 Configurações salvas:", keys);
    }

    // Salvar estado do painel
    function savePanelState() {
        localStorage.setItem('agario_panelVisible', panelVisible);
        const panel = document.getElementById('agario-control-panel');
        if (panel) {
            const position = {
                right: panel.style.right,
                bottom: panel.style.bottom
            };
            localStorage.setItem('agario_panelPosition', JSON.stringify(position));
        }
    }

    // Mostrar/ocultar painel
    function togglePanel() {
        const panel = document.getElementById('agario-control-panel');
        if (panel) {
            panelVisible = !panelVisible;
            if (panelVisible) {
                panel.style.display = 'block';
                panel.style.visibility = 'visible';
                panel.style.opacity = '0.95';
            } else {
                panel.style.display = 'none';
                panel.style.visibility = 'hidden';
                panel.style.opacity = '0';
            }
            savePanelState();
            updateStatus(`Painel ${panelVisible ? 'visível' : 'oculto'} (${keys.togglePanel.toUpperCase()})`);
        }
    }

    // Função para encontrar botão por texto EXATO
    function findButtonByText(texts) {
        const allElements = document.querySelectorAll('*');

        for (let element of allElements) {
            if (!element.textContent || element.offsetParent === null || element.offsetWidth === 0) continue;

            const elementText = element.textContent.trim().toLowerCase();

            for (let text of texts) {
                if (elementText === text.toLowerCase()) {
                    return element;
                }
            }
        }
        return null;
    }

    // Função para clicar sequencialmente: Continuar → Jogar
    function doAutoRespawnSequence() {
        if (isRespawnInProgress) return;

        isRespawnInProgress = true;

        const continuarBtn = findButtonByText(['continuar']);
        if (continuarBtn) {
            continuarBtn.click();

            setTimeout(() => {
                const jogarBtn = findButtonByText(['jogar']);
                if (jogarBtn) {
                    jogarBtn.click();
                }
                setTimeout(() => { isRespawnInProgress = false; }, 1000);
            }, 800);
        } else {
            const jogarBtn = findButtonByText(['jogar']);
            if (jogarBtn) jogarBtn.click();
            isRespawnInProgress = false;
        }
    }

    // Função para verificar e fazer respawn automático
    function startAutoRespawn() {
        if (respawnCheckInterval) clearInterval(respawnCheckInterval);

        respawnCheckInterval = setInterval(() => {
            if (!autoRespawnEnabled || isRespawnInProgress) return;

            const continuarBtn = findButtonByText(['continuar']);
            const jogarBtn = findButtonByText(['jogar']);

            if (continuarBtn || jogarBtn) doAutoRespawnSequence();
        }, 2000);
    }

    // TrickSplit: executa N splits espaçados
    let trickSplitInProgress = false;
    function doTrickSplit(count = trickSplitConfig.count, interval = trickSplitConfig.interval) {
        if (trickSplitInProgress) return;
        trickSplitInProgress = true;
        let i = 0;
        const id = setInterval(() => {
            pressKey(' ');
            i++;
            if (i >= count) {
                clearInterval(id);
                trickSplitInProgress = false;
            }
        }, interval);
    }

    // Criar input para editar tecla com suporte a mouse
    function createKeyInput(keyName, label, defaultValue) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 11px;';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.flex = '1';

        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.value = keys[keyName] || defaultValue;
        input.style.cssText = 'width: 30px; text-align: center; padding: 2px; font-size: 11px; text-transform: lowercase;';

        input.addEventListener('click', (e) => {
            e.stopPropagation();
            isEditingKey = keyName;
            input.select();
            updateStatus(`Pressione uma tecla ou botão do mouse para ${label}`);
        });

        input.addEventListener('input', (e) => {
            if (e.target.value.length > 0) {
                keys[keyName] = e.target.value.toLowerCase();
                saveKeyConfig();
                updateKeysDisplay();
                isEditingKey = null;
                updateStatus(`Tecla ${label} alterada para: ${e.target.value}`);
            }
        });

        input.addEventListener('blur', () => { isEditingKey = null; });

        // Botão para selecionar botão do mouse
        const mouseButton = document.createElement('button');
        mouseButton.textContent = 'Mouse';
        mouseButton.style.cssText = 'margin-left: 5px; padding: 2px 6px; font-size: 10px; background: #666; color: white; border: none; border-radius: 3px; cursor: pointer;';
        mouseButton.title = 'Clique aqui e depois clique com o botão do mouse que deseja usar';

        mouseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isEditingKey = keyName;
            input.value = '...';
            updateStatus(`Clique com o botão do mouse para ${label} (Esquerdo=0, Direito=2, Meio=1)`);
        });

        container.appendChild(labelSpan);
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.appendChild(input);
        inputContainer.appendChild(mouseButton);
        container.appendChild(inputContainer);

        return container;
    }

    // Atualizar display das teclas no painel
    function updateKeysDisplay() {
        const elements = {
            feed: document.getElementById('key-feed'),
            doubleSplit: document.getElementById('key-doubleSplit'),
            tripleSplit: document.getElementById('key-tripleSplit'),
            quadSplit: document.getElementById('key-quadSplit'),
            trickSplit: document.getElementById('key-trickSplit'),
            centerMouse: document.getElementById('key-centerMouse'),
            toggleAutoRespawn: document.getElementById('key-toggleAutoRespawn'),
            togglePanel: document.getElementById('key-togglePanel'),
            toggleOptimizations: document.getElementById('key-toggleOptimizations')
        };

        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                const keyValue = keys[key];
                // Mostrar de forma amigável para botões do mouse
                if (keyValue === '0') element.textContent = 'MB1';
                else if (keyValue === '1') element.textContent = 'MB2';
                else if (keyValue === '2') element.textContent = 'MB3';
                else element.textContent = keyValue.toUpperCase();
            }
        }
    }

    // Capturar cliques do mouse para atribuição
    function setupMouseCapture() {
        document.addEventListener('mousedown', function(e) {
            if (!isEditingKey) return;

            e.preventDefault();
            e.stopPropagation();

            let mouseButton = '';
            switch (e.button) {
                case 0: mouseButton = '0'; break; // Botão esquerdo
                case 1: mouseButton = '1'; break; // Botão do meio
                case 2: mouseButton = '2'; break; // Botão direito
                default: return;
            }

            keys[isEditingKey] = mouseButton;
            saveKeyConfig();
            updateKeysDisplay();

            const buttonNames = { '0': 'Esquerdo', '1': 'Meio', '2': 'Direito' };
            updateStatus(`${isEditingKey} atribuído ao botão ${buttonNames[mouseButton]} do mouse`);

            isEditingKey = null;
        });

        // Prevenir menu contextual durante a atribuição
        document.addEventListener('contextmenu', function(e) {
            if (isEditingKey) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    // Função para executar ação baseada na tecla/mouse configurada
    function executeAction(actionKey, actionFunction) {
        const keyValue = keys[actionKey];

        // Se for botão do mouse (0, 1, 2)
        if (['0', '1', '2'].includes(keyValue)) {
            // Esta função será chamada quando o botão do mouse for pressionado
            // A detecção do mouse é feita separadamente
            return;
        }

        // Se for tecla normal
        actionFunction();
    }

    // Cria painel de controle com otimizações
    function createControlPanel() {
        const existingPanel = document.getElementById('agario-control-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'agario-control-panel';

        Object.assign(panel.style, {
            position: 'fixed',
            right: panelPosition.right || '12px',
            bottom: panelPosition.bottom || '12px',
            zIndex: 99999,
            background: 'rgba(0,0,0,0.95)',
            borderRadius: '10px',
            padding: '12px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            minWidth: '280px',
            border: '2px solid #444',
            maxHeight: '450px',
            overflowY: 'auto'
        });

        if (panelVisible) {
            panel.style.display = 'block';
            panel.style.visibility = 'visible';
            panel.style.opacity = '0.95';
        } else {
            panel.style.display = 'none';
            panel.style.visibility = 'hidden';
            panel.style.opacity = '0';
        }

        // Título
        const title = document.createElement('div');
        title.textContent = 'Agario Macro v2.3 - Feed Contínuo';
        title.style.cssText = 'text-align:center; font-weight:bold; margin-bottom:10px; color:#4CAF50; font-size:13px;';

        // Instruções
        const instructions = document.createElement('div');
        instructions.innerHTML = '<div style="font-size:10px; color:#FF9800; margin-bottom:10px; text-align:center;">💡 Feed ultra-rápido sem interrupções</div>';
        panel.appendChild(instructions);

        // Seção de Otimizações
        const optimizationsTitle = document.createElement('div');
        optimizationsTitle.textContent = 'Otimizações de Performance:';
        optimizationsTitle.style.cssText = 'font-weight:bold; margin:10px 0 5px 0; color:#FF9800; font-size:11px;';

        // Botão Otimizações
        const optimizationsBtn = document.createElement('button');
        optimizationsBtn.id = 'optimizations-btn';
        optimizationsBtn.innerHTML = `Otimizações: ${optimizationsEnabled ? 'ON' : 'OFF'} (<span id="key-toggleOptimizations">${keys.toggleOptimizations.toUpperCase()}</span>)`;
        Object.assign(optimizationsBtn.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '5px',
            border: 'none',
            background: optimizationsEnabled ? '#2196F3' : '#f44336',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px'
        });
        optimizationsBtn.addEventListener('click', () => {
            optimizationsEnabled = !optimizationsEnabled;
            optimizationsBtn.innerHTML = `Otimizações: ${optimizationsEnabled ? 'ON' : 'OFF'} (<span id="key-toggleOptimizations">${keys.toggleOptimizations.toUpperCase()}</span>)`;
            optimizationsBtn.style.background = optimizationsEnabled ? '#2196F3' : '#f44336';

            if (optimizationsEnabled) {
                applyPerformanceOptimizations();
                updateStatus("Otimizações ativadas - Jogo mais fluido");
            } else {
                removePerformanceOptimizations();
                updateStatus("Otimizações desativadas - Recarregando...");
            }
            saveKeyConfig();
        });

        // Seção de Teclas Ajustáveis
        const keysTitle = document.createElement('div');
        keysTitle.textContent = 'Teclas Ajustáveis (Teclado/Mouse):';
        keysTitle.style.cssText = 'font-weight:bold; margin:10px 0 5px 0; color:#FF9800; font-size:11px;';

        const keysContainer = document.createElement('div');
        keysContainer.style.cssText = 'margin-bottom:10px;';

        keysContainer.appendChild(createKeyInput('feed', 'Feed:', 'w'));
        keysContainer.appendChild(createKeyInput('doubleSplit', 'Split Duplo:', 'd'));
        keysContainer.appendChild(createKeyInput('tripleSplit', 'Split Triplo:', 'f'));
        keysContainer.appendChild(createKeyInput('quadSplit', 'Split Quádruplo:', 'g'));
        keysContainer.appendChild(createKeyInput('trickSplit', 'TrickSplit:', 'r'));
        keysContainer.appendChild(createKeyInput('centerMouse', 'Centralizar Mouse:', 's'));
        keysContainer.appendChild(createKeyInput('toggleAutoRespawn', 'Auto Respawn ON/OFF:', 'n'));
        keysContainer.appendChild(createKeyInput('togglePanel', 'Mostrar/Ocultar Painel:', 'p'));
        keysContainer.appendChild(createKeyInput('toggleOptimizations', 'Otimizações ON/OFF:', 'o'));

        // Botão Auto Respawn
        const autoRespawnBtn = document.createElement('button');
        autoRespawnBtn.id = 'auto-respawn-btn';
        autoRespawnBtn.innerHTML = `Auto Respawn: ${autoRespawnEnabled ? 'ON' : 'OFF'} (<span id="key-toggleAutoRespawn">${formatKeyDisplay(keys.toggleAutoRespawn)}</span>)`;
        Object.assign(autoRespawnBtn.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '5px',
            border: 'none',
            background: autoRespawnEnabled ? '#2196F3' : '#f44336',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px'
        });
        autoRespawnBtn.addEventListener('click', () => {
            autoRespawnEnabled = !autoRespawnEnabled;
            autoRespawnBtn.innerHTML = `Auto Respawn: ${autoRespawnEnabled ? 'ON' : 'OFF'} (<span id="key-toggleAutoRespawn">${formatKeyDisplay(keys.toggleAutoRespawn)}</span>)`;
            autoRespawnBtn.style.background = autoRespawnEnabled ? '#2196F3' : '#f44336';
            updateStatus(`Auto Respawn ${autoRespawnEnabled ? 'ativado' : 'desativado'}`);
        });

        // Botão Salvar e Ocultar
        const saveHideBtn = document.createElement('button');
        saveHideBtn.innerHTML = `💾 Salvar e Ocultar Painel`;
        Object.assign(saveHideBtn.style, {
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '5px',
            border: 'none',
            background: '#9C27B0',
            color: 'white',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
        });
        saveHideBtn.addEventListener('click', () => {
            saveKeyConfig();
            savePanelState();
            togglePanel();
        });

        // Status
        const status = document.createElement('div');
        status.id = 'agario-status';
        status.textContent = `Feed Contínuo - Otimizações: ${optimizationsEnabled ? 'ON' : 'OFF'}`;
        status.style.cssText = 'margin-top:8px; font-size:9px; opacity:0.7; text-align:center; padding:4px; background:rgba(255,255,255,0.1); border-radius:3px;';

        // Legenda
        const legend = document.createElement('div');
        legend.innerHTML = `
            <div style="font-size:9px; opacity:0.7; margin-top:5px;">
                Teclas atuais:<br>
                Feed: <span id="key-feed">${formatKeyDisplay(keys.feed)}</span> |
                Split 2x: <span id="key-doubleSplit">${formatKeyDisplay(keys.doubleSplit)}</span><br>
                Split 3x: <span id="key-tripleSplit">${formatKeyDisplay(keys.tripleSplit)}</span> |
                Split 4x: <span id="key-quadSplit">${formatKeyDisplay(keys.quadSplit)}</span><br>
                Trick: <span id="key-trickSplit">${formatKeyDisplay(keys.trickSplit)}</span> |
                Mouse: <span id="key-centerMouse">${formatKeyDisplay(keys.centerMouse)}</span><br>
                Painel: <span id="key-togglePanel">${formatKeyDisplay(keys.togglePanel)}</span> |
                FPS: <span id="key-toggleOptimizations">${formatKeyDisplay(keys.toggleOptimizations)}</span>
            </div>
        `;

        panel.appendChild(title);
        panel.appendChild(optimizationsTitle);
        panel.appendChild(optimizationsBtn);
        panel.appendChild(keysTitle);
        panel.appendChild(keysContainer);
        panel.appendChild(autoRespawnBtn);
        panel.appendChild(saveHideBtn);
        panel.appendChild(legend);
        panel.appendChild(status);

        // Função para formatar a exibição das teclas
        function formatKeyDisplay(keyValue) {
            if (keyValue === '0') return 'MB1';
            if (keyValue === '1') return 'MB2';
            if (keyValue === '2') return 'MB3';
            return keyValue.toUpperCase();
        }

        // Tornar painel arrastável
        let isDragging = false;
        let startX, startY, origRight, origBottom;
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = panel.getBoundingClientRect();
                origRight = window.innerWidth - rect.right;
                origBottom = window.innerHeight - rect.bottom;
                panel.style.opacity = '0.8';
                e.preventDefault();
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.right = (origRight - dx) + 'px';
            panel.style.bottom = (origBottom - dy) + 'px';
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.opacity = '0.95';
            savePanelState();
        });

        document.body.appendChild(panel);
        return panel;
    }

    // Atualizar status do painel
    function updateStatus(message) {
        const status = document.getElementById('agario-status');
        if (status) {
            status.textContent = message;
            setTimeout(() => {
                status.textContent = `Feed Contínuo - Otimizações: ${optimizationsEnabled ? 'ON' : 'OFF'}`;
            }, 3000);
        }
    }

    // Sistema de detecção de botões do mouse para as funções
    function setupMouseActionSystem() {
        document.addEventListener('mousedown', function(e) {
            if (isEditingKey) return; // Não processar se estiver editando

            const mouseButton = e.button.toString();

            // Verificar qual função está atribuída a este botão do mouse
            for (const [action, key] of Object.entries(keys)) {
                if (key === mouseButton) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Executar a função correspondente
                    switch (action) {
                        case 'feed':
                            startFeed();
                            break;
                        case 'doubleSplit':
                            pressKey(' '); setTimeout(() => pressKey(' '), 40);
                            break;
                        case 'tripleSplit':
                            pressKey(' '); setTimeout(() => pressKey(' '), 40); setTimeout(() => pressKey(' '), 80);
                            break;
                        case 'quadSplit':
                            pressKey(' '); setTimeout(() => pressKey(' '), 40); setTimeout(() => pressKey(' '), 80); setTimeout(() => pressKey(' '), 120);
                            break;
                        case 'trickSplit':
                            if (!trickSplitInProgress) doTrickSplit();
                            break;
                        case 'centerMouse':
                            const centerX = window.innerWidth / 2;
                            const centerY = window.innerHeight / 2;
                            document.dispatchEvent(new MouseEvent('mousemove', { clientX: centerX, clientY: centerY, bubbles: true }));
                            updateStatus("Mouse centralizado");
                            break;
                    }
                    break;
                }
            }
        });

        document.addEventListener('mouseup', function(e) {
            const mouseButton = e.button.toString();
            if (mouseButton === '0' && keys.feed === '0') {
                stopFeed();
            }
        });

        // Prevenir menu contextual para botões do mouse atribuídos
        document.addEventListener('contextmenu', function(e) {
            for (const [action, key] of Object.entries(keys)) {
                if (key === '2') { // Botão direito
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                }
            }
        });
    }

    // Captura eventos de teclado
    window.addEventListener('keydown', function(e) {
        const tag = document.activeElement && document.activeElement.tagName;

        if (isEditingKey) {
            e.preventDefault();
            e.stopPropagation();
            const newKey = e.key.toLowerCase();
            if (newKey.length === 1 && newKey.match(/[a-z0-9]/)) {
                keys[isEditingKey] = newKey;
                saveKeyConfig();
                updateKeysDisplay();
                updateStatus(`Tecla alterada para: ${newKey.toUpperCase()}`);
            }
            isEditingKey = null;
            return;
        }

        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

        if (e.key.toLowerCase() === keys.togglePanel) {
            e.preventDefault();
            e.stopPropagation();
            togglePanel();
            return;
        }

        if (e.key.toLowerCase() === keys.toggleOptimizations) {
            e.preventDefault();
            e.stopPropagation();
            optimizationsEnabled = !optimizationsEnabled;
            const btn = document.getElementById('optimizations-btn');
            if (btn) {
                btn.innerHTML = `Otimizações: ${optimizationsEnabled ? 'ON' : 'OFF'} (<span id="key-toggleOptimizations">${formatKeyDisplay(keys.toggleOptimizations)}</span>)`;
                btn.style.background = optimizationsEnabled ? '#2196F3' : '#f44336';
            }

            if (optimizationsEnabled) {
                applyPerformanceOptimizations();
                updateStatus("Otimizações ativadas - Jogo mais fluido");
            } else {
                removePerformanceOptimizations();
            }
            saveKeyConfig();
            return;
        }

        // Demais teclas de controle (apenas se não forem botões de mouse)
        if (e.key.toLowerCase() === keys.feed && !['0', '1', '2'].includes(keys.feed)) startFeed();
        if (e.key.toLowerCase() === keys.doubleSplit && !['0', '1', '2'].includes(keys.doubleSplit)) {
            pressKey(' '); setTimeout(() => pressKey(' '), 40);
        }
        if (e.key.toLowerCase() === keys.tripleSplit && !['0', '1', '2'].includes(keys.tripleSplit)) {
            pressKey(' '); setTimeout(() => pressKey(' '), 40); setTimeout(() => pressKey(' '), 80);
        }
        if (e.key.toLowerCase() === keys.quadSplit && !['0', '1', '2'].includes(keys.quadSplit)) {
            pressKey(' '); setTimeout(() => pressKey(' '), 40); setTimeout(() => pressKey(' '), 80); setTimeout(() => pressKey(' '), 120);
        }
        if (e.key.toLowerCase() === keys.trickSplit && !['0', '1', '2'].includes(keys.trickSplit)) {
            if (!trickSplitInProgress) doTrickSplit();
        }
        if (e.key.toLowerCase() === keys.centerMouse && !['0', '1', '2'].includes(keys.centerMouse)) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            document.dispatchEvent(new MouseEvent('mousemove', { clientX: centerX, clientY: centerY, bubbles: true }));
            updateStatus("Mouse centralizado");
        }
        if (e.key.toLowerCase() === keys.toggleAutoRespawn && !['0', '1', '2'].includes(keys.toggleAutoRespawn)) {
            autoRespawnEnabled = !autoRespawnEnabled;
            const btn = document.getElementById('auto-respawn-btn');
            if (btn) {
                btn.innerHTML = `Auto Respawn: ${autoRespawnEnabled ? 'ON' : 'OFF'} (<span id="key-toggleAutoRespawn">${formatKeyDisplay(keys.toggleAutoRespawn)}</span>)`;
                btn.style.background = autoRespawnEnabled ? '#2196F3' : '#f44336';
            }
            updateStatus(`Auto Respawn ${autoRespawnEnabled ? 'ativado' : 'desativado'}`);
        }
    });

    window.addEventListener('keyup', function(e) {
        if (e.key.toLowerCase() === keys.feed && !['0', '1', '2'].includes(keys.feed)) stopFeed();
    });

    // Função auxiliar para formatar exibição
    function formatKeyDisplay(keyValue) {
        if (keyValue === '0') return 'MB1';
        if (keyValue === '1') return 'MB2';
        if (keyValue === '2') return 'MB3';
        return keyValue.toUpperCase();
    }

    // Inicializar
    function initialize() {
        createControlPanel();
        setupMouseCapture();
        setupMouseActionSystem();
        startAutoRespawn();

        if (optimizationsEnabled) {
            setTimeout(applyPerformanceOptimizations, 1000);
        }

        updateStatus(`Script carregado - Feed Contínuo Ativo`);
        console.log("✅ Macro AgarioBR com Feed Contínuo carregado!");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();