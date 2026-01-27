// ==UserScript==
// @name         SENASA – Sumar Peso Neto (totales en encabezado sin columna extra)
// @namespace    https://github.com/TU_USUARIO/senasa-peso-neto
// @version      3.6.0
// @description  Calcula los pesos netos y muestra los totales en el encabezado, sin agregar columna "Peso Neto".
// @author       Tu Nombre
// @match        https://aps2.senasa.gov.ar/certificaciones/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564150/SENASA%20%E2%80%93%20Sumar%20Peso%20Neto%20%28totales%20en%20encabezado%20sin%20columna%20extra%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564150/SENASA%20%E2%80%93%20Sumar%20Peso%20Neto%20%28totales%20en%20encabezado%20sin%20columna%20extra%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    btnCalc.onclick = async () => {
        const tabla = document.querySelector("table");
        if (!tabla) {
            alert("No se encontró la tabla principal");
            return;
        }

        // Asegurar que exista <thead>
        let thead = tabla.querySelector("thead");
        if (!thead) {
            thead = document.createElement("thead");
            tabla.insertBefore(thead, tabla.firstChild);
        }

        let totalGeneral = 0;
        let totalArgentina = 0;
        let totalDeposito = 0; // establecimientos 2062, 3676, 1918
        let totalCCP = 0;      // establecimientos 3574, 4073, 2085, 3203

        const botonesTxt = Array.from(
            document.querySelectorAll('input[type="image"][title*="Texto plano"]')
        );

        for (let i = 0; i < botonesTxt.length; i++) {
            const boton = botonesTxt[i];
            const form = boton.closest('form');
            if (!form) continue;

            const row = boton.closest("tr");
            let totalArchivo = 0;
            let paisDestino = null;
            let establecimiento = null;

            const formData = new FormData(form);
            formData.append(boton.getAttribute('name'), boton.getAttribute('name'));

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });

                const txt = await response.text();
                const lineas = txt.split('\n');

                lineas.forEach(linea => {
                    const matchDestino = linea.match(/País\s+Destino\s*:\s*(.+)/i);
                    if (matchDestino) paisDestino = matchDestino[1].trim();

                    const matchEst = linea.match(/Establecimiento\s+Emisor\s*:\s*(\d+)/i);
                    if (matchEst) establecimiento = matchEst[1].trim();

                    const matchPeso = linea.match(/Peso\s+Neto\s*:?\s*([\d.,]+)/i);
                    if (matchPeso) {
                        const valor = parseFloat(matchPeso[1].replace(',', '.'));
                        if (!isNaN(valor)) totalArchivo += valor;
                    }
                });

                totalArchivo = Number(totalArchivo.toFixed(2));
                totalGeneral += totalArchivo;

                if (paisDestino && paisDestino.toLowerCase() === "argentina") {
                    totalArgentina += totalArchivo;
                }

                if (establecimiento) {
                    if (["2062", "3676", "1918"].includes(establecimiento)) {
                        totalDeposito += totalArchivo;
                    } else if (["3574", "4073", "2085", "3203"].includes(establecimiento)) {
                        totalCCP += totalArchivo;
                    }
                }

                // Agregar celda con solo el neto (sin encabezado de columna)
                if (row) {
                    const td = document.createElement("td");
                    td.textContent = totalArchivo.toFixed(2);
                    td.style.fontSize = "11px";
                    td.style.background = "#f9f9f9";
                    row.appendChild(td);
                }

            } catch (err) {
                if (row) {
                    const td = document.createElement("td");
                    td.textContent = "ERROR";
                    td.style.color = "red";
                    row.appendChild(td);
                }
            }
        }

        // Crear fila de totales en el encabezado
        const totalsHeadRow = document.createElement("tr");

        const thTotals = document.createElement("th");
        thTotals.colSpan = tabla.querySelector("tr").cells.length; // ocupa todas las columnas
        thTotals.textContent =
            `Totales → Argentina: ${totalArgentina.toFixed(2)} | Depósito: ${totalDeposito.toFixed(2)} | CCP: ${totalCCP.toFixed(2)} | General: ${totalGeneral.toFixed(2)}`;
        thTotals.style.background = "#ddd";
        thTotals.style.fontWeight = "bold";
        thTotals.style.textAlign = "center";

        totalsHeadRow.appendChild(thTotals);
        thead.appendChild(totalsHeadRow);
    };

    document.body.appendChild(btnCalc);
})();
