// ==UserScript==
// @name         SENASA – Sumar Peso Neto por País Destino
// @namespace    https://github.com/TU_USUARIO/senasa-peso-neto
// @version      2.4.0
// @description  Suma el Peso Neto de todos los certificados TXT en SENASA, separando Argentina y China según "País Destino : ..."
// @author       Tu Nombre
// @match        https://aps2.senasa.gov.ar/certificaciones/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564151/SENASA%20%E2%80%93%20Sumar%20Peso%20Neto%20por%20Pa%C3%ADs%20Destino.user.js
// @updateURL https://update.greasyfork.org/scripts/564151/SENASA%20%E2%80%93%20Sumar%20Peso%20Neto%20por%20Pa%C3%ADs%20Destino.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== BOTÓN CALCULAR =====
    const btnCalc = document.createElement('button');
    btnCalc.textContent = 'Calcular Peso Neto';
    Object.assign(btnCalc.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        padding: '6px 10px',
        fontSize: '14px',
        cursor: 'pointer'
    });

    // ===== BOTÓN TOGGLE =====
    const btnToggle = document.createElement('button');
    btnToggle.textContent = 'Ocultar resultados';
    Object.assign(btnToggle.style, {
        position: 'fixed',
        top: '10px',
        right: '190px',
        zIndex: 9999,
        padding: '6px 10px',
        fontSize: '14px',
        cursor: 'pointer'
    });

    // ===== PANEL RESULTADOS =====
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        top: '50px',
        right: '10px',
        zIndex: 9999,
        background: '#fff',
        border: '1px solid #ccc',
        padding: '8px',
        maxHeight: '300px',
        width: '360px',
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace',
        whiteSpace: 'pre'
    });
    panel.textContent = 'Sin calcular';

    // ===== TOGGLE =====
    btnToggle.onclick = () => {
        const visible = panel.style.display !== 'none';
        panel.style.display = visible ? 'none' : 'block';
        btnToggle.textContent = visible ? 'Mostrar resultados' : 'Ocultar resultados';
    };

    // ===== CALCULAR =====
    btnCalc.onclick = async () => {
        panel.style.display = 'block';
        btnToggle.textContent = 'Ocultar resultados';
        panel.textContent = 'Procesando...\n';

        let totalArgentina = 0;
        let totalChina = 0;

        const botonesTxt = Array.from(
            document.querySelectorAll(
                'input[type="image"][title*="Texto plano"]'
            )
        );

        for (let i = 0; i < botonesTxt.length; i++) {
            const boton = botonesTxt[i];
            const form = boton.closest('form');
            if (!form) continue;

            const name = boton.getAttribute('name');
            const rowId = `ROW_${i}`;
            let totalArchivo = 0;
            let paisDestino = null;

            const formData = new FormData(form);
            formData.append(name, name);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                const txt = await response.text();
                const lineas = txt.split('\n');

                lineas.forEach(linea => {
                    // Buscar "País Destino :"
                    const matchDestino = linea.match(/País\s+Destino\s*:\s*(.+)/i);
                    if (matchDestino) {
                        paisDestino = matchDestino[1].trim();
                    }

                    // Buscar "Peso Neto"
                    const matchPeso = linea.match(/Peso\s+Neto\s*:?\s*([\d.,]+)/i);
                    if (matchPeso) {
                        const valor = parseFloat(matchPeso[1].replace(',', '.'));
                        if (!isNaN(valor)) {
                            totalArchivo += valor;
                        }
                    }
                });

                totalArchivo = Number(totalArchivo.toFixed(2));

                // Acumular según país destino
                if (paisDestino) {
                    if (paisDestino.toLowerCase() === "argentina") {
                        totalArgentina += totalArchivo;
                    } else if (paisDestino.toLowerCase().includes("china")) {
                        totalChina += totalArchivo;
                    }
                }

                panel.textContent += `${rowId} (${name}) → País Destino: ${paisDestino || "N/A"} → ${totalArchivo.toFixed(2)}\n`;

            } catch (err) {
                panel.textContent += `${rowId}: ERROR\n`;
            }
        }

        panel.textContent += '\n----------------------\n';
        panel.textContent += `TOTAL ARGENTINA: ${totalArgentina.toFixed(2)}\n`;
        panel.textContent += `TOTAL CHINA: ${totalChina.toFixed(2)}\n`;
        panel.textContent += `TOTAL GENERAL: ${(totalArgentina + totalChina).toFixed(2)}`;
    };

    document.body.appendChild(btnCalc);
    document.body.appendChild(btnToggle);
    document.body.appendChild(panel);
})();