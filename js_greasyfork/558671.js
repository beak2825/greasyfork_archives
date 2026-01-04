// ==UserScript==
// @name         Assignador de Notes per DNI per a ESFERA (SPA Fixed + Reporte Errores)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Assigna notes massivament a ESFERAi reporta quins alumnes no s'han trobat.
// @author       (Tu nombre aquí)
// @match        https://bfgh.aplicacions.ensenyament.gencat.cat/bfgh/avaluacio/finalAvaluacioGrupMateria*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558671/Assignador%20de%20Notes%20per%20DNI%20per%20a%20ESFERA%20%28SPA%20Fixed%20%2B%20Reporte%20Errores%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558671/Assignador%20de%20Notes%20per%20DNI%20per%20a%20ESFERA%20%28SPA%20Fixed%20%2B%20Reporte%20Errores%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURACIÓN
    const CHECK_INTERVAL_MS = 2000; // Comprobar cada 2 segundos
    const CONTAINER_ID = 'grade-injector-container';

    // 1. Detección continua (Fix para SPA)
    setInterval(() => {
        if (document.getElementById(CONTAINER_ID)) return;
        
        // Buscamos la tabla específica de alumnos
        const table = document.querySelector('table[data-st-table="dummyStudents"]');
        
        if (table) {
            console.log('Taula detectada. Injectant panell...');
            injectUI(table);
        }
    }, CHECK_INTERVAL_MS);

    // 2. Injectar la UI
    function injectUI(targetTable) {
        const container = document.createElement('div');
        container.id = CONTAINER_ID;

        const styles = `
            #grade-injector-header {
                display: flex; justify-content: space-between; align-items: center;
                cursor: pointer; user-select: none; background-color: #e6f0ff;
                padding: 10px; border-bottom: 1px solid #007bff; border-radius: 6px 6px 0 0;
            }
            #grade-injector-header h3 { margin: 0; color: #0056b3; font-size: 16px; }
            #grade-injector-body { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 15px; }
            #grade-injector-log {
                height: 200px; overflow-y: auto; border: 1px solid #ccc;
                padding: 10px; background: #fff; font-family: monospace; font-size: 11px;
            }
            #grade-input-area {
                width: 100%; height: 160px; box-sizing: border-box;
                font-family: monospace; border: 1px solid #ccc; padding: 5px;
            }
            @media (max-width: 768px) { #grade-injector-body { grid-template-columns: 1fr; } }
        `;

        container.innerHTML = `
            <style>${styles}</style>
            <div id="grade-injector-header" title="Plegar / Desplegar">
                <h3>⚡ Assignador Massiu v1.5</h3>
                <div id="grade-injector-toggle">▲</div>
            </div>
            <div id="grade-injector-body">
                <div id="injector-col-input">
                    <p style="margin: 0 0 5px 0; font-size: 12px;"><strong>DNI Nota</strong> (separat per espai o tab)</p>
                    <textarea id="grade-input-area" placeholder="12345678X 8&#10;87654321Z 6.5"></textarea>
                    <button id="process-grades-btn" style="width:100%; padding: 8px; margin-top: 8px; font-weight:bold; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Processar Notes
                    </button>
                </div>
                <div id="injector-col-log">
                     <h4 style="margin:0 0 5px 0; font-size: 12px;">Resultats:</h4>
                     <div id="grade-injector-log"><p style="color:#666;">Esperant dades...</p></div>
                </div>
            </div>
        `;

        Object.assign(container.style, {
            backgroundColor: '#f4f8ff', border: '1px solid #007bff',
            borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        });

        if (targetTable && targetTable.parentElement) {
            targetTable.parentElement.insertBefore(container, targetTable);
        } else {
            document.body.prepend(container);
        }

        document.getElementById('process-grades-btn').addEventListener('click', processGrades);
        document.getElementById('grade-injector-header').addEventListener('click', toggleInjectorBody);
    }

    function toggleInjectorBody() {
        const body = document.getElementById('grade-injector-body');
        const toggle = document.getElementById('grade-injector-toggle');
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'grid' : 'none';
        toggle.textContent = isHidden ? '▲' : '▼';
    }

    function log(message, type = 'info') {
        const logDiv = document.getElementById('grade-injector-log');
        if (logDiv) {
            const p = document.createElement('p');
            p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            
            if (type === 'error') p.style.color = '#d9534f'; // Rojo
            else if (type === 'success') p.style.color = '#28a745'; // Verde
            else if (type === 'warning') p.style.color = '#ff9900'; // Naranja
            else p.style.color = '#333';

            p.style.margin = '2px 0';
            p.style.borderBottom = '1px solid #f0f0f0';
            logDiv.prepend(p);
        }
        if (type === 'error') console.error(message);
        else console.log(message);
    }

    function mapGradeToValue(gradeInput) {
        const grade = gradeInput.toUpperCase();
        if (grade === 'PDT') return 'string:PDT';
        if (grade === 'EP') return 'string:EP';
        if (grade === 'NA') return 'string:NA';
        if (grade === 'MH') return 'string:MH';

        const numFloat = parseFloat(gradeInput.replace(',', '.'));
        if (isNaN(numFloat)) {
            if (grade.startsWith('A') && grade.length >= 2) return 'string:' + grade;
            return null;
        }

        const num = Math.round(numFloat);
        if (num >= 10) return 'string:A10';
        if (num === 9) return 'string:A9';
        if (num === 8) return 'string:A8';
        if (num === 7) return 'string:A7';
        if (num === 6) return 'string:A6';
        if (num === 5) return 'string:A5';
        if (num < 5 && num >= 0) return 'string:NA';
        return null;
    }

    // 3. LÒGICA PRINCIPAL (CORREGIDA)
    function processGrades() {
        log('Iniciant processament...', 'info');
        document.getElementById('grade-injector-log').innerHTML = ''; 
        const input = document.getElementById('grade-input-area').value.trim();

        if (!input) {
            log('L\'àrea de text és buida.', 'error');
            return;
        }

        const lines = input.split('\n');
        const gradeMap = new Map(); // Mapa: DNI -> Nota
        const processedDNIs = new Set(); // Conjunt per marcar els que trobem a la taula
        let parseErrors = 0;

        // Fase 1: Llegir la teva llista
        lines.forEach((line, index) => {
            if (line.trim()) {
                const parts = line.trim().split(/[\s,t;]+/);
                if (parts.length >= 2) {
                    // Netegem DNI (traiem guions i espais)
                    const dni = parts[0].trim().toUpperCase().replace(/[-\s]/g, '');
                    const grade = parts[parts.length - 1].trim(); 
                    if (dni && grade) {
                        gradeMap.set(dni, grade);
                    } else {
                        parseErrors++;
                    }
                } else {
                    parseErrors++;
                }
            }
        });

        if (gradeMap.size === 0) {
            log("No hi ha dades vàlides. Revisa el format.", 'error');
            return;
        }

        log(`Llista carregada: ${gradeMap.size} alumnes. Buscant a la taula...`, 'info');

        const studentRows = document.querySelectorAll('tbody tr[data-ng-repeat^="alumne in dummyStudents"]');
        let updatedCount = 0;

        // Fase 2: Recórrer la taula web
        studentRows.forEach((row) => {
            row.style.backgroundColor = ''; 
            const cells = row.querySelectorAll('td');
            let dniFoundInTable = null;
            
            // Busquem DNI a les cel·les visibles
            for (let cell of cells) {
                const text = cell.textContent.trim().toUpperCase().replace(/[-\s]/g, ''); // Netegem també el de la taula
                // Regex DNI/NIE aproximat (8 nums+lletra o Lletra+7nums+Lletra)
                if (text.length >= 8 && text.length <= 12 && /\d/.test(text)) {
                    // Si aquest text "net" coincideix amb una clau del nostre mapa
                    if (gradeMap.has(text)) {
                        dniFoundInTable = text;
                        break; 
                    }
                }
            }

            // Si hem trobat un DNI a la fila que està a la nostra llista
            if (dniFoundInTable) {
                // MARQUEM COM A PROCESSAT
                processedDNIs.add(dniFoundInTable);

                const gradeInput = gradeMap.get(dniFoundInTable);
                const targetValue = mapGradeToValue(gradeInput);
                const select = row.querySelector('select'); 

                if (select && targetValue) {
                    if (select.value !== targetValue) {
                        select.value = targetValue;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        select.dispatchEvent(new Event('input', { bubbles: true }));
                        row.style.backgroundColor = '#d4edda'; // Verd
                        updatedCount++;
                    } else {
                         // Ja tenia la nota posada
                         row.style.backgroundColor = '#e2e6ea'; 
                    }
                } else {
                    row.style.backgroundColor = '#f8d7da'; // Vermell clar
                    log(`Error assignant nota a ${dniFoundInTable}.`, 'error');
                }
            }
        });

        // Fase 3: REPORTAR ELS QUE FALTEN (La part nova)
        let missingCount = 0;
        gradeMap.forEach((val, key) => {
            if (!processedDNIs.has(key)) {
                log(`⚠️ ALERTA: No s'ha trobat l'alumne amb DNI ${key} a la taula.`, 'warning');
                missingCount++;
            }
        });

        log('------------------------------------------------', 'info');
        log(`Resum Final:`, 'info');
        log(`✅ Assignats/Revisats: ${processedDNIs.size}`, 'success');
        if (missingCount > 0) {
            log(`❌ NO TROBATS: ${missingCount} (Revisa el log de dalt)`, 'error');
        } else {
            log(`🎉 Tots els alumnes de la llista han estat processats!`, 'success');
        }
    }

})();