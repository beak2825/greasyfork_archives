// ==UserScript==
// @name         Selección de Segmentos WME
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  Selector de Segmentos WME
// @author       Kahlcolimon
// @match        https://beta.waze.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553582/Selecci%C3%B3n%20de%20Segmentos%20WME.user.js
// @updateURL https://update.greasyfork.org/scripts/553582/Selecci%C3%B3n%20de%20Segmentos%20WME.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRoadTypeName(roadType) {
        if (window.W && window.W.config && window.W.config.roadTypeStrings) {
            return window.W.config.roadTypeStrings[roadType] || roadType;
        }
        const mapRoadType = {
            1: "Calle Principal", 2: "Calle", 3: "Calle sin salida", 4: "Autopista", 5: "Carretera primaria",
            6: "Carretera secundaria", 7: "Tercer nivel", 8: "Rampa", 9: "Rotonda", 10: "Camino", 20: "Ferry"
        };
        return mapRoadType[roadType] || `Desconocido (${roadType})`;
    }

    const columnsMeta = [
        { key: 'nombre', name: 'Nombre' },
        { key: 'city', name: 'Ciudad' },
        { key: 'state', name: 'Estado' },
        { key: 'country', name: 'País' },
        { key: 'roadType', name: 'Tipo de vía' },
        { key: 'direction', name: 'Sentido' },
        { key: 'speedLimit', name: 'Límite de velocidad' },
        { key: 'lock', name: 'Bloqueo' },
        { key: 'actions', name: 'Acciones' }
    ];
    let selectedColumns = columnsMeta.map(col => col.key);
    let opacity = 1.0;
    let scriptActive = false;

    function buildTable(segments) {
        const old = document.getElementById('wme-segment-table');
        if (old) old.remove();

        const container = document.createElement('div');
        container.id = 'wme-segment-table';
        container.style.position = 'fixed';
        container.style.top = '80px';
        container.style.right = '20px';
        container.style.width = '700px';
        container.style.maxHeight = '70vh';
        container.style.overflowY = 'scroll';
        container.style.border = '2px solid #0078ff';
        container.style.background = '#fff';
        container.style.opacity = opacity;
        container.style.zIndex = 20000;
        container.style.boxShadow = '0 2px 10px #333';
        container.style.transition = 'opacity 0.3s';
        container.style.resize = 'horizontal';

        const menu = document.createElement('div');
        menu.innerHTML = `<strong>Columnas:</strong>`;
        columnsMeta.forEach(col => {
            if (col.key === "actions") return;
            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.checked = selectedColumns.includes(col.key);
            chk.onchange = function() {
                if (this.checked) selectedColumns.push(col.key);
                else selectedColumns = selectedColumns.filter(c => c !== col.key);
                buildTable(getVisibleSegments());
            };
            menu.appendChild(chk);
            menu.appendChild(document.createTextNode(col.name + ' '));
        });

        const btnActualizar = document.createElement('button');
        btnActualizar.textContent = 'Actualizar información';
        btnActualizar.style.marginLeft = '10px';
        btnActualizar.onclick = function() {
            buildTable(getVisibleSegments());
        };
        menu.appendChild(btnActualizar);

        container.appendChild(menu);

        const opBox = document.createElement('div');
        opBox.innerHTML = `<strong>Opacidad:</strong> `;
        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = 0.15; slider.max = 1; slider.step = 0.01; slider.value = opacity;
        slider.oninput = function() {
            opacity = this.value;
            container.style.opacity = opacity;
        };
        opBox.appendChild(slider);
        container.appendChild(opBox);

        const style = document.createElement('style');
        style.innerHTML = `
            #wme-segment-table table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            #wme-segment-table th, #wme-segment-table td {
                border: 1px solid #cccccc;
                padding: 4px 8px;
                text-align: left;
                background: #f5f8fc;
            }
            #wme-segment-table th {
                background: #e3eaf5;
            }
            #wme-segment-table tr:nth-child(even) td {
                background: #f9fbfd;
            }
            .select-btn {
                background: #0078ff;
                color: #fff;
                border: none;
                border-radius: 3px;
                padding: 2px 8px;
                cursor: pointer;
                font-size: 14px;
            }
            .select-btn:hover {
                background: #005cbf;
            }
        `;
        container.appendChild(style);

        const table = document.createElement('table');
        table.innerHTML = '<thead><tr>' +
            columnsMeta.filter(col => selectedColumns.includes(col.key) || col.key === 'actions')
            .map(col => `<th>${col.name}</th>`).join('') +
            '</tr></thead>';

        const tbody = document.createElement('tbody');

        segments.forEach(seg => {
            let row = '<tr>';
            columnsMeta.forEach(col => {
                if (col.key === 'actions') {
                    // Botón funcional
                    row += `<td><button class="select-btn" data-segid="${seg.id}">Seleccionar y Centrar</button></td>`;
                } else if (selectedColumns.includes(col.key)) {
                    row += `<td>${seg[col.key] ?? ''}</td>`;
                }
            });
            row += '</tr>';
            tbody.innerHTML += row;
        });
        table.appendChild(tbody);
        container.appendChild(table);

        document.body.appendChild(container);

        // -- INICIO DE LA REPARACIÓN --
        // Se corrigió el manejador de clics para usar la API moderna de WME
        setTimeout(() => {
            document.querySelectorAll('.select-btn').forEach(btn => {
                btn.onclick = function(e) {
                    let segId = this.getAttribute('data-segid');
                    if (window.W && window.W.model && window.W.selectionManager) {
                        
                        // La lógica para encontrar el segmento ya era robusta (intenta string, número y acceso directo)
                        let segment = window.W.model.segments.getObjectById(segId);
                        if (!segment) {
                            segment = window.W.model.segments.getObjectById(Number(segId));
                        }
                        if (!segment && window.W.model.segments.objects) {
                            segment = window.W.model.segments.objects[segId] || window.W.model.segments.objects[Number(segId)];
                        }

                        // Comprobar si se encontró el segmento
                        if (segment && segment.geometry) {
                            
                            // 1. Usar la NUEVA API de selección (requiere un array de objetos)
                            window.W.selectionManager.setSelectedModels([segment]);

                            // 2. Usar zoomToExtent para centrar Y hacer zoom al segmento
                            const bounds = segment.geometry.getBounds();
                            window.W.map.zoomToExtent(bounds);

                            // Opcional: Si el zoom es muy lejano (segmentos largos), fija un zoom mínimo
                            if (window.W.map.getZoom() < 17) {
                                window.W.map.setZoom(17);
                            }

                        } else {
                            alert(`No se puede seleccionar el segmento ${segId}. Por favor asegúrate de que esté visible en el mapa y actualiza la tabla.`);
                        }
                    } else {
                        alert("El editor de Waze no está listo.");
                    }
                }
            });
        }, 300);
        // -- FIN DE LA REPARACIÓN --
    }

    function getVisibleSegments() {
        if (!window.W || !window.W.map || !window.W.model) return [];
        
        // Esta función es correcta. Obtiene los límites de la pantalla.
        let bounds = window.W.map.getExtent(); 
        
        // Obtiene todos los segmentos cargados en el modelo
        let allSegs = Object.values(window.W.model.segments.objects); 
        
        // Filtra solo los que intersectan con la pantalla
        return allSegs.filter(seg => {
            const geom = seg.geometry?.getBounds();
            if (!geom) return false;
            return bounds.intersectsBounds(geom); // Lógica correcta
        }).map(seg => {
            const attrs = seg.attributes;
            let nombre = "(Sin nombre)";
            if (attrs.streetID) {
                const street = window.W.model.streets.getObjectById(attrs.streetID);
                if (street && street.name) {
                    nombre = street.name;
                }
            }
            return {
                id: seg.id,
                nombre: nombre,
                city: attrs.primaryCityID ? (window.W.model.cities.getObjectById(attrs.primaryCityID)?.name || '') : '',
                state: attrs.stateID ? (window.W.model.states.getObjectById(attrs.stateID)?.name || '') : '',
                country: attrs.countryID ? (window.W.model.countries.getObjectById(attrs.countryID)?.name || '') : '',
                roadType: getRoadTypeName(attrs.roadType),
                direction: attrs.direction === 3 ? "Ambos" : (attrs.direction === 2 ? "IZQ" : "DER"),
                speedLimit: attrs.speedLimit || '',
                lock: attrs.lockRank || '',
            };
        });
    }

    function addMainButton() {
        const btn = document.createElement('button');
        btn.id = 'wme-toggle-script';
        btn.textContent = 'Activar tabla segmentos WME';
        btn.style.position = 'fixed';
        btn.style.bottom = '40px';
        btn.style.right = '40px';
        btn.style.background = '#0078ff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '12px 20px';
        btn.style.borderRadius = '8px';
        btn.style.zIndex = 20001;
        btn.style.fontSize = '16px';
        btn.onclick = function() {
            scriptActive = !scriptActive;
            btn.textContent = scriptActive ? 'Desactivar tabla segmentos WME' : 'Activar tabla segmentos WME';
            const t = document.getElementById('wme-segment-table');
            if (scriptActive) buildTable(getVisibleSegments());
            else if (t) t.remove();
        };
        document.body.appendChild(btn);
    }

    function installMapListener() {
        window.W.map.events.register('moveend', null, () => {
            if (scriptActive) buildTable(getVisibleSegments());
        });
    }

    function initScript() {
        if (window.W && window.W.map && window.W.model) {
            addMainButton();
            installMapListener();
        } else {
            // Reintentar si WME no está listo
            setTimeout(initScript, 1000);
        }
    }

    // Aumentar un poco el tiempo de espera inicial para asegurar que WME esté completamente cargado
    setTimeout(initScript, 3000); 
})();