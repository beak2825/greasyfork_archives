// ==UserScript==
// @name         Moodle Grade Distribution Graph // Gràfica de distribució de les notes
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Calculates grading statistics and displays a grade distribution graph for Moodle assignments
// @author       Ermengol Bota
// @match        *://*/mod/assign/view.php?id=*&action=grading
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558165/Moodle%20Grade%20Distribution%20Graph%20%20Gr%C3%A0fica%20de%20distribuci%C3%B3%20de%20les%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/558165/Moodle%20Grade%20Distribution%20Graph%20%20Gr%C3%A0fica%20de%20distribuci%C3%B3%20de%20les%20notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== Script Suma Qualificacions iniciat ===');

    // Funció per calcular estadístiques
    function calcularEstadistiques(notes) {
        console.log('Calculant estadístiques per notes:', notes);

        if (notes.length === 0) {
            return {
                mitjana: 0,
                mediana: 0,
                moda: 0,
                desviacio: 0,
                minim: 0,
                maxim: 0
            };
        }

        // Mitjana
        const mitjana = notes.reduce((sum, val) => sum + val, 0) / notes.length;
        console.log('Mitjana:', mitjana);

        // Mediana
        const notesOrdenades = [...notes].sort((a, b) => a - b);
        let mediana;
        if (notesOrdenades.length % 2 === 0) {
            mediana = (notesOrdenades[notesOrdenades.length / 2 - 1] + notesOrdenades[notesOrdenades.length / 2]) / 2;
        } else {
            mediana = notesOrdenades[Math.floor(notesOrdenades.length / 2)];
        }
        console.log('Mediana:', mediana);

        // Moda (valor més freqüent)
        const frequencia = {};
        notes.forEach(nota => {
            frequencia[nota] = (frequencia[nota] || 0) + 1;
        });
        let maxFreq = 0;
        let moda = notes[0];
        for (const [valor, freq] of Object.entries(frequencia)) {
            if (freq > maxFreq) {
                maxFreq = freq;
                moda = parseFloat(valor);
            }
        }
        console.log('Moda:', moda, 'amb freqüència:', maxFreq);

        // Desviació estàndard
        const variancia = notes.reduce((sum, val) => sum + Math.pow(val - mitjana, 2), 0) / notes.length;
        const desviacio = Math.sqrt(variancia);
        console.log('Desviació estàndard:', desviacio);

        // Mínim i màxim
        const minim = Math.min(...notes);
        const maxim = Math.max(...notes);
        console.log('Mínim:', minim, 'Màxim:', maxim);

        return {
            mitjana,
            mediana,
            moda,
            desviacio,
            minim,
            maxim
        };
    }

    // Funció per calcular la suma
    function calcularSuma() {
        console.log('Calculant suma...');

        // Detectar si són inputs o selects
        const inputs = document.querySelectorAll('input.quickgrade[type="text"]');
        const selects = document.querySelectorAll('select.quickgrade');

        const esSelect = selects.length > 0;
        console.log('Tipus detectat:', esSelect ? 'SELECT' : 'INPUT');
        console.log('Nombre d\'elements trobats:', esSelect ? selects.length : inputs.length);

        if (esSelect) {
            // Processar selects
            return processarSelects(selects);
        } else {
            // Processar inputs numèrics
            return processarInputs(inputs);
        }
    }

    // Funció per processar selects
    function processarSelects(selects) {
        const opcions = [];
        const comptador = {};
        let senseNota = 0;

        // Obtenir totes les opcions possibles del primer select
        if (selects.length > 0) {
            const primeraSelect = selects[0];
            Array.from(primeraSelect.options).forEach(option => {
                if (option.value !== "-1") { // Ignorar "Sense qualificació"
                    opcions.push({
                        value: option.value,
                        text: option.text
                    });
                    comptador[option.value] = 0;
                }
            });
            console.log('Opcions detectades:', opcions);
        }

        // Comptar quants alumnes tenen cada opció
        selects.forEach((select, index) => {
            const valorSeleccionat = select.value;
            console.log(`Select ${index + 1}: valor="${valorSeleccionat}"`);

            if (valorSeleccionat === "-1") {
                senseNota++;
            } else if (comptador.hasOwnProperty(valorSeleccionat)) {
                comptador[valorSeleccionat]++;
            }
        });

        console.log('Comptador final:', comptador);
        console.log('Alumnes sense nota:', senseNota);

        return {
            esSelect: true,
            totalInputs: selects.length,
            opcions: opcions,
            comptador: comptador,
            senseNota: senseNota
        };
    }

    // Funció per processar inputs numèrics
    function processarInputs(inputs) {

        let sumaTots = 0;
        let sumaNoZero = 0;
        let comptadorNoZero = 0;
        let notesTotes = [];
        let notesNoZero = [];
        let notaMaxima = null;

        inputs.forEach((input, index) => {
            // Buscar la nota màxima del primer input
            if (index === 0 && !notaMaxima) {
                const nextSibling = input.nextSibling;
                if (nextSibling && nextSibling.textContent) {
                    const match = nextSibling.textContent.match(/\/\s*(\d+(?:,\d+)?)/);
                    if (match) {
                        notaMaxima = parseFloat(match[1].replace(',', '.'));
                        console.log('Nota màxima detectada:', notaMaxima);
                    }
                }
            }

            const valor = input.value.trim();
            console.log(`Input ${index + 1}: id="${input.id}", valor="${valor}"`);

            if (valor !== '') {
                // Convertir comes a punts per parsejar correctament
                const numero = parseFloat(valor.replace(',', '.'));
                if (!isNaN(numero)) {
                    // Sumar sempre (incloent zeros) per la mitjana de tots
                    sumaTots += numero;
                    notesTotes.push(numero);
                    console.log(`  -> Valor numèric: ${numero}, Suma total acumulada: ${sumaTots}`);

                    // Si no és zero, també comptar per la mitjana sense zeros
                    if (numero !== 0) {
                        sumaNoZero += numero;
                        comptadorNoZero++;
                        notesNoZero.push(numero);
                        console.log(`  -> No és zero, suma sense zeros: ${sumaNoZero}, comptador: ${comptadorNoZero}`);
                    } else {
                        console.log(`  -> És zero, no es compta per la mitjana sense zeros`);
                    }
                } else {
                    console.log(`  -> No és un número vàlid`);
                }
            } else {
                console.log(`  -> Camp buit, es compta com 0 per la mitjana de tots`);
                notesTotes.push(0);
            }
        });

        console.log(`Resultat final: SumaTots=${sumaTots}, TotalInputs=${inputs.length}, SumaNoZero=${sumaNoZero}, ComptadorNoZero=${comptadorNoZero}`);
        return {
            esSelect: false,
            sumaTots,
            totalInputs: inputs.length,
            sumaNoZero,
            comptadorNoZero,
            notesTotes,
            notesNoZero,
            notaMaxima
        };
    }

    // Funció per mostrar el resultat
    function mostrarResultat() {
        console.log('Intentant mostrar resultat...');

        // Buscar el div de navegació terciària
        const navDiv = document.querySelector('div.container-fluid.tertiary-navigation');

        if (!navDiv) {
            console.error('ERROR: No s\'ha trobat el div de navegació terciària');
            console.log('Divs container-fluid trobats:', document.querySelectorAll('div.container-fluid').length);
            return;
        }

        console.log('Div de navegació trobat:', navDiv);

        // Comprovar si ja existeix el div de resultats
        let resultatDiv = document.getElementById('suma-qualificacions');

        if (!resultatDiv) {
            console.log('Creant nou div de resultats...');
            // Crear el div de resultats
            resultatDiv = document.createElement('div');
            resultatDiv.id = 'suma-qualificacions';
            resultatDiv.style.cssText = 'margin-top: 15px; padding: 15px; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; color: #155724;';

            // Inserir després del div de navegació
            navDiv.parentNode.insertBefore(resultatDiv, navDiv.nextSibling);
            console.log('Div de resultats creat i inserit');
        } else {
            console.log('Div de resultats ja existeix, actualitzant...');
        }

        // Calcular la suma/comptador
        const resultats = calcularSuma();

        if (resultats.esSelect) {
            // Mostrar resultats per selects
            mostrarResultatsSelect(resultatDiv, resultats);
        } else {
            // Mostrar resultats per inputs numèrics
            mostrarResultatsInput(resultatDiv, resultats);
        }

        console.log('Contingut actualitzat correctament');
    }

    // Funció per mostrar resultats de selects
    function mostrarResultatsSelect(resultatDiv, resultats) {
        const { totalInputs, opcions, comptador, senseNota } = resultats;

        // Trobar el valor màxim per escalar les barres
        const maxCount = Math.max(...Object.values(comptador));
        const alturaMaxBarra = 200;

        let htmlGrafica = '<strong>Distribució de qualificacions:</strong><br>';
        htmlGrafica += '<div style="display: flex; align-items: flex-end; height: ' + (alturaMaxBarra + 60) + 'px; gap: 10px; margin-top: 10px; padding: 10px; background: #ffffff; border-radius: 5px; border: 1px solid #dee2e6;">';

        opcions.forEach(opcio => {
            const count = comptador[opcio.value] || 0;
            const alturaBarra = maxCount > 0 ? (count / maxCount) * alturaMaxBarra : 0;
            const colorBarra = count > 0 ? '#007bff' : '#dee2e6';

            htmlGrafica += `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px; color: #333;">${count}</div>
                    <div style="width: 100%; height: ${alturaBarra}px; background-color: ${colorBarra}; border-radius: 3px 3px 0 0;" title="${opcio.text}: ${count} alumnes"></div>
                    <div style="font-size: 11px; margin-top: 5px; text-align: center; color: #666; word-wrap: break-word; max-width: 100%;">${opcio.text}</div>
                </div>
            `;
        });

        htmlGrafica += '</div>';

        const textSenseNota = senseNota > 0 ? ` (incloent ${senseNota} alumnes sense nota)` : '';

        resultatDiv.innerHTML = `
            <strong>Total alumnes: ${totalInputs}${textSenseNota}</strong><br>
            ${htmlGrafica}
        `;
    }

    // Funció per mostrar resultats de inputs numèrics
    function mostrarResultatsInput(resultatDiv, resultats) {

        // Calcular la suma
        const { sumaTots, totalInputs, sumaNoZero, comptadorNoZero, notesTotes, notesNoZero, notaMaxima } = resultats;
        const mitjanaTots = totalInputs > 0 ? (sumaTots / totalInputs).toFixed(2) : '0.00';
        const mitjanaNoZero = comptadorNoZero > 0 ? (sumaNoZero / comptadorNoZero).toFixed(2) : '0.00';

        // Calcular estadístiques només amb notes > 0
        const stats = calcularEstadistiques(notesNoZero);

        // Calcular intervals si tenim nota màxima
        let htmlIntervals = '';
        if (notaMaxima && notaMaxima > 0) {
            const numIntervals = 10;
            const amplada = notaMaxima / numIntervals;
            const intervals = new Array(numIntervals).fill(0);

            console.log(`Creant ${numIntervals} intervals d'amplada ${amplada}`);

            notesTotes.forEach(nota => {
                let interval = Math.floor(nota / amplada);
                if (interval >= numIntervals) interval = numIntervals - 1; // Per notes exactament iguals a la màxima
                intervals[interval]++;
                console.log(`Nota ${nota} -> Interval ${interval}`);
            });

            // Trobar el valor màxim per escalar les barres
            const maxCount = Math.max(...intervals);
            const alturaMaxBarra = 200; // píxels

            htmlIntervals = '<br><strong>Distribució de les notes (incloent-hi zeros i no presentats):</strong><br>';
            htmlIntervals += '<div style="display: flex; align-items: flex-end; height: ' + (alturaMaxBarra + 60) + 'px; gap: 5px; margin-top: 10px; padding: 10px; background: #ffffff; border-radius: 5px; border: 1px solid #dee2e6;">';

            for (let i = 0; i < numIntervals; i++) {
                const min = (i * amplada).toFixed(1);
                const max = ((i + 1) * amplada).toFixed(1);
                const count = intervals[i];
                const alturaBarra = maxCount > 0 ? (count / maxCount) * alturaMaxBarra : 0;
                const colorBarra = count > 0 ? '#007bff' : '#dee2e6';

                htmlIntervals += `
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 5px; color: #333;">${count}</div>
                        <div style="width: 100%; height: ${alturaBarra}px; background-color: ${colorBarra}; border-radius: 3px 3px 0 0; transition: background-color 0.3s;" title="${min} - ${max}: ${count} notes"></div>
                        <div style="font-size: 10px; margin-top: 5px; text-align: center; color: #666;">${min}-${max}</div>
                    </div>
                `;
            }

            htmlIntervals += '</div>';
        }

        // Actualitzar el contingut
        resultatDiv.innerHTML = `
            <strong>Resum de qualificacions:</strong><br>
            <span title="Suma de totes les notes dividida pel nombre de notes. Representa el valor central del conjunt de dades." style="cursor: help; border-bottom: 1px dotted #666;">Mitjana</span>: <strong>${mitjanaNoZero}</strong> (${comptadorNoZero} alumnes)<br>
            <span title="Suma de totes les notes dividida pel nombre de notes. Representa el valor central del conjunt de dades." style="cursor: help; border-bottom: 1px dotted #666;">Mitjana</span> total: <strong>${mitjanaTots}</strong> (${totalInputs} alumnes, contant els 0 i els no presentats)<br>
            <br>
            <strong>Estadístiques (sense zeros ni no presentats):</strong><br>
            <span title="Valor que divideix les notes en dues meitats iguals. És la nota que queda al mig quan s'ordenen totes de menor a major. Menys sensible a valors extrems que la mitjana." style="cursor: help; border-bottom: 1px dotted #666;">Mediana</span>: <strong>${stats.mediana.toFixed(2)}</strong> |
            <span title="Nota que més es repeteix entre tots els alumnes. Indica quin valor és més freqüent al grup." style="cursor: help; border-bottom: 1px dotted #666;">Moda</span>: <strong>${stats.moda.toFixed(2)}</strong> |
            <span title="Mesura la dispersió de les notes respecte la mitjana. Un valor baix indica que les notes estan molt agrupades (grup homogeni). Un valor alt indica que hi ha molta variabilitat (grup heterogeni)." style="cursor: help; border-bottom: 1px dotted #666;">Desv. estàndard</span>: <strong>${stats.desviacio.toFixed(2)}</strong><br>
            Mínim: <strong>${stats.minim.toFixed(2)}</strong> |
            Màxim: <strong>${stats.maxim.toFixed(2)}</strong>
            ${htmlIntervals}
        `;

        console.log('Contingut actualitzat correctament');
    }
    window.addEventListener('load', function() {
        console.log('Pàgina carregada, esperant 0,5 segons...');
        setTimeout(function() {
            console.log('Timeout completat, executant mostrarResultat()');
            mostrarResultat();
            console.log('=== Script finalitzat ===');
        }, 500);
    });
})();