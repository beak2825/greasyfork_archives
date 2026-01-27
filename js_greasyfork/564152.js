// ==UserScript==
// @name         SENASA – Sumar Peso Neto (todas las páginas)
// @namespace    https://github.com/TU_USUARIO/senasa-peso-neto
// @version      1.5.0
// @description  Suma el Peso Neto de todos los certificados TXT en SENASA, incluyendo todas las páginas de resultados.
// @author       Tu Nombre
// @match        https://aps2.senasa.gov.ar/certificaciones/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564152/SENASA%20%E2%80%93%20Sumar%20Peso%20Neto%20%28todas%20las%20p%C3%A1ginas%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564152/SENASA%20%E2%80%93%20Sumar%20Peso%20Neto%20%28todas%20las%20p%C3%A1ginas%29.meta.js
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

        let totalGeneral = 0;

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
                    const match = linea.match(/Peso\s+Neto\s*:?\s*([\d.]+)/i);
                    if (match) {
                        const valor = parseFloat(match[1]);
                        if (!isNaN(valor)) {
                            totalArchivo += valor;
                        }
                    }
                });

                totalArchivo = Number(totalArchivo.toFixed(2));
                totalGeneral += totalArchivo;

                panel.textContent += `${rowId} (${name}): ${totalArchivo.toFixed(2)}\n`;

            } catch (err) {
                panel.textContent += `${rowId}: ERROR\n`;
            }
        }

        totalGeneral = Number(totalGeneral.toFixed(2));

        panel.textContent += '\n----------------------\n';
        panel.textContent += `TOTAL GENERAL: ${totalGeneral.toFixed(2)}`;
    };

    document.body.appendChild(btnCalc);
    document.body.appendChild(btnToggle);
    document.body.appendChild(panel);
})();
