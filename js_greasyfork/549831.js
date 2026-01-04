// ==UserScript==
// @name         Mapeador de Quests
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Mapeia quests com múltiplos andares, ícones, exportação para PNG.
// @author       Chris Popper 
// @match        https://*.popmundo.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/549831/Mapeador%20de%20Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/549831/Mapeador%20de%20Quests.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIÁVEIS GLOBAIS E LÓGICA ---
    let mapData = {}, currentPosition = { x: 0, y: 0, z: 0, s: 0 };
    const THEME_KEY = "questMapperTheme_v9", MINIMIZED_KEY = "questMapperMinimized_v9", POSITION_KEY = "questMapperPosition_v9";
    const DATA_KEY = 'questMapperData_v4', POS_KEY = 'questMapperPosition_v4', NAME_KEY = 'questMapperName_v4';
    const SAVED_MAPS_KEY = 'questMapperSavedMaps_v1';
    const AUTOLINK_START_COORD_KEY = 'questMapperAutoLinkStart_v1', AUTOLINK_COLOR_KEY = 'questMapperAutoLinkColor_v1';
    const VIEWBOX_KEY = 'questMapperViewBox_v1';
    const LAST_POS_KEY = 'questMapperLastPosition_v4';
    const LAST_DIR_KEY = 'questMapperLastDirection_v4';
    let currentMapName = '';

    let currentTheme = GM_getValue(THEME_KEY, 'dark'), isMinimized = GM_getValue(MINIMIZED_KEY, false);
    const DIRECTION_MAP = { 'Norte':{x:0,y:1},'Sul':{x:0,y:-1},'Leste':{x:1,y:0},'Oeste':{x:-1,y:0},'Nordeste':{x:1,y:1},'Noroeste':{x:-1,y:1},'Sudeste':{x:1,y:-1},'Sudoeste':{x:-1,y:-1} };
    const ROOM_SIZE = 24, SPACING = 18, TOTAL_SIZE = ROOM_SIZE + SPACING;
    const SECTION_SPACING = TOTAL_SIZE * 3;
    let isPanning = false, startPoint = { x: 0, y: 0 }, currentViewBox = { x: 0, y: 0, width: 0, height: 0 };

    let isDraggingSection = false;
    let draggedSectionInfo = null;
    let dragStartSVGPoint = null;

    const ICON_MAP = { 'current': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z', 'Sobe': 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z', 'Desce': 'M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z', 'Saída': 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z', 'link': 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z' };

    function getCoordKey(pos = currentPosition) { return `${pos.x},${pos.y},${pos.z},${pos.s}`; }
    function saveViewBoxState() { if (currentViewBox && currentViewBox.width > 0) { sessionStorage.setItem(VIEWBOX_KEY, JSON.stringify(currentViewBox)); } }
    function initializeViewBox() { const savedViewBox = sessionStorage.getItem(VIEWBOX_KEY); if (savedViewBox) { try { const parsedViewBox = JSON.parse(savedViewBox); if (typeof parsedViewBox.x === 'number' && typeof parsedViewBox.width === 'number' && parsedViewBox.width > 0) { currentViewBox = parsedViewBox; } } catch (e) { console.error("Mapeador de Quests: Erro ao carregar viewBox salvo.", e); sessionStorage.removeItem(VIEWBOX_KEY); } } }

    function initializeMap() {
        const savedMap = sessionStorage.getItem(DATA_KEY);
        const savedPosition = sessionStorage.getItem(POS_KEY);
        const savedName = sessionStorage.getItem(NAME_KEY);
        if (savedMap && savedPosition) {
            mapData = JSON.parse(savedMap);
            currentPosition = JSON.parse(savedPosition);
            if (currentPosition.s === undefined) {
                currentPosition.s = 0;
                const migratedMapData = {};
                for (const key in mapData) {
                    const room = mapData[key];
                    if (room.s === undefined) room.s = 0;
                    migratedMapData[`${room.x},${room.y},${room.z},${room.s}`] = room;
                }
                mapData = migratedMapData;
                saveMapState();
            }
        } else {
            mapData = {};
            currentPosition = { x: 0, y: 0, z: 0, s: 0 };
        }
        currentMapName = savedName || '';
        const mapNameInput = document.getElementById('qmp-map-name');
        if (mapNameInput) mapNameInput.value = currentMapName;
    }

    function reconcilePositionAfterMove() {
        const lastPosStr = sessionStorage.getItem(LAST_POS_KEY);
        const lastDir = sessionStorage.getItem(LAST_DIR_KEY);

        if (lastPosStr && lastDir) {
            try {
                const lastPosition = JSON.parse(lastPosStr);
                const move = DIRECTION_MAP[lastDir];

                if (move) {
                    currentPosition.x = lastPosition.x + move.x;
                    currentPosition.y = lastPosition.y + move.y;
                    currentPosition.z = lastPosition.z;
                    currentPosition.s = lastPosition.s;
                    saveMapState();
                }
            } catch (e) {
                console.error("Mapeador de Quests: Erro ao reconciliar a posição.", e);
            } finally {
                sessionStorage.removeItem(LAST_POS_KEY);
                sessionStorage.removeItem(LAST_DIR_KEY);
            }
        }
    }

    function saveMapState() { sessionStorage.setItem(DATA_KEY, JSON.stringify(mapData)); sessionStorage.setItem(POS_KEY, JSON.stringify(currentPosition)); }
    function saveMapName() { const mapNameInput = document.getElementById('qmp-map-name'); if (mapNameInput) { currentMapName = mapNameInput.value.trim(); sessionStorage.setItem(NAME_KEY, currentMapName); updateUI(); } }
    function getSavedMaps() { return GM_getValue(SAVED_MAPS_KEY, {}); }
    function saveCurrentMapToStorage() { if (!currentMapName) { alert("Por favor, dê um nome ao mapa antes de salvar."); return; } if (!confirm(`Tem certeza que deseja salvar/sobrescrever o mapa "${currentMapName}"?`)) { return; } const savedMaps = getSavedMaps(); savedMaps[currentMapName] = { mapData: mapData, position: currentPosition }; GM_setValue(SAVED_MAPS_KEY, savedMaps); alert(`Mapa "${currentMapName}" salvo com sucesso!`); drawSavedMapsList(); }
    function loadMapFromStorage(mapName) { if (!confirm(`Isso irá substituir o mapa da sessão atual pelo mapa "${mapName}". Deseja continuar?`)) { return; } const savedMaps = getSavedMaps(); const mapToLoad = savedMaps[mapName]; if (mapToLoad) { sessionStorage.setItem(DATA_KEY, JSON.stringify(mapToLoad.mapData)); sessionStorage.setItem(POS_KEY, JSON.stringify(mapToLoad.position)); sessionStorage.setItem(NAME_KEY, mapName); location.reload(); } else { alert("Erro: Mapa não encontrado."); } }
    function deleteMapFromStorage(mapName) { if (!confirm(`Tem certeza que deseja DELETAR PERMANENTEMENTE o mapa "${mapName}"?`)) { return; } const savedMaps = getSavedMaps(); if (savedMaps[mapName]) { delete savedMaps[mapName]; GM_setValue(SAVED_MAPS_KEY, savedMaps); drawSavedMapsList(); } }
    function drawSavedMapsList() { const listContainer = document.getElementById('qmp-saved-maps-list'); if (!listContainer) return; listContainer.innerHTML = ''; const savedMaps = getSavedMaps(); const mapNames = Object.keys(savedMaps).sort(); if (mapNames.length === 0) { listContainer.innerHTML = '<span class="qmp-no-maps-message">Nenhum mapa salvo.</span>'; return; } mapNames.forEach(name => { const item = document.createElement('div'); item.className = 'qmp-saved-map-item'; const nameSpan = document.createElement('span'); nameSpan.className = 'qmp-saved-map-name'; nameSpan.textContent = name; nameSpan.title = 'Clique para carregar este mapa'; nameSpan.onclick = () => loadMapFromStorage(name); const deleteBtn = document.createElement('button'); deleteBtn.className = 'qmp-delete-map-btn'; deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; deleteBtn.title = 'Deletar este mapa'; deleteBtn.onclick = () => deleteMapFromStorage(name); item.appendChild(nameSpan); item.appendChild(deleteBtn); listContainer.appendChild(item); }); }

    function scanCurrentRoom() {
        let exits = [], content = '', color = null;
        const cdlxDirectionMap = { 'North': 'Norte', 'South': 'Sul', 'East': 'Leste', 'West': 'Oeste', 'NorthEast': 'Nordeste', 'NorthWest': 'Noroeste', 'SouthEast': 'Sudeste', 'SouthWest': 'Sudoeste' };
        const svgCompass = document.getElementById('cdlx-compass') || document.getElementById('dungeon');
        if (svgCompass) {
            const activeDirections = svgCompass.querySelectorAll('g[display="inline"].fe-move[data-dir]');
            activeDirections.forEach(g => { const dirKey = g.dataset.dir; if (cdlxDirectionMap[dirKey] && !exits.includes(cdlxDirectionMap[dirKey])) { exits.push(cdlxDirectionMap[dirKey]); } });
            for (const dir in cdlxDirectionMap) { if (svgCompass.querySelector(`g#${dir}[display="inline"]`)) { const translatedDir = cdlxDirectionMap[dir]; if (!exits.includes(translatedDir)) { exits.push(translatedDir); } } }
            if (svgCompass.querySelector(`g#Up[display="inline"]`)) { content = 'Sobe'; color = '#3498db'; }
            if (svgCompass.querySelector(`g#Down[display="inline"]`)) { content = 'Desce'; color = '#9b59b6'; }
            if (svgCompass.querySelector(`g#Exit[display="inline"]`)) { content = 'Saída'; color = '#e74c3c'; }
        }
        const textCompass = document.querySelector('div.Compass, div[id*="divCompass"]');
        if (textCompass) { const links = textCompass.querySelectorAll('a'); links.forEach(link => { const dirText = link.textContent.trim(); if (DIRECTION_MAP[dirText] && !exits.includes(dirText)) { exits.push(dirText); } }); }
        const itemTable = document.getElementById('items-equipment') || document.getElementById('checkedlist') || document.getElementById('fe-items');
        if (itemTable) {
            let foundStair = false;
            const allLinks = itemTable.querySelectorAll('a, input[type="image"]');
            allLinks.forEach(link => {
                const itemText = (link.textContent || link.title).toLowerCase();
                if (itemText.includes('amarel')) { content = 'Cima/Baixo'; color = '#f1c40f'; foundStair = true; }
                else if (itemText.includes('azul')) { content = 'Cima/Baixo'; color = '#3498db'; foundStair = true; }
                else if (itemText.includes('vermelh')) { content = 'Cima/Baixo'; color = '#e74c3c'; foundStair = true; }
                else if (itemText.includes('magenta')) { content = 'Cima/Baixo'; color = '#ff00ff'; foundStair = true; }
                else if (itemText.includes('ciano')) { content = 'Cima/Baixo'; color = '#00ffff'; foundStair = true; }
                else if (itemText.includes('roxo')) { content = 'Cima/Baixo'; color = '#9b59b6'; foundStair = true; }
                else if (itemText.includes('para cima') || itemText.includes('subir')) { content = 'Sobe'; color = '#3498db'; foundStair = true; }
                else if (itemText.includes('para baixo') || itemText.includes('descer')) { content = 'Desce'; color = '#9b59b6'; foundStair = true; }
            });
            if (!foundStair && content === '') { const firstItem = itemTable.querySelector('a[id*="lnkItem"]'); if (firstItem) { content = firstItem.textContent.trim(); color = '#2ecc71'; } }
        }
        return { exits, content, color };
    }

    function updateMapAndDraw() { const roomInfo = scanCurrentRoom(); const coordKey = getCoordKey(); const existingRoom = mapData[coordKey]; if (!existingRoom) { mapData[coordKey] = { ...currentPosition, exits: roomInfo.exits, content: roomInfo.content || '', color: roomInfo.color || null, visited: true, manualAnnotation: false }; } else { existingRoom.exits = roomInfo.exits; if (!existingRoom.manualAnnotation) { existingRoom.content = roomInfo.content || ''; existingRoom.color = roomInfo.color || null; } } saveMapState(); updateUI(); }

    function setupMovementHooks() {
        document.querySelectorAll('div.Compass a, div[id*="divCompass"] a, #items-equipment input[id*="btnUse"], #items-equipment a[id*="lnkItem"], #dungeon g[id], #cdlx-compass g.fe-move[data-dir]').forEach(link => {
            link.addEventListener('click', () => {
                const cdlxDirectionMap = {'North':'Norte', 'South':'Sul', 'East':'Leste', 'West':'Oeste', 'NorthEast':'Nordeste', 'NorthWest':'Noroeste', 'SouthEast':'Sudeste', 'SouthWest':'Sudoeste'};
                let direction = null;
                const text = (link.textContent || link.title || link.id || '').trim();
                const dataDir = link.dataset.dir;

                if (dataDir && cdlxDirectionMap[dataDir]) {
                    direction = cdlxDirectionMap[dataDir];
                } else if (cdlxDirectionMap[text]) {
                    direction = cdlxDirectionMap[text];
                } else {
                    for (const dir in DIRECTION_MAP) {
                        if (text === dir) {
                            direction = dir;
                            break;
                        }
                    }
                }

                const textLower = text.toLowerCase();
                const isVerticalMove = textLower.includes('para cima') || textLower.includes('subir') || textLower.includes('para baixo') || textLower.includes('descer') || textLower === 'up' || textLower === 'down' || textLower.includes('amarel') || textLower.includes('azul') || textLower.includes('vermelh') || textLower.includes('roxo') || textLower.includes('ciano') || textLower.includes('magenta');
                const currentCoordKey = getCoordKey();
                const currentRoom = mapData[currentCoordKey];

                if (direction) {
                    sessionStorage.setItem(LAST_POS_KEY, JSON.stringify(currentPosition));
                    sessionStorage.setItem(LAST_DIR_KEY, direction);
                } else if (isVerticalMove && currentRoom && currentRoom.linkTo) {
                    const [newX, newY, newZ, newS] = currentRoom.linkTo.split(',').map(Number);
                    currentPosition = { x: newX, y: newY, z: newZ, s: newS };
                    sessionStorage.setItem(POS_KEY, JSON.stringify(currentPosition));
                } else if (isVerticalMove) {
                    if (currentRoom && currentRoom.color) {
                        sessionStorage.setItem(AUTOLINK_START_COORD_KEY, currentCoordKey);
                        sessionStorage.setItem(AUTOLINK_COLOR_KEY, currentRoom.color);
                    }
                    const maxSection = Math.max(0, ...Object.values(mapData).map(r => r.s));
                    currentPosition.s = maxSection + 1;
                    currentPosition.x = 0;
                    currentPosition.y = 0;
                    sessionStorage.setItem(POS_KEY, JSON.stringify(currentPosition));
                }
            });
        });
    }

    function processAutoLink() { const startCoordKey = sessionStorage.getItem(AUTOLINK_START_COORD_KEY); const linkColor = sessionStorage.getItem(AUTOLINK_COLOR_KEY); const endCoordKey = getCoordKey(); if (startCoordKey && linkColor && mapData[startCoordKey] && mapData[endCoordKey]) { mapData[startCoordKey].linkTo = endCoordKey; mapData[endCoordKey].linkTo = startCoordKey; mapData[startCoordKey].color = linkColor; mapData[endCoordKey].color = linkColor; if (!mapData[startCoordKey].manualAnnotation) { mapData[startCoordKey].content = 'Conexão'; } if (!mapData[endCoordKey].manualAnnotation) { mapData[endCoordKey].content = 'Conexão'; } console.log(`Auto-link created: ${startCoordKey} <-> ${endCoordKey} with color ${linkColor}`); sessionStorage.removeItem(AUTOLINK_START_COORD_KEY); sessionStorage.removeItem(AUTOLINK_COLOR_KEY); saveMapState(); updateUI(); } }
    function dragElement(elmnt) { let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0; const header = document.getElementById(elmnt.id + "-header"); function dragMouseDown(e) { if (e.target.id === 'qmp-map-name' || e.target.closest('.qmp-header-controls')) { return; } e = e || window.event; e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; } function elementDrag(e) { e = e || window.event; e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px"; } function closeDragElement() { document.onmouseup = null; document.onmousemove = null; GM_setValue(POSITION_KEY, { top: elmnt.style.top, left: elmnt.style.left }); } if (header) { header.onmousedown = dragMouseDown; } }
    function resetMap() { if (confirm("Você tem certeza que deseja apagar o mapa da sessão atual?")) { sessionStorage.clear(); location.reload(); } }
    function annotateCurrentRoom() { const input = document.getElementById('qmp-annotation-input'); const colorSelect = document.getElementById('qmp-color-select'); if (!input || !colorSelect) return; const newAnnotation = input.value.trim(); const newColor = colorSelect.value === 'none' ? null : colorSelect.value; const coordKey = getCoordKey(); if (mapData[coordKey]) { mapData[coordKey].content = newAnnotation; mapData[coordKey].color = newColor; mapData[coordKey].manualAnnotation = true; saveMapState(); updateUI(); } }

    function handleGhostRoomClick(direction) {
        const cdlxDirectionMap = { 'Norte': 'North', 'Sul': 'South', 'Leste': 'East', 'Oeste': 'West', 'Nordeste': 'NorthEast', 'Noroeste': 'NorthWest', 'Sudeste': 'SouthEast', 'Sudoeste': 'SouthWest' };
        const gameDirection = cdlxDirectionMap[direction];
        let link = document.querySelector(`#cdlx-compass g.fe-move[data-dir="${gameDirection}"]`) || document.querySelector(`#dungeon g#${gameDirection}`);
        if (!link) {
            const textLinks = document.querySelectorAll('div.Compass a, div[id*="divCompass"] a');
            for (let i = 0; i < textLinks.length; i++) { if (textLinks[i].textContent.trim() === direction) { link = textLinks[i]; break; } }
        }
        if (link) {
            sessionStorage.setItem(LAST_POS_KEY, JSON.stringify(currentPosition));
            sessionStorage.setItem(LAST_DIR_KEY, direction);
            link.click();
        } else {
            console.warn(`Mapeador de Quests: Não foi possível encontrar o link de navegação para a direção "${direction}".`);
            alert(`Não foi possível simular o clique para a direção ${direction}. Por favor, mova-se manualmente.`);
        }
    }

    // --- LÓGICA DE EXPORTAÇÃO ---
    function drawLegendOnCanvas(ctx, startX, startY, scale, isDark) {
        const legendItems = {};
        for (const room of Object.values(mapData)) { if (room.color && room.content) { const key = `${room.color}-${room.content}`; if (!legendItems[key]) { legendItems[key] = { color: room.color, content: room.content }; } } }
        const sortedItems = Object.values(legendItems).sort((a,b) => a.content.localeCompare(b.content));
        if (sortedItems.length === 0) return;
        const textColor = isDark ? "#dee2e6" : "#212529";
        const itemFontSize = 12 * scale; const boxSize = 12 * scale; const lineSpacing = 6 * scale; const padding = 10 * scale;
        let currentY = startY;
        ctx.font = `${itemFontSize}px Roboto, sans-serif`;
        for (const item of sortedItems) {
            ctx.fillStyle = item.color;
            ctx.fillRect(startX + padding, currentY, boxSize, boxSize);
            ctx.fillStyle = textColor;
            ctx.fillText(item.content, startX + padding + boxSize + (lineSpacing/2), currentY + boxSize * 0.8);
            currentY += boxSize + lineSpacing;
        }
    }

    function downloadFullMapAsPNG() {
        const allRooms = Object.values(mapData);
        if (allRooms.length === 0) {
            alert("Erro: Nenhum mapa para exportar.");
            return;
        }

        const isDark = document.getElementById('qmp-panel')?.classList.contains('dark');
        const C = { BORDER: isDark ? "#495057" : "#dee2e6", ACCENT: isDark ? "#5897fb" : "#0d6efd", BG_SUBTLE: isDark ? "#343a40" : "#ffffff", TEXT: isDark ? "#dee2e6" : "#212529" };
        const padding = 50;
        const floorSpacing = TOTAL_SIZE * 8;
        const legendWidth = 200;

        const zLevels = [...new Set(allRooms.map(r => r.z))].sort((a, b) => a - b);
        const precalculatedLayouts = {};
        let globalMinX = Infinity, globalMaxX = -Infinity;
        let globalMinY = Infinity, globalMaxY = -Infinity;

        let maxWidth = 0;
        const floorWidths = {};
        zLevels.forEach(z => {
            const roomsOnFloor = allRooms.filter(room => room.z === z);
            const sections = {};
            roomsOnFloor.forEach(room => {
                if (!sections[room.s]) sections[room.s] = { minX: room.x, maxX: room.x };
                sections[room.s].minX = Math.min(sections[room.s].minX, room.x);
                sections[room.s].maxX = Math.max(sections[room.s].maxX, room.x);
            });
            let currentOffset = 0;
            Object.keys(sections).sort((a, b) => a - b).forEach(sId => {
                const sectionWidth = (sections[sId].maxX - sections[sId].minX + 1) * TOTAL_SIZE;
                currentOffset += sectionWidth + SECTION_SPACING;
            });
            const floorWidth = currentOffset > 0 ? currentOffset - SECTION_SPACING : ROOM_SIZE;
            floorWidths[z] = floorWidth;
            maxWidth = Math.max(maxWidth, floorWidth);
        });

        let cumulativeY = 0;
        zLevels.forEach(z => {
            const roomsOnFloor = allRooms.filter(room => room.z === z);
            const sections = {};
            roomsOnFloor.forEach(room => {
                if (!sections[room.s]) sections[room.s] = { rooms: [] };
                sections[room.s].rooms.push(room);
            });
            const sectionOffsets = {};
            let currentOffset = 0;
            Object.keys(sections).sort((a, b) => a - b).forEach(sId => {
                const minX = Math.min(...sections[sId].rooms.map(r => r.x));
                const maxX = Math.max(...sections[sId].rooms.map(r => r.x));
                const sectionWidth = (maxX - minX + 1) * TOTAL_SIZE;
                sectionOffsets[sId] = currentOffset;
                currentOffset += sectionWidth + SECTION_SPACING;
            });
            const floorOffsetX = (maxWidth - floorWidths[z]) / 2;
            const minYonFloor = -Math.max(...roomsOnFloor.map(r => r.y)) * TOTAL_SIZE;
            const maxYonFloor = -Math.min(...roomsOnFloor.map(r => r.y)) * TOTAL_SIZE;
            const floorHeight = (maxYonFloor - minYonFloor) + ROOM_SIZE;
            roomsOnFloor.forEach(room => {
                const displayX = (room.x * TOTAL_SIZE) + sectionOffsets[room.s] + floorOffsetX;
                const displayY = (-room.y * TOTAL_SIZE) + cumulativeY;
                precalculatedLayouts[getCoordKey(room)] = { displayX, displayY };
                globalMinX = Math.min(globalMinX, displayX - ROOM_SIZE / 2);
                globalMaxX = Math.max(globalMaxX, displayX + ROOM_SIZE / 2);
                globalMinY = Math.min(globalMinY, displayY - ROOM_SIZE / 2);
                globalMaxY = Math.max(globalMaxY, displayY + ROOM_SIZE / 2);
            });
            cumulativeY += floorHeight + floorSpacing;
        });

        const mapContentWidth = globalMaxX - globalMinX;
        const mapContentHeight = globalMaxY - globalMinY;
        const totalWidth = mapContentWidth + padding * 2 + legendWidth;
        const totalHeight = mapContentHeight + padding * 2;
        const shiftX = -globalMinX + padding;
        const shiftY = -globalMinY + padding;

        const tempSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        tempSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        tempSVG.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
        tempSVG.setAttribute('width', totalWidth);
        tempSVG.setAttribute('height', totalHeight);
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', '100%');
        background.setAttribute('height', '100%');
        background.setAttribute('fill', C.BG_SUBTLE);
        tempSVG.appendChild(background);

        allRooms.forEach(room => {
            const roomLayout = precalculatedLayouts[getCoordKey(room)];
            room.exits.forEach(dir => {
                const move = DIRECTION_MAP[dir];
                const nextRoomPos = { ...room, x: room.x + move.x, y: room.y + move.y };
                const nextRoom = mapData[getCoordKey(nextRoomPos)];
                if (nextRoom && nextRoom.z === room.z && nextRoom.s === room.s) {
                    const nextRoomLayout = precalculatedLayouts[getCoordKey(nextRoom)];
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', roomLayout.displayX + shiftX);
                    line.setAttribute('y1', roomLayout.displayY + shiftY);
                    line.setAttribute('x2', nextRoomLayout.displayX + shiftX);
                    line.setAttribute('y2', nextRoomLayout.displayY + shiftY);
                    line.setAttribute('stroke', C.BORDER);
                    line.setAttribute('stroke-width', '2');
                    tempSVG.appendChild(line);
                }
            });
        });

        const drawnLinks = new Set();
        allRooms.forEach(room => {
            if (room.linkTo) {
                const startKey = getCoordKey(room);
                const endKey = room.linkTo;
                const linkId = [startKey, endKey].sort().join('-');
                if (!drawnLinks.has(linkId) && precalculatedLayouts[startKey] && precalculatedLayouts[endKey]) {
                    const startLayout = precalculatedLayouts[startKey];
                    const endLayout = precalculatedLayouts[endKey];
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startLayout.displayX + shiftX);
                    line.setAttribute('y1', startLayout.displayY + shiftY);
                    line.setAttribute('x2', endLayout.displayX + shiftX);
                    line.setAttribute('y2', endLayout.displayY + shiftY);
                    line.setAttribute('stroke', room.color || C.ACCENT);
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5, 5');
                    tempSVG.appendChild(line);
                    drawnLinks.add(linkId);
                }
            }
        });

        allRooms.forEach(room => {
            const roomLayout = precalculatedLayouts[getCoordKey(room)];
            const isCurrent = getCoordKey(room) === getCoordKey(currentPosition);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', roomLayout.displayX - ROOM_SIZE / 2 + shiftX);
            rect.setAttribute('y', roomLayout.displayY - ROOM_SIZE / 2 + shiftY);
            rect.setAttribute('width', ROOM_SIZE);
            rect.setAttribute('height', ROOM_SIZE);
            rect.setAttribute('fill', room.color || C.BG_SUBTLE);
            const strokeColor = isCurrent ? C.ACCENT : (isDark ? C.BORDER : 'black');
            rect.setAttribute('stroke', strokeColor);
            rect.setAttribute('stroke-width', isCurrent ? '2' : '1.5');
            rect.setAttribute('rx', '4');
            tempSVG.appendChild(rect);
        });

        const serializer = new XMLSerializer();
        const svgString = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(tempSVG);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const scale = 2;
        canvas.width = totalWidth * scale;
        canvas.height = totalHeight * scale;
        ctx.fillStyle = C.BG_SUBTLE;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = function() {
            ctx.drawImage(img, 0, 0, totalWidth * scale, totalHeight * scale);
            URL.revokeObjectURL(url);
            const legendStartX = (mapContentWidth + padding * 2) * scale;
            const legendStartY = padding * scale;
            drawLegendOnCanvas(ctx, legendStartX, legendStartY, scale, isDark);
            const mapName = currentMapName || 'mapa';
            const link = document.createElement('a');
            link.download = `${mapName}_completo.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.onerror = function(e) { console.error("Mapeador de Quests: Erro ao carregar a imagem SVG para o canvas.", e); alert("Ocorreu um erro ao gerar a imagem do mapa."); URL.revokeObjectURL(url); };
        img.src = url;
    }

    function updateUI() {
        drawMap();
        drawLegend();
        const coordKey = getCoordKey();
        const room = mapData[coordKey];
        const input = document.getElementById('qmp-annotation-input');
        const colorSelect = document.getElementById('qmp-color-select');
        if (room && input && colorSelect) {
            input.value = room.content || '';
            colorSelect.value = room.color || 'none';
        } else if (input && colorSelect) {
            input.value = '';
            colorSelect.value = 'none';
        }
    }

    function injectFonts() { document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">`); }

    function createPanel() {
        if (document.getElementById('qmp-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'qmp-panel';
        panel.className = currentTheme;
        if (isMinimized) panel.classList.add('minimized');
        panel.innerHTML = `<div id="qmp-panel-header" class="qmp-panel-header"><div class="qmp-header-title"><h4><i class="fa-solid fa-layer-group"></i> Mapeador:</h4><input type="text" id="qmp-map-name" placeholder="Nome do Mapa..."></div><div class="qmp-header-controls"><button id="qmpThemeToggle" title="Alternar Tema"><i class="fa-solid fa-sun"></i></button><button id="qmpMinimizeToggle" title="Minimizar"><i class="fa-solid fa-window-minimize"></i></button></div></div><div class="qmp-tabs"><button class="qmp-tab-button active" data-tab="map"><i class="fa-solid fa-map"></i> Mapa</button><button class="qmp-tab-button" data-tab="settings"><i class="fa-solid fa-gear"></i> Opções</button></div><div class="qmp-tab-content-wrapper"><div id="tab-map" class="qmp-tab-content active"><div id="qmp-main-view" class="qmp-main-view"><div id="qmp-map-container"><svg id="qmp-map-svg"></svg></div><div id="qmp-legend-container"></div></div><div id="qmp-tooltip"></div><div class="qmp-annotation-area"><select id="qmp-color-select"><option value="none">Nenhuma</option><option value="#e74c3c">Vermelho</option><option value="#3498db">Azul</option><option value="#2ecc71">Verde</option><option value="#f1c40f">Amarelo</option><option value="#9b59b6">Roxo</option><option value="#e67e22">Laranja</option></select><input type="text" id="qmp-annotation-input" placeholder="Anotação para a sala..."><button id="qmp-annotation-btn" title="Anotar sala atual"><i class="fa-solid fa-pencil"></i></button></div></div><div id="tab-settings" class="qmp-tab-content"><div class="qmp-settings-section"><label><i class="fa-solid fa-floppy-disk"></i> Depósito de Mapas</label><button id="save-map-btn" class="qmp-action-button"><i class="fa-solid fa-cloud-arrow-up"></i> Salvar Mapa Atual</button><div id="qmp-saved-maps-list"></div></div><div class="qmp-settings-section"><label><i class="fa-solid fa-map-location-dot"></i> Visualização</label><button id="reset-view-btn" class="qmp-action-button"><i class="fa-solid fa-expand"></i> Resetar Zoom/Posição</button><button id="download-full-map-btn" class="qmp-action-button"><i class="fa-solid fa-download"></i> Baixar Todo o Mapa</button></div><div class="qmp-settings-section"><label><i class="fa-solid fa-trash-can"></i> Gerenciar Sessão</label><button id="reset-map-btn" class="qmp-action-button qmp-danger-button"><i class="fa-solid fa-eraser"></i> Resetar Mapa da Sessão</button></div></div></div>`;
        const savedPosition = GM_getValue(POSITION_KEY, null);
        if (savedPosition && savedPosition.top && savedPosition.left) { panel.style.top = savedPosition.top; panel.style.left = savedPosition.left; }
        document.body.appendChild(panel);
        dragElement(panel);
    }

    function setupPanelListeners() {
        const panel = document.getElementById('qmp-panel');
        const themeToggle = document.getElementById('qmpThemeToggle');
        const minimizeToggle = document.getElementById('qmpMinimizeToggle');
        const tabButtons = document.querySelectorAll('.qmp-tab-button');
        const tabContents = document.querySelectorAll('.qmp-tab-content');
        themeToggle?.addEventListener('click', () => { panel.classList.toggle('dark'); panel.classList.toggle('light'); currentTheme = panel.classList.contains('dark') ? 'dark' : 'light'; GM_setValue(THEME_KEY, currentTheme); updateUI(); });
        minimizeToggle?.addEventListener('click', () => { isMinimized = !isMinimized; panel.classList.toggle('minimized', isMinimized); GM_setValue(MINIMIZED_KEY, isMinimized); });
        tabButtons.forEach(button => { button.addEventListener('click', (e) => { const tabId = e.currentTarget.dataset.tab; tabButtons.forEach(btn => btn.classList.remove('active')); e.currentTarget.classList.add('active'); tabContents.forEach(content => content.classList.toggle('active', content.id === `tab-${tabId}`)); }); });
        document.getElementById('reset-map-btn')?.addEventListener('click', resetMap);
        document.getElementById('qmp-annotation-btn')?.addEventListener('click', annotateCurrentRoom);
        document.getElementById('qmp-annotation-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') annotateCurrentRoom(); });
        document.getElementById('reset-view-btn')?.addEventListener('click', () => drawMap(true));
        document.getElementById('download-full-map-btn')?.addEventListener('click', downloadFullMapAsPNG);
        const mapNameInput = document.getElementById('qmp-map-name');
        if (mapNameInput) { mapNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') { saveMapName(); mapNameInput.blur(); } }); mapNameInput.addEventListener('blur', saveMapName); }
        document.getElementById('save-map-btn')?.addEventListener('click', saveCurrentMapToStorage);
    }

    function showTooltip(content, event) { const tooltip = document.getElementById('qmp-tooltip'); if (!tooltip || !content) return; tooltip.textContent = content; tooltip.style.display = 'block'; const panelRect = document.getElementById('qmp-panel').getBoundingClientRect(); tooltip.style.left = (event.clientX - panelRect.left + 15) + 'px'; tooltip.style.top = (event.clientY - panelRect.top + 10) + 'px'; }
    function hideTooltip() { const tooltip = document.getElementById('qmp-tooltip'); if (tooltip) tooltip.style.display = 'none'; }

    function drawMap(resetView = false) {
        const svg = document.getElementById('qmp-map-svg'); if (!svg) return; svg.innerHTML = '';
        const allRooms = Object.values(mapData);
        const isDark = document.getElementById('qmp-panel')?.classList.contains('dark');
        const C = { BORDER: isDark ? "#495057" : "#dee2e6", ACCENT: isDark ? "#5897fb" : "#0d6efd", BG_SUBTLE: isDark ? "#343a40" : "#ffffff", TEXT_SECONDARY: isDark ? "#adb5bd" : "#6c757d", TEXT: isDark ? "#dee2e6" : "#212529", ICON_LIGHT: "#f8f9fa" };

        const roomDisplayCoords = {};

        if (allRooms.length === 0) {
            const initialVb = { x: -25, y: -25, width: 50, height: 50 }; currentViewBox = initialVb; applyViewBox();
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); rect.setAttribute('x', -ROOM_SIZE / 2); rect.setAttribute('y', -ROOM_SIZE / 2); rect.setAttribute('width', ROOM_SIZE); rect.setAttribute('height', ROOM_SIZE); rect.setAttribute('fill', C.BG_SUBTLE); rect.setAttribute('stroke', C.ACCENT); rect.setAttribute('stroke-width', '2'); rect.setAttribute('rx', '4'); svg.appendChild(rect);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', ICON_MAP.current); path.setAttribute('fill', C.ACCENT); path.setAttribute('transform', 'translate(-6, -6)'); path.setAttribute('class', 'qmp-map-icon qmp-icon-current'); svg.appendChild(path);
            return;
        }

        const zLevels = [...new Set(allRooms.map(r => r.z))].sort((a, b) => a - b);
        let maxWidth = 0;
        const floorLayouts = [];
        const floorSpacing = TOTAL_SIZE * 8;

        zLevels.forEach(z => {
            const roomsOnFloor = allRooms.filter(room => room.z === z);
            const sections = {};
            roomsOnFloor.forEach(room => {
                if (!sections[room.s]) sections[room.s] = { minX: room.x, maxX: room.x };
                sections[room.s].minX = Math.min(sections[room.s].minX, room.x);
                sections[room.s].maxX = Math.max(sections[room.s].maxX, room.x);
            });
            const sectionOffsets = {};
            let currentOffset = 0;
            Object.keys(sections).sort((a,b) => a-b).forEach(sId => {
                sectionOffsets[sId] = currentOffset;
                const sectionWidth = (sections[sId].maxX - sections[sId].minX + 1) * TOTAL_SIZE;
                currentOffset += sectionWidth + SECTION_SPACING;
            });

            const floorWidth = currentOffset > 0 ? currentOffset - SECTION_SPACING + ROOM_SIZE : ROOM_SIZE;
            const minY = -Math.max(...roomsOnFloor.map(r => r.y)) * TOTAL_SIZE;
            const maxY = -Math.min(...roomsOnFloor.map(r => r.y)) * TOTAL_SIZE;
            const floorHeight = (maxY - minY) + ROOM_SIZE;

            maxWidth = Math.max(maxWidth, floorWidth);
            floorLayouts.push({ z, rooms: roomsOnFloor, sectionOffsets, minY, floorHeight });
        });

        if (resetView) { sessionStorage.removeItem(VIEWBOX_KEY); currentViewBox = { width: 0 }; }

        let cumulativeY = 20;
        floorLayouts.forEach(layout => {
            layout.yOffset = cumulativeY;
            cumulativeY += layout.floorHeight + floorSpacing;
        });
        const totalHeight = cumulativeY - floorSpacing;

        const mapContentBounds = { minX: 0, minY: 0, width: maxWidth, height: totalHeight };

        if (currentViewBox.width === 0) {
            const padding = 20;
            currentViewBox = { x: mapContentBounds.minX - padding, y: mapContentBounds.minY - padding, width: mapContentBounds.width + padding * 2, height: mapContentBounds.height + padding * 2 };
            saveViewBoxState();
        }
        applyViewBox();

        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgRect.setAttribute('x', mapContentBounds.minX);
        bgRect.setAttribute('y', mapContentBounds.minY);
        bgRect.setAttribute('width', mapContentBounds.width);
        bgRect.setAttribute('height', mapContentBounds.height);
        bgRect.setAttribute('fill', C.BG_SUBTLE);
        svg.appendChild(bgRect);

        const linkLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svg.appendChild(linkLayer);

        floorLayouts.forEach(({ z, rooms, sectionOffsets, yOffset }) => {
            let floorWidth = 0;
            if(Object.keys(sectionOffsets).length > 0) {
                const lastSectionId = Object.keys(sectionOffsets).sort((a,b)=>a-b).pop();
                const lastSection = rooms.filter(r => r.s == lastSectionId);
                if (lastSection.length > 0) {
                    const maxX = Math.max(...lastSection.map(r => r.x));
                    const minX = Math.min(...lastSection.map(r => r.x));
                    floorWidth = sectionOffsets[lastSectionId] + (maxX - minX + 1) * TOTAL_SIZE - SPACING;
                }
            }
            const floorOffsetX = (maxWidth - floorWidth) / 2;

            rooms.forEach(room => {
                const offsetX = sectionOffsets[room.s] + floorOffsetX;
                const roomDisplayX = room.x * TOTAL_SIZE + offsetX;
                const roomDisplayY = -room.y * TOTAL_SIZE + yOffset;

                roomDisplayCoords[getCoordKey(room)] = { x: roomDisplayX, y: roomDisplayY };

                room.exits.forEach(dir => {
                    const move = DIRECTION_MAP[dir];
                    const nextRoom = move ? mapData[getCoordKey({ ...room, x: room.x + move.x, y: room.y + move.y })] : null;
                    if (nextRoom && nextRoom.z === z && nextRoom.s === room.s) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', roomDisplayX);
                        line.setAttribute('y1', roomDisplayY);
                        line.setAttribute('x2', (nextRoom.x * TOTAL_SIZE) + sectionOffsets[nextRoom.s] + floorOffsetX);
                        line.setAttribute('y2', (-nextRoom.y * TOTAL_SIZE) + yOffset);
                        line.setAttribute('stroke', C.BORDER);
                        line.setAttribute('stroke-width', '2');
                        linkLayer.appendChild(line);
                    }
                });
            });

            rooms.forEach(room => {
                const offsetX = sectionOffsets[room.s] + floorOffsetX;
                const roomDisplayX = room.x * TOTAL_SIZE + offsetX;
                const roomDisplayY = -room.y * TOTAL_SIZE + yOffset;
                const isCurrent = getCoordKey(room) === getCoordKey(currentPosition);

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', roomDisplayX - ROOM_SIZE / 2);
                rect.setAttribute('y', roomDisplayY - ROOM_SIZE / 2);
                rect.setAttribute('width', ROOM_SIZE);
                rect.setAttribute('height', ROOM_SIZE);
                rect.setAttribute('fill', room.color || C.BG_SUBTLE);
                rect.setAttribute('stroke', isCurrent ? C.ACCENT : C.BORDER);
                rect.setAttribute('stroke-width', isCurrent ? '2' : '1.5');
                rect.setAttribute('rx', '4');
                const tooltipContent = room.linkTo ? `${room.content || `Sala (${room.x},${room.y},${room.s})`}\nConectado a: ${room.linkTo}` : room.content || `Sala (${room.x},${room.y},${room.s})`;
                rect.dataset.content = tooltipContent;
                rect.addEventListener('mouseenter', (e) => showTooltip(rect.dataset.content, e));
                rect.addEventListener('mousemove', (e) => showTooltip(rect.dataset.content, e));
                rect.addEventListener('mouseleave', hideTooltip);
                rect.addEventListener('mousedown', (e) => {
                    if (e.altKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        isDraggingSection = true;
                        draggedSectionInfo = { z: room.z, s: room.s };
                        const svgPoint = svg.createSVGPoint();
                        svgPoint.x = e.clientX;
                        svgPoint.y = e.clientY;
                        dragStartSVGPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
                        document.addEventListener('mouseup', handleSectionDragEnd, { once: true });
                    }
                });
                rect.style.cursor = 'pointer';
                svg.appendChild(rect);

                if (isCurrent) {
                    room.exits.forEach(dir => {
                        const move = DIRECTION_MAP[dir];
                        const nextPos = { x: room.x + move.x, y: room.y + move.y, z: room.z, s: room.s };
                        const nextKey = getCoordKey(nextPos);
                        if (!mapData[nextKey]) {
                            const ghostX = nextPos.x * TOTAL_SIZE + offsetX;
                            const ghostY = -nextPos.y * TOTAL_SIZE + yOffset;
                            const ghostRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            ghostRect.setAttribute('x', ghostX - ROOM_SIZE / 2); ghostRect.setAttribute('y', ghostY - ROOM_SIZE / 2);
                            ghostRect.setAttribute('width', ROOM_SIZE); ghostRect.setAttribute('height', ROOM_SIZE); ghostRect.setAttribute('fill', 'transparent'); ghostRect.setAttribute('stroke', C.ACCENT);
                            ghostRect.setAttribute('stroke-width', '1.5'); ghostRect.setAttribute('stroke-dasharray', '4 2'); ghostRect.setAttribute('rx', '4');
                            ghostRect.classList.add('qmp-ghost-room'); ghostRect.dataset.direction = dir; ghostRect.addEventListener('click', () => handleGhostRoomClick(dir)); svg.appendChild(ghostRect);
                        }
                    });
                }
                let iconPath = null; let iconColor = room.color ? C.ICON_LIGHT : C.TEXT;
                if (isCurrent) { iconPath = ICON_MAP.current; iconColor = C.ACCENT; } else if (ICON_MAP[room.content]) { iconPath = ICON_MAP[room.content]; }
                if (iconPath) { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${roomDisplayX - 6}, ${roomDisplayY - 6})`); const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', iconPath); path.setAttribute('fill', iconColor); path.setAttribute('class', `qmp-map-icon`); g.appendChild(path); svg.appendChild(g); }
                if (room.linkTo) { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${roomDisplayX + ROOM_SIZE / 3 - 5}, ${roomDisplayY - ROOM_SIZE / 3 - 5})`); const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', ICON_MAP.link); path.setAttribute('fill', C.ACCENT); path.setAttribute('class', 'qmp-map-icon qmp-icon-link'); g.appendChild(path); svg.appendChild(g); }
            });
        });

        const drawnLinks = new Set();
        allRooms.forEach(room => {
            if (room.linkTo) {
                const startKey = getCoordKey(room);
                const endKey = room.linkTo;
                const linkId = [startKey, endKey].sort().join('-');

                if (!drawnLinks.has(linkId) && roomDisplayCoords[startKey] && roomDisplayCoords[endKey]) {
                    const startCoords = roomDisplayCoords[startKey];
                    const endCoords = roomDisplayCoords[endKey];

                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', startCoords.x);
                    line.setAttribute('y1', startCoords.y);
                    line.setAttribute('x2', endCoords.x);
                    line.setAttribute('y2', endCoords.y);
                    line.setAttribute('stroke', room.color || C.ACCENT);
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5, 5');
                    linkLayer.appendChild(line);

                    drawnLinks.add(linkId);
                }
            }
        });
    }

    function handleSectionDragEnd(e) {
        if (!isDraggingSection) return;

        const svg = document.getElementById('qmp-map-svg');
        const endSVGPoint = svg.createSVGPoint();
        endSVGPoint.x = e.clientX;
        endSVGPoint.y = e.clientY;
        const finalSVGPoint = endSVGPoint.matrixTransform(svg.getScreenCTM().inverse());
        const dx = finalSVGPoint.x - dragStartSVGPoint.x;
        const dy = finalSVGPoint.y - dragStartSVGPoint.y;
        const deltaX = Math.round(dx / TOTAL_SIZE);
        const deltaY = Math.round(-dy / TOTAL_SIZE);

        if (deltaX === 0 && deltaY === 0) {
            isDraggingSection = false;
            draggedSectionInfo = null;
            dragStartSVGPoint = null;
            return;
        }

        const newMapData = {};
        const keyTranslationMap = {};

        for (const oldKey in mapData) {
            const room = mapData[oldKey];
            const wasDragged = room.z === draggedSectionInfo.z && room.s === draggedSectionInfo.s;

            if (wasDragged) {
                const newRoom = { ...room, x: room.x + deltaX, y: room.y + deltaY };
                const newKey = getCoordKey(newRoom);
                newMapData[newKey] = newRoom;
                keyTranslationMap[oldKey] = newKey;
            } else {
                newMapData[oldKey] = { ...room };
                keyTranslationMap[oldKey] = oldKey;
            }
        }

        for (const key in newMapData) {
            const room = newMapData[key];
            if (room.linkTo && keyTranslationMap[room.linkTo]) {
                room.linkTo = keyTranslationMap[room.linkTo];
            }
        }

        mapData = newMapData;
        if (currentPosition.z === draggedSectionInfo.z && currentPosition.s === draggedSectionInfo.s) {
            currentPosition.x += deltaX;
            currentPosition.y += deltaY;
        }

        saveMapState();
        isDraggingSection = false;
        draggedSectionInfo = null;
        dragStartSVGPoint = null;
        drawMap();
    }

    function applyViewBox() { const svg = document.getElementById('qmp-map-svg'); if (svg) { svg.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`); } }

    function setupMapInteractivity() {
        const mapContainer = document.getElementById('qmp-map-container');
        const svg = document.getElementById('qmp-map-svg');
        if (!mapContainer || !svg) return;
        mapContainer.addEventListener('mousedown', (e) => { if (e.altKey || e.button !== 0) return; isPanning = true; startPoint = { x: e.clientX, y: e.clientY }; mapContainer.style.cursor = 'grabbing'; });
        mapContainer.addEventListener('mousemove', (e) => {
            if (isPanning) {
                e.preventDefault();
                const endPoint = { x: e.clientX, y: e.clientY };
                const dx = (endPoint.x - startPoint.x) * (currentViewBox.width / mapContainer.clientWidth);
                const dy = (endPoint.y - startPoint.y) * (currentViewBox.height / mapContainer.clientHeight);
                currentViewBox.x -= dx;
                currentViewBox.y -= dy;
                applyViewBox();
                startPoint = endPoint;
            }
        });
        const stopPanning = () => { if (isPanning) { isPanning = false; mapContainer.style.cursor = 'grab'; saveViewBoxState(); } };
        mapContainer.addEventListener('mouseup', stopPanning);
        mapContainer.addEventListener('mouseleave', stopPanning);
        mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = 1.1; const direction = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
            const mousePoint = { x: e.clientX, y: e.clientY }; const svgPoint = svg.createSVGPoint(); svgPoint.x = mousePoint.x; svgPoint.y = mousePoint.y;
            const pointInSVG = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
            const newWidth = currentViewBox.width * direction; const newHeight = currentViewBox.height * direction;
            currentViewBox.x = pointInSVG.x - (pointInSVG.x - currentViewBox.x) * direction;
            currentViewBox.y = pointInSVG.y - (pointInSVG.y - currentViewBox.y) * direction;
            currentViewBox.width = newWidth; currentViewBox.height = newHeight;
            applyViewBox(); saveViewBoxState();
        }, { passive: false });
    }

    function drawLegend() { const legendContainer = document.getElementById('qmp-legend-container'); if (!legendContainer) return; legendContainer.innerHTML = ''; const legendItems = {}; for (const room of Object.values(mapData)) { if (room.color && room.content) { const key = `${room.color}-${room.content}`; if (!legendItems[key]) { legendItems[key] = { color: room.color, content: room.content }; } } } for (const item of Object.values(legendItems).sort((a,b) => a.content.localeCompare(b.content))) { const itemDiv = document.createElement('div'); itemDiv.className = 'qmp-legend-item'; const colorBox = document.createElement('span'); colorBox.className = 'qmp-legend-color-box'; colorBox.style.backgroundColor = item.color; const textSpan = document.createElement('span'); textSpan.className = 'qmp-legend-text'; textSpan.textContent = item.content; itemDiv.appendChild(colorBox); itemDiv.appendChild(textSpan); legendContainer.appendChild(itemDiv); } }
    function addStyles() { GM_addStyle(`:root { --qmp-font-family: 'Roboto', sans-serif; --qmp-shadow-color: rgba(0, 0, 0, 0.15); --qmp-accent-color: #4dabf7; } #qmp-panel.light { --qmp-bg-color: #f8f9fa; --qmp-text-color: #212529; --qmp-text-color-secondary: #6c757d; --qmp-border-color: #dee2e6; --qmp-subtle-bg: #ffffff; --qmp-tab-hover-bg: #e9ecef; --qmp-input-bg: #fff; --qmp-accent-color: #1971c2; } #qmp-panel.dark { --qmp-bg-color: #212529; --qmp-text-color: #dee2e6; --qmp-text-color-secondary: #adb5bd; --qmp-border-color: #495057; --qmp-subtle-bg: #343a40; --qmp-tab-hover-bg: #495057; --qmp-shadow-color: rgba(0, 0, 0, 0.4); --qmp-input-bg: #495057; } #qmp-panel { position: fixed; top: 20px; right: 20px; background-color: var(--qmp-bg-color); border: 1px solid var(--qmp-border-color); z-index: 10001; width: 400px; font-family: var(--qmp-font-family); font-size: 12px; color: var(--qmp-text-color); box-shadow: 0 4px 12px var(--qmp-shadow-color); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; } #qmp-panel i.fa-solid { margin-right: 6px; } .qmp-panel-header { background-color: var(--qmp-subtle-bg); border-bottom: 1px solid var(--qmp-border-color); padding: 8px 12px; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; } .qmp-header-title { display: flex; align-items: center; gap: 8px; flex-grow: 1; min-width: 0; } #qmp-map-name { background: transparent; border: none; color: var(--qmp-text-color); font-size: 16px; font-weight: 700; padding: 2px 4px; border-radius: 4px; flex-grow: 1; max-width: 180px; } #qmp-map-name:focus { background: var(--qmp-bg-color); outline: 1px solid var(--qmp-accent-color); } #qmp-map-name::placeholder { color: var(--qmp-text-color-secondary); font-weight: normal; } .qmp-panel-header h4 { margin: 0; font-size: 16px; font-weight: 700; white-space: nowrap; } .qmp-header-controls { display: flex; gap: 8px; } .qmp-header-controls button { background: none; border: none; color: var(--qmp-text-color-secondary); cursor: pointer; font-size: 14px; padding: 0; } #qmp-panel.minimized .qmp-tabs, #qmp-panel.minimized .qmp-tab-content-wrapper { display: none; } #qmp-panel.minimized { height: auto !important; } .qmp-tabs { display: flex; border-bottom: 1px solid var(--qmp-border-color); } .qmp-tab-button { flex: 1; padding: 10px 5px; border: none; background: transparent; color: var(--qmp-text-color-secondary); cursor: pointer; font-size: 12px; transition: all 0.25s ease; border-bottom: 3px solid transparent; } .qmp-tab-button:hover { background: var(--qmp-tab-hover-bg); } .qmp-tab-button.active { color: var(--qmp-accent-color); border-bottom-color: var(--qmp-accent-color); font-weight: 700; } .qmp-tab-content-wrapper { padding: 12px; overflow-y: auto; } .qmp-tab-content { display: none; } .qmp-tab-content.active { display: block; } #qmp-main-view { display: flex; height: 300px; border: 1px solid var(--qmp-border-color); border-radius: 5px; margin-top: 8px; } #qmp-map-container { flex-grow: 1; height: 100%; overflow: hidden; cursor: grab; background-color: var(--qmp-subtle-bg); } #qmp-map-container:active { cursor: grabbing; } #qmp-legend-container { flex-basis: 120px; flex-shrink: 0; height: 100%; overflow-y: auto; padding: 8px; font-size: 11px; background-color: var(--qmp-subtle-bg); box-sizing: border-box; } .qmp-legend-item { display: flex; align-items: center; margin-bottom: 4px; } .qmp-legend-color-box { width: 12px; height: 12px; border: 1px solid var(--qmp-text-color-secondary); margin-right: 6px; flex-shrink: 0; } .qmp-legend-text { word-break: break-all; } #qmp-map-svg { display: block; width: 100%; height: 100%; } #qmp-tooltip { position: absolute; display: none; background-color: var(--qmp-subtle-bg); color: var(--qmp-text-color); border: 1px solid var(--qmp-border-color); padding: 5px 8px; border-radius: 4px; font-size: 12px; z-index: 10002; max-width: 150px; pointer-events: none; white-space: pre-wrap; } .qmp-annotation-area { display: flex; margin-top: 10px; gap: 4px; align-items: center; } #qmp-color-select { padding: 8px 4px; border: 1px solid var(--qmp-border-color); background-color: var(--qmp-input-bg); color: var(--qmp-text-color); border-radius: 5px; } #qmp-annotation-input { flex-grow: 1; min-width: 50px; padding: 8px; border: 1px solid var(--qmp-border-color); background-color: var(--qmp-input-bg); color: var(--qmp-text-color); border-radius: 5px; } #qmp-annotation-btn { padding: 8px; background-color: var(--qmp-accent-color); color: white; border: none; border-radius: 5px; cursor: pointer; flex-shrink: 0; } #qmp-annotation-btn:hover { background-color: #0b5ed7; } #qmp-annotation-btn i { margin: 0; } .qmp-action-button { width: 100%; padding: 10px; background-color: var(--qmp-accent-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 700; transition: background-color 0.2s; } .qmp-action-button:hover { background-color: #0b5ed7; } .qmp-danger-button { background-color: #dc3545; } .qmp-danger-button:hover { background-color: #c82333; } #tab-settings label { display: block; margin-bottom: 6px; font-weight: 700; } .qmp-settings-section { margin-bottom: 16px; } .qmp-map-icon { fill: currentColor; pointer-events: none; } #qmp-saved-maps-list { border: 1px solid var(--qmp-border-color); border-radius: 4px; margin-top: 8px; max-height: 150px; overflow-y: auto; background-color: var(--qmp-bg-color); } .qmp-no-maps-message { padding: 10px; color: var(--qmp-text-color-secondary); font-style: italic; display: block; text-align: center; } .qmp-saved-map-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid var(--qmp-border-color); } .qmp-saved-map-item:last-child { border-bottom: none; } .qmp-saved-map-name { cursor: pointer; font-weight: 700; flex-grow: 1; transition: color 0.2s; } .qmp-saved-map-name:hover { color: var(--qmp-accent-color); } .qmp-delete-map-btn { background: none; border: none; color: #dc3545; cursor: pointer; padding: 2px 4px; font-size: 14px; flex-shrink: 0; } .qmp-delete-map-btn i { margin: 0; } .qmp-delete-map-btn:hover { color: #c82333; } .qmp-ghost-room { cursor: pointer; opacity: 0.6; transition: opacity 0.2s ease, fill 0.2s ease; } .qmp-ghost-room:hover { opacity: 1; fill: rgba(77, 171, 247, 0.2); }`); }

    function initializeScript() {
        console.log("Mapeador de Quests: Elementos do jogo detectados. Iniciando script.");
        injectFonts();
        addStyles();
        createPanel();
        setupPanelListeners();
        initializeMap();
        reconcilePositionAfterMove();
        initializeViewBox();
        updateMapAndDraw();
        processAutoLink();
        setupMovementHooks();
        setupMapInteractivity();
        drawSavedMapsList();
    }

    function waitForGameElements() {
        const essentialSelectors = ['#cdlx-compass', '#dungeon', 'div.Compass', 'div[id*="divCompass"]'];
        const areElementsReady = () => essentialSelectors.some(selector => document.querySelector(selector));

        if (areElementsReady()) {
            initializeScript();
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            if (areElementsReady()) {
                obs.disconnect();
                initializeScript();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    window.addEventListener('load', waitForGameElements);

})();