// ==UserScript==
// @name         SENASA – Sumar kg. Netos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Descarga el Excel de SENASA, suma la columna "kg. Netos" y guarda log con fecha/hora
// @author       Diego
// @match        https://aps2.senasa.gov.ar/certificaciones/faces/pages/carnicos/pt/pt_ptr_emitidos.jsp*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/564160/SENASA%20%E2%80%93%20Sumar%20kg%20Netos.user.js
// @updateURL https://update.greasyfork.org/scripts/564160/SENASA%20%E2%80%93%20Sumar%20kg%20Netos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear botón extra en la página
    const btn = document.createElement("button");
    btn.textContent = "Sumar kg. Netos";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = 9999;
    btn.style.background = "#4CAF50";
    btn.style.color = "white";
    btn.style.padding = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);

    btn.addEventListener("click", async () => {
        try {
            // Buscar el ícono de Excel y simular clic
            const excelIcon = document.querySelector("img[alt='Descargar resultados obtenidos']");
            if (!excelIcon) {
                alert("No se encontró el ícono de Excel en la página.");
                return;
            }
            excelIcon.click();

            // Esperar a que se descargue (el navegador baja el archivo)
            // No podemos interceptar directamente la descarga, pero podemos pedir el archivo si conocemos la URL.
            // Si el servidor expone un endpoint, reemplazar aquí:
            const urlExcel = "/certificaciones/pages/carnicos/pt/pt_ptr_emitidos.xls";

            const response = await fetch(urlExcel, { credentials: 'include' });
            if (!response.ok) {
                alert("Error al descargar Excel: " + response.status);
                return;
            }
            const blob = await response.blob();
            const data = await blob.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });

            // Tomar primera hoja
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { range: 12, defval: "" });

            // Sumar columna "kg. Netos"
            let total = 0;
            json.forEach(row => {
                if (row["kg. Netos"]) {
                    total += Number(row["kg. Netos"]) || 0;
                }
            });

            // Mostrar resultado
            alert("TOTAL GENERAL kg. Netos: " + total.toFixed(2) + " kg");

            // Guardar log en localStorage con fecha/hora
            const fecha = new Date().toLocaleString();
            const logs = JSON.parse(localStorage.getItem("senasa_netos_log") || "[]");
            logs.push({ fecha, total });
            localStorage.setItem("senasa_netos_log", JSON.stringify(logs));

            console.log("Log actualizado:", logs);

        } catch (e) {
            console.error("Error procesando Excel:", e);
            alert("Error procesando Excel: " + e.message);
        }
    });
})();
