// ==UserScript==
// @name         Controle de Linhas - Tabela
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Controle para marcar linhas da tabela e filtrar
// @author       Adriel Alves
// @match        https://cenegedpa.gpm.srv.br/ci/Servico/ConsultaServicos/*
// @match        https://cenegedpa.gpm.srv.br/ci/Servico/EditaServico/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550057/Controle%20de%20Linhas%20-%20Tabela.user.js
// @updateURL https://update.greasyfork.org/scripts/550057/Controle%20de%20Linhas%20-%20Tabela.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Classe para gerenciar o controle de linhas
    class TableRowController {
        constructor() {
            this.storageKey = 'markedTableRows';
            this.currentFilter = 'todos'; // todos, salvos, nao-salvos
            this.markedRows = this.loadMarkedRows();
            this.init();
        }

        // Carrega as linhas marcadas do localStorage
        loadMarkedRows() {
            try {
                const saved = localStorage.getItem(this.storageKey);
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
                return [];
            }
        }

        // Salva as linhas marcadas no localStorage
        saveMarkedRows() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.markedRows));
            } catch (e) {
                console.error('Erro ao salvar dados:', e);
            }
        }

        // Inicializa o controle
        init() {
            this.createControlPanel();
            this.addCustomStyles();
            this.processTable();
            this.observeTableChanges();
            this.toggleMinimize(); // inicia minimizado
        }

        // Adiciona estilos CSS customizados
        addCustomStyles() {
            const style = document.createElement('style');
            style.id = 'table-controller-styles';
            style.textContent = `
                /* Estilos para linhas marcadas - sobrepõe odd/even */
                #tab_resultados tr.marked-row {
                    background-color: #d4edda !important;
                    border-left: 4px solid #28a745 !important;
                }

                /* Hover effect para linhas marcadas */
                #tab_resultados tr.marked-row:hover {
                    background-color: #c3e6cb !important;
                }

                /* Estilos para os botões de controle */
                .row-control-btn {
                    transition: all 0.2s ease !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
                }

                .row-control-btn:hover {
                    transform: scale(1.1) !important;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
                }

                /* Estilo para o painel quando minimizado */
                #table-row-controller.minimized {
                    animation: pulse 2s infinite !important;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
                    50% { box-shadow: 0 4px 15px rgba(0,123,255,0.4); }
                    100% { box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
                }
            `;
            document.head.appendChild(style);
        }

        // Cria o painel de controle
        createControlPanel() {
            const controlPanel = document.createElement('div');
            controlPanel.id = 'table-row-controller';
            controlPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f0f0f0;
                border: 2px solid #ccc;
                border-radius: 8px;
                padding: 0;
                z-index: 9999;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
                min-width: 200px;
                cursor: move;
                transition: all 0.3s ease;
            `;

            controlPanel.innerHTML = `
                <div id="panel-header" style="
                    background: #007bff;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px 6px 0 0;
                    font-weight: bold;
                    font-size: 12px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                ">
                    <span>📋 Controle de Linhas</span>
                    <button id="minimize-btn" style="
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        padding: 2px 6px;
                        border-radius: 3px;
                        hover: background-color: rgba(255,255,255,0.2);
                    ">−</button>
                </div>
                <div id="panel-content" style="padding: 15px;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px; font-size: 12px; color: #666;">
                            Filtrar por:
                        </label>
                        <select id="filter-select" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="todos">📋 Todos</option>
                            <option value="salvos">✅ Salvos</option>
                            <option value="nao-salvos">❌ Não Salvos</option>
                        </select>
                    </div>
                    <div style="font-size: 11px; color: #666; margin-bottom: 10px;">
                        <div>Total: <span id="total-count">0</span></div>
                        <div>Salvos: <span id="saved-count">0</span></div>
                        <div>Não salvos: <span id="unsaved-count">0</span></div>
                    </div>
                    <div>
                        <button id="clear-all-btn" style="
                            width: 100%;
                            padding: 5px;
                            background: #dc3545;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                        ">🗑️ Limpar Todos</button>
                    </div>
                </div>
            `;

            document.body.appendChild(controlPanel);

            // Estado do painel (expandido/minimizado)
            this.isMinimized = false;

            // Eventos do painel
            document.getElementById('filter-select').addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.applyFilter();
            });

            document.getElementById('clear-all-btn').addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar todas as marcações?')) {
                    this.clearAllMarked();
                }
            });

            // Evento de minimizar/expandir
            document.getElementById('minimize-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });

            // Adiciona funcionalidade de drag
            this.makeDraggable(controlPanel);
        }

        // Alterna entre minimizado e expandido
        toggleMinimize() {
            const panel = document.getElementById('table-row-controller');
            const content = document.getElementById('panel-content');
            const minimizeBtn = document.getElementById('minimize-btn');
            const header = document.getElementById('panel-header');

            if (this.isMinimized) {
                // Expandir
                panel.style.minWidth = '200px';
                panel.style.width = '200px';
                panel.style.height = 'auto';
                panel.style.borderRadius = '8px';
                content.style.display = 'block';
                header.style.borderRadius = '6px 6px 0 0';
                header.style.justifyContent = 'space-between';
                header.querySelector('span').style.display = 'inline';
                minimizeBtn.textContent = '−';
                minimizeBtn.title = 'Minimizar';
                this.isMinimized = false;
            } else {
                // Minimizar
                panel.style.minWidth = '50px';
                panel.style.width = '50px';
                panel.style.height = '50px';
                panel.style.borderRadius = '50%';
                content.style.display = 'none';
                header.style.borderRadius = '50%';
                header.style.justifyContent = 'center';
                header.querySelector('span').style.display = 'none';
                minimizeBtn.textContent = '📋';
                minimizeBtn.title = 'Expandir';
                this.isMinimized = true;
            }
        }

        // Torna o painel arrastável
        makeDraggable(element) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            const header = element.querySelector('#panel-header');

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                // Não inicia drag se clicou no botão minimizar
                if (e.target.id === 'minimize-btn') return;

                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === header || header.contains(e.target)) {
                    isDragging = true;
                    element.style.cursor = 'grabbing';
                    header.style.cursor = 'grabbing';
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;

                    // Limita o movimento dentro da viewport
                    const rect = element.getBoundingClientRect();
                    const maxX = window.innerWidth - rect.width;
                    const maxY = window.innerHeight - rect.height;

                    currentX = Math.max(0, Math.min(currentX, maxX));
                    currentY = Math.max(0, Math.min(currentY, maxY));

                    element.style.left = currentX + 'px';
                    element.style.top = currentY + 'px';
                    element.style.right = 'auto';
                }
            }

            function dragEnd() {
                if (isDragging) {
                    initialX = currentX;
                    initialY = currentY;
                    isDragging = false;
                    element.style.cursor = 'move';
                    header.style.cursor = 'move';
                }
            }

            // Adiciona estilos de hover para o botão minimizar
            const minimizeBtn = document.getElementById('minimize-btn');
            minimizeBtn.addEventListener('mouseenter', () => {
                minimizeBtn.style.backgroundColor = 'rgba(255,255,255,0.2)';
            });
            minimizeBtn.addEventListener('mouseleave', () => {
                minimizeBtn.style.backgroundColor = 'transparent';
            });
        }

        // Processa a tabela adicionando botões e marcações
        processTable() {
            const table = document.querySelector('#tab_resultados');
            if (!table) return;

            const rows = table.querySelectorAll('tr');
            let totalRows = 0;

            rows.forEach((row, index) => {
                // Pula o cabeçalho (primeira linha)
                if (index === 0) return;

                const idCell = row.querySelector('.sorting_1');
                if (!idCell) return;

                const rowId = idCell.textContent.trim();
                if (!rowId) return;

                totalRows++;

                // Remove botão existente se houver
                const existingBtn = row.querySelector('.row-control-btn');
                if (existingBtn) existingBtn.remove();

                // Cria botão de controle
                const controlBtn = document.createElement('button');
                const isMarked = this.markedRows.includes(rowId);

                this.updateButtonState(controlBtn, isMarked);
                controlBtn.className = 'row-control-btn';
                controlBtn.style.cssText = `
                    margin-left: 5px;
                    padding: 2px 8px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: bold;
                `;

                controlBtn.addEventListener('click', () => {
                    this.toggleRowMark(rowId, row, controlBtn);
                });

                // Adiciona o botão na primeira célula
                const firstCell = row.querySelector('td');
                if (firstCell) {
                    firstCell.appendChild(controlBtn);
                }

                // Aplica cor de fundo se marcado
                this.updateRowStyle(row, isMarked);

                // Define atributos para filtragem
                row.setAttribute('data-row-id', rowId);
                row.setAttribute('data-marked', isMarked);
            });

            this.updateCounts();
            this.applyFilter();
        }

        // Atualiza o estado visual do botão
        updateButtonState(button, isMarked) {
            if (isMarked) {
                button.textContent = '✅';
                button.style.background = '#28a745';
                button.style.color = 'white';
                button.title = 'Clique para desmarcar';
            } else {
                button.textContent = '👍';
                button.style.background = '#6c757d';
                button.style.color = 'white';
                button.title = 'Clique para marcar';
            }
        }

        // Atualiza o estilo da linha
        updateRowStyle(row, isMarked) {
            if (isMarked) {
                // Aplica estilos com !important para sobrepor as classes odd/even
                row.style.setProperty('background-color', '#d4edda', 'important');
                row.style.setProperty('border-left', '4px solid #28a745', 'important');
                row.classList.add('marked-row');
            } else {
                // Remove estilos personalizados
                row.style.removeProperty('background-color');
                row.style.removeProperty('border-left');
                row.classList.remove('marked-row');
            }
        }

        // Alterna marcação da linha
        toggleRowMark(rowId, row, button) {
            const isCurrentlyMarked = this.markedRows.includes(rowId);

            if (isCurrentlyMarked) {
                // Desmarca
                this.markedRows = this.markedRows.filter(id => id !== rowId);
                this.updateButtonState(button, false);
                this.updateRowStyle(row, false);
                row.setAttribute('data-marked', 'false');
            } else {
                // Marca
                this.markedRows.push(rowId);
                this.updateButtonState(button, true);
                this.updateRowStyle(row, true);
                row.setAttribute('data-marked', 'true');
            }

            this.saveMarkedRows();
            this.updateCounts();
            this.applyFilter();
        }

        // Aplica filtro na tabela
        applyFilter() {
            const table = document.querySelector('#tab_resultados');
            if (!table) return;

            const rows = table.querySelectorAll('tr[data-row-id]');

            rows.forEach(row => {
                const isMarked = row.getAttribute('data-marked') === 'true';
                let shouldShow = true;

                switch (this.currentFilter) {
                    case 'salvos':
                        shouldShow = isMarked;
                        break;
                    case 'nao-salvos':
                        shouldShow = !isMarked;
                        break;
                    case 'todos':
                    default:
                        shouldShow = true;
                        break;
                }

                row.style.display = shouldShow ? '' : 'none';
            });
        }

        // Atualiza contadores
        updateCounts() {
            const table = document.querySelector('#tab_resultados');
            if (!table) return;

            const rows = table.querySelectorAll('tr[data-row-id]');
            const totalCount = rows.length;
            const savedCount = this.markedRows.length;
            const unsavedCount = totalCount - savedCount;

            const totalElement = document.getElementById('total-count');
            const savedElement = document.getElementById('saved-count');
            const unsavedElement = document.getElementById('unsaved-count');

            if (totalElement) totalElement.textContent = totalCount;
            if (savedElement) savedElement.textContent = savedCount;
            if (unsavedElement) unsavedElement.textContent = unsavedCount;
        }

        // Limpa todas as marcações
        clearAllMarked() {
            this.markedRows = [];
            this.saveMarkedRows();
            this.processTable();
        }

        // Observa mudanças na tabela (para tabelas dinâmicas)
        observeTableChanges() {
            const table = document.querySelector('#tab_resultados');
            if (!table) return;

            const observer = new MutationObserver((mutations) => {
                let shouldReprocess = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1 && (node.tagName === 'TR' || node.querySelector('tr'))) {
                                shouldReprocess = true;
                            }
                        });
                    }
                });

                if (shouldReprocess) {
                    setTimeout(() => this.processTable(), 100);
                }
            });

            observer.observe(table, {
                childList: true,
                subtree: true
            });
        }
    }

    // Aguarda o carregamento da página e inicializa
    function initController() {
        if (document.querySelector('#tab_resultados')) {
            new TableRowController();
        } else {
            // Se a tabela não estiver disponível, tenta novamente em 1 segundo
            setTimeout(initController, 1000);
        }
    }

    // Inicializa quando a página estiver carregada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initController);
    } else {
        initController();
    }

})();