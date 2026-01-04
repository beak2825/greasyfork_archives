// ==UserScript==
// @name         Moon UI
// @namespace    http://tampermonkey.net/
// @version      2.8.0
// @description  Melhorias para interface e jogabilidade, incluindo agendamento, favoritos avançados e backup.
// @author       crazyphantombr & Gemini
// @license      MIT
// @match        *://*.hive.pizza/uni*/game.php*
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551257/Moon%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/551257/Moon%20UI.meta.js
// ==/UserScript==
//
// --- HISTÓRICO DE VERSÕES (CHANGELOG) ---
// v2.8.0 (2026-01-03) [Stable Release]:
// - [STABLE] Consolidação das funcionalidades de Fila Inteligente e Otimização de Rotas.
// - [FEATURE] Fila Inteligente (Best Fit): O sistema agora ignora ataques para os quais faltam naves e preenche o lote com os próximos ataques da fila que cabem no estoque.
// - [FEATURE] Otimização de Rota: Reordenação automática da fila de ataques baseada na proximidade (Galáxia > Sistema) em relação à origem atual.
// - [SAFETY] Verificação de Estoque: O envio de frotas agora é validado matematicamente contra o cache local de naves, prevenindo erros de envio.
// - [UI] Melhorias gerais e renomeação dos botões de Importar/Exportar.
//
// v2.7.5 (2026-01-03) [Development]:
// - [FIX] Lógica de Fila Inteligente (Best Fit).
// --- FIM DO HISTÓRICO ---


