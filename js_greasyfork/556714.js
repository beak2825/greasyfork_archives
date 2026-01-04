// ==UserScript==
// @name         WME IBGE Estabelecimentos Importer
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Filtra e exibe estabelecimentos do CSV IBGE (DSC_ESTABELECIMENTO) no WME com pré-visualização e sugestão de endereço (SEGLOGR)
// @author       Josevaldo
// @match        https://www.waze.com/editor/*
// @match        https://www.waze.com/*/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556714/WME%20IBGE%20Estabelecimentos%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/556714/WME%20IBGE%20Estabelecimentos%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForWME() {
        if (typeof W === 'undefined' || !W.map || !W.model) {
            console.log('Aguardando WME carregar...');
            return setTimeout(waitForWME, 2000);
        }
        initUI();
    }

    function initUI() {
        const ui = document.createElement('div');
        ui.style.position = 'fixed';
        ui.style.top = '10px';
        ui.style.right = '10px';
        ui.style.width = '420px';
        ui.style.background = 'white';
        ui.style.border = '1px solid #ccc';
        ui.style.borderRadius = '10px';
        ui.style.padding = '10px';
        ui.style.fontFamily = 'Arial, sans-serif';
        ui.style.zIndex = 9999;
        ui.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        ui.innerHTML = `
            <h4 style="margin-top:0;">Importar Estabelecimentos IBGE → WME</h4>
            <input type="file" id="csvFile" accept=".csv" style="width:100%;">
            <p style="font-size:12px;color:#666;margin-top:5px;">Somente linhas com valor em <b>DSC_ESTABELECIMENTO</b> serão exibidas.</p>
            <hr>
            <div id="poiList" style="max-height:300px;overflow:auto;font-size:12px;"></div>
        `;
        document.body.appendChild(ui);

        let poiData = [];
        let markerLayer;

        function ensurePreviewLayer() {
            if (!window.W || !W.map) return;
            if (!markerLayer) {
                markerLayer = new OpenLayers.Layer.Markers('IBGE Preview Layer');
                W.map.addLayer(markerLayer);
            }
        }

        function previewPOI(p) {
            ensurePreviewLayer();
            markerLayer.clearMarkers();
            const lonlat = new OpenLayers.LonLat(p.lng, p.lat).transform('EPSG:4326', W.map.getOLMap().getProjectionObject());
            const icon = new OpenLayers.Icon('https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png', new OpenLayers.Size(24,24));
            const marker = new OpenLayers.Marker(lonlat, icon);
            markerLayer.addMarker(marker);
            W.map.setCenter(lonlat, 6);
        }

        document.getElementById('csvFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const text = evt.target.result;
                const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
                const headers = lines[0].split(',').map(h => h.trim().toUpperCase());

                const idxLat = headers.indexOf('LATITUDE');
                const idxLng = headers.indexOf('LONGITUDE');
                const idxNome = headers.indexOf('DSC_ESTABELECIMENTO');
                const idxEnd = headers.indexOf('SEGLOGR');

                if (idxLat === -1 || idxLng === -1 || idxNome === -1) {
                    alert('Erro: O arquivo CSV deve conter colunas LATITUDE, LONGITUDE e DSC_ESTABELECIMENTO.');
                    return;
                }

                poiData = lines.slice(1).map(line => {
                    const cols = line.split(',');
                    return {
                        lat: parseFloat(cols[idxLat]),
                        lng: parseFloat(cols[idxLng]),
                        nome: cols[idxNome]?.trim() || '',
                        endereco: idxEnd >= 0 ? cols[idxEnd].trim() : ''
                    };
                }).filter(p => p.nome && !isNaN(p.lat) && !isNaN(p.lng));

                renderPOIList(poiData);
            };
            reader.readAsText(file, 'UTF-8');
        });

        function renderPOIList(list) {
            const container = document.getElementById('poiList');
            container.innerHTML = '';
            if (list.length === 0) {
                container.innerHTML = '<p style="color:red;">Nenhum estabelecimento encontrado.</p>';
                return;
            }

            list.forEach((p, idx) => {
                const div = document.createElement('div');
                div.style.borderBottom = '1px solid #eee';
                div.style.padding = '4px 0';
                div.innerHTML = `
                    <b>${p.nome}</b><br>
                    <span style="color:#555;">${p.endereco || '(sem endereço)'}<br>(${p.lat.toFixed(5)}, ${p.lng.toFixed(5)})</span><br>
                    <button data-idx="${idx}" class="previewBtn">👁️ Pré-visualizar</button>
                    <button data-idx="${idx}" class="addPoiBtn">➕ Adicionar</button>
                `;
                container.appendChild(div);
            });

            container.querySelectorAll('.previewBtn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const i = e.target.dataset.idx;
                    previewPOI(poiData[i]);
                });
            });

            container.querySelectorAll('.addPoiBtn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const i = e.target.dataset.idx;
                    addPOIToWME(poiData[i]);
                });
            });
        }

        function addPOIToWME(p) {
            if (!window.W || !W.model || !W.model.venues) {
                alert('O WME ainda não terminou de carregar. Tente novamente em alguns segundos.');
                return;
            }
            const nome = p.nome.trim() || 'Estabelecimento IBGE';
            const venue = new W.model.venues.objects.Venue({
                geometry: new OL.Geometry.Point(p.lng, p.lat).transform('EPSG:4326', W.map.getOLMap().getProjectionObject()),
                attributes: {
                    categories: ['SHOPPING_AND_SERVICES'],
                    name: nome,
                    description: p.endereco || 'Endereço sugerido desconhecido'
                }
            });
            W.model.venues.add(venue);
            alert(`Adicionado: ${nome}\nEndereço sugerido: ${p.endereco}`);
        }
    }

    waitForWME();
})();