// ==UserScript==
// @name         WME Placas de Velocidade RJ
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Exibe placas de velocidade diretamente no mapa do editor conforme coordenadas obtidas na planilha CSV.
// @author       T0NINI
// @include      https://www.waze.com/*/editor*
// @include      https://www.waze.com/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552818/WME%20Placas%20de%20Velocidade%20RJ.user.js
// @updateURL https://update.greasyfork.org/scripts/552818/WME%20Placas%20de%20Velocidade%20RJ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = 'WME Placas de Velocidade RJ';
    const DEBUG = true;

    let todasAsPlacas = [];
    let codigosUnicos = [];
    let mapLayer = null;

    let ui_placasToggle, ui_codigoSeletor, ui_painelInfo;

    const logDebug = (msg) => DEBUG && console.log(`[${SCRIPT_NAME}] ${msg}`);

    /* ---------------------- PARSER CSV ---------------------- */
    function parseCSVRespectingQuotes(text) {
        const rows = []; let cur = ''; let row = []; let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i]; const next = text[i + 1];
            if (ch === '"') {
                if (inQuotes && next === '"') { cur += '"'; i++; continue; }
                inQuotes = !inQuotes; continue;
            }
            if (!inQuotes && (ch === '\n' || ch === '\r')) {
                if (ch === '\r' && next === '\n') i++;
                row.push(cur); rows.push(row); cur = ''; row = []; continue;
            }
            if (!inQuotes && ch === ',') {
                row.push(cur); cur = ''; continue;
            }
            cur += ch;
        }
        if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
        return rows;
    }

    /* ---------------------- PROCESSAMENTO CSV ---------------------- */
    function processarCSV(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        logDebug("Processando CSV...");
        const reader = new FileReader();
        reader.onload = function(e) {
            let text = e.target.result || "";
            text = text.replace(/^\uFEFF/, '');
            const rows = parseCSVRespectingQuotes(text);
            if (!rows || rows.length === 0) {
                todasAsPlacas = [];
                atualizarPainel(0,0);
                return;
            }
            const header = rows[0].map(h => (h || '').trim().toLowerCase());
            const idxCodigo = header.indexOf('código');
            const idxValor  = header.indexOf('valor');
            const idxX = header.indexOf('x');
            const idxY = header.indexOf('y');
            const colCodigo = idxCodigo >= 0 ? idxCodigo : 0;
            const colValor = idxValor >= 0 ? idxValor : 1;
            const colX = idxX >= 0 ? idxX : 2;
            const colY = idxY >= 0 ? idxY : 3;
            const placas = [];
            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i];
                if (!cols || cols.length <= Math.max(colX, colY, colValor, colCodigo)) continue;
                let scod = (cols[colCodigo] || 'null').trim().replace(/["]/g,'');
                let sval = (cols[colValor] || '').trim().replace(/["]/g,'');
                let sx = (cols[colX] || '').trim().replace(/["]/g,'');
                let sy = (cols[colY] || '').trim().replace(/["]/g,'');
                if (!sx || !sy) continue;
                sx = sx.replace(',', '.');
                sy = sy.replace(',', '.');
                const lon = parseFloat(sx);
                const lat = parseFloat(sy);
                const speed = sval ? parseInt(sval.replace(',', '.'), 10) : null;
                if (isFinite(lon) && isFinite(lat)) {
                    placas.push({ lon: lon, lat: lat, speed: isNaN(speed) ? null : speed, codigo: scod });
                }
            }
            todasAsPlacas = placas;
            codigosUnicos = [...new Set(todasAsPlacas.map(p => p.codigo))].sort();
            atualizarSeletorDeCodigo();
            solicitarAtualizacaoPlacas();
            logDebug(`${todasAsPlacas.length} placas carregadas.`);
        };
        reader.readAsText(file, 'utf-8');
    }

    /* ---------------------- DESENHO ---------------------- */
    function desenharPlacasNaTela() {
        if (!mapLayer || !ui_placasToggle || !ui_codigoSeletor) return;
        mapLayer.setVisibility(ui_placasToggle.checked);
        if (todasAsPlacas.length === 0 || !ui_placasToggle.checked) {
            mapLayer.destroyFeatures();
            atualizarPainel(0,0);
            return;
        }
        mapLayer.destroyFeatures();
        const codigoSelecionado = ui_codigoSeletor.value;
        const placasFiltradas = todasAsPlacas.filter(p => codigoSelecionado === 'todas' || p.codigo === codigoSelecionado);
        const mapBounds = W.map.getExtent().clone().transform(W.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
        const features = [];
        for (const placa of placasFiltradas) {
            if (placa.lon >= mapBounds.left && placa.lon <= mapBounds.right &&
                placa.lat >= mapBounds.bottom && placa.lat <= mapBounds.top) {
                const ponto = new OpenLayers.Geometry.Point(placa.lon, placa.lat)
                    .transform(new OpenLayers.Projection("EPSG:4326"), W.map.getProjectionObject());
                features.push(new OpenLayers.Feature.Vector(ponto, { speed: placa.speed }));
            }
        }
        if (features.length > 0) mapLayer.addFeatures(features);
        atualizarPainel(placasFiltradas.length, features.length);
    }

    /* ---------------------- UI ---------------------- */
    function criarPainel() {
        const observer = new MutationObserver(() => {
            const abaNav = document.querySelector('#user-info .nav-tabs');
            const abaContent = document.querySelector('#user-info .tab-content');
            if (abaNav && abaContent) {
                observer.disconnect();
                if (document.getElementById('pane-placas-velocidade')) return;

                const tabLi = document.createElement('li');
                tabLi.innerHTML = '<a href="#pane-placas-velocidade" data-toggle="tab">Placas RJ</a>';
                abaNav.appendChild(tabLi);

                const contentDiv = document.createElement('div');
                contentDiv.id = 'pane-placas-velocidade';
                contentDiv.className = 'tab-pane';
                contentDiv.style.padding = '15px';
                contentDiv.innerHTML = `
                    <style>
                        #pane-placas-velocidade .w-100 { width: 100%; }
                        #pane-placas-velocidade .control-group { margin-bottom: 20px; }
                        #pane-placas-velocidade .hotkey-group { border-top: 1px solid #eee; padding-top: 15px; }
                        #placas-hotkey-input { cursor: pointer; text-align: center; border-radius: 50px !important; }
                        .script-title-container { text-align: left; margin-bottom: 20px; }
                        .script-title-container h4 { margin: 0; font-size: 28px; font-weight: 500; color: #333; }
                        .script-title-container h4 + h4 { font-size: 22px; font-weight: 500; }
                        .btn-primary { display: flex; align-items: center; justify-content: center; background-color: #008CFF; color: white; border: none; border-radius: 50px; font-weight: 400; font-size: 13px; padding: 10px 0; transition: background-color 0.2s ease; text-decoration: none; cursor: pointer; }
                        .btn-primary:hover { background-color: #0073cc; text-decoration: none; color: white; }
                        #csv-file-name { text-align: center; font-size: 12px; margin-top: 5px; font-style: italic; color: #888; }
                        .filter-group label, .hotkey-group label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: bold; }
                        #seletor-codigo-placas { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; }
                        .checkbox-group label { display: flex; align-items: center; cursor: pointer; font-size: 14px; padding: 5px 0; }
                        .checkbox-group input[type="checkbox"] { margin-right: 8px; width: 16px; height: 16px; }
                        #painel-info-placas { margin-top: 20px; font-size: 14px; color: #44cc35; text-align: center; }
                    </style>
                    <div class="script-title-container">
                        <h4>Placas de Velocidade</h4>
                        <h4>Rio de Janeiro</h4>
                    </div>
                    <div class="control-group">
                        <input type="file" id="input-csv-placas" accept=".csv" style="display:none;">
                        <label for="input-csv-placas" class="btn-primary w-100">Carregar Arquivo CSV</label>
                        <p id="csv-file-name">Nenhum arquivo selecionado</p>
                    </div>
                    <div class="control-group filter-group">
                        <label for="seletor-codigo-placas">Filtrar por código da placa:</label>
                        <select id="seletor-codigo-placas"><option value="todas">Carregue um arquivo...</option></select>
                    </div>
                    <div class="control-group checkbox-group">
                        <label><input type="checkbox" id="placas-velocidade-toggle-visibility" checked> Mostrar placas no mapa</label>
                    </div>
                    <div class="control-group hotkey-group">
                        <label for="placas-hotkey-input">Atalho para Mostrar/Ocultar as placas</label>
                        <input type="text" id="placas-hotkey-input" class="form-control" placeholder="Definir atalho" readonly>
                        <p style="font-size: 11px; color: #888; margin-top: 10px;">Clique na caixa acima e pressione a tecla ou combinação desejada. O padrão é <b>Tab</b>.</p>
                    </div>
                    <div id="painel-info-placas">0 placas carregadas</div>
                `;
                abaContent.appendChild(contentDiv);

                ui_placasToggle = document.getElementById('placas-velocidade-toggle-visibility');
                ui_codigoSeletor = document.getElementById('seletor-codigo-placas');
                ui_painelInfo = document.getElementById('painel-info-placas');

                const fileInput = document.getElementById('input-csv-placas');
                const fileNameDisplay = document.getElementById('csv-file-name');

                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files && event.target.files[0];
                    fileNameDisplay.textContent = file ? file.name : 'Nenhum arquivo selecionado';
                    processarCSV(event);
                });

                ui_placasToggle.addEventListener('change', desenharPlacasNaTela);
                ui_codigoSeletor.addEventListener('change', desenharPlacasNaTela);

                initializeHotkeyControls();

                logDebug("Aba e hotkey inicializadas.");
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ---------------------- AUXILIARES ---------------------- */
    function atualizarSeletorDeCodigo() {
        if (!ui_codigoSeletor) return;
        ui_codigoSeletor.innerHTML = '<option value="todas">Todas</option>';
        codigosUnicos.forEach(codigo => {
            const option = document.createElement('option');
            option.value = codigo;
            option.textContent = codigo;
            ui_codigoSeletor.appendChild(option);
        });
        ui_codigoSeletor.value = 'todas';
    }

    function atualizarPainel(total, visiveis) {
        if (!ui_painelInfo || !ui_codigoSeletor) return;
        const codigoSelecionado = ui_codigoSeletor.value;
        if (codigoSelecionado === 'todas') {
            ui_painelInfo.textContent = `${total} placas carregadas (${visiveis || 0} visíveis na tela)`;
        } else {
            ui_painelInfo.textContent = `${total} placas ${codigoSelecionado} carregadas (${visiveis || 0} visíveis na tela)`;
        }
    }

    /* ---------------------- HOTKEY ---------------------- */
    function toggleLayerVisibility() {
        if (mapLayer && ui_placasToggle) {
            const isVisible = mapLayer.getVisibility();
            mapLayer.setVisibility(!isVisible);
            ui_placasToggle.checked = !isVisible;
        }
    }

    function initializeHotkeyControls() {
        const hotkeyInput = document.getElementById('placas-hotkey-input');
        if (!hotkeyInput) return;

        const storageKey = 'WME_PLACAS_HOTKEY';
        const defaultHotkey = 'Tab';
        hotkeyInput.value = localStorage.getItem(storageKey) || defaultHotkey;

        hotkeyInput.addEventListener('keydown', (event) => {
            event.preventDefault();
            const hotkeyString = [
                event.ctrlKey && 'Ctrl',
                event.altKey && 'Alt',
                event.shiftKey && 'Shift',
                !['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)
                    && (event.key === ' ' ? 'Space' : event.key.charAt(0).toUpperCase() + event.key.slice(1))
            ].filter(Boolean).join(' + ');
            if (hotkeyString) {
                hotkeyInput.value = hotkeyString;
                localStorage.setItem(storageKey, hotkeyString);
            }
        });

        document.addEventListener('keydown', (event) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;

            const targetHotkey = localStorage.getItem(storageKey) || defaultHotkey;
            const currentPress = [
                event.ctrlKey && 'Ctrl',
                event.altKey && 'Alt',
                event.shiftKey && 'Shift',
                !['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)
                    && (event.key === ' ' ? 'Space' : event.key.charAt(0).toUpperCase() + event.key.slice(1))
            ].filter(Boolean).join(' + ');

            if (currentPress && currentPress === targetHotkey) {
                event.preventDefault();
                toggleLayerVisibility();
            }
        });
    }

    /* ---------------------- MAPA ---------------------- */
    function criarLayers() {
        if (mapLayer) return;
        mapLayer = new OpenLayers.Layer.Vector("Placas de Velocidade", {
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    graphicName: 'circle', pointRadius: 13, fillColor: '#FFFFFF', fillOpacity: 1,
                    strokeColor: '#D90000', strokeWidth: 3, strokeOpacity: 1, label: "${speed}",
                    fontColor: "#000000", fontSize: "12px",
                })
            })
        });
        W.map.addLayer(mapLayer);
    }

    function configurarListeners() {
        W.map.events.register("moveend", null, solicitarAtualizacaoPlacas);
        W.map.events.register("zoomend", null, solicitarAtualizacaoPlacas);
    }

    function solicitarAtualizacaoPlacas() {
        setTimeout(desenharPlacasNaTela, 300);
    }

    /* ---------------------- INICIALIZAÇÃO ---------------------- */
    function init() {
        logDebug("Inicializando script...");
        criarLayers();
        criarPainel();
        configurarListeners();
        logDebug(`${SCRIPT_NAME} carregado com sucesso.`);
    }

    function waitForWaze() {
        if (typeof W === 'undefined' || !W.map || !W.model) {
            setTimeout(waitForWaze, 1000);
            return;
        }
        init();
    }

    waitForWaze();
})();