(function() {
    'use strict';

    // --- PAINEL DE CONTROLE E CONSTANTES ---
    const CONFIG = {
        MODO_DEBUG: false,
        INTERVALO_VERIFICACAO_AGENDADOR: 5000
    };

    const webAppUrl = 'https://script.google.com/macros/s/AKfycbwS-bmTcD5JLwGGP6F8QOYxzTYzMLPIO8eV2X5bXeCtxAmUn6YeCEVgWgIfWY9bDWY/exec';

    const log = (message) => {
        if (CONFIG.MODO_DEBUG) console.log(`[Moon UI Script v${GM_info.script.version}] ${message}`);
    };

    // --- LÓGICA DE MÚLTIPLOS UNIVERSOS E CHAVES DINÂMICAS ---
    function getUniverseId() {
        const match = window.location.hostname.match(/uni(\d+)/) || window.location.href.match(/uni(\d+)/);
        const id = match ? `uni${match[1]}` : 'default_universe';
        return id;
    }
    const UNIVERSE_ID = getUniverseId();
    const FAVORITE_PLANETS_KEY = `${UNIVERSE_ID}_favoritePlanets_v2`;
    const SPY_QUEUE_KEY = `${UNIVERSE_ID}_spyQueue`;
    const SPY_QUEUE_ORIGIN_KEY = `${UNIVERSE_ID}_spyQueueOrigin`;
    const SCHEDULED_ATTACKS_KEY = `${UNIVERSE_ID}_scheduledAttacks`;
    const FLEET_SLOTS_KEY = `${UNIVERSE_ID}_fleetSlotsInfo`;
    const PANEL_COLLAPSED_KEY = `${UNIVERSE_ID}_panelCollapsed`;

    // Chaves de sessão para o novo fluxo de agendamento
    const DRAFT_SCHEDULE_PARAMS_KEY = 'moon_draft_params';
    const DRAFT_SCHEDULE_ACTIVE_KEY = 'moon_draft_active';

    function getAttackQueueKey() {
        const planetId = getPlanetaOrigemId();
        if (!planetId) return null;
        return `${UNIVERSE_ID}_attackQueue_${planetId}`;
    }

    function getShipCountsKey() {
        const planetId = getPlanetaOrigemId();
        if (!planetId) return null;
        return `${UNIVERSE_ID}_shipCounts_${planetId}`;
    }


    // --- FUNÇÕES UTILITÁRIAS ---
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function parseDurationToMs(text) {
        if (!text) return 0;
        let seconds = 0;
        const cleanText = text.trim();

        const matchColons = cleanText.match(/(\d+):(\d+):(\d+)/);
        
        if (matchColons) {
            seconds += parseInt(matchColons[1], 10) * 3600;
            seconds += parseInt(matchColons[2], 10) * 60;
            seconds += parseInt(matchColons[3], 10);
            return seconds * 1000;
        }

        const partsH = cleanText.match(/(\d+)\s*h/);
        const partsM = cleanText.match(/(\d+)\s*m/);
        const partsS = cleanText.match(/(\d+)\s*s/);

        if (partsH || partsM || partsS) {
            if (partsH) seconds += parseInt(partsH[1], 10) * 3600;
            if (partsM) seconds += parseInt(partsM[1], 10) * 60;
            if (partsS) seconds += parseInt(partsS[1], 10);
            return seconds * 1000;
        }

        return 0;
    }

    function getCoordenadasOrigem() {
        const planetSelector = document.getElementById('planetSelector');
        if (!planetSelector || planetSelector.selectedIndex < 0) return null;
        
        const optionText = planetSelector.options[planetSelector.selectedIndex].text;
        const match = optionText.match(/\[(\d+):(\d+):(\d+)\]/);
        
        if (match) {
            return { g: parseInt(match[1]), s: parseInt(match[2]), p: parseInt(match[3]) };
        }
        return null;
    }

    function parseCoordsFromUrl(url) {
        try {
            const params = new URLSearchParams(new URL(url, window.location.origin).search);
            return {
                g: parseInt(params.get('galaxy') || 0),
                s: parseInt(params.get('system') || 0),
                p: parseInt(params.get('planet') || 0)
            };
        } catch (e) {
            return { g: 0, s: 0, p: 0 };
        }
    }

    // --- FUNÇÕES DE MELHORIA ---
    async function salvarContagemNaves() {
        const key = getShipCountsKey();
        if (!key) return;

        const getShipCount = (shipId) => {
            const countElement = document.getElementById(`ship${shipId}_value`);
            if (countElement) {
                return parseInt(countElement.textContent.replace(/\D/g, ''), 10) || 0;
            }
            return 0;
        };

        const shipCounts = {
            sc: getShipCount(202),
            lc: getShipCount(203),
            bs: getShipCount(207),
            rc: getShipCount(209),
            spy: getShipCount(210),
            pb: getShipCount(211)
        };

        await GM_setValue(key, JSON.stringify(shipCounts));
    }

    async function atualizarContagemNavesDisponiveis() {
        const display = document.getElementById('available-ships-display');
        const key = getShipCountsKey();
        if (!display || !key) return;

        const savedCounts = JSON.parse(await GM_getValue(key, '{}'));
        const shipDataLine1 = [
            { sigla: 'SC', count: savedCounts.sc || 0 },
            { sigla: 'LC', count: savedCounts.lc || 0 },
            { sigla: 'BS', count: savedCounts.bs || 0 }
        ];
        const shipDataLine2 = [
            { sigla: 'PB', count: savedCounts.pb || 0 },
            { sigla: 'RC', count: savedCounts.rc || 0 },
            { sigla: 'SPY', count: savedCounts.spy || 0 }
        ];

        const line1Text = shipDataLine1
            .filter(ship => ship.count > 0)
            .map(ship => `${ship.count} ${ship.sigla}`)
            .join(' | ');

        const line2Text = shipDataLine2
            .filter(ship => ship.count > 0)
            .map(ship => `${ship.count} ${ship.sigla}`)
            .join(' | ');

        const displayText = [line1Text, line2Text].filter(line => line).join('<br>');

        if (displayText === '') {
            display.style.display = 'none';
        } else {
            display.innerHTML = displayText;
            display.style.display = 'block';
        }
    }


    function calcularTempoParaRecursos() {
        const page = new URLSearchParams(window.location.search).get('page');
        if (!['buildings', 'research', 'shipyard'].includes(page)) return;

        const productionRates = { metal: 0, crystal: 0, deuterium: 0 };
        const scripts = document.querySelectorAll('script');
        const tickerScript = Array.from(scripts).find(s => s.textContent.includes('resourceTicker'));

        if (tickerScript) {
            const text = tickerScript.textContent;
            const metalMatch = text.match(/production:\s*([\d\.]+),\s*valueElem:\s*"current_metal"/);
            const crystalMatch = text.match(/production:\s*([\d\.]+),\s*valueElem:\s*"current_crystal"/);
            const deuteriumMatch = text.match(/production:\s*([\d\.]+),\s*valueElem:\s*"current_deuterium"/);

            if (metalMatch) productionRates.metal = parseFloat(metalMatch[1]);
            if (crystalMatch) productionRates.crystal = parseFloat(crystalMatch[1]);
            if (deuteriumMatch) productionRates.deuterium = parseFloat(deuteriumMatch[1]);
        }

        document.querySelectorAll('div.buildl:not([data-time-calculated])').forEach(buildSection => {
            const remainingTextNode = Array.from(buildSection.childNodes).find(node =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim().includes('Remaining:')
            );

            if (!remainingTextNode) return;
            buildSection.setAttribute('data-time-calculated', 'true');

            const resourceLinks = buildSection.querySelectorAll('a[onclick*="Dialog.info"]');
            resourceLinks.forEach(link => {
                let resourceKey = link.textContent.toLowerCase();
                if (resourceKey === 'silicon') resourceKey = 'crystal';
                if (resourceKey === 'uranium') resourceKey = 'deuterium';

                const productionRate = productionRates[resourceKey];
                if (productionRate > 0) {
                    const amountSpan = link.nextElementSibling;
                    if (amountSpan && amountSpan.tagName === 'SPAN') {
                        const neededAmount = parseInt(amountSpan.textContent.replace(/\./g, ''), 10);

                        if (neededAmount > 0) {
                            const timeInSeconds = (neededAmount / productionRate) * 3600;

                            const hours = Math.floor(timeInSeconds / 3600);
                            const minutes = Math.floor((timeInSeconds % 3600) / 60);
                            const seconds = Math.floor(timeInSeconds % 60);

                            let formattedTime = '';
                            if (hours > 0) formattedTime += `${hours}h `;
                            if (minutes > 0 || hours > 0) formattedTime += `${minutes}m `;
                            formattedTime += `${seconds}s`;

                            const timeSpan = document.createElement('span');
                            timeSpan.style.color = '#9ACD32';
                            timeSpan.style.marginLeft = '5px';
                            timeSpan.textContent = `(${formattedTime.trim()})`;

                            amountSpan.insertAdjacentElement('afterend', timeSpan);
                        }
                    }
                }
            });
        });
    }

    function atualizarContagemFrotasFila() {
        const display = document.getElementById('queue-req-display');
        const key = getAttackQueueKey();
        if (!display || !key) return;

        const queue = JSON.parse(localStorage.getItem(key)) || [];
        if (queue.length === 0) {
            display.style.display = 'none';
            return;
        }

        let totals = { sc: 0, lc: 0, bs: 0, pb: 0 };

        queue.forEach(url => {
            const params = new URLSearchParams(new URL(url, window.location.origin).search);
            totals.sc += parseInt(params.get('ship202') || '0', 10);
            totals.lc += parseInt(params.get('ship203') || '0', 10);
            totals.bs += parseInt(params.get('ship207') || '0', 10);
            totals.pb += parseInt(params.get('ship211') || '0', 10);
        });

        const displayText = [
            totals.sc > 0 ? `${totals.sc} SC` : '',
            totals.lc > 0 ? `${totals.lc} LC` : '',
            totals.bs > 0 ? `${totals.bs} BS` : '',
            totals.pb > 0 ? `${totals.pb} PB` : ''
        ].filter(text => text).join(' | ');


        display.textContent = displayText;
        display.style.display = 'block';
    }

    async function carregarRankingCompleto() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') !== 'statistics' || document.body.dataset.rankingLoaded === 'true') return;
        document.body.dataset.rankingLoaded = 'true';

        const rangeSelector = document.getElementById('range');
        if (!rangeSelector || rangeSelector.options.length <= 1) return;

        const rankingTable = Array.from(document.querySelectorAll('.table519')).find(table => table.textContent.includes('Rank'));
        if (!rankingTable) return;

        const targetElement = rankingTable.querySelector('tbody') || rankingTable;

        const statusIndicator = document.createElement('div');
        statusIndicator.style.cssText = 'text-align: center; padding: 10px; color: #FFA500; font-weight: bold;';
        rankingTable.insertAdjacentElement('beforebegin', statusIndicator);

        const pagesToFetch = [...rangeSelector.options].filter(option => !option.selected);
        const totalPages = pagesToFetch.length + 1;
        let currentPageNum = 1;

        const whoValue = document.getElementById('who').value;
        const typeValue = document.getElementById('type').value;

        for (const option of pagesToFetch) {
            currentPageNum++;
            statusIndicator.textContent = `Carregando página ${currentPageNum} de ${totalPages}...`;
            try {
                const formData = new FormData();
                formData.append('who', whoValue);
                formData.append('type', typeValue);
                formData.append('range', option.value);

                const response = await fetch('game.php?page=statistics', {
                    method: 'POST',
                    body: formData
                });
                if (!response.ok) continue;

                const htmlText = await response.text();
                const tempDoc = new DOMParser().parseFromString(htmlText, 'text/html');
                const fetchedRankingTable = Array.from(tempDoc.querySelectorAll('.table519')).find(table => table.textContent.includes('Rank'));

                if (fetchedRankingTable) {
                    fetchedRankingTable.querySelectorAll('tbody tr').forEach(row => {
                        if (!row.querySelector('th')) {
                            targetElement.appendChild(row);
                        }
                    });
                }
            } catch (error) {
                log(`Falha ao buscar a página do ranking`, error);
            }
            await new Promise(res => setTimeout(res, 200));
        }

        statusIndicator.textContent = 'Ranking completo carregado!';
        setTimeout(() => statusIndicator.remove(), 3000);

        if (rangeSelector) {
            const rangeLabel = document.querySelector('label[for="range"]');
            if (rangeLabel) rangeLabel.style.display = 'none';
            rangeSelector.style.display = 'none';
        }
    }

    function extrairDados() {
        const galaxia = document.querySelector('input[name="galaxy"]').value;
        const sistemaSolar = document.querySelector('input[name="system"]').value;
        const todosOsJogadores = [];
        const dataAtual = new Date().toLocaleString('pt-BR');
        const linhasJogadores = document.querySelectorAll('.table569 tbody tr:has(.galaxy-username)');

        for (const linha of linhasJogadores) {
            const celulaPosicao = linha.querySelector('td:nth-child(1)');
            const celulaJogador = Array.from(linha.cells).find(cell => cell.querySelector('.galaxy-username'));

            if (celulaPosicao && celulaJogador) {
                const posicao = celulaPosicao.innerText.trim();
                const nomeJogador = celulaJogador.querySelector('.galaxy-username').innerText.trim();
                let status = celulaJogador.querySelector('a.tooltip_sticky').innerText.replace(nomeJogador, '').trim();
                if (status === '') status = '-';
                todosOsJogadores.push([dataAtual, galaxia, sistemaSolar, posicao, nomeJogador, status]);
            }
        }

        if (todosOsJogadores.length > 0) {
            log(`Enviando ${todosOsJogadores.length} jogadores para a planilha...`);
            enviarParaPlanilha(todosOsJogadores);
        } else {
            alert('Nenhum jogador encontrado nesta página.');
        }
    }

    function enviarParaPlanilha(data) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: webAppUrl,
            data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            onload: function(response) { log('Resposta da Planilha:', response.responseText); },
            onerror: function(response) {
                console.error('Erro ao enviar dados:', response.responseText);
                alert('Ocorreu um erro ao enviar os dados.');
            }
        });
    }

    function processarTabelaDaGalaxia() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') !== 'galaxy') return;

        const table = document.querySelector('.table569');
        if (!table || table.getAttribute('data-galaxy-processed')) return;

        // Adiciona o cabeçalho 'Rank'
        const headerRow = table.querySelector('tbody > tr:nth-child(2)');
        if (headerRow && headerRow.cells.length > 5 && headerRow.cells[5].textContent.includes('Player')) {
            const rankHeader = document.createElement('th');
            rankHeader.textContent = 'Rank';
            headerRow.insertBefore(rankHeader, headerRow.cells[6]);
        }

        const origemId = getPlanetaOrigemId();
        if (!origemId) return;
        const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
        const favoritesForCurrentPlanet = allFavorites[origemId] || {};

        // Processa cada linha de dados da tabela
        table.querySelectorAll('tbody > tr:nth-child(n+3)').forEach(row => {
            if (row.cells.length < 8) return; // Pula linhas não-padrão (e.g., "Deep Space")

            const planetCell = row.cells[1];
            const playerCell = row.cells[5];

            const planetTooltipLink = planetCell ? planetCell.querySelector('a.tooltip_sticky') : null;
            const playerLink = playerCell ? playerCell.querySelector('a.tooltip_sticky .galaxy-username') : null;

            // Insere a célula de rank em todas as linhas de dados válidas
            const rankCell = row.insertCell(6);
            rankCell.style.textAlign = 'center';

            const actionsCell = row.cells[row.cells.length - 1]; // A última célula é sempre a de ações

            // Processa apenas linhas que contêm um jogador
            if (playerLink && actionsCell) {
                // 1. Pega o Rank do tooltip do JOGADOR
                const playerTooltipContent = playerLink.closest('a.tooltip_sticky').getAttribute("data-tooltip-content");
                const rankMatch = playerTooltipContent.match(/in pos\.\s*(\d+)/i);
                rankCell.textContent = (rankMatch && rankMatch[1]) ? rankMatch[1] : '-';

                // 2. Pega as informações do Favorito do tooltip do PLANETA
                if (planetTooltipLink) {
                    const planetTooltipContent = planetTooltipLink.getAttribute("data-tooltip-content");
                    const idMatch = planetTooltipContent.match(/javascript:doit\(\d+,(\d+)/);
                    const coordsMatch = planetTooltipContent.match(/\[(\d+:\d+:\d+)\]/);

                    if (idMatch && coordsMatch) {
                        const planetId = idMatch[1];
                        const coords = coordsMatch[1];
                        const playerName = playerCell.textContent.trim();
                        
                        const favData = favoritesForCurrentPlanet[coords];
                        const isFavorite = !!favData;
                        const isBad = favData && favData.type === 'bad';

                        const star = document.createElement('a');
                        star.className = 'favorite-star';
                        star.style.cssText = 'cursor: pointer; font-size: 16px; text-decoration: none; margin-right: 5px;';
                        
                        if (!isFavorite) {
                            star.textContent = '☆';
                            star.style.color = ''; // Padrão
                        } else if (isBad) {
                            star.textContent = '★';
                            star.style.color = '#FF4500'; // Vermelho
                        } else {
                            star.textContent = '★';
                            star.style.color = '#FFD700'; // Dourado
                        }

                        star.onclick = (e) => { e.preventDefault(); toggleFavorito(planetId, coords, playerName, star); };
                        actionsCell.prepend(star);
                    }
                }
            } else {
                // Deixa a célula de rank vazia para posições sem planeta
                rankCell.textContent = '';
            }
        });

        table.setAttribute('data-galaxy-processed', 'true');
        log('Tabela da galáxia processada (Ranking e Favoritos).');
    }


    async function verificarSlotsDeFrota() {
        try {
            const response = await fetch('game.php?page=fleetTable');
            if (!response.ok) return 0;
            const htmlText = await response.text();
            const tempDoc = new DOMParser().parseFromString(htmlText, 'text/html');
            const allDivs = Array.from(tempDoc.querySelectorAll('div.transparent'));
            const fleetDiv = allDivs.find(div => div.textContent.trim().startsWith('Fleet'));
            if (fleetDiv) {
                const match = fleetDiv.textContent.match(/(\d+)\s*\/\s*(\d+)/);
                if (match) return parseInt(match[2], 10) - parseInt(match[1], 10);
            }
            return 0;
        } catch (error) {
            log('Erro crítico ao verificar slots de frota:', error);
            return 0;
        }
    }

    async function lancarProximoLoteEspionagem() {
        observer.disconnect();

        try {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('page') !== 'galaxy') {
                sessionStorage.setItem('pendingSpyAction', 'batch_spy');
                window.location.href = 'game.php?page=galaxy';
                return;
            }
            let spyQueue = JSON.parse(await GM_getValue(SPY_QUEUE_KEY, '[]'));
            if (spyQueue.length === 0) {
                await GM_deleteValue(SPY_QUEUE_ORIGIN_KEY);
                await atualizarContadoresPainel();
                return;
            }
            const availableSlots = await verificarSlotsDeFrota();
            if (availableSlots === 0) return;

            const batchSize = Math.min(spyQueue.length, availableSlots);
            const batchToSend = spyQueue.slice(0, batchSize);
            const remainingQueue = spyQueue.slice(batchSize);

            const delay = ms => new Promise(res => setTimeout(res, ms));
            for (const fav of batchToSend) {
                unsafeWindow.doit(6, fav.planetId, { '210': 1 });
                await delay(300 + Math.random() * 200);
            }

            await GM_setValue(SPY_QUEUE_KEY, JSON.stringify(remainingQueue));
            
            if (remainingQueue.length === 0) {
                await GM_deleteValue(SPY_QUEUE_ORIGIN_KEY);
            }

            await atualizarContadoresPainel();
        } finally {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }


    async function limparFilaEspionagem() {
        if (confirm('Tem certeza que deseja limpar a fila de espionagem?')) {
            await GM_deleteValue(SPY_QUEUE_KEY);
            await GM_deleteValue(SPY_QUEUE_ORIGIN_KEY);
            await atualizarContadoresPainel();
        }
    }

    function adicionarEstilosCSS() {
        const styleId = 'moon-ui-styles';
        if (document.getElementById(styleId)) return;
        const css = `
            #moon-control-panel { font-size: 0.8em; width: 150px; }
            #moon-control-panel .panel-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: #222; margin: -10px -10px 8px -10px; padding: 5px 10px; border-bottom: 1px solid #555; }
            #moon-control-panel .panel-header span { font-weight: bold; color: #FFA500; }
            #moon-control-panel .panel-toggle { font-size: 1.2em; }
            #moon-control-panel.collapsed .panel-content { display: none; }
            #moon-control-panel.collapsed .panel-toggle::before { content: '▼'; }
            #moon-control-panel:not(.collapsed) .panel-toggle::before { content: '▲'; }
            #moon-control-panel .list-container { border-top: 1px solid #555; margin-top: 8px; padding-top: 8px; max-height: 250px; overflow-y: auto; display: none; }
            #moon-control-panel .list-item { display: flex; justify-content: space-between; align-items: center; padding: 4px; }
            #moon-control-panel .list-item:hover { background-color: rgba(255, 255, 255, 0.1); }
            #moon-control-panel .list-item a { color: #87CEEB; text-decoration: none; }
            #moon-control-panel .list-item .remove-btn { cursor: pointer; color: #ff6666; font-weight: bold; padding: 0 5px; }
            #moon-control-panel .panel-title { font-weight: bold; color: #FFA500; text-transform: uppercase; margin-top: 8px; margin-bottom: 4px; border-bottom: 1px solid #444; padding-bottom: 4px; }
            #moon-control-panel .panel-separator { border-top: 1px solid #444; margin: 5px 0; }
            #fleet-slots-display { display: block; text-align: center; padding: 5px; background-color: #2a2a2a; color: #fff; text-decoration: none; border-radius: 3px; border: 1px solid #555; margin-bottom: 5px; }
            #fleet-slots-display:hover { background-color: #3a3a3a; }
            #moon-control-panel .info-display { text-align: center; padding: 4px; color: #ccc; font-size: 0.95em; background-color: #1a1a1a; border-radius: 3px; margin-top: -4px; margin-bottom: 4px; }
            #moon-spy-origin-warning { display:none; color: #ff6666; text-align: center; font-weight: bold; margin-bottom: 5px; padding: 5px; border: 1px dashed #ff6666; border-radius: 3px; cursor: default; }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function getPlanetaOrigemId() {
        const planetSelector = document.getElementById('planetSelector');
        return planetSelector ? planetSelector.value : null;
    }

    async function atualizarContadoresPainel() {
        const origemId = getPlanetaOrigemId();
        if (!origemId) return;

        // Spy Queue Logic
        const spyQueue = JSON.parse(await GM_getValue(SPY_QUEUE_KEY, '[]'));
        const savedOriginData = JSON.parse(await GM_getValue(SPY_QUEUE_ORIGIN_KEY, 'null'));

        const spyFavoritesButton = document.getElementById('spy-favorites-button');
        const launchSpyBatchButton = document.getElementById('launch-spy-batch-button');
        const clearSpyQueueButton = document.getElementById('clear-spy-queue-button');
        const originWarningDiv = document.getElementById('moon-spy-origin-warning');

        if (spyFavoritesButton && launchSpyBatchButton && clearSpyQueueButton && originWarningDiv) {
            if (spyQueue.length > 0) {
                spyFavoritesButton.disabled = true;
                spyFavoritesButton.title = 'Há uma fila de espionagem pendente.';
                clearSpyQueueButton.style.display = 'block';

                if (savedOriginData && savedOriginData.id !== origemId) {
                    launchSpyBatchButton.style.display = 'none';
                    originWarningDiv.style.display = 'block';
                    originWarningDiv.innerHTML = `Fila pausada.<br>Retorne a ${savedOriginData.coords || 'origem'} para continuar.`;
                } else {
                    launchSpyBatchButton.style.display = 'block';
                    originWarningDiv.style.display = 'none';
                    launchSpyBatchButton.textContent = `LANÇAR (${spyQueue.length})`; // Atualizado
                }
            } else {
                spyFavoritesButton.disabled = false;
                spyFavoritesButton.title = '';
                launchSpyBatchButton.style.display = 'none';
                clearSpyQueueButton.style.display = 'none';
                originWarningDiv.style.display = 'none';
            }
        }

        // Attack Queue Logic
        const attackQueueKey = getAttackQueueKey();
        const queue = attackQueueKey ? JSON.parse(localStorage.getItem(attackQueueKey)) || [] : [];
        const launchButton = document.getElementById('launch-queue-button');
        if (launchButton) {
            launchButton.textContent = `LANÇAR (${queue.length})`; // Atualizado
            launchButton.disabled = queue.length === 0;
        }

        // Other Counters
        const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
        const favoritesForCurrentPlanet = allFavorites[origemId] ? Object.values(allFavorites[origemId]) : [];
        const scheduled = JSON.parse(localStorage.getItem(SCHEDULED_ATTACKS_KEY)) || [];
        if (spyFavoritesButton) spyFavoritesButton.textContent = `ESPIONAR (${favoritesForCurrentPlanet.length})`; // Atualizado

        const scheduledBtn = document.getElementById('show-scheduled-button');
        if(scheduledBtn) scheduledBtn.textContent = `AGENDADOS (${scheduled.length})`; // Atualizado

        const fleetSlotsButton = document.getElementById('fleet-slots-display');
        if (fleetSlotsButton) {
            const savedSlotsInfo = localStorage.getItem(FLEET_SLOTS_KEY);
            fleetSlotsButton.textContent = savedSlotsInfo || 'Slots de Frota (?)';
        }
    }

    function atualizarInfoDeFrota() {
        let fleetInfo = null;
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');

        if (currentPage === 'fleetTable') {
            const fleetDiv = Array.from(document.querySelectorAll('div.transparent')).find(div => div.textContent.trim().startsWith('Fleet'));
            if (fleetDiv) {
                fleetInfo = fleetDiv.textContent.trim();
            }
        } else if (currentPage === 'galaxy') {
            const slotsCell = Array.from(document.querySelectorAll('.table569 td')).find(td => td.textContent.includes('Fleet Slots'));
            if (slotsCell) {
                const freeSlotsText = slotsCell.querySelector('#slots')?.textContent.trim();
                const totalSlotsText = slotsCell.textContent.match(/\/(\d+)/);
                if (freeSlotsText && totalSlotsText && totalSlotsText[1]) {
                    const free = parseInt(freeSlotsText, 10);
                    const total = parseInt(totalSlotsText[1], 10);
                    const current = total - free;
                    fleetInfo = `Fleet ${current} / ${total}`;
                }
            }
        }

        if (fleetInfo && localStorage.getItem(FLEET_SLOTS_KEY) !== fleetInfo) {
            localStorage.setItem(FLEET_SLOTS_KEY, fleetInfo);
        }
    }

    function toggleFavorito(planetId, coords, playerName, starElement) {
        const origemId = getPlanetaOrigemId();
        if (!origemId) return;

        let allFavorites = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
        if (!allFavorites[origemId]) allFavorites[origemId] = {};

        const existingFav = allFavorites[origemId][coords];

        if (!existingFav) {
            // ESTADO 1: Criar Favorito (Bom)
            allFavorites[origemId][coords] = { planetId, coords, name: playerName, type: 'good' };
            starElement.textContent = '★';
            starElement.style.color = '#FFD700'; // Dourado
            starElement.title = 'Favorito (Clique para marcar como Ruim)';
        } 
        else if (existingFav.type !== 'bad') {
            // ESTADO 2: Mudar para Favorito Ruim
            existingFav.type = 'bad';
            starElement.textContent = '★';
            starElement.style.color = '#FF4500'; // Vermelho Laranja
            starElement.title = 'Favorito Ruim (Clique para remover)';
        } 
        else {
            // ESTADO 3: Remover
            delete allFavorites[origemId][coords];
            starElement.textContent = '☆';
            starElement.style.color = ''; // Cor padrão
            starElement.title = 'Adicionar aos Favoritos';
        }

        localStorage.setItem(FAVORITE_PLANETS_KEY, JSON.stringify(allFavorites));
        atualizarContadoresPainel();
    }

    function construirListaFavoritos() {
        const container = document.getElementById('favorites-container');
        container.innerHTML = '';
        const origemId = getPlanetaOrigemId();
        const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
        const favorites = allFavorites[origemId] ? Object.values(allFavorites[origemId]) : [];
        if (favorites.length === 0) {
            container.innerHTML = '<div class="list-item"><span>Nenhum favorito.</span></div>';
            return;
        }
        favorites.sort((a, b) => a.coords.localeCompare(b.coords));
        favorites.forEach(fav => {
            const item = document.createElement('div');
            item.className = 'list-item';
            
            if (fav.type === 'bad') {
                item.style.borderLeft = '3px solid #FF4500'; 
            } else {
                item.style.borderLeft = '3px solid #FFD700';
            }

            const [galaxy, system] = fav.coords.split(':');
            const link = document.createElement('a');
            link.href = `game.php?page=galaxy&galaxy=${galaxy}&system=${system}`;
            link.textContent = `[${fav.coords}]`;
            
            const text = document.createElement('span');
            text.innerHTML = `${fav.name || '<i>Desconhecido</i>'} `;
            if (fav.type === 'bad') text.style.color = '#ff9999';
            
            text.appendChild(link);
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remover favorito';
            removeBtn.onclick = () => {
                // Simples remoção direta para a lista
                let allFavs = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
                if(allFavs[origemId]) delete allFavs[origemId][fav.coords];
                localStorage.setItem(FAVORITE_PLANETS_KEY, JSON.stringify(allFavs));
                atualizarContadoresPainel();
                construirListaFavoritos();
                // Se estiver na galáxia, atualizar visualmente
                if (new URLSearchParams(window.location.search).get('page') === 'galaxy') processarTabelaDaGalaxia();
            };
            item.appendChild(text);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
    }

    function removerDaFila(indexToRemove) {
        const key = getAttackQueueKey();
        if (!key) return;
        let queue = JSON.parse(localStorage.getItem(key)) || [];
        queue.splice(indexToRemove, 1);
        localStorage.setItem(key, JSON.stringify(queue));
        atualizarContadoresPainel();
        atualizarContagemFrotasFila();
        construirListaFila();
    }


    function construirListaFila() {
        const container = document.getElementById('queue-container');
        container.innerHTML = '';
        const key = getAttackQueueKey();
        if (!key) {
            container.innerHTML = '<div class="list-item"><span>Selecione um planeta.</span></div>';
            return;
        }

        const queue = JSON.parse(localStorage.getItem(key)) || [];
        if (queue.length === 0) {
            container.innerHTML = '<div class="list-item"><span>Fila vazia.</span></div>';
            return;
        }
        queue.forEach((url, index) => {
            const item = document.createElement('div');
            item.className = 'list-item';

            const params = new URLSearchParams(new URL(url, window.location.origin).search);
            const coords = `[${params.get('galaxy')}:${params.get('system')}:${params.get('planet')}]`;

            const scCount = params.get('ship202');
            const lcCount = params.get('ship203');
            const bsCount = params.get('ship207');
            const pbCount = params.get('ship211');

            let fleetParts = [];
            if (scCount) fleetParts.push(`${scCount} SC`);
            if (lcCount) fleetParts.push(`${lcCount} LC`);
            if (bsCount) fleetParts.push(`${bsCount} BS`);
            if (pbCount) fleetParts.push(`${pbCount} PB`);


            let fleetInfo = fleetParts.join(' | ') || 'Ataque';

            const text = document.createElement('span');
            text.textContent = `${coords}: ${fleetInfo}`;

            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remover da fila';
            removeBtn.onclick = () => removerDaFila(index);

            item.appendChild(text);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
    }

    // --- NOVA LÓGICA DE AGENDAMENTO (PÁGINA 1) ---
    function iniciarAgendamento(e) {
        e.preventDefault();
        const form = document.querySelector('form[action="?page=fleetStep1"]');
        if (!form) return;

        const formData = new FormData(form);
        const params = new URLSearchParams();

        // Captura todos os campos (naves, galáxia, etc.)
        for (const pair of formData) {
             if ((pair[0].startsWith('ship') && parseInt(pair[1], 10) > 0) || !pair[0].startsWith('ship')) {
                 params.append(pair[0], pair[1]);
             }
        }

        // Salva o "rascunho" do ataque na sessão e avança para a próxima página
        sessionStorage.setItem(DRAFT_SCHEDULE_PARAMS_KEY, params.toString());
        sessionStorage.setItem(DRAFT_SCHEDULE_ACTIVE_KEY, 'true');

        log('Iniciando agendamento: Redirecionando para cálculo de tempo...');
        form.submit();
    }

    // --- NOVA LÓGICA DE AGENDAMENTO (PÁGINA 2) ---
    function adicionarBotaoConfirmarAgendamento() {
        const submitBtn = document.querySelector('form[action*="page=fleetStep2"] input[type="submit"]');
        if (!submitBtn) return;

        // Verifica se o botão já existe
        if (document.getElementById('btn-confirm-schedule')) return;

        const confirmButton = document.createElement('input');
        confirmButton.id = 'btn-confirm-schedule';
        confirmButton.type = 'button';
        confirmButton.value = 'Agendar Chegada';
        confirmButton.className = submitBtn.className;
        confirmButton.style.marginLeft = '10px';
        confirmButton.style.backgroundColor = '#FFA500'; // Laranja para destacar
        confirmButton.style.borderColor = '#cc8400';

        confirmButton.onclick = finalizarAgendamento;

        submitBtn.insertAdjacentElement('afterend', confirmButton);
    }

    function finalizarAgendamento() {
        // Seleção robusta do elemento de duração, priorizando a tabela de conteúdo
        let durationElement = document.getElementById('duration');
        
        if (!durationElement) {
            // Fallback: busca dentro da tabela principal se não achar por ID direto
            const contentTable = document.querySelector('#content table');
            if (contentTable) {
                durationElement = contentTable.querySelector('.duration');
            }
        }
        
        // Último recurso: qualquer classe duration (com risco de pegar timers errados)
        if (!durationElement) {
             durationElement = document.querySelector('.duration');
        }

        if (!durationElement) {
            alert('Erro: Não foi possível encontrar o tempo de voo nesta página.');
            return;
        }

        const durationText = durationElement.textContent.trim();
        let durationMs = parseDurationToMs(durationText);

        if (durationMs === 0) {
             alert('Erro ao ler a duração do voo. Verifique se há naves selecionadas.');
             return;
        }

        const localDate = new Date();
        const localTimeStr = localDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        let serverTimeStr = 'Desconhecida';
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.serverTime) {
             serverTimeStr = unsafeWindow.serverTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }

        const promptMessage = `
-----------------------------------------------------------
        Agendar por Hora de CHEGADA
-----------------------------------------------------------
Tempo de Voo Detectado: ${durationText}
(Se estiver errado, digite 'HORA#DURACAO' ex: 06:10#08:33:50)

REFERÊNCIA:
  > Hora do Servidor: ${serverTimeStr}
  > Sua Hora (Local): ${localTimeStr}  <-- USE ESTA

Digite a hora que você deseja que o ataque CHEGUE
(Baseado na SUA HORA LOCAL):

Entrada (HH:MM ou HH:MM:SS):
-----------------------------------------------------------
`;
        const rawInput = prompt(promptMessage);
        if (!rawInput) return;

        let horaInput = rawInput;
        let overrideDuration = null;

        // Verifica se o usuário está tentando sobrescrever a duração (Formato HORA#DURACAO)
        if (rawInput.includes('#')) {
            const parts = rawInput.split('#');
            horaInput = parts[0].trim();
            overrideDuration = parts[1].trim();
            
            const overrideMs = parseDurationToMs(overrideDuration);
            if (overrideMs > 0) {
                durationMs = overrideMs;
                log(`[Moon UI] Duração sobrescrita manualmente para: ${overrideDuration} (${durationMs}ms)`);
            } else {
                alert('Formato de duração inválido. Use HH:MM:SS ou Xh Ym Zs.');
                return;
            }
        }

        const [horas, minutos, segundos = 0] = horaInput.split(':').map(Number);
        if (isNaN(horas) || isNaN(minutos)) {
            alert('Hora inválida.');
            return;
        }

        // Recupera os parâmetros salvos da Página 1
        const savedParamsStr = sessionStorage.getItem(DRAFT_SCHEDULE_PARAMS_KEY);
        if (!savedParamsStr) {
            alert('Erro: Dados da frota perdidos. Reinicie o processo.');
            return;
        }

        let targetArrivalDate = new Date();
        let launchTimestamp = 0;
        let foundValidTime = false;

        // Loop de segurança: tenta encontrar o primeiro horário de lançamento válido nos próximos 7 dias
        for (let i = 0; i < 7; i++) {
            let tentativeArrival = new Date();
            tentativeArrival.setDate(tentativeArrival.getDate() + i);
            tentativeArrival.setHours(horas, minutos, segundos, 0);

            let tentativeLaunch = tentativeArrival.getTime() - durationMs;

            // Verifica se o lançamento é no futuro (com margem de 5 segundos para processamento)
            if (tentativeLaunch > (Date.now() + 5000)) {
                targetArrivalDate = tentativeArrival;
                launchTimestamp = tentativeLaunch;
                foundValidTime = true;
                break;
            }
        }

        if (!foundValidTime) {
             alert('Erro: Não foi possível encontrar um horário de lançamento válido nos próximos 7 dias com os parâmetros informados.');
             return;
        }

        // Constrói o objeto de agendamento
        const params = new URLSearchParams(savedParamsStr);
        // Adiciona/Atualiza os parâmetros de destino da página atual (fleetStep1)
        const currentUrlParams = new URLSearchParams(window.location.search);
        if(currentUrlParams.has('galaxy')) params.set('galaxy', currentUrlParams.get('galaxy'));
        if(currentUrlParams.has('system')) params.set('system', currentUrlParams.get('system'));
        if(currentUrlParams.has('planet')) params.set('planet', currentUrlParams.get('planet'));
        if(currentUrlParams.has('planettype')) params.set('planettype', currentUrlParams.get('planettype'));
        if(currentUrlParams.has('target_mission')) params.set('target_mission', currentUrlParams.get('target_mission'));
        
        const targetCoords = `[${params.get('galaxy')}:${params.get('system')}:${params.get('planet')}]`;
        const attackUrl = `game.php?page=fleetTable&${params.toString()}&auto_submit=true`;

        const agendamento = {
            id: `sched_${Date.now()}`,
            url: attackUrl,
            launchTimestamp: launchTimestamp,
            targetCoords: targetCoords
        };

        let scheduledAttacks = JSON.parse(localStorage.getItem(SCHEDULED_ATTACKS_KEY)) || [];
        scheduledAttacks.push(agendamento);
        localStorage.setItem(SCHEDULED_ATTACKS_KEY, JSON.stringify(scheduledAttacks));

        // Limpa a sessão
        sessionStorage.removeItem(DRAFT_SCHEDULE_PARAMS_KEY);
        sessionStorage.removeItem(DRAFT_SCHEDULE_ACTIVE_KEY);

        atualizarContadoresPainel();

        const launchDate = new Date(launchTimestamp);
        alert(`Agendamento Confirmado!\n\nLançamento: ${launchDate.toLocaleString()}\nChegada: ${targetArrivalDate.toLocaleString()}\n\nO script irá redirecionar você para a galáxia.`);

        window.location.href = 'game.php?page=galaxy';
    }


    let lastCheck = 0;
    function verificarAtaquesAgendados() {
        const now = Date.now();
        if (now - lastCheck < CONFIG.INTERVALO_VERIFICACAO_AGENDADOR) return;
        lastCheck = now;
        let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_ATTACKS_KEY)) || [];
        const dueAttacks = scheduled.filter(attack => now >= attack.launchTimestamp);
        if (dueAttacks.length > 0) {
            log(`GATILHO DISPARADO: ${dueAttacks.length} ataques agendados atingiram o horário.`);
            const dueUrls = dueAttacks.map(a => a.url);

            let activeQueue = JSON.parse(sessionStorage.getItem('attackQueueActive')) || [];
            activeQueue.push(...dueUrls);
            sessionStorage.setItem('attackQueueActive', JSON.stringify(activeQueue));

            const remainingScheduled = scheduled.filter(attack => now < attack.launchTimestamp);
            localStorage.setItem(SCHEDULED_ATTACKS_KEY, JSON.stringify(remainingScheduled));
            atualizarContadoresPainel();

            if (!sessionStorage.getItem('autoFleetInProgress')) {
                log('Disparando fila de ataques a partir do agendador.');
                sessionStorage.setItem('startAttackQueueFromGalaxy', 'true');
                window.location.href = 'game.php?page=galaxy';
            }
        }
    }


    function cancelarAgendamento(idToRemove) {
        let scheduled = JSON.parse(localStorage.getItem(SCHEDULED_ATTACKS_KEY)) || [];
        const updatedScheduled = scheduled.filter(attack => attack.id !== idToRemove);
        localStorage.setItem(SCHEDULED_ATTACKS_KEY, JSON.stringify(updatedScheduled));
        atualizarContadoresPainel();
        construirListaAgendados();
    }

    function construirListaAgendados() {
        const container = document.getElementById('scheduled-container');
        container.innerHTML = '';
        const scheduled = JSON.parse(localStorage.getItem(SCHEDULED_ATTACKS_KEY)) || [];
        if (scheduled.length === 0) {
            container.innerHTML = '<div class="list-item"><span>Nenhum ataque agendado.</span></div>';
            return;
        }
        scheduled.sort((a, b) => a.launchTimestamp - b.launchTimestamp);
        scheduled.forEach(attack => {
            const item = document.createElement('div');
            item.className = 'list-item';
            const launchDate = new Date(attack.launchTimestamp);
            const formattedDate = launchDate.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            const text = document.createElement('span');
            text.textContent = `Alvo ${attack.targetCoords} às ${formattedDate}`;
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Cancelar agendamento';
            removeBtn.onclick = () => cancelarAgendamento(attack.id);
            item.appendChild(text);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
    }

    function forcarLimpezaSessao() {
        if (confirm('Isso irá parar qualquer ataque em progresso e limpar a fila de ataques da sessão atual. É uma medida de emergência para destravar o script. Deseja continuar?')) {
            log('Forçando limpeza da sessão de ataque...');
            sessionStorage.removeItem('autoFleetInProgress');
            sessionStorage.removeItem('attackQueueActive');
            sessionStorage.removeItem(DRAFT_SCHEDULE_ACTIVE_KEY);
            sessionStorage.removeItem(DRAFT_SCHEDULE_PARAMS_KEY);
            atualizarContadoresPainel();
        }
    }

    function toggleLista(containerId, builderFunction) {
        const allContainers = document.querySelectorAll('#moon-control-panel .list-container');
        const targetContainer = document.getElementById(containerId);
        allContainers.forEach(c => {
            if (c.id !== containerId) c.style.display = 'none';
        });
        if (targetContainer.style.display === 'block') {
            targetContainer.style.display = 'none';
        } else {
            builderFunction();
            targetContainer.style.display = 'block';
        }
    }

    // --- IMPORTAÇÃO E EXPORTAÇÃO ---
    async function exportarFavoritos() {
        const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
        
        if (Object.keys(allFavorites).length === 0) {
            alert('Não há favoritos salvos neste universo para exportar.');
            return;
        }

        const pacoteExportacao = {
            meta: {
                universe: UNIVERSE_ID,
                exportedAt: new Date().toISOString(),
                scriptVersion: GM_info.script.version
            },
            data: allFavorites
        };

        const stringFinal = JSON.stringify(pacoteExportacao);

        try {
            await navigator.clipboard.writeText(stringFinal);
            alert(`Backup Global (${UNIVERSE_ID}) copiado para a área de transferência!`);
        } catch (err) {
            console.error('Erro ao copiar:', err);
            prompt('Copie o código abaixo manualmente:', stringFinal);
        }
    }

    function importarFavoritos() {
        const input = prompt("Cole o código JSON dos favoritos aqui:");
        if (!input) return;

        try {
            const pacoteImportado = JSON.parse(input);
            let dadosParaSalvar = null;

            if (pacoteImportado.meta && pacoteImportado.data) {
                if (pacoteImportado.meta.universe !== UNIVERSE_ID) {
                    const confirmacao = confirm(
                        `ATENÇÃO DE SEGURANÇA:\n\n` +
                        `Este backup pertence ao universo: "${pacoteImportado.meta.universe}".\n` +
                        `Você está atualmente no universo: "${UNIVERSE_ID}".\n\n` +
                        `Importar esses dados pode causar inconsistências (coordenadas erradas). Deseja continuar mesmo assim?`
                    );
                    if (!confirmacao) return;
                }
                dadosParaSalvar = pacoteImportado.data;
            } else if (typeof pacoteImportado === 'object') {
                if(!confirm("O código colado não possui assinatura de universo (formato antigo). Deseja importar assim mesmo?")) return;
                dadosParaSalvar = pacoteImportado;
            } else {
                throw new Error("Formato irreconhecível.");
            }

            localStorage.setItem(FAVORITE_PLANETS_KEY, JSON.stringify(dadosParaSalvar));
            alert('Favoritos importados com sucesso!');
            
            atualizarContadoresPainel();
            const container = document.getElementById('favorites-container');
            if (container && container.style.display === 'block') {
                construirListaFavoritos();
            }

        } catch (e) {
            alert('Erro Crítico: O código fornecido é inválido.');
            console.error(e);
        }
    }

    async function criarPainelControle() {
        if (document.getElementById('moon-control-panel')) {
            await atualizarContadoresPainel();
            return;
        }
        const origemId = getPlanetaOrigemId();
        if (!origemId) return;

        const panel = document.createElement('div');
        panel.id = 'moon-control-panel';
        panel.style.cssText = 'position: fixed; top: 50px; right: 10px; z-index: 9999; background: rgba(30, 30, 30, 0.9); border: 1px solid #555; padding: 10px; border-radius: 5px;';

        const panelHeader = document.createElement('div');
        panelHeader.className = 'panel-header';
        panelHeader.innerHTML = `<span>Moon UI</span><span class="panel-toggle"></span>`;
        panel.appendChild(panelHeader);

        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';
        panel.appendChild(panelContent);

        panelHeader.onclick = () => {
            const isCollapsed = panel.classList.toggle('collapsed');
            localStorage.setItem(PANEL_COLLAPSED_KEY, isCollapsed);
        };

        if (localStorage.getItem(PANEL_COLLAPSED_KEY) === 'true') {
            panel.classList.add('collapsed');
        }

        const titleGalaxy = document.createElement('div');
        titleGalaxy.className = 'panel-title';
        titleGalaxy.textContent = 'Galáxia';
        panelContent.appendChild(titleGalaxy);

        const fleetSlotsButton = document.createElement('a');
        fleetSlotsButton.id = 'fleet-slots-display';
        fleetSlotsButton.href = 'game.php?page=fleetTable';
        panelContent.appendChild(fleetSlotsButton);

        const availableShipsDisplay = document.createElement('div');
        availableShipsDisplay.id = 'available-ships-display';
        availableShipsDisplay.className = 'info-display';
        panelContent.appendChild(availableShipsDisplay);

        const titleSpy = document.createElement('div');
        titleSpy.className = 'panel-title';
        titleSpy.textContent = 'FAVORITOS';
        panelContent.appendChild(titleSpy);
        const showFavsButton = document.createElement('button');
        showFavsButton.textContent = 'EXIBIR';
        showFavsButton.onclick = () => toggleLista('favorites-container', construirListaFavoritos);
        panelContent.appendChild(showFavsButton);
        const spyButton = document.createElement('button');
        spyButton.id = 'spy-favorites-button';
        spyButton.onclick = async () => await executarEspionagemEmMassa();
        panelContent.appendChild(spyButton);
        
        // Botão Otimizar Removido
        
        const spyOriginWarning = document.createElement('div');
        spyOriginWarning.id = 'moon-spy-origin-warning';
        panelContent.appendChild(spyOriginWarning);

        const launchSpyBatchButton = document.createElement('button');
        launchSpyBatchButton.id = 'launch-spy-batch-button';
        launchSpyBatchButton.onclick = async () => await lancarProximoLoteEspionagem();
        launchSpyBatchButton.style.display = 'none';
        panelContent.appendChild(launchSpyBatchButton);
        const clearSpyQueueButton = document.createElement('button');
        clearSpyQueueButton.id = 'clear-spy-queue-button';
        clearSpyQueueButton.textContent = 'Limpar Fila de Esp.';
        clearSpyQueueButton.onclick = async () => await limparFilaEspionagem();
        clearSpyQueueButton.style.display = 'none';
        panelContent.appendChild(clearSpyQueueButton);

        const divBotoesFav = document.createElement('div');
        divBotoesFav.style.cssText = "display: flex; gap: 5px; margin-top: 5px;";
        const btnExport = document.createElement('button');
        btnExport.textContent = 'Exportar';
        btnExport.title = 'Exportar Favoritos para área de transferência';
        btnExport.style.width = '50%';
        btnExport.onclick = exportarFavoritos;
        const btnImport = document.createElement('button');
        btnImport.textContent = 'Importar';
        btnImport.title = 'Importar Favoritos (Sobrescreve atual)';
        btnImport.style.width = '50%';
        btnImport.onclick = importarFavoritos;
        divBotoesFav.appendChild(btnExport);
        divBotoesFav.appendChild(btnImport);
        panelContent.appendChild(divBotoesFav);

        const titleAttacks = document.createElement('div');
        titleAttacks.className = 'panel-title';
        titleAttacks.textContent = 'Ataques';
        panelContent.appendChild(titleAttacks);

        const showQueueButton = document.createElement('button');
        showQueueButton.textContent = 'EXIBIR';
        showQueueButton.onclick = () => toggleLista('queue-container', construirListaFila);
        panelContent.appendChild(showQueueButton);
        const launchButton = document.createElement('button');
        launchButton.id = 'launch-queue-button';
        launchButton.onclick = iniciarLoteDeAtaques;
        panelContent.appendChild(launchButton);

        const queueReqDisplay = document.createElement('div');
        queueReqDisplay.id = 'queue-req-display';
        queueReqDisplay.className = 'info-display';
        panelContent.appendChild(queueReqDisplay);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'LIMPAR FILA';
        clearButton.onclick = limparFilaDeAtaques;
        panelContent.appendChild(clearButton);

        const separator = document.createElement('div');
        separator.className = 'panel-separator';
        panelContent.appendChild(separator);

        const showScheduledButton = document.createElement('button');
        showScheduledButton.id = 'show-scheduled-button';
        showScheduledButton.onclick = () => toggleLista('scheduled-container', construirListaAgendados);
        panelContent.appendChild(showScheduledButton);
        const forceClearSessionButton = document.createElement('button');
        forceClearSessionButton.textContent = 'Limpar Sessão de Ataque';
        forceClearSessionButton.style.color = '#FFA500';
        forceClearSessionButton.title = 'Botão de emergência para destravar o script se um ataque ficar preso em loop.';
        forceClearSessionButton.onclick = forcarLimpezaSessao;
        panelContent.appendChild(forceClearSessionButton);

        const favContainer = document.createElement('div');
        favContainer.id = 'favorites-container';
        favContainer.className = 'list-container';
        panelContent.appendChild(favContainer);
        const queueContainer = document.createElement('div');
        queueContainer.id = 'queue-container';
        queueContainer.className = 'list-container';
        panelContent.appendChild(queueContainer);
        const scheduledContainer = document.createElement('div');
        scheduledContainer.id = 'scheduled-container';
        scheduledContainer.className = 'list-container';
        panelContent.appendChild(scheduledContainer);
        document.body.appendChild(panel);
        await atualizarContadoresPainel();
    }

    // --- FUNÇÕES CORE ---

    function adicionarBotaoExtrairDadosGalaxia() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') !== 'galaxy') return;
        if (document.getElementById('moon-ui-extract-button')) return;

        const viewButton = document.querySelector('form#galaxy_form input[type="submit"][value="View"]');
        if (viewButton) {
            const extractButton = document.createElement('button');
            extractButton.id = 'moon-ui-extract-button';
            extractButton.type = 'button';
            extractButton.textContent = 'Extrair Dados';
            extractButton.onclick = extrairDados;
            extractButton.style.marginLeft = '10px';
            viewButton.insertAdjacentElement('afterend', extractButton);
        }
    }

    function adicionarBotaoAgendamento() {
        if (new URLSearchParams(window.location.search).get('page') !== 'fleetTable' || document.getElementById('schedule-fleet-button')) return;
        const submitButton = document.querySelector('form[action="?page=fleetStep1"] input[type="submit"]');
        if (submitButton) {
            const scheduleButton = document.createElement('input');
            scheduleButton.type = 'button';
            scheduleButton.value = 'Agendar Envio';
            scheduleButton.id = 'schedule-fleet-button';
            scheduleButton.className = submitButton.className;
            scheduleButton.style.marginLeft = '10px';
            scheduleButton.onclick = iniciarAgendamento;
            submitButton.insertAdjacentElement('afterend', scheduleButton);
        }
    }

    function adicionarAtaqueAFila(attackUrl, buttonElement) {
        const key = getAttackQueueKey();
        if (!key) {
            alert('Por favor, selecione um planeta de origem antes de adicionar um ataque à fila.');
            return;
        }
        
        let queue = JSON.parse(localStorage.getItem(key)) || [];
        queue.push(attackUrl);

        // Otimização de rota (Sort) ao adicionar
        const origin = getCoordenadasOrigem();
        if (origin) {
            queue.sort((urlA, urlB) => {
                const posA = parseCoordsFromUrl(urlA);
                const posB = parseCoordsFromUrl(urlB);

                const distGa = Math.abs(posA.g - origin.g);
                const distGb = Math.abs(posB.g - origin.g);

                if (distGa !== distGb) return distGa - distGb;

                const distSa = Math.abs(posA.s - origin.s);
                const distSb = Math.abs(posB.s - origin.s);

                return distSa - distSb;
            });
            log('Fila de ataques reordenada automaticamente.');
        }

        localStorage.setItem(key, JSON.stringify(queue));
        buttonElement.textContent = 'Na Fila!';
        buttonElement.disabled = true;
        buttonElement.style.color = '#9ACD32';
        atualizarContadoresPainel();
        atualizarContagemFrotasFila();
    }

    function limparFilaDeAtaques() {
        const key = getAttackQueueKey();
        if (!key) return;
        if (confirm('Tem certeza que deseja limpar a fila de ataques para este planeta?')) {
            localStorage.removeItem(key);
            atualizarContadoresPainel();
            atualizarContagemFrotasFila();
        }
    }

    async function iniciarLoteDeAtaques() {
        const key = getAttackQueueKey();
        if (!key) return;
        let queue = JSON.parse(localStorage.getItem(key)) || [];
        if (queue.length === 0) return;

        const availableSlots = await verificarSlotsDeFrota();
        if (availableSlots === 0) {
            alert('Nenhum slot de frota disponível para ataques.');
            return;
        }

        // --- Safety Check e Smart Queue: Verificação de Estoque e Pulo Automático ---
        const shipCountsKey = getShipCountsKey();
        const availableShips = JSON.parse(await GM_getValue(shipCountsKey, '{}'));
        let stockSimulation = { ...availableShips }; // Cópia para simulação
        
        let batchToSend = [];
        let remainingQueue = [];
        
        // Mapeamento de IDs da URL para chaves do objeto salvo
        const shipMap = {
            'ship202': 'sc',
            'ship203': 'lc',
            'ship207': 'bs',
            'ship209': 'rc',
            'ship210': 'spy',
            'ship211': 'pb'
        };

        // Itera sobre a fila INTEIRA para encontrar candidatos que caibam no estoque
        for (const url of queue) {
            // Se já enchemos os slots, o restante vai para a fila de espera
            if (batchToSend.length >= availableSlots) {
                remainingQueue.push(url);
                continue;
            }

            const params = new URLSearchParams(new URL(url, window.location.origin).search);
            let canSendThis = true;
            let tempDeduction = {}; // Armazena a dedução temporária para este ataque específico

            // Verifica se tem naves para este ataque específico
            for (const [paramId, stockKey] of Object.entries(shipMap)) {
                const needed = parseInt(params.get(paramId) || '0', 10);
                if (needed > 0) {
                    if ((stockSimulation[stockKey] || 0) >= needed) {
                        tempDeduction[stockKey] = needed;
                    } else {
                        canSendThis = false;
                        break;
                    }
                }
            }

            if (canSendThis) {
                // Deduz do estoque simulado e adiciona ao lote
                for (const [stockKey, amount] of Object.entries(tempDeduction)) {
                    stockSimulation[stockKey] -= amount;
                }
                batchToSend.push(url);
            } else {
                // Não tem naves para este, manda para o fim da fila (para a próxima rodada)
                remainingQueue.push(url);
            }
        }

        if (batchToSend.length === 0) {
            alert('Frotas insuficientes (baseado no cache) para enviar qualquer ataque da fila.');
            return;
        }

        if (confirm(`Slots Livres: ${availableSlots}\nFila Total: ${queue.length}\nEncontrados (Cabem no estoque): ${batchToSend.length}\n\nLançar este lote?`)) {
            sessionStorage.setItem('attackQueueActive', JSON.stringify(batchToSend));
            localStorage.setItem(key, JSON.stringify(remainingQueue));
            atualizarContadoresPainel();
            atualizarContagemFrotasFila();
            sessionStorage.setItem('startAttackQueueFromGalaxy', 'true');
            window.location.href = 'game.php?page=galaxy';
        }
    }

    async function executarEspionagemEmMassa() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') !== 'galaxy') {
            log('Não está na galáxia. Redirecionando para iniciar espionagem em massa.');
            sessionStorage.setItem('pendingSpyAction', 'mass_spy');
            window.location.href = 'game.php?page=galaxy';
            return;
        }
        const origemId = getPlanetaOrigemId();
        if (!origemId) {
             alert('Planeta de origem não encontrado.');
             return;
        }
        const allFavorites = JSON.parse(localStorage.getItem(FAVORITE_PLANETS_KEY)) || {};
        
        const favoriteList = allFavorites[origemId] 
            ? Object.values(allFavorites[origemId]).filter(f => f.type !== 'bad') 
            : [];

        if (favoriteList.length === 0) {
            alert('Nenhum favorito válido (verde/amarelo) encontrado para espionar.');
            return;
        }
        
        const planetSelector = document.getElementById('planetSelector');
        let coordsText = 'origem';
        if (planetSelector && planetSelector.selectedIndex >= 0) {
             const optionText = planetSelector.options[planetSelector.selectedIndex].text;
             const coordsMatch = optionText.match(/\[(.*?)\]/);
             if(coordsMatch) coordsText = `[${coordsMatch[1]}]`;
        }
        
        await GM_setValue(SPY_QUEUE_ORIGIN_KEY, JSON.stringify({
            id: origemId,
            coords: coordsText
        }));

        // Usa a função centralizada
        const origin = getCoordenadasOrigem();

        if (origin) {
            // Reutiliza função auxiliar
            const parseFavCoords = (str) => {
                const match = str.match(/(\d+):(\d+):(\d+)/);
                if (!match) return null;
                return { g: parseInt(match[1]), s: parseInt(match[2]), p: parseInt(match[3]) };
            };

            favoriteList.sort((a, b) => {
                const posA = parseFavCoords(a.coords);
                const posB = parseFavCoords(b.coords);

                if (!posA || !posB) return 0;

                const distGa = Math.abs(posA.g - origin.g);
                const distGb = Math.abs(posB.g - origin.g);

                if (distGa !== distGb) return distGa - distGb;

                const distSa = Math.abs(posA.s - origin.s);
                const distSb = Math.abs(posB.s - origin.s);

                return distSa - distSb;
            });
            log('Fila de espionagem otimizada por proximidade.');
        }

        await GM_setValue(SPY_QUEUE_KEY, JSON.stringify(favoriteList));
        await atualizarContadoresPainel();
        await lancarProximoLoteEspionagem();
    }

    async function gerenciarFilaDeEspionagem() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = sessionStorage.getItem('pendingSpyAction');
        if (urlParams.get('page') === 'galaxy' && action) {
            sessionStorage.removeItem('pendingSpyAction');
            log(`Ação de espionagem pendente encontrada: '${action}'. Executando...`);
            if (action === 'mass_spy') {
                await executarEspionagemEmMassa();
            } else if (action === 'batch_spy') {
                await lancarProximoLoteEspionagem();
            }
        }
    }

    function gerenciarFilaDeAtaques() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') === 'galaxy' && sessionStorage.getItem('startAttackQueueFromGalaxy') === 'true') {
            sessionStorage.removeItem('startAttackQueueFromGalaxy');
            const queueJSON = sessionStorage.getItem('attackQueueActive');
            if (queueJSON) {
                const queue = JSON.parse(queueJSON);
                if (queue.length > 0) {
                    log('Iniciando fila de ataques a partir da página da galáxia...');
                    sessionStorage.setItem('autoFleetInProgress', 'start');
                    window.location.href = queue[0];
                    return;
                }
            }
        }
        let activeQueueJSON = sessionStorage.getItem('attackQueueActive');
        if (!activeQueueJSON) return;

        const isSafePage = ['overview', 'messages', 'galaxy', 'fleetTable'].includes(urlParams.get('page'));
        if (isSafePage && sessionStorage.getItem('autoFleetInProgress') === 'finished') {
            log('Ciclo de ataque anterior concluído.');
            let activeQueue = JSON.parse(activeQueueJSON);
            activeQueue.shift();
            if (activeQueue.length > 0) {
                sessionStorage.setItem('attackQueueActive', JSON.stringify(activeQueue));
                const nextAttackUrl = activeQueue[0];
                log(`Iniciando próximo ataque da fila em 1 segundo...`);
                sessionStorage.setItem('autoFleetInProgress', 'start');
                setTimeout(() => { window.location.href = nextAttackUrl; }, 1000);
            } else {
                log('Fila de ataques concluída.');
                sessionStorage.removeItem('attackQueueActive');
                sessionStorage.removeItem('autoFleetInProgress');
            }
        }
    }

    function calcularCargaEspionagem() {
        document.querySelectorAll('tr.message_head:not([data-cargo-calculated])').forEach(header => {
            header.setAttribute('data-cargo-calculated', 'true');
            const senderCell = header.querySelector('td:nth-of-type(3)');
            if (senderCell && senderCell.textContent.trim() === 'Spying department') {
                senderCell.dataset.bsCount = '0';
                senderCell.dataset.pbCount = '0';
                const bodyRow = header.nextElementSibling;
                if (bodyRow) {
                    try {
                        const getResourceValue = (selector) => {
                            const element = bodyRow.querySelector(selector);
                            return element ? parseInt(element.parentElement.nextElementSibling.textContent.trim().replace(/\./g, ''), 10) || 0 : 0;
                        };
                        const totalResources = getResourceValue('a[onclick*="901"]') + getResourceValue('a[onclick*="902"]') + getResourceValue('a[onclick*="903"]');
                        const baseAttackLink = bodyRow.querySelector('.spyRaportFooter a[href*="target_mission=1"]');
                        if (!baseAttackLink) return;

                        const scCount = Math.ceil(totalResources / 10000);
                        const lcCount = Math.ceil(totalResources / 50000);

                        senderCell.innerHTML = '';
                        senderCell.style.textAlign = "center";
                        senderCell.style.width = "170px";
                        const baseUrl = baseAttackLink.getAttribute('href') + '&auto_submit=true';

                        const createAttackUrl = (base, shipType, shipCount) => {
                            let url = `${base}&${shipType}=${shipCount}`;
                            const bsCount = senderCell.dataset.bsCount || '0';
                            const pbCount = senderCell.dataset.pbCount || '0';
                            if (parseInt(bsCount, 10) > 0) url += `&ship207=${bsCount}`;
                            if (parseInt(pbCount, 10) > 0) url += `&ship211=${pbCount}`;
                            return url;
                        };

                        const scButton = document.createElement('button');
                        scButton.textContent = `SC: ${scCount}`;
                        scButton.onclick = () => adicionarAtaqueAFila(createAttackUrl(baseUrl, 'ship202', scCount), scButton);

                        const lcButton = document.createElement('button');
                        lcButton.textContent = `LC: ${lcCount}`;
                        lcButton.onclick = () => adicionarAtaqueAFila(createAttackUrl(baseUrl, 'ship203', lcCount), lcButton);

                        const bsButton = document.createElement('button');
                        bsButton.textContent = 'BS';
                        bsButton.onclick = (e) => {
                            e.preventDefault();
                            const currentVal = senderCell.dataset.bsCount || '0';
                            const amount = prompt('Quantidade de Naves de Batalha (BS):', currentVal);
                            if (amount !== null && !isNaN(amount) && amount >= 0) {
                                senderCell.dataset.bsCount = parseInt(amount, 10);
                                bsButton.textContent = `BS: ${senderCell.dataset.bsCount}`;
                            }
                        };

                        const pbButton = document.createElement('button');
                        pbButton.textContent = 'PB';
                        pbButton.onclick = (e) => {
                            e.preventDefault();
                            const currentVal = senderCell.dataset.pbCount || '0';
                            const amount = prompt('Quantidade de Bombardeiros (PB):', currentVal);
                            if (amount !== null && !isNaN(amount) && amount >= 0) {
                                senderCell.dataset.pbCount = parseInt(amount, 10);
                                pbButton.textContent = `PB: ${senderCell.dataset.pbCount}`;
                            }
                        };

                        senderCell.appendChild(scButton);
                        senderCell.appendChild(document.createTextNode(' '));
                        senderCell.appendChild(lcButton);
                        senderCell.appendChild(document.createTextNode(' '));
                        senderCell.appendChild(bsButton);
                        senderCell.appendChild(document.createTextNode(' '));
                        senderCell.appendChild(pbButton);

                    } catch (e) { console.error('Erro ao processar relatório:', e); }
                }
            }
        });
    }

    function autoSubmitFleetPage1() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') === 'fleetTable' && urlParams.get('auto_submit') === 'true' && sessionStorage.getItem('autoFleetInProgress') !== 'step2') {
            log('Tela 1 (fleetTable): Submetendo...');
            sessionStorage.setItem('autoFleetInProgress', 'step2');
            const btn = document.querySelector('form[action="?page=fleetStep1"] input[type="submit"]');
            if (btn) setTimeout(() => btn.click(), 200);
        }
    }

    function autoSubmitFleetPage2() {
        const urlParams = new URLSearchParams(window.location.search);
        if (sessionStorage.getItem(DRAFT_SCHEDULE_ACTIVE_KEY) === 'true') {
             log('Modo de agendamento detectado. Interrompendo auto-submit para aguardar usuário.');
             adicionarBotaoConfirmarAgendamento();
             return;
        }

        if (urlParams.get('page') === 'fleetStep1' && sessionStorage.getItem('autoFleetInProgress') === 'step2') {
            log('Tela 2 (fleetStep1): Submetendo...');
            sessionStorage.setItem('autoFleetInProgress', 'step3');
            const btn = document.querySelector('form[action*="page=fleetStep2"] input[type="submit"]');
            if (btn) setTimeout(() => btn.click(), 200);
        }
    }

    function autoSubmitFleetPage3() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('page') === 'fleetStep2' && sessionStorage.getItem('autoFleetInProgress') === 'step3') {
            log('Tela 3 (fleetStep2): Submetendo...');
            sessionStorage.setItem('autoFleetInProgress', 'finished');
            const btn = document.querySelector('form[action*="page=fleetStep3"] input[type="submit"]');
            if (btn) setTimeout(() => btn.click(), 200);
        }
    }

    function preencherFrotaComURL() {
        if (new URLSearchParams(window.location.search).get('page') === 'fleetTable') {
            const params = new URLSearchParams(window.location.search);
            for (const [key, value] of params.entries()) {
                if (key.startsWith('ship')) {
                    const input = document.querySelector(`input[name="${key}"]`);
                    if (input) input.value = value;
                }
            }
        }
    }

    function adicionarLinkSpyMessages() {
        const linkId = 'custom-spy-messages-link';
        if (document.getElementById(linkId)) return;
        const messagesLink = document.querySelector('a[href="game.php?page=messages"]');
        if (!messagesLink) return;
        const messagesLi = messagesLink.closest('li');
        if (!messagesLi) return;
        const spyLi = document.createElement('li');
        const spyA = document.createElement('a');
        spyA.id = linkId;
        spyA.href = location.pathname.replace('game.php', 'game.php?page=messages&category=0');
        spyA.textContent = 'Spy Messages';
        spyA.style.color = '#87CEEB';
        spyLi.appendChild(spyA);
        messagesLi.insertAdjacentElement('afterend', spyLi);
    }

    function adicionarIndicadorDeVersao() {
        const identifierId = 'hivenova-ui-script-version';
        const existingDiv = document.getElementById(identifierId);
        const versionText = `Melhorias UI v${GM_info.script.version}`;
        if (existingDiv) {
            if (existingDiv.textContent !== versionText) existingDiv.textContent = versionText;
            return;
        }
        const footer = document.querySelector("footer");
        if (footer) {
            const versionDiv = document.createElement('div');
            versionDiv.id = identifierId;
            versionDiv.textContent = versionText;
            versionDiv.style.cssText = "position: fixed; bottom: 5px; right: 10px; padding: 3px 6px; background-color: rgba(0, 0, 0, 0.4); color: #ccc; font-size: 10px; font-family: monospace; border-radius: 3px; z-index: 10000;";
            footer.appendChild(versionDiv);
        }
    }

    function exporComposicaoFrota() {
        document.querySelectorAll("span.return > a.tooltip[data-tooltip-content]:not([data-composition-exposed])").forEach(link => {
            link.setAttribute("data-composition-exposed", "true");
            const tooltipHTML = link.dataset.tooltipContent;
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = tooltipHTML;
            const rows = tempDiv.querySelectorAll("tr");
            if (rows.length === 0) return;
            const composicao = [];
            const abreviacoes = { "Large Cargo": "CG", "Planet Bomber": "Bomb", "Spy Probe": "Sonda", "Light Fighter": "CL", "Heavy Fighter": "CP", Cruiser: "Cruz", Battleship: "NB", Battlecruiser: "Inc", Destroyer: "Dest", Deathstar: "EDM", "Small Cargo": "CPq", "Colony Ship": "Col", Recycler: "Rec" };
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length === 2) {
                    const nomeNave = cells[0].textContent.replace(":", "").trim();
                    const quantidade = cells[1].textContent.trim();
                    const abrev = abreviacoes[nomeNave] || nomeNave.substring(0, 3);
                    composicao.push(`${abrev}: ${quantidade}`);
                }
            });
            if (composicao.length > 0) {
                const elementoComp = document.createElement("span");
                elementoComp.textContent = ` (${composicao.join(", ")})`;
                elementoComp.style.cssText = "color: #FFA500; font-size: 0.9em; margin-left: 5px; font-family: monospace;";
                link.insertAdjacentElement("afterend", elementoComp);
            }
        });
    }

    function exporVelocidadeNaves() {
        document.querySelectorAll('a.tooltip[data-tooltip-content*="Speed:"]:not([data-speed-exposed])').forEach(linkDaNave => {
            linkDaNave.setAttribute("data-speed-exposed", "true");
            const tooltipHTML = linkDaNave.dataset.tooltipContent;
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = tooltipHTML;
            const celulaVelocidade = tempDiv.querySelector("td:last-child");
            if (celulaVelocidade) {
                const velocidade = celulaVelocidade.textContent.trim();
                const elementoVelocidade = document.createElement("span");
                elementoVelocidade.textContent = ` (Vel: ${velocidade})`;
                elementoVelocidade.style.cssText = "color: #87CEEB; font-size: 0.9em; margin-left: 10px; font-family: monospace;";
                linkDaNave.insertAdjacentElement("afterend", elementoVelocidade);
            }
        });
    }

    function calcularHoraTermino() {
        if (new URLSearchParams(window.location.search).get('page') === 'fleetTable') return;
        document.querySelectorAll(".timer:not([data-endtime-calculated]), .fleets:not([data-endtime-calculated])").forEach(timer => {
            timer.setAttribute("data-endtime-calculated", "true");
            let segundosRestantes;
            if (timer.dataset.time) {
                segundosRestantes = parseInt(timer.dataset.time, 10);
            } else if (timer.dataset.fleetTime) {
                segundosRestantes = parseInt(timer.dataset.fleetTime, 10);
            }
            if (!isNaN(segundosRestantes) && segundosRestantes > 0) {
                const dataFinal = new Date(new Date().getTime() + 1000 * segundosRestantes);
                const horaFormatada = dataFinal.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
                const elementoResultado = document.createElement("span");
                elementoResultado.textContent = ` (${horaFormatada})`;
                elementoResultado.style.cssText = "color: #9ACD32; font-style: italic; margin-left: 8px; font-size: 0.95em;";
                timer.insertAdjacentElement("afterend", elementoResultado);
            }
        });
    }

    // --- LÓGICA DE EXECUÇÃO ---
    async function executarMelhorias() {
        const page = new URLSearchParams(window.location.search).get('page');

        adicionarIndicadorDeVersao();
        await criarPainelControle();
        await atualizarContagemNavesDisponiveis();
        atualizarContagemFrotasFila();
        gerenciarFilaDeAtaques();
        await gerenciarFilaDeEspionagem();
        verificarAtaquesAgendados();
        processarTabelaDaGalaxia();
        adicionarBotaoExtrairDadosGalaxia();
        preencherFrotaComURL();
        adicionarBotaoAgendamento();
        atualizarInfoDeFrota();
        autoSubmitFleetPage1();
        autoSubmitFleetPage2();
        autoSubmitFleetPage3();
        calcularCargaEspionagem();
        adicionarLinkSpyMessages();
        calcularHoraTermino();
        exporVelocidadeNaves();
        exporComposicaoFrota();
        await carregarRankingCompleto();
        calcularTempoParaRecursos();

        if (page === 'fleetTable') {
            await salvarContagemNaves();
            await atualizarContagemNavesDisponiveis();
        }
    }

    const debouncedExecutarMelhorias = debounce(executarMelhorias, 300);
    const observer = new MutationObserver(debouncedExecutarMelhorias);

    adicionarEstilosCSS();
    executarMelhorias();

    observer.observe(document.body, { childList: true, subtree: true });

})();