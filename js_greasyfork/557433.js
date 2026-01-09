// ==UserScript==
// @name         Reporte Vacunación MSPAS (V61 - Anti-Freeze Paginado)
// @namespace    http://tampermonkey.net/
// @version      61.0
// @description  V60 + Paginación en Dashboard: Soluciona el congelamiento al ver historiales masivos mostrando los datos por páginas de 50 registros. Lógica de Data-ID intacta.
// @author       Gemini AI
// @match        *://*.oraclecloudapps.com/ords/r/vacunacion/vacunacion/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557433/Reporte%20Vacunaci%C3%B3n%20MSPAS%20%28V61%20-%20Anti-Freeze%20Paginado%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557433/Reporte%20Vacunaci%C3%B3n%20MSPAS%20%28V61%20-%20Anti-Freeze%20Paginado%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* jshint esversion: 6 */

    // =================================================
    // CONFIGURACIÓN
    // =================================================
    const URL_GOOGLE_SHEET = "https://script.google.com/macros/s/AKfycbzT3rWlONdKIOQfbaTqABKA1Y4PNj4iZ1LvVZsOVIV_Xi_IKIUv5_99gKIOrzj9XlQQ/exec";
    // =================================================

    const ID_NOMBRE_DISPLAY = "P701_NOMBRE_DISPLAY";
    const ID_CUI_DISPLAY    = "P701_CUI_P_DISPLAY";
    const ID_SEXO_DISPLAY   = "P701_SEXO_DISPLAY";
    const ID_NAC_DISPLAY    = "P701_NACIONALIDAD_DISPLAY";
    const ID_FEC_NAC_DISP   = "P701_FECHA_NACIMIENTO_DISPLAY";

    const ID_FECHA_INPUT    = "P702_FECHA_VACUNA_input";
    const ID_VACUNA_SELECT  = "P702_ID_CONFIGURACION_VACUNA_DOSIS";

    const TEXTO_EXITO_OTRAS = "El registro ha sido procesado exitosamente";
    const TEXTO_EXITO_REGULAR = "Los cambios han sido procesados exitosamente";

    const ID_INPUT_SERVICIO_PARAM = "P216_IDTS";
    const STORAGE_KEY_HISTORIAL = "mspas_historial_hashes_v1";

    // --- VARIABLES GLOBALES DE ESTADO ---
    let cuiActualSesion = "";
    // MAPA para guardar la FOTO EXACTA usando el data-id como llave
    let snapshotGridInicial = new Map();

    // ========================================================================
    // 1. LÓGICA DE REINICIO DIARIO (Auto-Reset)
    // ========================================================================
    function chequearCambioDia() {
        const hoy = new Date().toLocaleDateString('es-GT');
        const ultimoDiaRegistrado = localStorage.getItem('mspas_fecha_activa');

        if (ultimoDiaRegistrado !== hoy) {
            localStorage.setItem('reporte_regular_diario', '[]');
            localStorage.setItem('reporte_vacunacion_diario', '[]');
            localStorage.setItem('mspas_fecha_activa', hoy);
            window.dispatchEvent(new Event('storage'));
        }
    }
    chequearCambioDia();

    // ========================================================================
    // 2. UTILIDADES Y CARGA SEGURA
    // ========================================================================
    async function obtenerFechaHoraReal() {
        try {
            const response = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
            const dateHeader = response.headers.get('Date');
            if (dateHeader) return new Date(dateHeader);
        } catch (e) { }
        return new Date();
    }

    function safeLoad(key) {
        try {
            let raw = localStorage.getItem(key);
            if (!raw) return [];
            let parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.map(d => ({
                ...d,
                synced: (d.synced === true),
                wasEdited: (d.wasEdited === true),
                esquema: d.esquema || 'otras',
                hash: d.hash || null
            }));
        } catch(e) { return []; }
    }

    function getServicioGuardado() { return localStorage.getItem('mspas_servicio_actual') || "Detectando..."; }

    function guardarRegistro(nuevoRegistro, tipo) {
        chequearCambioDia();

        nuevoRegistro.synced = false;
        nuevoRegistro.wasEdited = false;
        nuevoRegistro.esquema = tipo;

        const keyDiario = tipo === 'regular' ? 'reporte_regular_diario' : 'reporte_vacunacion_diario';
        const keyAcum = tipo === 'regular' ? 'reporte_regular_acumulado' : 'reporte_vacunacion_acumulado';

        const diario = safeLoad(keyDiario);
        diario.push(nuevoRegistro);
        localStorage.setItem(keyDiario, JSON.stringify(diario));

        const acumulado = safeLoad(keyAcum);
        acumulado.push(nuevoRegistro);
        localStorage.setItem(keyAcum, JSON.stringify(acumulado));

        localStorage.setItem('mspas_fecha_activa', new Date().toLocaleDateString('es-GT'));
        window.dispatchEvent(new Event('storage'));
    }

    function mostrarNotificacion(mensaje, colorFondo = "#27ae60", duracion = 3000) {
        const notif = document.createElement('div');
        notif.innerText = mensaje;
        notif.style = `position: fixed; top: 20px; right: 20px; background: ${colorFondo}; color: white; padding: 12px 20px; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 999999; font-family: Arial; font-weight: bold; opacity: 0; transition: opacity 0.3s;`;
        document.body.appendChild(notif);
        requestAnimationFrame(() => { notif.style.opacity = "1"; });
        setTimeout(() => { notif.style.opacity = "0"; setTimeout(() => notif.remove(), 300); }, duracion);
    }

    function capturarDatosCompletos() {
        const leer = (id) => {
            let el = document.getElementById(id);
            if (!el && window.parent && window.parent.document) {
                el = window.parent.document.getElementById(id);
            }
            return el ? el.innerText.trim() : "";
        };

        const rawNac = leer(ID_FEC_NAC_DISP);
        let fechaNac = rawNac;
        let edad = "";

        if (rawNac.includes("(")) {
            const p = rawNac.split("(");
            fechaNac = p[0].trim();
            edad = p[1].replace(")", "").trim();
        }
        if (edad === "") {
             const hiddenEdad = document.getElementById("P701_EDAD_ANOS");
             if(hiddenEdad) edad = hiddenEdad.value;
        }

        return {
            servicio: getServicioGuardado(),
            cui: leer(ID_CUI_DISPLAY),
            nombre: leer(ID_NOMBRE_DISPLAY),
            sexo: leer(ID_SEXO_DISPLAY),
            nacionalidad: leer(ID_NAC_DISPLAY),
            nacimiento_fecha: fechaNac,
            nacimiento_edad: edad
        };
    }

    // ========================================================================
    // 3. GESTIÓN DE HUELLA DIGITAL (PERSISTENCIA GLOBAL)
    // ========================================================================
    function obtenerHistorialHashes() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL);
            return new Set(JSON.parse(raw || '[]'));
        } catch(e) { return new Set(); }
    }

    function agregarAHistorialHashes(hash) {
        if (!hash) return;
        const historial = obtenerHistorialHashes();
        historial.add(hash);
        localStorage.setItem(STORAGE_KEY_HISTORIAL, JSON.stringify([...historial]));
    }

    // ========================================================================
    // 4. NUEVA LÓGICA BLINDADA CON DATA-ID (CORE V60/V61)
    // ========================================================================

    function leerEstadoFila(fila) {
        let rowId = fila.getAttribute('data-id');

        const celdas = fila.querySelectorAll('td');
        if (celdas.length < 4) return null;

        const nombreVacuna = celdas[0].innerText.trim();
        const dosis = celdas[1].innerText.trim();
        const fechaAdmin = celdas[3].innerText.trim(); 
        const textoFila = fila.innerText || "";

        if (!rowId) {
            rowId = `${nombreVacuna}|${dosis}`;
        }

        const textoLimpio = textoFila.replace(/\s+/g, ' ').trim();
        const estaAdministrada = (textoLimpio.includes("Administrada") && !textoLimpio.includes("No administrada") && fechaAdmin.length > 5);

        return {
            id: rowId, 
            nombre: nombreVacuna,
            dosis: dosis,
            fecha: fechaAdmin,
            administrada: estaAdministrada,
            firma: estaAdministrada ? `SI|${fechaAdmin}` : "NO"
        };
    }

    function tomarSnapshotGrid() {
        const gridBody = document.querySelector('#regular_ig_grid_vc .a-GV-bdy');
        if (!gridBody) { setTimeout(tomarSnapshotGrid, 500); return; }
        
        const filas = Array.from(gridBody.querySelectorAll('tr.a-GV-row'));
        if (filas.length === 0) { setTimeout(tomarSnapshotGrid, 500); return; }

        snapshotGridInicial.clear();
        
        filas.forEach(fila => {
            const estado = leerEstadoFila(fila);
            if (estado) {
                snapshotGridInicial.set(estado.id, estado.firma);
            }
        });
    }

    function detectarCambiosVsSnapshot() {
        const gridBody = document.querySelector('#regular_ig_grid_vc .a-GV-bdy');
        if (!gridBody) return [];

        const cuiActual = capturarDatosCompletos().cui || "CUI_DESCONOCIDO";
        const filas = Array.from(gridBody.querySelectorAll('tr.a-GV-row'));
        const cambiosDetectados = [];

        filas.forEach(fila => {
            const estadoActual = leerEstadoFila(fila);
            if (!estadoActual) return;

            const firmaInicial = snapshotGridInicial.get(estadoActual.id);
            const firmaVieja = firmaInicial || "NO";

            if (estadoActual.administrada) {
                if (firmaVieja === "NO" || estadoActual.firma !== firmaVieja) {
                    const hash = `${cuiActual}|${estadoActual.nombre}|${estadoActual.dosis}|${estadoActual.fecha}`;

                    cambiosDetectados.push({
                        nombre: `${estadoActual.nombre} ${estadoActual.dosis}`,
                        fecha: estadoActual.fecha,
                        hash: hash
                    });
                }
            }
        });

        return cambiosDetectados;
    }

    // --- SINCRONIZACIÓN GLOBAL ---
    window.sincronizarDrive = function() {
        if (URL_GOOGLE_SHEET.includes("PON_AQUI")) return alert("⚠️ Configura la URL de Google Sheets en el script.");

        const regularAll = safeLoad('reporte_regular_acumulado');
        const otrasAll = safeLoad('reporte_vacunacion_acumulado');

        const pendientesRegular = regularAll.filter(r => !r.synced);
        const pendientesOtras = otrasAll.filter(r => !r.synced);

        const payload = [
            ...pendientesRegular.map(r => ({...r, esquema: 'regular'})),
            ...pendientesOtras.map(r => ({...r, esquema: 'otras'}))
        ];

        if (payload.length === 0) return mostrarNotificacion("✅ Todo sincronizado.", "#2980b9", 3000);
        if(!confirm(`Se enviarán ${payload.length} registros a Drive. ¿Continuar?`)) return;

        mostrarNotificacion("☁️ Enviando...", "#f39c12", 10000);

        fetch(URL_GOOGLE_SHEET, {
            method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(() => {
            const updateSync = (key) => {
                let data = safeLoad(key);
                data = data.map(item => {
                    if (payload.some(p => p.cui === item.cui && p.hora === item.hora && p.vacuna === item.vacuna)) {
                        item.synced = true; item.wasEdited = false;
                    }
                    return item;
                });
                localStorage.setItem(key, JSON.stringify(data));
            };
            updateSync('reporte_regular_diario'); updateSync('reporte_regular_acumulado');
            updateSync('reporte_vacunacion_diario'); updateSync('reporte_vacunacion_acumulado');

            mostrarNotificacion(`🚀 Éxito! ${payload.length} enviados.`, "#27ae60", 5000);
            window.dispatchEvent(new Event('storage'));
        }).catch(err => alert("Error red."));
    };

    // ========================================================================
    // 5. LOGICA MAESTRA (GUARDADO)
    // ========================================================================
    function agendarGuardado(datos, tipo) {
        const datosPaciente = capturarDatosCompletos();
        localStorage.setItem('mspas_pendiente_guardar', JSON.stringify({
            datos: datos, tipo: tipo, paciente: datosPaciente, timestamp: Date.now()
        }));
        mostrarNotificacion(`⏳ Procesando...`, "#f39c12", 5000);
    }

    async function procesarExito(pendiente) {
        if (!pendiente) return;
        const fechaReal = await obtenerFechaHoraReal();
        const datosBase = pendiente.paciente || capturarDatosCompletos();
        datosBase.servicio = getServicioGuardado();
        datosBase.fecha_registro = fechaReal.toLocaleDateString('es-GT');
        datosBase.hora = fechaReal.toLocaleTimeString('es-GT');

        const historialGlobal = obtenerHistorialHashes();

        if (Array.isArray(pendiente.datos)) {
            // REGULAR (LÓGICA DELTA)
            let guardadosCount = 0;
            pendiente.datos.forEach(v => {
                if (!historialGlobal.has(v.hash)) {
                    const reg = { ...datosBase, vacuna: v.nombre, fecha_vacuna: v.fecha, hash: v.hash };
                    guardarRegistro(reg, 'regular');
                    agregarAHistorialHashes(v.hash);
                    guardadosCount++;
                }
            });
            if (guardadosCount > 0) {
                mostrarNotificacion(`✅ REGISTRADO EXCEL: ${datosBase.nombre} (${guardadosCount} nuevas)`, "#27ae60", 6000);
            } else {
                mostrarNotificacion(`ℹ️ Actualizado en MSPAS (Sin cambios nuevos)`, "#2980b9", 3000);
            }
            setTimeout(tomarSnapshotGrid, 1000);

        } else {
            // OTRAS
            const hashOtras = `${datosBase.cui}|${pendiente.datos.vacuna}|UNICA|${pendiente.datos.fecha}`;
            if (!historialGlobal.has(hashOtras)) {
                const reg = { ...datosBase, vacuna: pendiente.datos.vacuna, fecha_vacuna: pendiente.datos.fecha, hash: hashOtras };
                guardarRegistro(reg, 'otras');
                agregarAHistorialHashes(hashOtras);
                mostrarNotificacion(`✅ REGISTRADO EXCEL: ${datosBase.nombre}`, "#27ae60", 6000);
            } else {
                mostrarNotificacion(`ℹ️ Ya registrado anteriormente`, "#2980b9", 3000);
            }
        }
        localStorage.removeItem('mspas_pendiente_guardar');
    }

    function verificarGuardadoPendiente() {
        const pendienteRaw = localStorage.getItem('mspas_pendiente_guardar');
        if (!pendienteRaw) return;
        const pendiente = JSON.parse(pendienteRaw);
        if (Date.now() - pendiente.timestamp > 300000) { localStorage.removeItem('mspas_pendiente_guardar'); return; }

        let procesado = false;
        const chequearAhora = () => {
            if (procesado) return true;
            const bodyText = document.body.textContent;
            if (bodyText.includes(TEXTO_EXITO_OTRAS) || bodyText.includes(TEXTO_EXITO_REGULAR)) {
                procesado = true; procesarExito(pendiente); return true;
            }
            if (bodyText.includes("Error") || bodyText.includes("ORA-")) {
                procesado = true; localStorage.removeItem('mspas_pendiente_guardar');
                mostrarNotificacion("❌ Error detectado.", "#c0392b", 5000); return true;
            }
            return false;
        };

        if (chequearAhora()) return;
        const observer = new MutationObserver(() => { if (chequearAhora()) observer.disconnect(); });
        observer.observe(document.body, { attributes: true, childList: true, subtree: true, characterData: true });

        let intentos = 0;
        const intervalo = setInterval(() => {
            intentos++;
            if (chequearAhora() || intentos > 800) { clearInterval(intervalo); observer.disconnect(); }
        }, 10);
    }

    verificarGuardadoPendiente();

    // ========================================================================
    // 6. CAPTURAS Y MONITORES
    // ========================================================================

    setInterval(() => {
        chequearCambioDia();

        const cuiElement = document.getElementById(ID_CUI_DISPLAY);
        if (cuiElement) {
            const cuiLeido = cuiElement.innerText.trim();
            if (cuiLeido !== "" && cuiLeido !== cuiActualSesion) {
                cuiActualSesion = cuiLeido;
                snapshotGridInicial.clear();
                setTimeout(tomarSnapshotGrid, 1000);
                setTimeout(tomarSnapshotGrid, 3000);
            }
        }

        const inputFecha = document.getElementById(ID_FECHA_INPUT);
        const selectVacuna = document.getElementById(ID_VACUNA_SELECT);
        if (inputFecha && selectVacuna) {
            const botones = Array.from(document.querySelectorAll("button"));
            const btnGuardar = botones.find(b => b.innerText.trim() === "Guardar");
            if (btnGuardar && !btnGuardar.classList.contains('monitor-listo')) {
                btnGuardar.classList.add('monitor-listo');
                btnGuardar.style.border = "3px solid #e67e22";
                btnGuardar.addEventListener('click', function() {
                    const vacunaTxt = selectVacuna.options[selectVacuna.selectedIndex].text;
                    const fechaTxt = inputFecha.value;
                    if (vacunaTxt && fechaTxt) agendarGuardado({ vacuna: vacunaTxt, fecha: fechaTxt }, 'otras');
                });
            }
        }
    }, 500);

    const obsPopup = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const btnConfirmar = document.querySelector('button.js-confirmBtn');
                if (btnConfirmar && !btnConfirmar.classList.contains('monitor-regular')) {
                    btnConfirmar.classList.add('monitor-regular');
                    btnConfirmar.style.border = "3px solid #3498db";

                    btnConfirmar.addEventListener('click', function() {
                        const vacunasNuevas = detectarCambiosVsSnapshot();
                        if (vacunasNuevas.length > 0) {
                            agendarGuardado(vacunasNuevas, 'regular');
                        }
                    });
                }
            }
        });
    });
    obsPopup.observe(document.body, { childList: true, subtree: true });


    // ========================================================================
    // 7. DASHBOARD PANEL V61 (PAGINACIÓN + FULL ARMOR)
    // ========================================================================
    const PANEL_ID = "mspas_panel_v56_fixed";

    function dibujarPanel() {
        if (window.self !== window.top) return;

        if (document.getElementById(PANEL_ID)) return;
        if (!document.body) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style = "position: fixed; bottom: 10px; left: 10px; background: #2c3e50; color: white; padding: 10px; z-index: 99999; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.5); font-family: Arial; font-size: 11px; width: 230px; border: 2px solid #3498db;";
        panel.innerHTML = `
            <div style="font-weight:bold; border-bottom:1px solid #aaa; margin-bottom:5px;">💉 V61 Anti-Freeze
            <button id="btnAbrirDash" style="background:#8e44ad; color:white; width:100%; border:none; padding:5px; margin-bottom:5px; cursor:pointer; font-weight:bold; border-radius:4px;">🖥️ ABRIR DASHBOARD</button>
            <div style="font-size:10px; color:#bdc3c7;">Servicio: <span id="lblServicio" style="color:white; font-weight:bold;">...</span></div>

            <div style="margin-top:5px; background:#2980b9; padding:4px; border-radius:4px;">
                <div style="font-weight:bold; color:white;">👶 Regular</div>
                <div style="display:flex; justify-content:space-between;"><span>Hoy: <b id="cntRegHoy" style="color:#f1c40f">0</b></span><span>Total: <b id="cntRegTot">0</b></span></div>
                <div style="margin-top:2px; display:flex; gap:2px;">
                    <button id="btnRegHoy" style="flex:1; background:#fff; color:#333; border:none; padding:1px; font-size:9px;">📥 CSV HOY</button>
                    <button id="btnRegTot" style="flex:1; background:#fff; color:#333; border:none; padding:1px; font-size:9px;">📥 CSV TOTAL</button>
                </div>
            </div>

            <div style="margin-top:5px; background:#d35400; padding:4px; border-radius:4px;">
                <div style="font-weight:bold; color:white;">💉 Otras</div>
                <div style="display:flex; justify-content:space-between;"><span>Hoy: <b id="cntOtrHoy" style="color:#f1c40f">0</b></span><span>Total: <b id="cntOtrTot">0</b></span></div>
                <div style="margin-top:2px; display:flex; gap:2px;">
                    <button id="btnOtrHoy" style="flex:1; background:#fff; color:#333; border:none; padding:1px; font-size:9px;">📥 CSV HOY</button>
                    <button id="btnOtrTot" style="flex:1; background:#fff; color:#333; border:none; padding:1px; font-size:9px;">📥 CSV TOTAL</button>
                </div>
            </div>

            <div style="margin-top:8px;">
                <button id="btnSyncDrive" style="width:100%; background:#27ae60; color:white; border:none; padding:5px; border-radius:4px; font-weight:bold; cursor:pointer;">☁️ Sincronizar Drive</button>
            </div>

            <div style="text-align:center; margin-top:5px; display:flex; justify-content:space-around;">
                 <small id="btnResetHoy" style="cursor:pointer; color:#bdc3c7;">⚙️ Reset Hoy</small>
                 <small id="btnResetAll" style="cursor:pointer; color:#e74c3c;">⚙️ Reset TOTAL</small>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('btnAbrirDash').onclick = abrirDashboard;
        document.getElementById('btnSyncDrive').onclick = window.sincronizarDrive;

        const asignarEventosRestantes = () => {
             const generarCSV = (datos, nombre) => {
                 if(datos.length === 0) return alert("Sin datos");
                 let csv = "\uFEFFSERVICIO;FECHA_REGISTRO;HORA_REGISTRO;CUI/DPI;NOMBRE_PACIENTE;SEXO;NACIONALIDAD;FECHA_NACIMIENTO;EDAD;TIPO_VACUNA;FECHA_VACUNACION\n";
                 datos.forEach(d => {
                    const clean = (txt) => (txt || "").toString().replace(/;/g, " ");
                    const cuiFormateado = `="${clean(d.cui)}"`;
                    csv += `"${clean(d.servicio)}";"${clean(d.fecha_registro)}";"${clean(d.hora)}";${cuiFormateado};"${clean(d.nombre)}";"${clean(d.sexo)}";"${clean(d.nacionalidad)}";"${clean(d.nacimiento_fecha)}";"${clean(d.nacimiento_edad)}";"${clean(d.vacuna)}";"${clean(d.fecha_vacuna)}"\n`;
                });
                const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = nombre;
                link.click();
            };

            document.getElementById('btnRegHoy').onclick = () => generarCSV(safeLoad('reporte_regular_diario'), `Regular_HOY_${new Date().toLocaleDateString('es-GT').replace(/\//g,'-')}.csv`);
            document.getElementById('btnRegTot').onclick = () => generarCSV(safeLoad('reporte_regular_acumulado'), `Regular_TOTAL.csv`);
            document.getElementById('btnOtrHoy').onclick = () => generarCSV(safeLoad('reporte_vacunacion_diario'), `Otras_HOY_${new Date().toLocaleDateString('es-GT').replace(/\//g,'-')}.csv`);
            document.getElementById('btnOtrTot').onclick = () => generarCSV(safeLoad('reporte_vacunacion_acumulado'), `Otras_TOTAL.csv`);

            const logicaReset = (modo) => {
                const seleccion = prompt(`⚠️ RESET ${modo}\n\nEscribe el número de la opción:\n1 - Solo Esquema Regular\n2 - Solo Otras Vacunas\n3 - Todo (Ambas)`);
                if (!seleccion) return;
                let borrarRegular = (seleccion === '1' || seleccion === '3');
                let borrarOtras = (seleccion === '2' || seleccion === '3');
                if (modo === 'HOY') {
                    if (borrarRegular) {
                        const diario = safeLoad('reporte_regular_diario'); const acumulado = safeLoad('reporte_regular_acumulado');
                        if (diario.length === acumulado.length) localStorage.setItem('reporte_regular_acumulado', '[]');
                        localStorage.setItem('reporte_regular_diario', '[]');
                    }
                    if (borrarOtras) {
                        const diario = safeLoad('reporte_vacunacion_diario'); const acumulado = safeLoad('reporte_vacunacion_acumulado');
                        if (diario.length === acumulado.length) localStorage.setItem('reporte_vacunacion_acumulado', '[]');
                        localStorage.setItem('reporte_vacunacion_diario', '[]');
                    }
                }
                else if (modo === 'TOTAL') {
                    if (confirm(`¿SEGURO QUE DESEAS BORRAR EL ACUMULADO?\n\n(Esto NO borra el historial de vacunas ya detectadas)`)) {
                        if (borrarRegular) { localStorage.setItem('reporte_regular_diario', '[]'); localStorage.setItem('reporte_regular_acumulado', '[]'); }
                        if (borrarOtras) { localStorage.setItem('reporte_vacunacion_diario', '[]'); localStorage.setItem('reporte_vacunacion_acumulado', '[]'); }
                    }
                }
                window.dispatchEvent(new Event('storage')); alert(`✅ Reset ${modo} completado.`);
            };
            document.getElementById('btnResetHoy').onclick = () => logicaReset('HOY');
            document.getElementById('btnResetAll').onclick = () => logicaReset('TOTAL');
        };
        asignarEventosRestantes();
        updatePanel();
    }

    const updatePanel = () => {
        const elServ = document.getElementById('lblServicio');
        if(elServ) elServ.innerText = getServicioGuardado();
        const elRegHoy = document.getElementById('cntRegHoy');
        if(elRegHoy) elRegHoy.innerText = safeLoad('reporte_regular_diario').length;
        const elRegTot = document.getElementById('cntRegTot');
        if(elRegTot) elRegTot.innerText = safeLoad('reporte_regular_acumulado').length;
        const elOtrHoy = document.getElementById('cntOtrHoy');
        if(elOtrHoy) elOtrHoy.innerText = safeLoad('reporte_vacunacion_diario').length;
        const elOtrTot = document.getElementById('cntOtrTot');
        if(elOtrTot) elOtrTot.innerText = safeLoad('reporte_vacunacion_acumulado').length;
    };

    window.addEventListener('storage', updatePanel);
    setInterval(updatePanel, 1000);
    setInterval(dibujarPanel, 1500);


    // ========================================================================
    // DASHBOARD HTML (PAGINADO)
    // ========================================================================
    function abrirDashboard() {
        const win = window.open("", "Dashboard_MSPAS_Master_V56", "width=1350,height=900");
        if (!win) return alert("⚠️ Permite Pop-ups");

        win.focus();
        if(win.document.body.innerHTML.length > 100) return;

        const htmlContent = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>🖥️ Dashboard V61</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"><style>body{background:#2c3e50;color:#ecf0f1;font-family:'Segoe UI',sans-serif}.section-card{background:#34495e;border-radius:10px;padding:15px;margin-bottom:20px;box-shadow:0 4px 6px rgba(0,0,0,0.3)}.card-header-custom{border-bottom:2px solid #7f8c8d;padding-bottom:10px;margin-bottom:15px;display:flex;justify-content:space-between;align-items:center}.table{color:#ecf0f1;font-size:0.85rem}.table thead{background:#2c3e50;position:sticky;top:0;z-index:2}.table-hover tbody tr:hover{color:#fff;background:#576574}.stat-box{background:rgba(0,0,0,0.2);border-radius:5px;padding:5px 10px;text-align:center;min-width:70px}.stat-num{font-size:1.1rem;font-weight:bold}.search-bar{width:300px}.filter-group{display:flex;gap:5px;align-items:center}.filter-count{font-size:0.9rem;font-weight:bold;padding:2px 8px;border-radius:4px}.dropdown-menu{max-height:250px;overflow-y:auto;background:#2c3e50;border:1px solid #7f8c8d;color:#ecf0f1}.dropdown-item:hover{background:#34495e;color:white}.form-check-input:checked{background-color:#3498db;border-color:#3498db} .nav-tabs .nav-link { color: #bdc3c7; } .nav-tabs .nav-link.active { background-color: #34495e; border-color: #7f8c8d #7f8c8d #34495e; color: #3498db; font-weight: bold; } .btn-page { background: #576574; color: white; border: none; padding: 2px 8px; font-size: 0.8rem; margin: 0 2px; } .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }</style></head><body>
        <div class="container-fluid pt-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="m-0">Dashboard V61</h3>
                <div class="input-group search-bar mx-3">
                    <input type="text" id="searchInput" class="form-control bg-dark text-white border-secondary" placeholder="Buscar por Nombre o CUI..." onkeyup="refrescarTablas()">
                </div>
                <div class="text-end">
                    <div class="btn-group me-3" role="group">
                        <input type="radio" class="btn-check" name="btnViewMode" id="vHoy" autocomplete="off" checked onclick="cambiarVista('hoy')">
                        <label class="btn btn-outline-info" for="vHoy">Ver HOY</label>
                        <input type="radio" class="btn-check" name="btnViewMode" id="vTotal" autocomplete="off" onclick="cambiarVista('total')">
                        <label class="btn btn-outline-warning" for="vTotal">Ver TODO EL HISTORIAL</label>
                    </div>

                    <button onclick="sincronizarDriveDash()" class="btn btn-sm btn-success me-2">☁️ Sincronizar Drive</button>
                    <small class="d-block text-info" id="servName">...</small>
                    <button onclick="cargarDatos()" class="btn btn-sm btn-outline-light">🔄 Refrescar Datos</button>
                </div>
            </div>
            
            <div class="row">
                <div class="col-lg-6">
                    <div class="section-card" style="border-top:4px solid #3498db">
                        <div class="card-header-custom">
                            <h5 class="text-white m-0">Regular</h5>
                            <div class="d-flex gap-2">
                                <div class="stat-box"><small>HOY</small><div id="regHoy" class="stat-num text-info">0</div></div>
                                <div class="stat-box"><small>TOTAL</small><div id="regTotal" class="stat-num text-white">0</div></div>
                            </div>
                        </div>
                        <div class="filter-group mb-2" id="divFiltrosReg"></div>
                        <div class="mb-2 text-end">
                            <span id="regViendo" class="filter-count bg-info text-dark">Viendo: 0</span>
                        </div>
                        <div class="table-responsive" style="max-height:550px;overflow-y:auto">
                            <table class="table table-hover table-sm" id="tableReg">
                                <thead><tr><th>#</th><th>Hora</th><th>Servicio</th><th>Paciente</th><th>Vacuna / Fecha</th><th>Acción</th></tr></thead>
                                <tbody id="bodyRegular"></tbody>
                            </table>
                        </div>
                        <div id="pag_regular" class="text-center mt-2">
                            </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="section-card" style="border-top:4px solid #e67e22">
                        <div class="card-header-custom">
                            <h5 class="text-white m-0">Otras</h5>
                            <div class="d-flex gap-2">
                                <div class="stat-box"><small>HOY</small><div id="otrHoy" class="stat-num text-warning">0</div></div>
                                <div class="stat-box"><small>TOTAL</small><div id="otrTotal" class="stat-num text-white">0</div></div>
                            </div>
                        </div>
                        <div class="filter-group mb-2" id="divFiltrosOtr"></div>
                        <div class="mb-2 text-end">
                            <span id="otrViendo" class="filter-count bg-warning text-dark">Viendo: 0</span>
                        </div>
                        <div class="table-responsive" style="max-height:550px;overflow-y:auto">
                            <table class="table table-hover table-sm" id="tableOtr">
                                <thead><tr><th>#</th><th>Hora</th><th>Servicio</th><th>Paciente</th><th>Vacuna / Fecha</th><th>Acción</th></tr></thead>
                                <tbody id="bodyOtras"></tbody>
                            </table>
                        </div>
                        <div id="pag_otras" class="text-center mt-2">
                            </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="editModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content text-dark"><div class="modal-header bg-warning"><h5 class="modal-title">Editar</h5><button type="button" class="btn-close" onclick="cerrarModal()"></button></div><div class="modal-body"><input type="hidden" id="editType"><input type="hidden" id="editIndex"><div class="mb-2"><label>Paciente:</label><input type="text" id="editNombre" class="form-control" readonly></div><div class="mb-2"><label>Vacuna:</label><input type="text" id="editVacuna" class="form-control"></div><div class="mb-2"><label>Fecha:</label><input type="date" id="editFecha" class="form-control"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="guardarEdicion()">Guardar</button></div></div></div></div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            let dataReg = [], dataOtr = [];
            let acumReg = [], acumOtr = [];
            let viewMode = 'hoy'; // Default view
            const URL_SHEET = "${URL_GOOGLE_SHEET}";
            const KEY_HISTORIAL = "mspas_historial_hashes_v1";

            // CONFIG PAGINACION
            const ITEMS_PER_PAGE = 50; 
            let currentPageReg = 1;
            let currentPageOtr = 1;

            let activeFilters = {
                regular: { vacuna: 'ALL', fecha_vacuna: 'ALL', servicio: 'ALL' },
                otras: { vacuna: 'ALL', fecha_vacuna: 'ALL', servicio: 'ALL' }
            };

            function safeLoad(key) {
                try {
                    let raw = localStorage.getItem(key);
                    if (!raw) return [];
                    let parsed = JSON.parse(raw);
                    if (!Array.isArray(parsed)) return [];
                    return parsed.map(d => ({
                        ...d,
                        synced: (d.synced === true),
                        wasEdited: (d.wasEdited === true),
                        hash: d.hash || null
                    }));
                } catch(e) { return []; }
            }

            function cambiarVista(mode) {
                viewMode = mode;
                currentPageReg = 1; // Reset pagina
                currentPageOtr = 1;
                refrescarTablas();
            }

            function cargarDatos(){
                const servicio = localStorage.getItem('mspas_servicio_actual')||"N/A";
                document.getElementById('servName').innerText = servicio;
                
                dataReg = safeLoad('reporte_regular_diario');
                dataOtr = safeLoad('reporte_vacunacion_diario');
                acumReg = safeLoad('reporte_regular_acumulado');
                acumOtr = safeLoad('reporte_vacunacion_acumulado');

                document.getElementById('regHoy').innerText = dataReg.length;
                document.getElementById('regTotal').innerText = acumReg.length;
                document.getElementById('otrHoy').innerText = dataOtr.length;
                document.getElementById('otrTotal').innerText = acumOtr.length;

                if(document.getElementById('divFiltrosReg').innerHTML === "") {
                    generarFiltros('regular', acumReg);
                    generarFiltros('otras', acumOtr);
                }
                renderizarTabla('regular');
                renderizarTabla('otras');
            }

            function actualizarSoloTablas(){
                dataReg = safeLoad('reporte_regular_diario');
                dataOtr = safeLoad('reporte_vacunacion_diario');
                acumReg = safeLoad('reporte_regular_acumulado');
                acumOtr = safeLoad('reporte_vacunacion_acumulado');

                document.getElementById('regHoy').innerText = dataReg.length;
                document.getElementById('regTotal').innerText = acumReg.length;
                document.getElementById('otrHoy').innerText = dataOtr.length;
                document.getElementById('otrTotal').innerText = acumOtr.length;

                renderizarTabla('regular');
                renderizarTabla('otras');
            }

            function sincronizarDriveDash() {
                if (URL_SHEET.includes("PON_AQUI")) return alert("Configura URL.");
                const regAll = safeLoad('reporte_regular_acumulado');
                const otrAll = safeLoad('reporte_vacunacion_acumulado');
                const pendReg = regAll.filter(r => !r.synced);
                const pendOtr = otrAll.filter(r => !r.synced);
                
                const payload = [
                    ...pendReg.map(r => ({...r, esquema: 'regular'})),
                    ...pendOtr.map(r => ({...r, esquema: 'otras'}))
                ];

                if (payload.length === 0) return alert("✅ Todo sincronizado.");
                if(!confirm(\`Enviar \${payload.length} registros a Drive?\`)) return;

                fetch(URL_SHEET, {
                    method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }).then(() => {
                    const marcar = (key) => {
                        let data = safeLoad(key);
                        data = data.map(item => {
                            if (payload.some(p => p.cui === item.cui && p.hora === item.hora)) {
                                item.synced = true; item.wasEdited = false;
                            }
                            return item;
                        });
                        localStorage.setItem(key, JSON.stringify(data));
                    };
                    marcar('reporte_regular_diario'); marcar('reporte_regular_acumulado');
                    marcar('reporte_vacunacion_diario'); marcar('reporte_vacunacion_acumulado');
                    alert("🚀 Enviado con éxito!");
                    window.dispatchEvent(new Event('storage'));
                    cargarDatos();
                }).catch(e => alert("Error red."));
            }

            function getUnique(data, key) {
                return [...new Set(data.map(item => item[key]))].sort();
            }

            function generarFiltros(tipo, data) {
                const containerId = tipo === 'regular' ? 'divFiltrosReg' : 'divFiltrosOtr';
                const container = document.getElementById(containerId);
                container.innerHTML = '';
                const unicasVacunas = getUnique(data, 'vacuna');
                const unicasFechas = getUnique(data, 'fecha_vacuna');
                const unicosServicios = getUnique(data, 'servicio');
                container.appendChild(crearDropdownFiltro(tipo, 'Vacuna', unicasVacunas, 'vacuna'));
                container.appendChild(crearDropdownFiltro(tipo, 'Fecha', unicasFechas, 'fecha_vacuna'));
                container.appendChild(crearDropdownFiltro(tipo, 'Servicio', unicosServicios, 'servicio'));
            }

            function crearDropdownFiltro(tipo, etiqueta, unicos, campoDatos) {
                const groupId = \`grp_\${tipo}_\${campoDatos}\`;
                const div = document.createElement('div');
                div.className = 'dropdown d-inline-block';
                const currentState = activeFilters[tipo][campoDatos];
                const isAllSelected = currentState === 'ALL';
                let html = \`
                    <button class="btn btn-sm btn-secondary dropdown-toggle text-light" type="button" id="\${groupId}" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        \${etiqueta}s
                    </button>
                    <div class="dropdown-menu p-2 shadow" aria-labelledby="\${groupId}" style="width: 250px;">
                        <div class="form-check mb-2 border-bottom pb-2">
                            <input class="form-check-input select-all" type="checkbox" id="all_\${groupId}" \${isAllSelected ? 'checked' : ''} onchange="toggleAll('\${groupId}')">
                            <label class="form-check-label text-white fw-bold" for="all_\${groupId}">Seleccionar Todo</label>
                        </div>
                        <div id="list_\${groupId}" style="max-height: 150px; overflow-y: auto;">\`;
                if (unicos.length === 0) { html += \`<div class="text-white small p-1">Sin datos aún</div>\`; } 
                else {
                    unicos.forEach((val, idx) => {
                        const chkId = \`chk_\${groupId}_\${idx}\`;
                        let isChecked = (currentState === 'ALL') || (Array.isArray(currentState) && currentState.includes(String(val)));
                        html += \`<div class="form-check"><input class="form-check-input item-check" type="checkbox" value="\${val}" id="\${chkId}" \${isChecked ? 'checked' : ''} onchange="updateMaster('\${groupId}')"><label class="form-check-label text-light" for="\${chkId}" style="font-size:0.85rem">\${val}</label></div>\`;
                    });
                }
                html += \`</div><div class="mt-2 pt-2 border-top text-end"><button class="btn btn-primary btn-sm w-100" onclick="confirmarFiltro('\${tipo}', '\${campoDatos}', '\${groupId}')">Aceptar</button></div></div>\`;
                div.innerHTML = html;
                return div;
            }

            window.updateMaster = function(groupId) {
                const master = document.getElementById('all_' + groupId);
                const container = document.getElementById('list_' + groupId);
                if(!container) return;
                const totalItems = container.querySelectorAll('.item-check').length;
                const checkedItems = container.querySelectorAll('.item-check:checked').length;
                master.checked = (totalItems > 0 && totalItems === checkedItems);
            };

            window.toggleAll = function(groupId) {
                const master = document.getElementById('all_' + groupId);
                const items = document.querySelectorAll(\`#list_\${groupId} .item-check\`);
                items.forEach(chk => chk.checked = master.checked);
            };

            window.confirmarFiltro = function(tipo, campo, groupId) {
                const containerList = document.getElementById(\`list_\${groupId}\`);
                const masterCheck = document.getElementById('all_' + groupId);
                if (masterCheck && masterCheck.checked) { activeFilters[tipo][campo] = 'ALL'; } 
                else if (containerList) {
                    const checkedBoxes = containerList.querySelectorAll('.item-check:checked');
                    activeFilters[tipo][campo] = (checkedBoxes.length===0) ? [] : Array.from(checkedBoxes).map(cb => String(cb.value));
                }
                currentPageReg = 1; currentPageOtr = 1; // Reset page on filter
                renderizarTabla(tipo);
                const btnToggle = document.getElementById(groupId);
                if(btnToggle) { bootstrap.Dropdown.getOrCreateInstance(btnToggle).hide(); }
            };

            // FUNCION MAESTRA DE RENDERIZADO (CON PAGINACION)
            function renderizarTabla(tipo) {
                const term = document.getElementById('searchInput').value.toLowerCase();
                
                let rawData;
                if (viewMode === 'hoy') {
                    rawData = (tipo === 'regular') ? dataReg : dataOtr;
                } else {
                    rawData = (tipo === 'regular') ? acumReg : acumOtr;
                }

                let indexedData = rawData.map((item, idx) => ({...item, originalIndex: idx}));
                const filtros = activeFilters[tipo];
                
                let filtered = indexedData.filter(item => {
                    const matchText = (item.nombre && item.nombre.toLowerCase().includes(term)) || (item.cui && item.cui.includes(term));
                    const matchVac = filtros.vacuna === 'ALL' ? true : (Array.isArray(filtros.vacuna) ? filtros.vacuna.includes(String(item.vacuna)) : false);
                    const matchFec = filtros.fecha_vacuna === 'ALL' ? true : (Array.isArray(filtros.fecha_vacuna) ? filtros.fecha_vacuna.includes(String(item.fecha_vacuna)) : false);
                    const matchSer = filtros.servicio === 'ALL' ? true : (Array.isArray(filtros.servicio) ? filtros.servicio.includes(String(item.servicio)) : false);
                    return matchText && matchVac && matchFec && matchSer;
                });
                
                // --- PAGINACION LOGIC ---
                const page = (tipo === 'regular') ? currentPageReg : currentPageOtr;
                const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
                const start = (page - 1) * ITEMS_PER_PAGE;
                const end = start + ITEMS_PER_PAGE;
                const pageData = filtered.slice().reverse().slice(start, end);

                const spanViendo = document.getElementById(tipo === 'regular' ? 'regViendo' : 'otrViendo');
                spanViendo.innerText = \`Viendo: \${filtered.length}\`;
                
                const tbody = document.getElementById(tipo === 'regular' ? 'bodyRegular' : 'bodyOtras');
                tbody.innerHTML = '';
                
                // Renderizar solo la página actual
                pageData.forEach((reg, i) => {
                    let statusDot = '🔴'; if (reg.synced) statusDot = '🟢'; else if (reg.wasEdited) statusDot = '🟡';
                    const realIndex = filtered.length - start - i; // Calculo visual inverso
                    const row = \`<tr><td>\${realIndex} \${statusDot}</td><td><small>\${reg.hora}</small></td><td><small class="text-info">\${reg.servicio || '-'}</small></td><td><small>\${reg.cui}</small><br><strong>\${reg.nombre}</strong></td><td>\${reg.vacuna}<br><span class="badge bg-secondary">\${reg.fecha_vacuna}</span></td><td><button class="btn btn-warning btn-sm py-0" onclick="abrirEdit('\${tipo}', \${reg.originalIndex})">✎</button> <button class="btn btn-danger btn-sm py-0" onclick="borrar('\${tipo}', \${reg.originalIndex})">×</button></td></tr>\`;
                    tbody.innerHTML += row;
                });

                // Renderizar controles de paginación
                const divPag = document.getElementById(tipo === 'regular' ? 'pag_regular' : 'pag_otras');
                divPag.innerHTML = \`
                    <button class="btn-page" \${page===1?'disabled':''} onclick="cambiarPagina('\${tipo}', -1)">◀ Ant</button>
                    <span class="text-white small mx-2">Pág \${page} de \${totalPages}</span>
                    <button class="btn-page" \${page>=totalPages?'disabled':''} onclick="cambiarPagina('\${tipo}', 1)">Sig ▶</button>
                \`;
            }

            window.cambiarPagina = function(tipo, delta) {
                if (tipo === 'regular') {
                    currentPageReg += delta;
                    if(currentPageReg < 1) currentPageReg = 1;
                } else {
                    currentPageOtr += delta;
                    if(currentPageOtr < 1) currentPageOtr = 1;
                }
                renderizarTabla(tipo);
            };

            function borrar(tipo, index){
                if(!confirm("¿Borrar este registro?\\n(Esto permitirá volver a guardarlo si lo reingresa)")) return;
                const keyDiario = tipo === 'regular' ? 'reporte_regular_diario' : 'reporte_vacunacion_diario';
                const keyAcum = tipo === 'regular' ? 'reporte_regular_acumulado' : 'reporte_vacunacion_acumulado';
                
                let diario = safeLoad(keyDiario); 
                let acumulado = safeLoad(keyAcum);
                
                let target;
                if (viewMode === 'hoy') {
                    target = diario[index];
                } else {
                    target = acumulado[index];
                }

                if (target) {
                    if(target.hash) {
                        try {
                            const rawHist = localStorage.getItem(KEY_HISTORIAL);
                            const histSet = new Set(JSON.parse(rawHist || '[]'));
                            if(histSet.has(target.hash)) {
                                histSet.delete(target.hash);
                                localStorage.setItem(KEY_HISTORIAL, JSON.stringify([...histSet]));
                            }
                        } catch(e) {}
                    }

                    const idxD = diario.findIndex(r => r.cui === target.cui && r.hora === target.hora && r.vacuna === target.vacuna);
                    if (idxD !== -1) diario.splice(idxD, 1);
                    
                    const idxA = acumulado.findIndex(r => r.cui === target.cui && r.hora === target.hora && r.vacuna === target.vacuna);
                    if (idxA !== -1) acumulado.splice(idxA, 1);
                    
                    localStorage.setItem(keyDiario, JSON.stringify(diario));
                    localStorage.setItem(keyAcum, JSON.stringify(acumulado));
                    window.dispatchEvent(new Event('storage'));
                    cargarDatos(); 
                }
            }

            let modal;
            function abrirEdit(tipo, index){
                const keyTarget = (viewMode === 'hoy') ? 
                    (tipo === 'regular' ? 'reporte_regular_diario' : 'reporte_vacunacion_diario') :
                    (tipo === 'regular' ? 'reporte_regular_acumulado' : 'reporte_vacunacion_acumulado');
                
                const data = safeLoad(keyTarget);
                const reg = data[index];
                
                document.getElementById('editType').value = tipo;
                document.getElementById('editIndex').value = index; 
                document.getElementById('editNombre').value = reg.nombre;
                document.getElementById('editVacuna').value = reg.vacuna;
                let fechaIso = "";
                if(reg.fecha_vacuna && reg.fecha_vacuna.includes('/')){
                    const partes = reg.fecha_vacuna.split('/');
                    if(partes.length === 3) fechaIso = \`\${partes[2]}-\${partes[1]}-\${partes[0]}\`;
                }
                document.getElementById('editFecha').value = fechaIso;
                modal = new bootstrap.Modal(document.getElementById('editModal'));
                modal.show();
            }

            function cerrarModal(){ if(modal) modal.hide(); }

            function guardarEdicion(){
                const tipo = document.getElementById('editType').value;
                const index = document.getElementById('editIndex').value;
                const nVacuna = document.getElementById('editVacuna').value;
                const nFechaIso = document.getElementById('editFecha').value;
                let nFechaFinal = nFechaIso;
                if(nFechaIso && nFechaIso.includes('-')){
                    const partes = nFechaIso.split('-');
                    nFechaFinal = \`\${partes[2]}/\${partes[1]}/\${partes[0]}\`;
                }

                const keyDiario = tipo === 'regular' ? 'reporte_regular_diario' : 'reporte_vacunacion_diario';
                const keyAcum = tipo === 'regular' ? 'reporte_regular_acumulado' : 'reporte_vacunacion_acumulado';
                let diario = safeLoad(keyDiario); 
                let acumulado = safeLoad(keyAcum);

                let target;
                if (viewMode === 'hoy') {
                    target = diario[index];
                } else {
                    target = acumulado[index];
                }

                if (target) {
                    const actualizarItem = (item) => {
                        if (item.synced === true) { 
                            alert("⚠️ Registro editado. Se re-enviará a Drive."); 
                            item.synced = false; 
                            item.wasEdited = true; 
                        }
                        item.vacuna = nVacuna;
                        item.fecha_vacuna = nFechaFinal;
                        return item;
                    };

                    const idxD = diario.findIndex(r => r.cui === target.cui && r.hora === target.hora);
                    if (idxD !== -1) diario[idxD] = actualizarItem(diario[idxD]);

                    const idxA = acumulado.findIndex(r => r.cui === target.cui && r.hora === target.hora);
                    if (idxA !== -1) acumulado[idxA] = actualizarItem(acumulado[idxA]);

                    localStorage.setItem(keyDiario, JSON.stringify(diario));
                    localStorage.setItem(keyAcum, JSON.stringify(acumulado));
                    window.dispatchEvent(new Event('storage'));
                    cerrarModal();
                    cargarDatos();
                }
            }

            window.addEventListener('storage', actualizarSoloTablas);
            window.onload = cargarDatos;
            setInterval(actualizarSoloTablas, 3000);
        </script></body></html>`;
        win.document.write(htmlContent);
        win.document.close();
    }

    // --- SERVICIO MONITOR ---
    setInterval(() => {
       try {
           if (document.body.innerText.includes("SERVICIO DE SALUD:")) {
               const match = document.body.innerText.match(/SERVICIO DE SALUD:\s*(.+)/i);
               if (match && match[1]) {
                   const serv = match[1].trim();
                   if (serv !== localStorage.getItem('mspas_servicio_actual')) {
                       localStorage.setItem('mspas_servicio_actual', serv);
                       window.dispatchEvent(new Event('storage'));
                   }
               }
           }
       } catch (e) {}
       
       const inputServicioManual = document.getElementById(ID_INPUT_SERVICIO_PARAM);
       if (inputServicioManual) {
           const btnGuardarParam = Array.from(document.querySelectorAll("button")).find(b => b.innerText.trim() === "Guardar");
           if (btnGuardarParam && !btnGuardarParam.classList.contains('servicio-monitor')) {
               btnGuardarParam.classList.add('servicio-monitor');
               btnGuardarParam.addEventListener('click', function() {
                   const nuevoServicio = inputServicioManual.value;
                   if (nuevoServicio) {
                       localStorage.setItem('mspas_servicio_actual', nuevoServicio);
                       window.dispatchEvent(new Event('storage'));
                       mostrarNotificacion(`🏥 Servicio: ${nuevoServicio}`, "#3498db", 4000);
                   }
               });
           }
       }
    }, 1000);
})();