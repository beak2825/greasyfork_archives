// ==UserScript==
// @name         ElAmigos modo catálogo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modo catálogo en elamigos.site con portadas limpias y títulos ordenados
// @author       Shu2Ouma
// @match        https://elamigos.site/*
// @grant        GM_xmlhttpRequest
// @connect      elamigos.site
// @run-at       document-idle
// @icon         https://elamigos.site/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554171/ElAmigos%20modo%20cat%C3%A1logo.user.js
// @updateURL https://update.greasyfork.org/scripts/554171/ElAmigos%20modo%20cat%C3%A1logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CACHE PARA EVITAR DUPLICADOS ---
    const processedLinks = new Set();

    // --- SISTEMA DE ALMACENAMIENTO ---
    const STORAGE_KEY = 'elamigos_games_manager';
    const DEFAULT_DATA = {
        games: {
            played: {},      // Terminados
            playing: {},     // Jugando
            wantToPlay: {},   // Lo quiero jugar
            abandoned: {}    // Abandonados (NUEVO ESTADO)
        },
        visits: {},
        metadata: {
            lastUpdated: null,
            version: '1.0'
        },
        viewMode: 'grid',
        currentList: 'wantToPlay', // Lista activa por defecto
        sortBy: 'date' // Orden por defecto: fecha (otra opción: 'alpha')
    };

    // Cargar datos existentes o inicializar
    let catalogData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;

    // Migrar datos de versiones anteriores si es necesario
    if (catalogData.favorites && !catalogData.games) {
        catalogData.games = {
            played: {},
            playing: {},
            wantToPlay: catalogData.favorites,
            abandoned: {} // Agregar abandonados vacío
        };
        delete catalogData.favorites;
    }

    // Inicializar estructura si no existe
    if (!catalogData.games) catalogData.games = DEFAULT_DATA.games;
    if (!catalogData.games.played) catalogData.games.played = {};
    if (!catalogData.games.playing) catalogData.games.playing = {};
    if (!catalogData.games.wantToPlay) catalogData.games.wantToPlay = {};
    if (!catalogData.games.abandoned) catalogData.games.abandoned = {}; // NUEVO
    if (!catalogData.visits) catalogData.visits = {};
    if (!catalogData.metadata) catalogData.metadata = DEFAULT_DATA.metadata;
    if (!catalogData.viewMode) catalogData.viewMode = 'grid';
    if (!catalogData.currentList) catalogData.currentList = 'wantToPlay';
    if (!catalogData.sortBy) catalogData.sortBy = 'date';

    // --- CLASE GESTORA DE JUEGOS ---
    class GamesManager {
        constructor() {
            this.data = catalogData;
            this.save();
            this.createGamesPanel();
            this.setupGlobalLinkHandler();
            this.setupPanelScrollLock();
        }

        save() {
            this.data.metadata.lastUpdated = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }

        // Añadir juego a una lista específica
        addToList(listName, link, title) {
            if (this.isInAnyList(link)) {
                this.removeFromAllLists(link);
            }

            this.data.games[listName][link] = {
                title: title,
                added: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                image: this.getImageForLink(link),
                status: listName
            };

            this.save();
            this.updateGameStatusButtons();
            this.updateGamesView();
            this.updateGamesCount();
        }

        // Mover juego de una lista a otra
        moveToList(fromList, toList, link) {
            if (this.data.games[fromList][link]) {
                const gameData = this.data.games[fromList][link];
                delete this.data.games[fromList][link];

                gameData.status = toList;
                gameData.lastUpdated = new Date().toISOString();
                this.data.games[toList][link] = gameData;

                this.save();
                this.updateGameStatusButtons();
                this.updateGamesView();
                this.updateGamesCount();
            }
        }

        // Eliminar juego de todas las listas
        removeFromAllLists(link) {
            Object.keys(this.data.games).forEach(listName => {
                if (this.data.games[listName][link]) {
                    delete this.data.games[listName][link];
                }
            });
            this.save();
            this.updateGameStatusButtons();
            this.updateGamesView();
            this.updateGamesCount();
        }

        // Verificar si un juego está en alguna lista
        isInAnyList(link) {
            return Object.keys(this.data.games).some(listName =>
                this.data.games[listName][link]
            );
        }

        // Obtener el estado actual de un juego
        getGameStatus(link) {
            for (const listName of Object.keys(this.data.games)) {
                if (this.data.games[listName][link]) {
                    return listName;
                }
            }
            return null;
        }

        incrementVisits(link) {
            if (!this.data.visits[link]) {
                this.data.visits[link] = 0;
            }
            this.data.visits[link]++;
            this.save();
            this.updateVisitCounter(link);
            this.updateVisitCounterInPanel(link);
        }

        getVisits(link) {
            return this.data.visits[link] || 0;
        }

        getImageForLink(link) {
            const card = document.querySelector(`.card[data-link="${link}"]`);
            if (card) {
                const img = card.querySelector('img');
                return img ? img.src : null;
            }
            return null;
        }

        setupGlobalLinkHandler() {
            document.addEventListener('click', (e) => {
                const linkElement = e.target.closest('a');
                if (linkElement && linkElement.href) {
                    const url = new URL(linkElement.href);
                    const currentUrl = new URL(window.location.href);

                    if (url.hostname === currentUrl.hostname &&
                        url.pathname.includes('/data/')) {
                        this.incrementVisits(linkElement.href);
                    }
                }
            });
        }

        setupPanelScrollLock() {
            const panel = document.getElementById('games-panel');
            if (panel) {
                panel.addEventListener('wheel', (e) => {
                    e.stopPropagation();
                }, { passive: false });

                panel.addEventListener('touchmove', (e) => {
                    e.stopPropagation();
                }, { passive: false });
            }
        }

        updateGameStatusButtons() {
            document.querySelectorAll('.status-btn').forEach(btn => {
                const link = btn.dataset.link;
                const targetStatus = btn.dataset.target;
                const currentStatus = this.getGameStatus(link);

                btn.classList.remove('active');
                btn.classList.remove('played', 'playing', 'wantToPlay', 'abandoned');

                if (currentStatus === targetStatus) {
                    btn.classList.add('active');
                    btn.classList.add(targetStatus);
                }

                if (currentStatus === targetStatus) {
                    btn.title = `Quitar de ${this.getListDisplayName(targetStatus)}`;
                } else {
                    btn.title = `Marcar como ${this.getListDisplayName(targetStatus)}`;
                }
            });
        }

        updateVisitCounter(link) {
            const card = document.querySelector(`.card[data-link="${link}"]`);
            if (card) {
                // Buscar el contador dentro de la imagen (nueva ubicación)
                const counter = card.querySelector('.image-container .visit-counter');
                if (counter) {
                    const visits = this.getVisits(link);
                    counter.innerHTML = `👁️ ${visits}`;
                    counter.title = `Visitas: ${visits}`;
                }
            }
        }

        updateVisitCounterInPanel(link) {
            const panel = document.getElementById('games-panel');
            if (panel && panel.style.right === '0px') {
                const gameItem = panel.querySelector(`.game-item[data-link="${link}"]`);
                if (gameItem) {
                    const visitsElement = gameItem.querySelector('.list-view-visits, .game-item-visits');
                    if (visitsElement) {
                        const visits = this.getVisits(link);
                        visitsElement.innerHTML = `👁️ ${visits}`;
                        if (visitsElement.title) {
                            visitsElement.title = `Visitas: ${visits}`;
                        }
                    }
                }
            }
        }

        updateGamesCount() {
            const gamesBtn = document.getElementById('games-toolbar-btn');
            if (gamesBtn) {
                const playedCount = Object.keys(this.data.games.played).length;
                const playingCount = Object.keys(this.data.games.playing).length;
                const wantToPlayCount = Object.keys(this.data.games.wantToPlay).length;
                const abandonedCount = Object.keys(this.data.games.abandoned).length; // NUEVO

                gamesBtn.innerHTML = `🎮 Mis Juegos
                    <span class="games-count">
                        <span class="want-count">⏳${wantToPlayCount}</span>
                        <span class="playing-count">🎮${playingCount}</span>
                        <span class="played-count">🏆${playedCount}</span>
                        <span class="abandoned-count">💀${abandonedCount}</span>
                    </span>`;
            }
        }

        createGamesPanel() {
            const panel = document.createElement('div');
            panel.id = 'games-panel';
            panel.style.cssText = `
                position: fixed;
                top: 0;
                right: -400px;
                width: 380px;
                height: 100vh;
                background: white;
                z-index: 9998;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1);
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            `;

            // Header del panel
            const header = document.createElement('div');
            header.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            `;

            const title = document.createElement('h3');
            title.textContent = 'Mis Juegos';
            title.style.margin = '0';
            title.style.fontSize = '18px';

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            closeBtn.addEventListener('click', () => this.toggleGamesView());

            header.appendChild(title);
            header.appendChild(closeBtn);

            // Tabs para las diferentes listas - AGREGADO ABANDONADOS
            const tabs = document.createElement('div');
            tabs.style.cssText = `
                display: flex;
                background: #5a67d8;
                flex-shrink: 0;
            `;

            const tabConfig = [
                { id: 'wantToPlay', label: 'Por jugar', icon: '⏳', color: '#ff9800' },
                { id: 'playing', label: 'Jugando', icon: '🎮', color: '#4caf50' },
                { id: 'played', label: 'Terminados', icon: '🏆', color: '#2196f3' },
                { id: 'abandoned', label: 'Abandonados', icon: '💀', color: '#f44336' } // NUEVA PESTAÑA
            ];

            tabConfig.forEach(tab => {
                const tabBtn = document.createElement('button');
                tabBtn.className = 'games-tab';
                tabBtn.dataset.tab = tab.id;
                tabBtn.innerHTML = `${tab.icon} ${tab.label}`;
                tabBtn.style.cssText = `
                    flex: 1;
                    padding: 12px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    border-bottom: 3px solid transparent;
                    position: relative;
                    overflow: hidden;
                `;

                if (this.data.currentList === tab.id) {
                    tabBtn.style.background = 'rgba(255,255,255,0.25)';
                    tabBtn.style.borderBottomColor = tab.color;
                    tabBtn.style.fontWeight = 'bold';
                    tabBtn.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.2)';
                }

                tabBtn.addEventListener('click', () => this.switchTab(tab.id));
                tabs.appendChild(tabBtn);
            });

            // Controles principales
            const controls = document.createElement('div');
            controls.style.cssText = `
                padding: 12px 15px;
                background: #f8f9fa;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                flex-shrink: 0;
            `;

            // Primera fila de controles
            const firstRow = document.createElement('div');
            firstRow.style.cssText = `
                display: flex;
                gap: 6px;
                width: 100%;
                margin-bottom: 6px;
            `;

            const viewToggle = document.createElement('button');
            viewToggle.id = 'games-view-toggle';
            viewToggle.innerHTML = this.data.viewMode === 'grid' ? '📋 Lista' : '🖼️ Mosaico';
            viewToggle.style.cssText = `
                padding: 6px 12px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                flex: 1;
            `;

            const sortToggle = document.createElement('button');
            sortToggle.id = 'games-sort-toggle';
            sortToggle.innerHTML = this.data.sortBy === 'date' ? '📅 Por fecha' : '🔤 Alfabético';
            sortToggle.style.cssText = `
                padding: 6px 12px;
                background: #17a2b8;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                flex: 1;
            `;

            const optionsBtn = document.createElement('button');
            optionsBtn.id = 'games-options-btn';
            optionsBtn.innerHTML = '⚙️';
            optionsBtn.style.cssText = `
                padding: 6px 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                width: 40px;
            `;
            optionsBtn.title = 'Opciones avanzadas';

            const optionsMenu = document.createElement('div');
            optionsMenu.id = 'games-options-menu';
            optionsMenu.style.cssText = `
                position: absolute;
                top: 60px;
                right: 15px;
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                display: none;
                flex-direction: column;
                min-width: 180px;
                overflow: hidden;
            `;

            const exportBtn = document.createElement('button');
            exportBtn.innerHTML = '📤 Exportar datos';
            exportBtn.style.cssText = `
                padding: 10px 15px;
                background: white;
                color: #333;
                border: none;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                transition: background 0.2s;
            `;

            const importBtn = document.createElement('button');
            importBtn.innerHTML = '📥 Importar datos';
            importBtn.style.cssText = `
                padding: 10px 15px;
                background: white;
                color: #333;
                border: none;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                transition: background 0.2s;
            `;

            const resetBtn = document.createElement('button');
            resetBtn.innerHTML = '🔄 Resetear datos';
            resetBtn.style.cssText = `
                padding: 10px 15px;
                background: white;
                color: #dc3545;
                border: none;
                cursor: pointer;
                font-size: 13px;
                text-align: left;
                transition: background 0.2s;
            `;

            const menuButtonHover = `
                background: #f8f9fa !important;
            `;

            exportBtn.addEventListener('mouseenter', () => exportBtn.style.cssText += menuButtonHover);
            exportBtn.addEventListener('mouseleave', () => exportBtn.style.cssText = exportBtn.style.cssText.replace(menuButtonHover, ''));

            importBtn.addEventListener('mouseenter', () => importBtn.style.cssText += menuButtonHover);
            importBtn.addEventListener('mouseleave', () => importBtn.style.cssText = importBtn.style.cssText.replace(menuButtonHover, ''));

            resetBtn.addEventListener('mouseenter', () => resetBtn.style.cssText += menuButtonHover);
            resetBtn.addEventListener('mouseleave', () => resetBtn.style.cssText = resetBtn.style.cssText.replace(menuButtonHover, ''));

            exportBtn.addEventListener('click', () => {
                this.exportToJSON();
                optionsMenu.style.display = 'none';
            });
            importBtn.addEventListener('click', () => {
                this.openImportDialog();
                optionsMenu.style.display = 'none';
            });
            resetBtn.addEventListener('click', () => {
                this.resetData();
                optionsMenu.style.display = 'none';
            });

            optionsMenu.appendChild(exportBtn);
            optionsMenu.appendChild(importBtn);
            optionsMenu.appendChild(resetBtn);

            let optionsMenuTimeout;
            optionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsMenu.style.display = optionsMenu.style.display === 'flex' ? 'none' : 'flex';
            });

            document.addEventListener('click', (e) => {
                if (!optionsMenu.contains(e.target) && e.target !== optionsBtn) {
                    optionsMenu.style.display = 'none';
                }
            });

            optionsMenu.addEventListener('mouseenter', () => {
                clearTimeout(optionsMenuTimeout);
            });

            optionsMenu.addEventListener('mouseleave', () => {
                optionsMenuTimeout = setTimeout(() => {
                    optionsMenu.style.display = 'none';
                }, 3000);
            });

            viewToggle.addEventListener('click', () => this.toggleViewMode());
            sortToggle.addEventListener('click', () => this.toggleSortMode());

            firstRow.appendChild(viewToggle);
            firstRow.appendChild(sortToggle);
            firstRow.appendChild(optionsBtn);

            controls.appendChild(firstRow);
            controls.appendChild(optionsMenu);

            // Contenedor de juegos
            const content = document.createElement('div');
            content.id = 'games-content';
            content.className = this.data.viewMode === 'grid' ? 'grid-view' : 'list-view';
            content.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 10px;
                background: #f5f5f5;
            `;

            panel.appendChild(header);
            panel.appendChild(tabs);
            panel.appendChild(controls);
            panel.appendChild(content);
            document.body.appendChild(panel);
        }

        switchTab(tabId) {
            this.data.currentList = tabId;
            this.save();
            this.updateTabs();
            this.updateGamesView();
        }

        updateTabs() {
            document.querySelectorAll('.games-tab').forEach(tab => {
                const isActive = tab.dataset.tab === this.data.currentList;
                const colors = {
                    played: '#2196f3',
                    playing: '#4caf50',
                    wantToPlay: '#ff9800',
                    abandoned: '#f44336' // NUEVO COLOR
                };
                const color = colors[tab.dataset.tab] || '#667eea';

                if (isActive) {
                    tab.style.background = 'rgba(255,255,255,0.25)';
                    tab.style.borderBottomColor = color;
                    tab.style.fontWeight = 'bold';
                    tab.style.boxShadow = 'inset 0 0 10px rgba(255,255,255,0.2)';
                } else {
                    tab.style.background = 'none';
                    tab.style.borderBottomColor = 'transparent';
                    tab.style.fontWeight = 'normal';
                    tab.style.boxShadow = 'none';
                }
            });
        }

        getTabColor(tabId) {
            const colors = {
                played: '#2196f3',
                playing: '#4caf50',
                wantToPlay: '#ff9800',
                abandoned: '#f44336' // NUEVO COLOR
            };
            return colors[tabId] || '#667eea';
        }

        toggleGamesView() {
            const panel = document.getElementById('games-panel');
            if (panel.style.right === '0px') {
                panel.style.right = '-400px';
                document.getElementById('games-options-menu').style.display = 'none';
            } else {
                panel.style.right = '0px';
                this.updateGamesView();
            }
        }

        toggleViewMode() {
            const content = document.getElementById('games-content');
            const toggleBtn = document.getElementById('games-view-toggle');

            if (content.classList.contains('grid-view')) {
                content.classList.remove('grid-view');
                content.classList.add('list-view');
                toggleBtn.innerHTML = '🖼️ Mosaico';
                this.data.viewMode = 'list';
            } else {
                content.classList.remove('list-view');
                content.classList.add('grid-view');
                toggleBtn.innerHTML = '📋 Lista';
                this.data.viewMode = 'grid';
            }

            this.save();
            this.updateGamesView();
        }

        toggleSortMode() {
            const sortBtn = document.getElementById('games-sort-toggle');

            if (this.data.sortBy === 'date') {
                this.data.sortBy = 'alpha';
                sortBtn.innerHTML = '🔤 Alfabético';
            } else {
                this.data.sortBy = 'date';
                sortBtn.innerHTML = '📅 Por fecha';
            }

            this.save();
            this.updateGamesView();
        }

        updateGamesView() {
            const content = document.getElementById('games-content');
            if (!content) return;

            const currentList = this.data.games[this.data.currentList];
            const listName = this.getListDisplayName(this.data.currentList);

            if (Object.keys(currentList).length === 0) {
                content.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; color: #6c757d; background: white; border-radius: 8px;">
                        <div style="font-size: 48px; margin-bottom: 20px; color: #ddd;">${this.getListIcon(this.data.currentList)}</div>
                        <h4 style="margin: 0 0 10px 0; color: #666;">No hay juegos en "${listName}"</h4>
                        <p style="margin: 0; font-size: 13px; color: #888;">Usa los botones en los juegos para agregarlos a tus listas</p>
                    </div>
                `;
                return;
            }

            let html = '';
            const isListView = content.classList.contains('list-view');

            let sortedGames = Object.entries(currentList);

            if (this.data.sortBy === 'date') {
                sortedGames.sort((a, b) =>
                    new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated)
                );
            } else {
                sortedGames.sort((a, b) =>
                    a[1].title.localeCompare(b[1].title, 'es', { sensitivity: 'base' })
                );
            }

            sortedGames.forEach(([link, data]) => {
                const visits = this.getVisits(link) || 0;
                const currentStatus = data.status;

                if (isListView) {
                    const changeButtons = this.getChangeButtons(link, currentStatus);

                    html += `
                        <div class="game-item list-view-item" data-link="${link}">
                            <div class="list-view-content">
                                <a href="${link}" target="_blank" class="list-view-title" title="${data.title}">${data.title}</a>
                                <div class="list-view-details">
                                    <span class="list-view-visits" title="Visitas: ${visits}">👁️ ${visits}</span>
                                    <span class="list-view-date">${new Date(data.lastUpdated).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div class="list-view-actions">
                                <div class="status-actions">
                                    ${changeButtons}
                                </div>
                                <button class="list-view-btn remove-btn" data-link="${link}" title="Quitar de todas las listas">✕</button>
                            </div>
                        </div>
                    `;
                } else {
                    const changeButtons = this.getChangeButtons(link, currentStatus);

                    html += `
                        <div class="game-item grid-view-item" data-link="${link}">
                            <div class="game-item-image">
                                <a href="${link}" target="_blank">
                                    <img src="${data.image || 'https://via.placeholder.com/120x180?text=Sin+imagen'}"
                                         alt="${data.title}"
                                         loading="lazy"
                                         onerror="this.src='https://via.placeholder.com/120x180?text=Error'">
                                </a>
                                <div class="game-item-visits" title="Visitas: ${visits}">👁️ ${visits}</div>
                            </div>
                            <div class="game-item-info">
                                <h4 title="${data.title}">${data.title}</h4>
                                <p class="game-item-date">${new Date(data.lastUpdated).toLocaleDateString()}</p>
                                <div class="game-item-actions">
                                    <div class="status-buttons">
                                        ${changeButtons}
                                    </div>
                                    <button class="remove-btn" data-link="${link}" title="Quitar de todas las listas">✕</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            content.innerHTML = html;

            content.querySelectorAll('.status-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const link = btn.dataset.link;
                    const targetList = btn.dataset.target;
                    const currentStatus = this.getGameStatus(link);

                    this.moveToList(currentStatus, targetList, link);
                });
            });

            content.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const link = btn.dataset.link;
                    this.removeFromAllLists(link);
                });
            });
        }

        // Obtener solo botones para Mover a otros estados (excluye el estado actual)
        getChangeButtons(link, currentStatus) {
            const buttons = [
                { target: 'wantToPlay', icon: '⏳', label: 'Por jugar' },
                { target: 'playing', icon: '🎮', label: 'Jugando' },
                { target: 'played', icon: '🏆', label: 'Terminado' },
                { target: 'abandoned', icon: '💀', label: 'Abandonado' } // NUEVO BOTÓN
            ];

            // Filtrar para mostrar solo los botones que NO sean el estado actual
            const filteredButtons = buttons.filter(btn => btn.target !== currentStatus);

            return filteredButtons.map(btn => `
                <button class="status-btn"
                        data-link="${link}"
                        data-target="${btn.target}"
                        title="Mover a ${btn.label}">
                    ${btn.icon}
                </button>
            `).join('');
        }

        getListIcon(listName) {
            const icons = {
                wantToPlay: '⏳',
                playing: '🎮',
                played: '🏆',
                abandoned: '💀' // NUEVO ICONO
            };
            return icons[listName] || '🎮';
        }

        getListDisplayName(listName) {
            const names = {
                played: 'Terminado',
                playing: 'Jugando',
                wantToPlay: 'Por jugar',
                abandoned: 'Abandonado' // NUEVO NOMBRE
            };
            return names[listName] || listName;
        }

        exportToJSON() {
            const dataStr = JSON.stringify(this.data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

            const exportName = `elamigos_games_${new Date().toISOString().split('T')[0]}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportName);
            linkElement.click();

            this.showNotification('Datos exportados correctamente');
        }

        importFromJSON(jsonData) {
            try {
                const parsedData = JSON.parse(jsonData);
                if (parsedData.games || parsedData.favorites) {
                    this.data = parsedData;
                    this.save();

                    this.updateGameStatusButtons();
                    this.updateGamesView();
                    this.updateGamesCount();

                    this.showNotification('Datos importados correctamente');
                    return true;
                }
            } catch (e) {
                console.error('Error importing JSON:', e);
                this.showNotification('Error al importar: formato inválido', 'error');
            }
            return false;
        }

        openImportDialog() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (this.importFromJSON(e.target.result)) {
                            this.updateGamesView();
                        }
                    };
                    reader.readAsText(file);
                }
                input.remove();
            });

            document.body.appendChild(input);
            input.click();
        }

        resetData() {
            if (confirm('¿Estás seguro de que quieres resetear todos los datos? Se perderán todas las listas y contadores.')) {
                this.data = {...DEFAULT_DATA};
                this.save();
                this.updateGameStatusButtons();
                this.updateGamesView();
                this.updateGamesCount();
                this.showNotification('Datos reseteados correctamente');
            }
        }

        showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `games-notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#e74c3c' : '#2ecc71'};
                color: white;
                padding: 12px 16px;
                border-radius: 5px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease;
                font-size: 14px;
                max-width: 300px;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // Inicializar el gestor de juegos
    const gamesManager = new GamesManager();
    window.gamesManager = gamesManager;

    // Resto del código existente (funciones auxiliares)
    function convertYouTubeLinks(doc, contenedorFlex = null) {
        const parrafos = doc.querySelectorAll('p');
        parrafos.forEach(p => {
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+))/g;
                if (ytRegex.test(node.textContent)) {
                    const frag = document.createDocumentFragment();
                    let lastIndex = 0;
                    node.textContent.replace(ytRegex, (match, url, videoId, offset) => {
                        if (offset > lastIndex) frag.appendChild(document.createTextNode(node.textContent.slice(lastIndex, offset)));
                        const iframe = document.createElement('iframe');
                        iframe.width = 560;
                        iframe.height = 315;
                        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
                        iframe.frameBorder = 0;
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                        iframe.allowFullscreen = true;
                        if (contenedorFlex) contenedorFlex.appendChild(iframe);
                        else frag.appendChild(iframe);
                        lastIndex = offset + match.length;
                    });
                    if (lastIndex < node.textContent.length)
                        frag.appendChild(document.createTextNode(node.textContent.slice(lastIndex)));
                    node.parentNode.replaceChild(frag, node);
                }
            }
        });
    }

    if(location.href.includes('/data/')){
        const primeraImg = document.querySelector('img');
        if(primeraImg){
            const iframeHeight = 315;
            primeraImg.style.height = iframeHeight + 'px';
            primeraImg.style.width = 'auto';
            primeraImg.style.objectFit = 'cover';
            const contenedor = document.createElement('div');
            contenedor.style.display = 'flex';
            contenedor.style.alignItems = 'flex-start';
            contenedor.style.gap = '20px';
            primeraImg.parentNode.insertBefore(contenedor, primeraImg);
            contenedor.appendChild(primeraImg);
            convertYouTubeLinks(document, contenedor);
        }
        return;
    }

    if(document.getElementById('catalogo-elamigos')) return;

    function limpiarNombre(nombre) {
        return nombre
            .replace(/\bEl\s*-?\s*Amigos\b/gi, '')
            .replace(/\bElAmigos\b/gi, '')
            .replace(/[\[\(\{]\s*El\s*-?\s*Amigos\s*[\]\)\}]/gi, '')
            .replace(/\bAmigos\b/gi, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\r?\n/g, '')
            .replace(/\s*\+\s*(?=\[)/g, '')
            .replace(/(?=\[)/g, '<br>')
            .trim();
    }

    function formatDate(dateStr) {
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
        }
        return dateStr;
    }

    // --- ESTILOS ACTUALIZADOS CON EL NUEVO ESTADO Y CONTADOR EN ESQUINA SUPERIOR DERECHA ---
    const style = document.createElement('style');
    style.textContent = `
        #catalogo-elamigos {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
            margin: 30px 0;
            padding: 10px;
        }

        .date-separator {
            grid-column: 1 / -1;
            text-align: center;
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #e74c3c;
            position: relative;
        }

        .date-separator h2 {
            color: #333;
            font-size: 1.8em;
            margin: 0;
            padding: 0 20px;
            display: inline-block;
            background: white;
            position: relative;
            top: 10px;
        }

        #catalogo-elamigos .card {
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeIn 0.5s ease;
            position: relative;
            display: flex;
            flex-direction: column;
            min-height: 340px;
            border-radius: 10px;
            overflow: hidden;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #catalogo-elamigos .card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.2);
        }

        .card-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
        }

        .image-container {
            position: relative;
            width: 100%;
            height: 250px;
            overflow: hidden;
            flex-shrink: 0;
        }

        #catalogo-elamigos img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            border-radius: 10px 10px 0 0;
            transition: transform 0.4s ease;
            cursor: pointer;
        }

        #catalogo-elamigos .card:hover img {
            transform: scale(1.05);
        }

        #catalogo-elamigos .title {
            font-size: 13px;
            font-weight: 600;
            text-align: center;
            word-wrap: break-word;
            transition: color 0.3s ease;
            line-height: 1.3em;
            padding: 5px 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            overflow: hidden;
            min-height: 60px;
        }

        #catalogo-elamigos .title-inner {
            width: 100%;
            max-height: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }

        #catalogo-elamigos .card:hover .title {
            color: #e74c3c !important;
        }

        .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            border-top: 1px solid #eaeaea;
            border-radius: 0 0 10px 10px;
            flex-shrink: 0;
            margin-top: auto;
            padding: 8px 10px;
            gap: 8px;
        }

        /* Contenedor para botones de estado */
        .status-buttons-container {
            display: flex;
            gap: 5px;
            align-items: center;
            flex: 1;
        }

        /* Botones de estado - AGREGADO ABANDONADO */
        .status-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            background: #f0f0f0;
            color: #666;
            padding: 0;
        }

        .status-btn:hover {
            transform: scale(1.1);
        }

        .status-btn.active {
            color: white;
        }

        .status-btn.wantToPlay.active {
            background: #2196f3;
        }

        .status-btn.playing.active {
            background: #2196f3;
        }

        .status-btn.played.active {
            background: #2196f3;
        }

        .status-btn.abandoned.active {
            background: #f44336; /* NUEVO COLOR PARA ABANDONADO */
        }

        .status-btn.wantToPlay:not(.active):hover {
            background: #ffe0b2;
            color: #ff9800;
        }

        .status-btn.playing:not(.active):hover {
            background: #c8e6c9;
            color: #4caf50;
        }

        .status-btn.played:not(.active):hover {
            background: #bbdefb;
            color: #2196f3;
        }

        .status-btn.abandoned:not(.active):hover {
            background: #ffcdd2; /* NUEVO HOVER PARA ABANDONADO */
            color: #f44336;
        }

        /* Contador de visitas en la esquina superior derecha de la imagen */
        .visit-counter {
            position: absolute;
            top: 0px;
            right: 0px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 1.5px 1px;
            border-radius: 0px 11px 0px 10px;
            font-size: 11px;
            font-weight: bold;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 4px;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            min-width: 40px;
            justify-content: center;
        }

        .visit-counter:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.05);
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
        }

        #catalogo-elamigos .placeholder {
            width: 100%;
            height: 220px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 10px 10px 0 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 12px;
            animation: pulse 2s infinite;
            flex-shrink: 0;
        }

        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }

        /* Filtros y controles */
        .catalog-filters {
            position: sticky;
            top: 40px;
            z-index: 100;
            background: rgba(51, 51, 51, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            justify-content: center;
        }

        .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }

        .filter-label {
            color: white;
            font-weight: bold;
            font-size: 14px;
            margin-right: 5px;
            white-space: nowrap;
        }

        .letter-button {
            min-width: 36px;
            height: 36px;
            padding: 0 8px;
            border: none;
            border-radius: 8px;
            background: #444;
            color: white;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .letter-button:hover {
            background: #007bff;
            transform: translateY(-2px);
        }

        .letter-button.active {
            background: #e74c3c;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
        }

        .letter-button.special {
            background: #3498db;
        }

        /* Contador de juegos en toolbar - AGREGADO ABANDONADOS */
        .games-count {
            display: inline-flex;
            gap: 5px;
            margin-left: 8px;
            font-size: 11px;
        }

        .played-count, .playing-count, .want-count, .abandoned-count {
            background: rgba(255,255,255,0.2);
            padding: 1px 4px;
            border-radius: 3px;
            min-width: 18px;
            text-align: center;
        }

        .played-count { background: #2196f3; }
        .playing-count { background: #4caf50; }
        .want-count { background: #ff9800; }
        .abandoned-count { background: #f44336; } /* NUEVO ESTILO */

        #search-filter {
            flex: 1;
            min-width: 200px;
            max-width: 300px;
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            background: white;
            color: #333;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        #search-filter:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
        }

        .stats {
            color: white;
            font-size: 12px;
            background: rgba(0,0,0,0.3);
            padding: 5px 10px;
            border-radius: 6px;
            margin-left: auto;
        }

        body > a[href^="data/"] {
            display: none !important;
        }

        h1:not(:first-of-type) {
            display: none !important;
        }

        .section-divider {
            grid-column: 1 / -1;
            text-align: center;
            margin: 40px 0 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            font-size: 1.5em;
            font-weight: bold;
        }

        .section-divider.new-additions {
            background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
        }

        /* Estilos para panel de juegos */
        #games-content.grid-view {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
        }

        .grid-view-item {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
            background: white;
            height: 240px;
            display: flex;
            flex-direction: column;
        }

        .grid-view-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: #007bff;
        }

        .game-item-image {
            position: relative;
            height: 140px;
            overflow: hidden;
            flex-shrink: 0;
        }

        .game-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
            cursor: pointer;
        }

        .grid-view-item:hover .game-item-image img {
            transform: scale(1.05);
        }

        /* Contador en el panel de juegos - vista grid */
        .game-item-visits {
            position: absolute;
            bottom: 8px;
            left: 8px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 4px;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .game-item-info {
            padding: 8px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .game-item-info h4 {
            margin: 0 0 4px 0;
            color: black;
            font-size: 12px;
            line-height: 1.3;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            cursor: default;
        }

        .game-item-date {
            margin: 0 0 8px 0;
            font-size: 10px;
            color: #666;
        }

        /* Estilos para panel de juegos - MODO MOSAICO */
        .game-item-actions {
            display: flex;
            gap: 2px;
            margin-top: auto;
            min-height: 24px;
            justify-content: center;
        }

        /* Contenedor de botones de estado en modo mosaico */
        .game-item-actions .status-buttons {
            display: flex;
            gap: 1px;
            flex: 3;
            max-width: 60px;
        }

        .game-item-actions .status-btn {
            flex: 1;
            min-width: 0;
            padding: 0;
            font-size: 10px;
            border-radius: 3px;
            border: none;
            background: #f0f0f0;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 20px;
            max-height: 20px;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .game-item-actions .status-btn:hover {
            transform: scale(1.05);
        }

        .game-item-actions .status-btn.active {
            color: white;
        }

        .game-item-actions .status-btn.wantToPlay.active {
            background: #ff9800;
        }

        .game-item-actions .status-btn.playing.active {
            background: #4caf50;
        }

        .game-item-actions .status-btn.played.active {
            background: #2196f3;
        }

        .game-item-actions .status-btn.abandoned.active {
            background: #f44336; /* NUEVO COLOR EN MODO MOSAICO */
        }

        /* Botón de eliminar en modo mosaico */
        .game-item-actions .remove-btn {
            flex: 1;
            min-width: 20px;
            max-width: 20px;
            padding: 0;
            font-size: 10px;
            border-radius: 3px;
            border: none;
            background: #dc3545;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 20px;
            max-height: 20px;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .game-item-actions .remove-btn:hover {
            background: #c82333;
        }

        /* Estilos para panel de juegos - MODO LISTA */
        #games-content.list-view {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .list-view-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            transition: all 0.2s ease;
        }

        .list-view-item:hover {
            background: #f8f9fa;
            border-color: #007bff;
            transform: translateX(2px);
        }

        .list-view-content {
            flex: 1;
            overflow: hidden;
        }

        .list-view-title {
            margin: 0 0 4px 0;
            color: #007bff;
            font-size: 13px;
            font-weight: 600;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            display: block;
            transition: color 0.2s ease;
        }

        .list-view-title:hover {
            color: #0056b3;
            text-decoration: underline;
        }

        .list-view-details {
            display: flex;
            gap: 10px;
            align-items: center;
            font-size: 11px;
            color: #666;
        }

        .list-view-visits {
            background: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 4px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .list-view-actions {
            display: flex;
            gap: 5px;
            margin-left: 10px;
            flex-shrink: 0;
        }

        .status-actions {
            display: flex;
            gap: 3px;
        }

        .list-view-btn, .status-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .remove-btn {
            background: #dc3545;
            color: white;
        }

        .remove-btn:hover {
            background: #c82333;
        }

        /* Tabs mejorados en el panel de juegos */
        .games-tab.active {
            font-weight: bold !important;
            text-shadow: 0 1px 1px rgba(0,0,0,0.2);
        }

        .games-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 25%;
            width: 50%;
            height: 2px;
            background: rgba(255,255,255,0.8);
            border-radius: 1px;
        }

        /* Menú de opciones avanzadas */
        #games-options-menu button:hover {
            background: #f8f9fa !important;
            color: #007bff !important;
        }

        #games-options-menu button:active {
            background: #e9ecef !important;
        }

        /* Notificaciones */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        @media (max-width: 768px) {
            #catalogo-elamigos {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 15px;
            }

            .date-separator h2 {
                font-size: 1.4em;
            }

            .image-container {
                height: 200px;
            }

            #catalogo-elamigos .placeholder {
                height: 200px;
            }

            .catalog-filters {
                flex-direction: column;
                align-items: stretch;
            }

            .filter-group {
                justify-content: center;
            }

            #search-filter {
                max-width: 100%;
            }

            #games-panel {
                width: 100%;
                right: -100%;
            }

            #games-content.grid-view {
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            }

            .grid-view-item {
                height: 230px;
            }

            .game-item-image {
                height: 130px;
            }

            .card-footer {
                padding: 8px 6px;
                gap: 5px;
            }

            .status-buttons-container {
                gap: 3px;
            }

            .status-btn {
                width: 26px;
                height: 26px;
                font-size: 12px;
            }

            .visit-counter {
                top: 6px;
                right: 6px;
                padding: 2px 6px;
                font-size: 10px;
                min-width: 36px;
            }

            .list-view-item {
                padding: 8px 10px;
            }

            .list-view-title {
                font-size: 12px;
            }

            .list-view-details {
                font-size: 10px;
            }

            .list-view-btn, .status-btn {
                width: 26px;
                height: 26px;
                font-size: 11px;
            }

            .game-item-actions .status-btn {
                font-size: 9px;
                height: 18px;
            }

            .game-item-actions .remove-btn {
                font-size: 9px;
                height: 18px;
            }

            #games-options-menu {
                min-width: 160px;
                right: 10px;
            }
        }

        .highlight-first-card {
            animation: highlightCard 1s ease;
        }

        @keyframes highlightCard {
            0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
    `;
    document.head.appendChild(style);

    const grid = document.createElement('div');
    grid.id = 'catalogo-elamigos';

    // --- OBSERVER MEJORADO ---
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(!entry.isIntersecting) return;
            const card = entry.target;
            const link = card.dataset.link;
            const tituloTexto = card.dataset.title;
            if(card.dataset.loaded) return;

            GM_xmlhttpRequest({
                method:'GET',
                url: link,
                onload:function(response){
                    try{
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText,'text/html');
                        convertYouTubeLinks(doc);
                        const imgElem = doc.querySelector('img');
                        if(imgElem){
                            const imgSrc = new URL(imgElem.src, link).href;

                            // Crear estructura de contenido de la tarjeta
                            const cardContent = document.createElement('div');
                            cardContent.className = 'card-content';

                            // Contenedor de imagen (MODIFICADO)
                            const imageContainer = document.createElement('div');
                            imageContainer.className = 'image-container';

                            const enlace = document.createElement('a');
                            enlace.href = link;
                            enlace.target = '_blank';
                            enlace.rel = 'noopener noreferrer';
                            enlace.style.textDecoration = 'none';

                            const portada = document.createElement('img');
                            portada.src = imgSrc;
                            portada.alt = tituloTexto;
                            portada.loading = 'lazy';
                            portada.style.objectFit = 'cover';

                            // Contador de visitas (MOVIDO AQUÍ)
                            const counter = document.createElement('div');
                            counter.className = 'visit-counter';
                            const visits = gamesManager.getVisits(link);
                            counter.innerHTML = `👁️ ${visits}`;
                            counter.title = `Visitas: ${visits}`;

                            enlace.appendChild(portada);
                            enlace.appendChild(counter); // Añadir contador dentro del enlace
                            imageContainer.appendChild(enlace);
                            cardContent.appendChild(imageContainer);

                            // Contenedor del título
                            const tituloContainer = document.createElement('div');
                            tituloContainer.className = 'title';

                            const tituloInner = document.createElement('div');
                            tituloInner.className = 'title-inner';
                            tituloInner.innerHTML = tituloTexto;

                            if(card.dataset.color) tituloContainer.style.color = card.dataset.color;
                            tituloContainer.appendChild(tituloInner);
                            cardContent.appendChild(tituloContainer);

                            // Crear footer de la tarjeta
                            const cardFooter = document.createElement('div');
                            cardFooter.className = 'card-footer';

                            // Contenedor para botones de estado
                            const statusButtonsContainer = document.createElement('div');
                            statusButtonsContainer.className = 'status-buttons-container';

                            // Obtener estado actual del juego
                            const currentStatus = gamesManager.getGameStatus(link);

                            // Crear botones para cada estado - AGREGADO ABANDONADO
                            const statusButtons = [
                                { target: 'wantToPlay', icon: '⏳', label: 'Por jugar' },
                                { target: 'playing', icon: '🎮', label: 'Jugando' },
                                { target: 'played', icon: '🏆', label: 'Terminado' },
                                { target: 'abandoned', icon: '💀', label: 'Abandonado' } // NUEVO BOTÓN
                            ];

                            statusButtons.forEach(btn => {
                                const btnElement = document.createElement('button');
                                btnElement.className = 'status-btn';
                                if (currentStatus === btn.target) {
                                    btnElement.classList.add('active');
                                    btnElement.classList.add(btn.target);
                                }
                                btnElement.dataset.link = link;
                                btnElement.dataset.target = btn.target;
                                btnElement.innerHTML = btn.icon;

                                // Configurar tooltip
                                if (currentStatus === btn.target) {
                                    btnElement.title = `Quitar de ${btn.label}`;
                                } else {
                                    btnElement.title = `Marcar como ${btn.label}`;
                                }

                                btnElement.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const targetList = btn.target;
                                    const currentStatus = gamesManager.getGameStatus(link);

                                    if (currentStatus === targetList) {
                                        // Si ya está en esta lista, quitar
                                        gamesManager.removeFromAllLists(link);
                                    } else if (currentStatus) {
                                        // Si está en otra lista, mover a la nueva
                                        gamesManager.moveToList(currentStatus, targetList, link);
                                    } else {
                                        // Si no está en ninguna lista, agregar
                                        gamesManager.addToList(targetList, link, tituloTexto);
                                    }
                                });

                                statusButtonsContainer.appendChild(btnElement);
                            });

                            cardFooter.appendChild(statusButtonsContainer);

                            // NOTA: El contador de visitas ya está en la imagen, no en el footer
                            // cardFooter.appendChild(counter); // ELIMINADO

                            card.appendChild(cardContent);
                            card.appendChild(cardFooter);

                            const placeholder = card.querySelector('.placeholder');
                            if(placeholder) card.removeChild(placeholder);
                        }

                        card.dataset.loaded = "true";

                        updateStats();
                    }catch(err){
                        console.error('Error cargando portada:', link, err);
                        card.querySelector('.placeholder').innerHTML = '⚠️<br>Error';
                        card.querySelector('.placeholder').style.color = '#e74c3c';
                    }
                },
                onerror:function(err){
                    console.warn('GM_xmlhttpRequest ->', err);
                    card.querySelector('.placeholder').innerHTML = '❌<br>Error';
                    card.querySelector('.placeholder').style.color = '#e74c3c';
                }
            });

            observer.unobserve(card);
        });
    },{rootMargin:'200px'});

    // --- FUNCIONES AUXILIARES ---
    function findFirstFecha(){
        return Array.from(document.querySelectorAll('h1')).find(h1 =>
            /^\d{2}\.\d{2}\.\d{4}$/.test(h1.textContent.trim())
        ) || null;
    }

    // --- SISTEMA DE FILTRADO MEJORADO ---
    let activeFilter = 'Todos';
    let searchTerm = '';
    let totalCards = 0;
    let visibleCards = 0;
    let fullLogFound = false;
    let cardsBeforeFullLog = 0;
    let cardsAfterFullLog = 0;
    let scrollToFirstCard = false;

    function createFilterSystem() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'catalog-filters';

        // Grupo de letras
        const letterGroup = document.createElement('div');
        letterGroup.className = 'filter-group';

        const letterLabel = document.createElement('span');
        letterLabel.className = 'filter-label';
        letterLabel.textContent = 'Letra:';
        letterGroup.appendChild(letterLabel);

        // Botón "Todos"
        const allButton = document.createElement('button');
        allButton.className = 'letter-button active special';
        allButton.textContent = 'Todos';
        allButton.addEventListener('click', () => {
            scrollToFirstCard = false;
            setFilter('Todos');
        });
        letterGroup.appendChild(allButton);

        // Botón "#"
        const numButton = document.createElement('button');
        numButton.className = 'letter-button special';
        numButton.textContent = '#';
        numButton.addEventListener('click', () => {
            scrollToFirstCard = true;
            setFilter('#');
        });
        letterGroup.appendChild(numButton);

        // Botones A-Z
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-button';
            button.textContent = letter;
            button.addEventListener('click', () => {
                scrollToFirstCard = true;
                setFilter(letter);
            });
            letterGroup.appendChild(button);
        });

        // Grupo de búsqueda
        const searchGroup = document.createElement('div');
        searchGroup.className = 'filter-group';
        searchGroup.style.flex = '1';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search-filter';
        searchInput.placeholder = '🔍 Buscar juegos...';
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            scrollToFirstCard = false;
            applyFilters();
        });
        searchGroup.appendChild(searchInput);

        // Botón de gestión de juegos en la barra de herramientas
        const gamesButton = document.createElement('button');
        gamesButton.id = 'games-toolbar-btn';
        gamesButton.className = 'letter-button special';
        gamesButton.title = 'Gestionar mis juegos';
        gamesButton.addEventListener('click', () => {
            gamesManager.toggleGamesView();
        });

        // Grupo para el botón de juegos
        const gamesGroup = document.createElement('div');
        gamesGroup.className = 'filter-group';
        gamesGroup.appendChild(gamesButton);

        // Estadísticas
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats';
        statsDiv.id = 'catalog-stats';
        statsDiv.textContent = 'Cargando...';

        filterContainer.appendChild(letterGroup);
        filterContainer.appendChild(searchGroup);
        filterContainer.appendChild(gamesGroup);
        filterContainer.appendChild(statsDiv);

        grid.parentNode.insertBefore(filterContainer, grid);

        window.filterButtons = letterGroup.querySelectorAll('.letter-button');

        // Actualizar contador de juegos
        gamesManager.updateGamesCount();
    }

    function setFilter(filter) {
        activeFilter = filter;

        window.filterButtons?.forEach(button => {
            button.classList.remove('active');
            if ((filter === 'Todos' && button.textContent === 'Todos') ||
                (filter === '#' && button.textContent === '#') ||
                (filter !== 'Todos' && filter !== '#' && button.textContent === filter)) {
                button.classList.add('active');
            }
        });

        applyFilters();
    }

    function applyFilters() {
        const cards = document.querySelectorAll('#catalogo-elamigos .card');
        visibleCards = 0;
        let firstVisibleCard = null;

        cards.forEach(card => {
            const titulo = (card.dataset.title || '').toLowerCase();
            const cleanTitle = titulo.replace(/<br>/g, ' ').replace(/[^\w\s]/g, '');
            const isAfterFullLog = card.dataset.afterFullLog === 'true';

            // Aplicar filtro de letra SOLO a los juegos después del Full Log
            let passesLetterFilter = false;
            if (!isAfterFullLog) {
                // Juegos antes del Full Log (nuevas adiciones) - SIEMPRE visibles con filtro de letra
                passesLetterFilter = true;
            } else {
                // Juegos después del Full Log (catálogo completo) - aplicar filtro de letra
                if (activeFilter === 'Todos') {
                    passesLetterFilter = true;
                } else if (activeFilter === '#') {
                    passesLetterFilter = /^[^a-z]/i.test(cleanTitle);
                } else {
                    passesLetterFilter = cleanTitle.startsWith(activeFilter.toLowerCase());
                }
            }

            // Aplicar filtro de búsqueda a TODOS los juegos
            const passesSearchFilter = !searchTerm ||
                titulo.includes(searchTerm) ||
                cleanTitle.includes(searchTerm);

            const shouldShow = passesLetterFilter && passesSearchFilter;
            card.style.display = shouldShow ? 'flex' : 'none';

            if (shouldShow) {
                visibleCards++;
                if (!firstVisibleCard && isAfterFullLog) {
                    firstVisibleCard = card;
                }
            }

            // Remover highlight previo
            card.classList.remove('highlight-first-card');
        });

        // Scroll al primer juego visible si se activó scrollToFirstCard
        if (scrollToFirstCard && firstVisibleCard) {
            setTimeout(() => {
                firstVisibleCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Añadir animación de highlight
                firstVisibleCard.classList.add('highlight-first-card');
            }, 100);
        }

        // Resetear la bandera después de aplicar el scroll
        scrollToFirstCard = false;

        // Mostrar/ocultar separadores según si tienen tarjetas visibles
        const sections = document.querySelectorAll('.date-separator, .section-divider');
        sections.forEach(section => {
            const nextElements = getNextElementsUntil(section, '.date-separator, .section-divider');
            const hasVisibleCards = nextElements.some(el =>
                el.classList.contains('card') && el.style.display !== 'none'
            );
            section.style.display = hasVisibleCards ? 'block' : 'none';
        });

        updateStats();
    }

    // Función auxiliar para obtener elementos entre dos separadores
    function getNextElementsUntil(startElement, selector) {
        const elements = [];
        let nextElement = startElement.nextElementSibling;

        while (nextElement && !nextElement.matches(selector)) {
            elements.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }

        return elements;
    }

    function updateStats() {
        const statsDiv = document.getElementById('catalog-stats');
        if (statsDiv) {
            const loadedCards = document.querySelectorAll('#catalogo-elamigos .card[data-loaded="true"]').length;
            const totalPlayed = Object.keys(catalogData.games.played).length;
            const totalPlaying = Object.keys(catalogData.games.playing).length;
            const totalWantToPlay = Object.keys(catalogData.games.wantToPlay).length;
            const totalAbandoned = Object.keys(catalogData.games.abandoned).length; // NUEVO
            statsDiv.innerHTML = `
                <strong>${visibleCards}</strong> de <strong>${totalCards}</strong> juegos<br>
                <small>${loadedCards} cargados | ${cardsBeforeFullLog} nuevos | ${cardsAfterFullLog} catálogo</small>
            `;
        }
    }

    // --- PROCESAMIENTO PRINCIPAL CON FECHAS ---
    function processFrom(reference){
        if(!reference) return;

        // Ocultar imágenes grandes del inicio
        document.querySelectorAll('body > a[href^="data/"]').forEach(a => {
            a.style.display = 'none';
        });

        // Insertar el grid
        reference.parentNode.insertBefore(grid, reference.nextSibling);

        // Crear sistema de filtros
        createFilterSystem();

        // Ocultar todas las fechas originales excepto la primera (título del sitio)
        document.querySelectorAll('h1').forEach((h1, index) => {
            if (index > 0) {
                h1.style.display = 'none';
            }
        });

        // Crear separador para nuevas adiciones
        if (!fullLogFound) {
            const newAdditionsDivider = document.createElement('div');
            newAdditionsDivider.className = 'section-divider new-additions';
            newAdditionsDivider.textContent = '🆕 NUEVAS ADICIONES 🆕';
            grid.appendChild(newAdditionsDivider);
        }

        // Procesar elementos
        let nodo = reference;
        let currentDate = null;

        while(nodo){
            const nextNodo = nodo.nextElementSibling;
            const textoNodo = nodo.textContent.trim();
            const esFecha = /^\d{2}\.\d{2}\.\d{4}$/.test(textoNodo);
            const esFullLog = /Full log of updates/i.test(textoNodo);

            if(esFecha){
                // Crear separador de fecha (solo fecha grande)
                currentDate = textoNodo;
                const dateSeparator = document.createElement('div');
                dateSeparator.className = 'date-separator';
                dateSeparator.innerHTML = `<h2>${formatDate(textoNodo)}</h2>`;
                grid.appendChild(dateSeparator);
                nodo.style.display = 'none';
            }
            else if(esFullLog){
                // Crear separador para el catálogo completo
                fullLogFound = true;
                currentDate = null;

                // LIMPIAR EL CACHE DE ENLACES PARA EL CATÁLOGO COMPLETO
                processedLinks.clear();

                const catalogDivider = document.createElement('div');
                catalogDivider.className = 'section-divider';
                catalogDivider.textContent = '🎮 CATÁLOGO COMPLETO 🎮';
                grid.appendChild(catalogDivider);

                nodo.style.display = 'none';
            }
            else if(['H3','H4','H5'].includes(nodo.tagName)){
                const a = nodo.querySelector('a[href]');
                if(a){
                    const link = a.href;
                    const tituloTexto = limpiarNombre(nodo.textContent.replace(/DOWNLOAD/gi,'').trim());

                    // Verificar duplicados solo por enlace y solo para nuevas adiciones
                    // Para el catálogo completo, NO verificar duplicados
                    let esDuplicado = false;

                    if (!fullLogFound) {
                        // Para nuevas adiciones: verificar duplicados por enlace
                        if (processedLinks.has(link)) {
                            console.log('Duplicado omitido (nuevas adiciones):', link);
                            esDuplicado = true;
                        } else {
                            processedLinks.add(link);
                        }
                    }
                    // Para catálogo completo: NO omitir duplicados

                    if (esDuplicado) {
                        nodo.style.display = 'none';
                        nodo = nextNodo;
                        continue;
                    }

                    // Crear tarjeta
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.link = link;
                    card.dataset.title = tituloTexto;
                    card.dataset.color = window.getComputedStyle(nodo).color;
                    card.dataset.afterFullLog = fullLogFound ? 'true' : 'false';

                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder';
                    placeholder.textContent = 'Cargando...';
                    card.appendChild(placeholder);

                    grid.appendChild(card);
                    observer.observe(card);
                    totalCards++;

                    // Contar tarjetas antes/después del Full Log
                    if (fullLogFound) {
                        cardsAfterFullLog++;
                    } else {
                        cardsBeforeFullLog++;
                    }

                    nodo.style.display = 'none';
                }
            }

            nodo = nextNodo;
        }

        // Aplicar filtros iniciales
        applyFilters();
    }

    // --- INICIALIZACIÓN ---
    const firstFecha = findFirstFecha();
    if(firstFecha) processFrom(firstFecha);
    else{
        const mo = new MutationObserver((mutations, observerMut)=>{
            const fecha = findFirstFecha();
            if(fecha){
                observerMut.disconnect();
                processFrom(fecha);
            }
        });
        mo.observe(document.documentElement||document.body,{childList:true, subtree:true});
        setTimeout(()=>{
            const fecha2 = findFirstFecha();
            if(fecha2) processFrom(fecha2);
        },3000);
    }

})();