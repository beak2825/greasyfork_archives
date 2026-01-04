// ==UserScript==
// @name         Asistente de Formularios APEX (Panel Fijo con Foco)
// @namespace    Violentmonkey Scripts
// @match        http://192.168.100.83:8080/apex/f*
// @grant        none
// @version      2.2
// @author       IKAROS & Gemini
// @description  Añade un panel lateral para gestionar órdenes y rellenar datos, con lista de trabajadores personalizable. Pone el foco en el campo de orden al cargar.
// @downloadURL https://update.greasyfork.org/scripts/549256/Asistente%20de%20Formularios%20APEX%20%28Panel%20Fijo%20con%20Foco%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549256/Asistente%20de%20Formularios%20APEX%20%28Panel%20Fijo%20con%20Foco%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURACIÓN ---
    const APEX_APP_ID = '100';
    const APEX_PAGE_ID = '2010';
    const APEX_GO_BACK_PAGE = '2300';
    const APEX_STATUS_SELECT_ID = 'P2010_TA1R250_CODIGO';
    const APEX_TEXT_AREA_ID = 'P2010_RESPUESTA';
    const APEX_STATUS_VALUE_TO_SET = 'RES';
    const DEFAULT_TRABAJADORES = ['AGUILERA','BUSTAMANTE','MENDOZA','MERCAU','MERCAU L','MUÑOZ','OJEDA','PEREYRA','PINO','RODRIGUEZ','ROSALES','SALINAS'];
    // --- FIN DE LA CONFIGURACIÓN ---

    const SESSION_DATE_KEY = 'gm_apex_form_date';
    const SESSION_WORKERS_KEY = 'gm_apex_form_workers';
    const LOCAL_WORKER_LIST_KEY = 'gm_apex_worker_list';
    let toastTimer;

    function addStyles() {
        const panelWidth = 'auto';
        const styles = `
            body { margin-right: ${panelWidth} !important; }
            #gm-side-panel {
                position: fixed; top: 0; right: 0; width: ${panelWidth}; height: 100vh;
                background-color: #f7f9fc; border-left: 1px solid #dfe3e8; box-shadow: -3px 0 15px rgba(0,0,0,0.08);
                z-index: 9999; padding: 15px; overflow-y: auto; font-family: Arial, sans-serif; box-sizing: border-box;
                transition: opacity 0.3s ease, display 0.3s ease;
            }
            #gm-side-panel.hidden {
                opacity: 0;
                pointer-events: none;
            }
            #gm-side-panel h2 {
                margin: 0; padding-bottom: 10px; color: #333; border-bottom: 2px solid #007bff;
                text-align: center; font-size: 18px; margin-bottom: 15px;
            }
            #gm-side-panel .gm-section {
                background-color: #fff; border: 1px solid #dfe3e8; border-radius: 8px; padding: 15px; margin-bottom: 15px;
            }
            #gm-side-panel label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
            #gm-side-panel input[type="date"], #gm-side-panel input[type="number"], #gm-side-panel input[type="text"], #gm-side-panel textarea {
                width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box;
            }
            #gm-side-panel button {
                width: 100%; padding: 12px 15px; border: none; border-radius: 5px; cursor: pointer;
                font-weight: bold; font-size: 14px; margin-top: 10px;
            }
            .gm-input-group { display: flex; gap: 10px; }
            #gm-trabajadores-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px; }
            #gm-trabajadores-list label { font-weight: normal; display: flex; align-items: center; justify-content: space-between; }
            .gm-worker-controls { display: none; } /* Oculto por defecto */
            .gm-worker-controls button { background: none; border: none; cursor: pointer; font-weight: bold; padding: 2px 5px; }
            .gm-edit-worker-btn { color: #007bff; padding: 5px !important; }
            .gm-remove-worker-btn { color: #dc3545; padding: 5px !important; }
            .gm-save-worker-btn { color: #28a745; }
            .gm-cancel-edit-btn { color: #6c757d; }
            #gm-worker-add-group { display: none; } /* Oculto por defecto */
            #gm-manage-worker-section.gm-edit-mode #gm-worker-add-group,
            #gm-manage-worker-section.gm-edit-mode .gm-worker-controls {
                display: flex; /* Se muestra en modo edición */
            }

            #gm-btn-cargar-orden { background-color: #17a2b8; color: white; }
            #gm-btn-colectora { background-color: #28a745; color: white; }
            #gm-btn-anexar { background-color: #007bff; color: white; }
            #gm-btn-perdida { background-color: #fd7e14; color: white; }
            #gm-btn-toggle-worker-edit { background-color: #6c757d; color: white; }
            #gm-btn-add-worker { background-color: #007bff; color: white; }
            #gm-toast-notification {
                visibility: hidden; opacity: 0; position: fixed; bottom: 20px; left: 50%;
                transform: translate(-50%, 20px); background-color: #2c3e50; color: white;
                padding: 16px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: all 0.4s ease-in-out; z-index: 10002;
            }
            #gm-toast-notification.gm-toast-show { visibility: visible; opacity: 1; transform: translate(-50%, 0); }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function createUI() {
        const sidePanel = document.createElement('div');
        sidePanel.id = 'gm-side-panel';
        sidePanel.innerHTML = `
            <div class="gm-section">
                <label for="gm-orden-input">Cargar Orden</label>
                <input type="number" id="gm-orden-input" placeholder="N° de orden...">
                <button id="gm-btn-cargar-orden">Cargar Orden</button>
            </div>
            <div id="gm-manage-worker-section" class="gm-section">
                <label>1. Generar Suceso</label>
                <input type="date" id="gm-fecha-input" style="margin-bottom: 15px;">
                <div id="gm-trabajadores-list"></div>
                <div id="gm-worker-add-group" class="gm-input-group" style="margin-top: 15px;">
                    <input type="text" id="gm-new-worker-input" placeholder="Añadir nombre...">
                    <button id="gm-btn-add-worker" style="margin-top:0; width:auto; padding:0 15px;">Añadir</button>
                </div>
                <button id="gm-btn-toggle-worker-edit">Editar Lista</button>
            </div>
            <div class="gm-section">
                <label>2. Aplicar a Página</label>
                <div class="gm-input-group" style="margin-top:0;">
                    <button id="gm-btn-colectora" style="margin-top:0;">Colectora</button>
                    <button id="gm-btn-anexar" style="margin-top:0;">Reiterado</button>
                    <button id="gm-btn-perdida" style="margin-top:0;">Pérdida</button>
                </div>
            </div>
        `;
        document.body.appendChild(sidePanel);
        const toast = document.createElement('div');
        toast.id = 'gm-toast-notification';
        document.body.appendChild(toast);
        rebuildWorkerUI();
    }

    // --- Lógica de Trabajadores ---
    function getWorkers() { const d=localStorage.getItem(LOCAL_WORKER_LIST_KEY); if(d)return JSON.parse(d); localStorage.setItem(LOCAL_WORKER_LIST_KEY,JSON.stringify(DEFAULT_TRABAJADORES)); return DEFAULT_TRABAJADORES; }
    function saveWorkerList(workers) { localStorage.setItem(LOCAL_WORKER_LIST_KEY,JSON.stringify(workers)); }
    function rebuildWorkerUI() {
        const workerListDiv = document.getElementById('gm-trabajadores-list');
        workerListDiv.innerHTML = '';
        getWorkers().forEach(name => {
            const workerLabel = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.value = name; checkbox.style.marginRight = '8px';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name; nameSpan.style.flexGrow = '1';
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'gm-worker-controls';
            const editBtn = document.createElement('button');
            editBtn.className = 'gm-edit-worker-btn'; editBtn.innerHTML = '✏️'; editBtn.title = `Editar ${name}`;
            editBtn.onclick = () => handleEditWorker(name);
            const removeBtn = document.createElement('button');
            removeBtn.className = 'gm-remove-worker-btn'; removeBtn.innerHTML = '✖️'; removeBtn.title = `Quitar a ${name}`;
            removeBtn.onclick = () => {
                if (confirm(`¿Está seguro que desea eliminar a ${name}?`)) {
                    saveWorkerList(getWorkers().filter(w => w !== name));
                    rebuildWorkerUI();
                }
            };
            controlsDiv.appendChild(editBtn);
            controlsDiv.appendChild(removeBtn);
            workerLabel.appendChild(checkbox);
            workerLabel.appendChild(nameSpan);
            workerLabel.appendChild(controlsDiv);
            workerListDiv.appendChild(workerLabel);
        });
        loadPersistedData();
    }
    function handleEditWorker(originalName) {
        rebuildWorkerUI();
        const targetLabel = Array.from(document.querySelectorAll('#gm-trabajadores-list label')).find(label => label.querySelector('span').textContent === originalName);
        if (!targetLabel) return;
        const nameSpan = targetLabel.querySelector('span');
        const controlsDiv = targetLabel.querySelector('.gm-worker-controls');
        const editInput = document.createElement('input');
        editInput.type = 'text'; editInput.value = originalName; editInput.style.width = '100px';
        const saveBtn = document.createElement('button');
        saveBtn.className = 'gm-save-worker-btn'; saveBtn.innerHTML = '✔️'; saveBtn.title = 'Guardar';
        saveBtn.onclick = () => {
            const newName = editInput.value.trim().toUpperCase();
            if (!newName) return;
            const workers = getWorkers();
            if (workers.includes(newName) && newName !== originalName) {
                showToast(`El nombre "${newName}" ya existe.`);
                return;
            }
            saveWorkerList(workers.map(w => w === originalName ? newName : w));
            rebuildWorkerUI();
        };
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'gm-cancel-edit-btn'; cancelBtn.innerHTML = '✖️'; cancelBtn.title = 'Cancelar';
        cancelBtn.onclick = () => rebuildWorkerUI();
        nameSpan.style.display = 'none';
        controlsDiv.innerHTML = '';
        controlsDiv.appendChild(saveBtn);
        controlsDiv.appendChild(cancelBtn);
        targetLabel.insertBefore(editInput, controlsDiv);
        editInput.focus();
    }

    // --- Lógica Principal y de Utilidad ---
    function loadOrderPage() { const d=document.getElementById("gm-orden-input").value.trim(); if(!d){showToast("Por favor, ingrese un número de orden.");return}const e=document.getElementById("pInstance")?.value; if(!e){showToast("Error: No se pudo encontrar el ID de sesión de APEX.");return}const f=`/apex/f?p=${APEX_APP_ID}:${APEX_PAGE_ID}:${e}:UPDATE:NO:${APEX_PAGE_ID}:P${APEX_PAGE_ID}_NUMERO,P${APEX_PAGE_ID}_GO_BACK:${d},${APEX_GO_BACK_PAGE}`; window.location.href=f; }

    function applyValuesToPage(text, append = false) {
        const statusSelect = document.getElementById(APEX_STATUS_SELECT_ID);
        const descriptionTextarea = document.getElementById(APEX_TEXT_AREA_ID);

        if (statusSelect) {
            statusSelect.value = APEX_STATUS_VALUE_TO_SET;
            statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
            statusSelect.style.color = 'red';
        }
        if (descriptionTextarea) {
            if (append && descriptionTextarea.value.trim() !== '') {
                descriptionTextarea.value += `\n${text}`;
            } else {
                descriptionTextarea.value = text;
            }
            descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            descriptionTextarea.style.color = 'red';
        }
        showToast('✅ ¡Texto aplicado!');
    }

    function generateColectoraText() {
        const fechaInput = document.getElementById('gm-fecha-input').value;
        if (!fechaInput) {
            showToast('Por favor, seleccione una fecha.');
            return null;
        }
        const checkboxes = document.querySelectorAll('#gm-trabajadores-list input:checked');
        if (checkboxes.length === 0) {
            showToast('Seleccione al menos un trabajador.');
            return null;
        }
        const fecha = new Date(fechaInput + 'T00:00:00');
        const fechaFormateada = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const nombres = Array.from(checkboxes).map(cb => cb.value).join(', ');
        return `COLECTORA NORMALIZADA - ${nombres} ${fechaFormateada}.`;
    }

      function generatePerdidaText() {
        const fechaInput = document.getElementById('gm-fecha-input').value;
        if (!fechaInput) {
            showToast('Por favor, seleccione una fecha.');
            return null;
        }
        const checkboxes = document.querySelectorAll('#gm-trabajadores-list input:checked');
        if (checkboxes.length === 0) {
            showToast('Seleccione al menos un trabajador.');
            return null;
        }
        const fecha = new Date(fechaInput + 'T00:00:00');
        const fechaFormateada = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const nombres = Array.from(checkboxes).map(cb => cb.value).join(', ');
        return `PERDIDA DE AGUA - ${nombres} ${fechaFormateada}.`;
    }

    function handleColectora() {
        const textoFinal = generateColectoraText();
        if (textoFinal) {
            applyValuesToPage(textoFinal, false); // Sobrescribir
        }
    }

    function handleAnexar() {
        const textoFinal = generateColectoraText();
        if (textoFinal) {
            applyValuesToPage(textoFinal, true); // Anexar
        }
    }

    function handlePerdida() {
        const textoFinal = generatePerdidaText();
        applyValuesToPage(textoFinal, false); // Sobrescribir
    }

    function showToast(message) { const e=document.getElementById("gm-toast-notification"); e.textContent=message; e.classList.add("gm-toast-show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>{e.classList.remove("gm-toast-show")},3e3); }
    function saveDate() { sessionStorage.setItem(SESSION_DATE_KEY,document.getElementById("gm-fecha-input").value); }
    function saveWorkersSelection() { const d=Array.from(document.querySelectorAll("#gm-trabajadores-list input:checked")).map(e=>e.value); sessionStorage.setItem(SESSION_WORKERS_KEY,JSON.stringify(d)); }
    function loadPersistedData() { const d=sessionStorage.getItem(SESSION_DATE_KEY); if(d)document.getElementById("gm-fecha-input").value=d; const e=sessionStorage.getItem(SESSION_WORKERS_KEY); if(e){const f=JSON.parse(e); document.querySelectorAll("#gm-trabajadores-list input").forEach(g=>{g.checked=f.includes(g.value)})} }

    // --- Event Listeners ---
    function addEventListeners() {
        document.getElementById('gm-btn-cargar-orden').addEventListener('click', loadOrderPage);
        document.getElementById('gm-orden-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); loadOrderPage(); } });
        document.getElementById('gm-btn-colectora').addEventListener('click', handleColectora);
        document.getElementById('gm-btn-anexar').addEventListener('click', handleAnexar);
        document.getElementById('gm-btn-perdida').addEventListener('click', handlePerdida);

        const manageSection = document.getElementById('gm-manage-worker-section');
        const toggleBtn = document.getElementById('gm-btn-toggle-worker-edit');
        toggleBtn.addEventListener('click', () => {
            manageSection.classList.toggle('gm-edit-mode');
            if (manageSection.classList.contains('gm-edit-mode')) {
                toggleBtn.textContent = 'Finalizar Edición';
                toggleBtn.style.backgroundColor = '#28a745';
            } else {
                toggleBtn.textContent = 'Editar Lista';
                toggleBtn.style.backgroundColor = '#6c757d';
                rebuildWorkerUI();
            }
        });

        document.getElementById('gm-btn-add-worker').addEventListener('click', () => {
            const input = document.getElementById('gm-new-worker-input');
            const newName = input.value.trim().toUpperCase();
            if (newName) {
                const workers = getWorkers();
                if (workers.includes(newName)) { showToast(`"${newName}" ya existe.`); }
                else {
                    workers.push(newName); saveWorkerList(workers); rebuildWorkerUI(); input.value = '';
                    showToast(`"${newName}" fue añadido.`);
                }
            }
        });

        document.getElementById('gm-fecha-input').addEventListener('change', saveDate);
        document.getElementById('gm-trabajadores-list').addEventListener('change', saveWorkersSelection);
    }

    // --- Ejecución Principal con Detección de Logout ---
    function main() {
        addStyles();
        createUI();
        addEventListeners();

        // **Añadido para poner el foco en el campo de la orden**
        const ordenInput = document.getElementById('gm-orden-input');
        if (ordenInput) {
            ordenInput.focus();
        }

        const sidePanel = document.getElementById('gm-side-panel');
        if (!sidePanel) return;

        const checkLogoutLink = () => {
            const logoutLinks = Array.from(document.querySelectorAll('a[href]'))
                .filter(a => a.href.includes('apex_authentication.logout'));

            if (logoutLinks.length > 0) {
                sidePanel.classList.remove('hidden');
                sidePanel.style.display = 'block';
            } else {
                sidePanel.classList.add('hidden');
                setTimeout(() => {
                    sidePanel.style.display = 'none';
                }, 300);
            }
        };

        checkLogoutLink();

        const observer = new MutationObserver(() => {
            checkLogoutLink();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        window.addEventListener('popstate', checkLogoutLink);
        window.addEventListener('hashchange', checkLogoutLink);
    }

    main();
})();