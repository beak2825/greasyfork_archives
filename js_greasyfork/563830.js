// ==UserScript==
// @name         SIGSA - Sincronizador Nutricional PRO v8.0 (Validacion Estricta)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Validación de 3 puntos (Fecha/Peso/Talla), Filtros restaurados, CSV separado.
// @author       TuNombre
// @match        *://swescuintla.mspas.gob.gt/sigsa5a/*
// @match        *://swescuintla.mspas.gob.gt/Sigsa5a/*
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      swescuintla.mspas.gob.gt
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563830/SIGSA%20-%20Sincronizador%20Nutricional%20PRO%20v80%20%28Validacion%20Estricta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563830/SIGSA%20-%20Sincronizador%20Nutricional%20PRO%20v80%20%28Validacion%20Estricta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // NUEVA URL PROPORCIONADA
    const GAS_URL = "https://script.google.com/macros/s/AKfycbws_WE5_yVkKzet88uc4qkvZ_JLEN9PD9zd6w8Njpx8vf85ghMN1W9a6ivh9Cjn7qUp6w/exec";

    // --- DICCIONARIOS ---
    const inputsSuple = [
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_27', libro: 'Vitamina A', rango: '6 Meses a < 1 Año', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_100', libro: 'Chispitas', rango: '6 Meses a < 1 Año', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_101', libro: 'Chispitas', rango: '1 a < 2 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_102', libro: 'Chispitas', rango: '1 a < 2 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_219', libro: 'Desparasitante Tableta', rango: '1 a < 2 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_220', libro: 'Desparasitante Tableta', rango: '1 a < 2 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_103', libro: 'Chispitas', rango: '2 a < 3 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_104', libro: 'Chispitas', rango: '2 a < 3 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_52', libro: 'Desparasitante Frasco', rango: '2 a < 3 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_53', libro: 'Desparasitante Frasco', rango: '2 a < 3 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_105', libro: 'Chispitas', rango: '3 a < 4 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_106', libro: 'Chispitas', rango: '3 a < 4 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_64', libro: 'Desparasitante Frasco', rango: '3 a < 4 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_65', libro: 'Desparasitante Frasco', rango: '3 a < 4 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_107', libro: 'Chispitas', rango: '4 a < 5 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_108', libro: 'Chispitas', rango: '4 a < 5 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_76', libro: 'Desparasitante Frasco', rango: '4 a < 5 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_77', libro: 'Desparasitante Frasco', rango: '4 a < 5 Años', dosis: '2a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_221', libro: 'Desparasitante Frasco', rango: '5 a < 6 Años', dosis: '1a' },
        { id: 'ctl00_MainContent_frmSigsa5a_txtDosis_222', libro: 'Desparasitante Frasco', rango: '5 a < 6 Años', dosis: '2a' },
        // ACF con su Sufijo asociado para validación
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_80', libro: 'ACF', rango: '6 meses', dosis: 'auto', type: 'checkbox', suffix: '80' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_81', libro: 'ACF', rango: '7 meses', dosis: 'auto', type: 'checkbox', suffix: '81' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_82', libro: 'ACF', rango: '8 meses', dosis: 'auto', type: 'checkbox', suffix: '82' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_83', libro: 'ACF', rango: '9 meses', dosis: 'auto', type: 'checkbox', suffix: '83' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_84', libro: 'ACF', rango: '10 meses', dosis: 'auto', type: 'checkbox', suffix: '84' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_85', libro: 'ACF', rango: '11 meses', dosis: 'auto', type: 'checkbox', suffix: '85' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_86', libro: 'ACF', rango: '12 meses', dosis: 'auto', type: 'checkbox', suffix: '86' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_87', libro: 'ACF', rango: '13 meses', dosis: 'auto', type: 'checkbox', suffix: '87' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_88', libro: 'ACF', rango: '14 meses', dosis: 'auto', type: 'checkbox', suffix: '88' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_89', libro: 'ACF', rango: '15 meses', dosis: 'auto', type: 'checkbox', suffix: '89' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_90', libro: 'ACF', rango: '16 meses', dosis: 'auto', type: 'checkbox', suffix: '90' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_91', libro: 'ACF', rango: '17 meses', dosis: 'auto', type: 'checkbox', suffix: '91' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_92', libro: 'ACF', rango: '18 meses', dosis: 'auto', type: 'checkbox', suffix: '92' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_93', libro: 'ACF', rango: '19 meses', dosis: 'auto', type: 'checkbox', suffix: '93' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_94', libro: 'ACF', rango: '20 meses', dosis: 'auto', type: 'checkbox', suffix: '94' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_95', libro: 'ACF', rango: '21 meses', dosis: 'auto', type: 'checkbox', suffix: '95' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_96', libro: 'ACF', rango: '22 meses', dosis: 'auto', type: 'checkbox', suffix: '96' },
        { id: 'ctl00_MainContent_frmSigsa5a_chkAlimentoC_97', libro: 'ACF', rango: '23 meses', dosis: 'auto', type: 'checkbox', suffix: '97' }
    ];

    const pesoTallaSuffixes = [
        { s: '74', r: '0 a 28 dias' }, { s: '75', r: '1 mes' }, { s: '76', r: '2 meses' }, { s: '77', r: '3 meses' },
        { s: '78', r: '4 meses' }, { s: '79', r: '5 meses' }, { s: '80', r: '6 meses' }, { s: '81', r: '7 meses' },
        { s: '82', r: '8 meses' }, { s: '83', r: '9 meses' }, { s: '84', r: '10 meses' }, { s: '85', r: '11 meses' },
        { s: '86', r: '12 meses' }, { s: '87', r: '13 meses' }, { s: '88', r: '14 meses' }, { s: '89', r: '15 meses' },
        { s: '90', r: '16 meses' }, { s: '91', r: '17 meses' }, { s: '92', r: '18 meses' }, { s: '93', r: '19 meses' },
        { s: '94', r: '20 meses' }, { s: '95', r: '21 meses' }, { s: '96', r: '22 meses' }, { s: '97', r: '23 meses' },
        { s: '98', r: '2 a < 3 Primer' }, { s: '99', r: '2 a < 3 Segundo' }, { s: '100', r: '2 a < 3 Tercer' }, { s: '101', r: '2 a < 3 Cuarto' },
        { s: '102', r: '3 a < 4 Primer' }, { s: '103', r: '3 a < 4 Segundo' }, { s: '104', r: '4 a < 5 Primer' }, { s: '105', r: '4 a < 5 Segundo' }
    ];

    let initialValues = {};
    let currentRUP = "";
    let serverDateOffset = 0;
    let currentTab = 'suple';

    GM_addStyle(`
        #panel-control-sigsa { position: fixed; bottom: 20px; right: 20px; z-index: 2147483647; }
        .btn-panel { background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-weight: bold; font-size: 13px; margin-left: 5px; }
        .pulse-red { animation: pulse-animation 2s infinite; background-color: #dc3545; }
        @keyframes pulse-animation { 0% { box-shadow: 0 0 0 0px rgba(220, 53, 69, 0.7); } 100% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); } }

        #dash-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 95%; max-width: 1250px; height: 90%; background: white; border-radius: 8px; box-shadow: 0 0 25px rgba(0,0,0,0.5); z-index: 2147483647; flex-direction: column; font-family: 'Segoe UI', Arial, sans-serif; }
        #dash-header { padding: 15px; background: #343a40; color: white; border-radius: 8px 8px 0 0; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .tab-buttons { display: flex; gap: 5px; }
        .tab-btn { padding: 8px 15px; border: none; cursor: pointer; background: #495057; color: #ccc; border-radius: 4px 4px 0 0; font-weight: bold; }
        .tab-btn.active { background: #f8f9fa; color: #343a40; }

        #dash-content { flex: 1; overflow-y: auto; padding: 20px; background: #f8f9fa; }
        #dash-footer { padding: 15px; background: white; border-top: 1px solid #dee2e6; display: flex; gap: 10px; justify-content: flex-end; align-items: center; }

        table.sigsa-table { width: 100%; border-collapse: collapse; font-size: 11px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        table.sigsa-table th { background-color: #007bff; color: white; padding: 8px; text-align: left; position: sticky; top: 0; z-index: 2; border-right: 1px solid rgba(255,255,255,0.2); }
        table.sigsa-table td { border-bottom: 1px solid #dee2e6; padding: 6px 8px; color: #333; vertical-align: middle; }
        .filter-select { width: 100%; padding: 2px; margin-top: 5px; font-size: 10px; border: 1px solid #ccc; border-radius: 3px; color: #333; }

        .btn-action { padding: 5px 10px; cursor: pointer; border: none; border-radius: 4px; color: white; font-size: 11px; }
        .btn-delete { background-color: #dc3545; }
        .btn-sync { background-color: #28a745; }
        .btn-csv { background-color: #17a2b8; }
        .btn-reload { background-color: #ffc107; color: black; margin-right: auto; }
        .btn-close { background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; }

        .status-dot { height: 12px; width: 12px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .status-red { background-color: #dc3545; }
        .status-green { background-color: #28a745; }
        .status-orange { background-color: #fd7e14; }

        #global-search { padding: 5px; border-radius: 4px; border: none; width: 250px; color: black; }
        #view-counter { color: #ccc; font-size: 12px; margin-left: 15px; }
    `);

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    window.addEventListener('load', function() { setTimeout(init, 1500); });

    function init() {
        console.log("SIGSA v8.0 Iniciado");
        createUI();
        calculateServerTimeOffset();

        const observer = new MutationObserver((mutations) => {
            let shouldReattach = false;
            mutations.forEach((mutation) => { if (mutation.addedNodes.length) shouldReattach = true; });
            if (shouldReattach) {
                attachSaveListener();
                checkIfChildLoaded();
                if (!document.getElementById('panel-control-sigsa')) createUI();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        attachSaveListener();
        checkIfChildLoaded();
    }

    function calculateServerTimeOffset() {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: window.location.href,
            onload: function(response) {
                let serverDateHeader = response.responseHeaders.match(/Date: (.*)/i);
                if (serverDateHeader && serverDateHeader[1]) {
                    serverDateOffset = new Date(serverDateHeader[1]).getTime() - new Date().getTime();
                }
            }
        });
    }

    function getCurrentDateFormatted() {
        let now = new Date(new Date().getTime() + serverDateOffset);
        return formatDateShort(now);
    }

    function checkIfChildLoaded() {
        const rupInput = document.getElementById('ctl00_MainContent_frmSigsa5a_txtRUP');
        if (rupInput && rupInput.value && rupInput.value !== currentRUP) {
            setTimeout(() => { currentRUP = rupInput.value; captureInitialValues(); }, 1000);
        }
    }

    function attachSaveListener() {
        const btnGuardar = document.getElementById('ctl00_MainContent_frmSigsa5a_btnGuardar1');
        if (btnGuardar && !btnGuardar.classList.contains('script-attached')) {
            btnGuardar.addEventListener('mousedown', analyzeAndSave);
            btnGuardar.classList.add('script-attached');
        }
    }

    function getInputValue(id, type) {
        let el = document.getElementById(id);
        if (!el) return "";
        if (type === 'checkbox') return el.checked ? "checked" : "unchecked";
        return el.value.trim();
    }

    function captureInitialValues() {
        // Suplementos y ACF
        inputsSuple.forEach(item => {
            initialValues[item.id] = getInputValue(item.id, item.type);
        });
        // Peso y Talla
        pesoTallaSuffixes.forEach(item => {
            initialValues['ctl00_MainContent_frmSigsa5a_txtTallaFecha_' + item.s] = getInputValue('ctl00_MainContent_frmSigsa5a_txtTallaFecha_' + item.s);
        });

        const panelBtn = document.getElementById('open-dash');
        if(panelBtn) {
            let oldText = panelBtn.innerText;
            panelBtn.innerText = "✅ Niño Cargado";
            setTimeout(() => panelBtn.innerText = oldText, 2000);
        }
    }

    // ==========================================
    // VALIDACIÓN ESTRICTA (FECHA + PESO + TALLA)
    // ==========================================
    function validateRowRequirement(suffix) {
        let dateVal = getInputValue('ctl00_MainContent_frmSigsa5a_txtTallaFecha_' + suffix);
        let weightVal = getInputValue('ctl00_MainContent_frmSigsa5a_txtPesoLibras_' + suffix);
        let heightVal = getInputValue('ctl00_MainContent_frmSigsa5a_txtTallaMedicion_' + suffix);

        // Si CUALQUIERA de los 3 está vacío, devuelve FALSO
        if (!dateVal || !weightVal || !heightVal) {
            return false;
        }
        return { dateVal, weightVal, heightVal }; // Retorna los valores validados
    }

    // ==========================================
    // LÓGICA DE DETECCIÓN Y GUARDADO
    // ==========================================

    function analyzeAndSave() {
        let recordsToProcess = [];

        // 1. SUPLEMENTOS Y ACF
        inputsSuple.forEach(item => {
            let currentVal = getInputValue(item.id, item.type);
            let prevVal = initialValues[item.id] || (item.type === 'checkbox' ? "unchecked" : "");

            if (currentVal !== "" && currentVal !== prevVal) {
                // ACF CHECKBOX LOGIC
                if (item.type === 'checkbox') {
                    if (currentVal === "checked") {
                        // VALIDACIÓN ESTRICTA: ACF solo se guarda si la fila de peso/talla correspondiente está completa
                        let reqs = validateRowRequirement(item.suffix);
                        if (reqs) {
                            let acfDose = calculateACFDose();
                            // ACF usa la fecha de la fila de peso (reqs.dateVal), no la del sistema
                            let record = buildRecord(item, reqs.dateVal, acfDose);
                            if(record) recordsToProcess.push(record);
                        } else {
                            console.log("ACF marcado pero faltan datos en la fila (Fecha/Peso/Talla). Ignorado.");
                        }
                    }
                } else {
                    // OTROS SUPLEMENTOS (Inputs directos)
                    let record = buildRecord(item, currentVal, item.dosis);
                    if(record) recordsToProcess.push(record);
                }
            }
        });

        // 2. PESO Y TALLA
        pesoTallaSuffixes.forEach(item => {
            let idFecha = 'ctl00_MainContent_frmSigsa5a_txtTallaFecha_' + item.s;
            let currentVal = getInputValue(idFecha);
            let prevVal = initialValues[idFecha] || "";

            // Solo intentar guardar si cambió la fecha O si la fecha está llena y cambió peso/talla
            // Simplificación: si la fila es válida y algo cambió respecto al inicio
            let reqs = validateRowRequirement(item.s); // Check estricto

            if (reqs && (currentVal !== prevVal)) {
                 let record = buildPesoTallaRecord(item, reqs.dateVal);
                 if (record) recordsToProcess.push(record);
            }
        });

        if (recordsToProcess.length > 0) {
            saveToLocalSmart(recordsToProcess);
            captureInitialValues();
            updateDashboard();

            const panelBtn = document.getElementById('open-dash');
            if(panelBtn) {
                panelBtn.classList.add('pulse-red');
                panelBtn.innerText = `💾 ${recordsToProcess.length} Guardados`;
                setTimeout(() => {
                    panelBtn.classList.remove('pulse-red');
                    panelBtn.innerText = "📊 Panel Nutrición";
                }, 3000);
            }
        }
    }

    function calculateACFDose() {
        let count = 0;
        inputsSuple.forEach(i => {
            if (i.libro === 'ACF' && initialValues[i.id] === 'checked') count++;
        });
        return (count + 1) + "a";
    }

    function saveToLocalSmart(newRecords) {
        let current = JSON.parse(localStorage.getItem('sigsa_records') || "[]");
        newRecords.forEach(newItem => {
            let existingIndex = -1;
            if (newItem.libroDestino === "Peso y talla") {
                existingIndex = current.findIndex(r => r.rup === newItem.rup && r.libroDestino === newItem.libroDestino && r.fechaAdmin === newItem.fechaAdmin);
            } else {
                existingIndex = current.findIndex(r => r.rup === newItem.rup && r.libroDestino === newItem.libroDestino && r.dosis === newItem.dosis);
            }

            if (existingIndex !== -1) {
                // Actualizar si algo cambió
                if (current[existingIndex].fechaAdmin !== newItem.fechaAdmin || current[existingIndex].peso !== newItem.peso) {
                    current[existingIndex] = { ...newItem, id: current[existingIndex].id, status: 'updated' };
                }
            } else {
                current.push(newItem);
            }
        });
        localStorage.setItem('sigsa_records', JSON.stringify(current));
    }

    function buildRecord(itemConfig, dateValue, dynamicDose) {
        try {
            let common = getCommonData();
            let birthDateObj = parseSpanishDate(common.nacimiento);
            let adminDateObj = parseInputDate(dateValue);
            let edadCalc = calculateAge(birthDateObj, adminDateObj);
            let finalDose = dynamicDose || itemConfig.dosis;

            return {
                id: Date.now() + Math.random().toString(16).slice(2),
                fechaIngreso: getCurrentDateFormatted(),
                libroDestino: itemConfig.libro,
                servicio: common.servicio,
                personal: common.personal,
                nombre: common.nombre,
                rup: common.rup,
                fechaNac: formatDateShort(birthDateObj),
                edadCalculada: edadCalc,
                rangoEdad: itemConfig.rango,
                dosis: finalDose,
                fechaAdmin: dateValue,
                municipio: common.municipio,
                comunidad: common.comunidad,
                direccion: common.dir,
                status: 'pending',
                timestamp: new Date().toISOString()
            };
        } catch (e) { return null; }
    }

    function buildPesoTallaRecord(item, dateValue) {
        try {
            let common = getCommonData();
            let lbs = getInputValue('ctl00_MainContent_frmSigsa5a_txtPesoLibras_' + item.s);
            let oz = getInputValue('ctl00_MainContent_frmSigsa5a_txtPesoOnz_' + item.s);
            let talla = getInputValue('ctl00_MainContent_frmSigsa5a_txtTallaMedicion_' + item.s);
            let genero = getInputValue('ctl00_MainContent_frmSigsa5a_txtSexo');

            let birthDateObj = parseSpanishDate(common.nacimiento);
            let adminDateObj = parseInputDate(dateValue);
            let edadCalc = calculateAge(birthDateObj, adminDateObj);

            return {
                id: Date.now() + Math.random().toString(16).slice(2),
                fechaIngreso: getCurrentDateFormatted(),
                libroDestino: 'Peso y talla',
                servicio: common.servicio,
                personal: common.personal,
                nombre: common.nombre,
                genero: genero,
                fechaNac: formatDateShort(birthDateObj),
                edadCalculada: edadCalc,
                rup: common.rup,
                municipio: common.municipio,
                comunidad: common.comunidad,
                direccion: common.dir,
                peso: `${lbs}.${oz}`,
                talla: talla,
                fechaAdmin: dateValue,
                status: 'pending',
                timestamp: new Date().toISOString()
            };
        } catch (e) { return null; }
    }

    function getCommonData() {
        let rawService = document.getElementById('ctl00_lblRedServicioUsuario').innerText || "";
        let serviceParts = rawService.split('|');
        let servicioClean = serviceParts.length >= 3 ? serviceParts[2].trim() : rawService;
        servicioClean = servicioClean.replace(/^\(CAP\)\s*/, '').replace(/^\(P\/S\)\s*/, '');

        let personalSelect = document.getElementById('ctl00_MainContent_frmSigsa5a_drpNombreResponsable');
        let personalName = (personalSelect && personalSelect.selectedIndex !== -1) ? personalSelect.options[personalSelect.selectedIndex].text : "";

        let rup = document.getElementById('ctl00_MainContent_frmSigsa5a_txtRUP').value;
        let rawName = document.getElementById('ctl00_MainContent_frmSigsa5a_txtNombre').value;
        let rawBirth = document.getElementById('ctl00_MainContent_frmSigsa5a_txtNacimiento').value;
        let dir = document.getElementById('ctl00_MainContent_frmSigsa5a_txtDireccionExacta').value || "";

        let rawComunidad = document.getElementById('ctl00_MainContent_frmSigsa5a_TxtComunidad').value;
        let comunidadClean = rawComunidad.includes('-') ? rawComunidad.split('-').pop().trim() : rawComunidad;
        let municipio = document.getElementById('ctl00_MainContent_frmSigsa5a_TxtMunicipio').value;

        return { servicio: servicioClean, personal: personalName, rup, nombre: formatName(rawName), nacimiento: rawBirth, dir, comunidad: comunidadClean, municipio };
    }

    function formatName(n){if(!n)return"";n=n.toUpperCase().trim();if(n.includes(',')){let p=n.split(',');if(p.length===2)return(p[1].trim()+" "+p[0].trim())}else{let p=n.split(' ');if(p.length>1){let a=p.shift();return(p.join(' ')+" "+a)}}return n;}
    function parseSpanishDate(s){if(!s)return new Date();let c=s.toLowerCase().replace(/\s+de\s+/g,' ').replace(/\s+del\s+/g,' ');let p=c.split(' ');if(p.length<3)return new Date();let m={"enero":0,"febrero":1,"marzo":2,"abril":3,"mayo":4,"junio":5,"julio":6,"agosto":7,"septiembre":8,"octubre":9,"noviembre":10,"diciembre":11};return new Date(parseInt(p[2]),m[p[1]]||0,parseInt(p[0]));}
    function parseInputDate(s){if(!s)return new Date();let p=s.split('/');return new Date(p[2],p[1]-1,p[0]);}
    function calculateAge(b,a){let y=a.getFullYear()-b.getFullYear();let m=a.getMonth()-b.getMonth();if(m<0||(m===0&&a.getDate()<b.getDate())){y--;m+=12;}if(a.getDate()<b.getDate())m--;if(y<0)y=0;if(m<0)m=0;return`${y} año(s) ${m} mes(es)`;}
    function formatDateShort(d){if(isNaN(d.getTime()))return"";let dd=d.getDate();let mm=d.getMonth()+1;let yy=d.getFullYear();return`${dd<10?'0'+dd:dd}/${mm<10?'0'+mm:mm}/${yy}`;}

    // ==========================================
    // UI DASHBOARD (FILTROS + BUSCADOR)
    // ==========================================

    function createUI() {
        if (document.getElementById('panel-control-sigsa')) return;

        let container = document.createElement('div');
        container.id = 'panel-control-sigsa';
        container.innerHTML = `<button class="btn-panel" id="open-dash">📊 Panel Nutrición</button>`;
        document.body.appendChild(container);

        let modal = document.createElement('div');
        modal.id = 'dash-modal';
        modal.innerHTML = `
            <div id="dash-header">
                <div class="header-top">
                    <div style="display:flex; align-items:center;">
                        <h3>🔍 Monitor de Registros</h3>
                        <span id="view-counter">Viendo: 0</span>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span>🔎</span>
                        <input type="text" id="global-search" placeholder="Buscar por Nombre o RUP...">
                        <button class="btn-close" id="close-dash">&times;</button>
                    </div>
                </div>
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="suple">💊 Suplementación / ACF</button>
                    <button class="tab-btn" data-tab="peso">⚖️ Peso y Talla</button>
                </div>
            </div>
            <div id="dash-content">
                <table class="sigsa-table" id="data-table">
                    <thead id="table-head"></thead>
                    <tbody id="dash-body"></tbody>
                </table>
            </div>
            <div id="dash-footer">
                <button class="btn-panel btn-reload" id="btn-force-reload">🔄 Re-leer Pantalla</button>
                <button class="btn-panel btn-sync" id="btn-sync-cloud">☁️ Sincronizar Drive</button>
                <button class="btn-panel btn-csv" id="btn-download-suple">⬇️ CSV Suple/ACF</button>
                <button class="btn-panel btn-csv" id="btn-download-peso">⬇️ CSV Peso</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('open-dash').addEventListener('click', () => { document.getElementById('dash-modal').style.display = 'flex'; updateDashboard(); });
        document.getElementById('close-dash').addEventListener('click', () => document.getElementById('dash-modal').style.display = 'none');
        document.getElementById('btn-sync-cloud').addEventListener('click', syncToCloud);
        document.getElementById('btn-download-suple').addEventListener('click', () => downloadCSV('suple'));
        document.getElementById('btn-download-peso').addEventListener('click', () => downloadCSV('peso'));
        document.getElementById('btn-force-reload').addEventListener('click', () => { captureInitialValues(); alert("Datos re-leídos."); });

        document.getElementById('global-search').addEventListener('keyup', applyFilters);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentTab = this.getAttribute('data-tab');
                updateDashboard();
            });
        });
    }

    function renderHeader() {
        let thead = document.getElementById('table-head');
        let html = '';
        if (currentTab === 'suple') {
            html = `<tr>
                <th>Est</th>
                <th>Libro <br><select class="filter-select" data-col="libroDestino"><option value="">Todos</option></select></th>
                <th>Servicio <br><select class="filter-select" data-col="servicio"><option value="">Todos</option></select></th>
                <th>Niño/a</th>
                <th>Edad <br><select class="filter-select" data-col="edadCalculada"><option value="">Todos</option></select></th>
                <th>Dosis <br><select class="filter-select" data-col="dosis"><option value="">Todos</option></select></th>
                <th>Fecha <br><select class="filter-select" data-col="fechaAdmin"><option value="">Todos</option></select></th>
                <th>Acciones</th>
            </tr>`;
        } else {
             html = `<tr>
                <th>Est</th>
                <th>Servicio <br><select class="filter-select" data-col="servicio"><option value="">Todos</option></select></th>
                <th>Niño/a</th>
                <th>Edad <br><select class="filter-select" data-col="edadCalculada"><option value="">Todos</option></select></th>
                <th>Peso</th>
                <th>Talla</th>
                <th>Fecha <br><select class="filter-select" data-col="fechaAdmin"><option value="">Todos</option></select></th>
                <th>Acciones</th>
            </tr>`;
        }
        thead.innerHTML = html;
        document.querySelectorAll('.filter-select').forEach(sel => sel.addEventListener('change', applyFilters));
    }

    function updateDashboard() {
        renderHeader();
        let records = JSON.parse(localStorage.getItem('sigsa_records') || "[]");
        let filteredByTab = records.filter(r => currentTab === 'suple' ? r.libroDestino !== 'Peso y talla' : r.libroDestino === 'Peso y talla');
        populateFilters(filteredByTab);
        applyFilters();
    }

    function populateFilters(records) {
        document.querySelectorAll('.filter-select').forEach(sel => {
            if(sel.options.length > 1) return;
            let col = sel.dataset.col;
            let vals = [...new Set(records.map(r => r[col]))].sort();
            vals.forEach(v => {
                let opt = document.createElement('option');
                opt.value = v; opt.innerText = v;
                sel.appendChild(opt);
            });
        });
    }

    function applyFilters() {
        let records = JSON.parse(localStorage.getItem('sigsa_records') || "[]");
        let tbody = document.getElementById('dash-body');
        tbody.innerHTML = '';

        let globalSearch = document.getElementById('global-search').value.toLowerCase();
        let filters = {};
        document.querySelectorAll('.filter-select').forEach(sel => { filters[sel.dataset.col] = sel.value; });

        let filtered = records.filter(r => {
            if (currentTab === 'suple' && r.libroDestino === 'Peso y talla') return false;
            if (currentTab === 'peso' && r.libroDestino !== 'Peso y talla') return false;

            let matchGlobal = !globalSearch || (r.nombre.toLowerCase().includes(globalSearch) || r.rup.includes(globalSearch));
            let matchColumns = true;
            for (let key in filters) {
                if (filters[key] && r[key] !== filters[key]) matchColumns = false;
            }
            return matchGlobal && matchColumns;
        });

        // Actualizar Contador
        document.getElementById('view-counter').innerText = `Viendo: ${filtered.length}`;

        filtered.sort((a, b) => (a.status === 'pending' || a.status === 'updated' ? -1 : 1));

        filtered.forEach(r => {
            let row = document.createElement('tr');
            let colorClass = r.status === 'synced' ? 'status-green' : (r.status === 'updated' ? 'status-orange' : 'status-red');
            let cols = '';

            if (currentTab === 'suple') {
                cols = `<td>${r.libroDestino}</td><td>${r.servicio}</td>
                        <td style="font-weight:bold;">${r.nombre}<br><small style="color:#666">${r.rup}</small></td>
                        <td>${r.edadCalculada}</td><td>${r.dosis}<br><small>${r.rangoEdad}</small></td><td>${r.fechaAdmin}</td>`;
            } else {
                cols = `<td>${r.servicio}</td>
                        <td style="font-weight:bold;">${r.nombre}<br><small>${r.rup}</small></td>
                        <td>${r.edadCalculada}</td><td>${r.peso}</td><td>${r.talla}</td><td>${r.fechaAdmin}</td>`;
            }

            row.innerHTML = `<td style="text-align:center;"><span class="status-dot ${colorClass}" title="${r.status}"></span></td>
                             ${cols}
                             <td><button class="btn-action btn-delete" data-id="${r.id}">🗑️</button></td>`;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                let id = this.getAttribute('data-id');
                let rec = records.find(r => r.id === id);
                if (confirm("¿Eliminar?")) {
                    if (rec.status !== 'pending') deleteFromCloud(rec, id);
                    else deleteLocal(id);
                }
            });
        });
    }

    function deleteLocal(id) {
        let current = JSON.parse(localStorage.getItem('sigsa_records') || "[]").filter(r => r.id !== id);
        localStorage.setItem('sigsa_records', JSON.stringify(current));
        updateDashboard();
    }

    function syncToCloud() {
        let records = JSON.parse(localStorage.getItem('sigsa_records') || "[]");
        let pending = records.filter(r => r.status === 'pending' || r.status === 'updated');
        if (!pending.length) return alert("Nada nuevo.");

        let btn = document.getElementById('btn-sync-cloud');
        let old = btn.innerText; btn.disabled = true;

        function sendNext(i) {
            if (i >= pending.length) { btn.innerText = old; btn.disabled = false; updateDashboard(); alert("Terminado."); return; }
            btn.innerText = `Enviando ${i+1}/${pending.length}...`;

            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: "POST", url: GAS_URL,
                    data: JSON.stringify({ action: "save", ...pending[i] }),
                    headers: { "Content-Type": "application/json" },
                    onload: function(r) {
                        let res = JSON.parse(r.responseText);
                        if (res.result === "success") {
                            let all = JSON.parse(localStorage.getItem('sigsa_records'));
                            let it = all.find(x => x.id === pending[i].id);
                            if(it) it.status = 'synced';
                            localStorage.setItem('sigsa_records', JSON.stringify(all));
                        }
                        sendNext(i+1);
                    },
                    onerror: () => sendNext(i+1)
                });
            }, 300); // 300ms de pausa para estabilidad
        }
        sendNext(0);
    }

    function deleteFromCloud(rec, localId) {
        GM_xmlhttpRequest({
            method: "POST", url: GAS_URL,
            data: JSON.stringify({ action: "delete", rup: rec.rup, fechaAdmin: rec.fechaAdmin, dosis: rec.dosis, libroDestino: rec.libroDestino }),
            headers: { "Content-Type": "application/json" },
            onload: () => deleteLocal(localId)
        });
    }

    function downloadCSV(type) {
        let records = JSON.parse(localStorage.getItem('sigsa_records') || "[]");

        // Filtrar según el botón presionado
        if (type === 'peso') {
            records = records.filter(r => r.libroDestino === 'Peso y talla');
        } else {
            records = records.filter(r => r.libroDestino !== 'Peso y talla');
        }

        if (!records.length) return alert("Sin datos para este tipo.");

        let csv = "\uFEFF"; // BOM

        if (type === 'peso') {
            csv += "Fecha Ingreso;Servicio;Personal;Nombre del Niño;Genero;Fecha naciemiento;Edad;RUP;Municipio;Comunidad;Direccion Exacta;Peso Lbs.Oz;Talla;Fecha Administracion\n";
        } else {
            csv += "Libro;Fecha Ingreso;Servicio;Personal;Nombre del Niño;Fecha naciemiento;Edad;RUP;Municipio;Comunidad;Direccion Exacta;Rango edad;Dosis;Fecha Administracion\n";
        }

        records.forEach(r => {
            let rupFixed = `="${r.rup}"`; // Fix Excel

            if (type === 'peso') {
                 csv += [
                    r.fechaIngreso, r.servicio, r.personal, r.nombre, r.genero, r.fechaNac, r.edadCalculada,
                    rupFixed, r.municipio, r.comunidad, r.direccion, r.peso, r.talla, r.fechaAdmin
                ].map(f => `"${String(f||"").replace(/"/g, '""')}"`).join(";") + "\n";
            } else {
                 csv += [
                    r.libroDestino, r.fechaIngreso, r.servicio, r.personal, r.nombre, r.fechaNac, r.edadCalculada,
                    rupFixed, r.municipio, r.comunidad, r.direccion, r.rangoEdad, r.dosis, r.fechaAdmin
                ].map(f => `"${String(f||"").replace(/"/g, '""')}"`).join(";") + "\n";
            }
        });

        let link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = `sigsa_${type}.csv`;
        link.click();
    }

})();