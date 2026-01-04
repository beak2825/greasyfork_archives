// ==UserScript==
// @name         CaixaBank: Automatic Movement Deployer (v1.0)
// @name:es      CaixaBank: Despliegue de Movimientos automático (v1.0)
// @name:ca      CaixaBank: Desplegament de Moviments automàtic (v1.0)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically expands all movements on CaixaBankNow before exporting.
// @description:es Despliega automáticamente todos los movimientos en CaixaBankNow antes de exportar.
// @description:ca Desplega automàticament tots els moviments a CaixaBankNow abans d'exportar.
// @author       Tinaut1986
// @match        *://*.caixabank.es/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555245/CaixaBank%3A%20Automatic%20Movement%20Deployer%20%28v10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555245/CaixaBank%3A%20Automatic%20Movement%20Deployer%20%28v10%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** CONFIGURATION ***
    const CLICK_DELAY_MS = 1500;
    const PAGINATION_DIV_SELECTOR = '#paginacionAcumulativa01';

    // Global state
    let loadingInterval = null;

    // CaixaBank Brand Colors
    const COLOR_YELLOW_GOLD = '#ffc72c';
    const COLOR_BLUE_TURQUOISE = '#00A6E0';
    const COLOR_RED_CORAL = '#e35205'; // Based on the logo dot provided

    // --- UTILITY FUNCTIONS FOR FRAME ACCESS ---

    function getContentFrame() {
        try {
            const inferiorFrame = window.frames['Inferior'];
            if (!inferiorFrame) return null;
            const cosFrame = inferiorFrame.frames['Cos'];
            return cosFrame || inferiorFrame;
        } catch (e) {
            console.error("Error accessing iframe window.", e);
        }
        return null;
    }

    function isPaginationButtonPresent() {
        const contentFrame = getContentFrame();
        if (!contentFrame || !contentFrame.document) {
            return false;
        }
        const paginationDiv = contentFrame.document.querySelector(PAGINATION_DIV_SELECTOR);
        return paginationDiv && paginationDiv.offsetParent !== null;
    }


    // --- MAIN LOADING LOGIC ---

    function stopLoading() {
        if (loadingInterval !== null) {
            clearTimeout(loadingInterval);
            loadingInterval = null;
            updateButtonStates(false);
        }
    }

    function loadMoreMovementsStep() {
        const contentFrame = getContentFrame();

        if (!contentFrame || !contentFrame.document) {
             stopLoading();
             return;
        }

        const paginationDiv = contentFrame.document.querySelector(PAGINATION_DIV_SELECTOR);

        if (paginationDiv && paginationDiv.offsetParent !== null) {
            const onclickCode = paginationDiv.getAttribute('onclick');
            if (onclickCode) {
                contentFrame.eval(onclickCode);
                loadingInterval = setTimeout(loadMoreMovementsStep, CLICK_DELAY_MS);
            } else {
                 stopLoading();
            }
        } else {
            stopLoading();
            alert('Carga de movimientos finalizada. Todos los datos visibles están desplegados.');
            // The panel will auto-destroy itself on the next sync check
        }
    }

    function startLoading() {
        if (loadingInterval === null) {
            updateButtonStates(true);

            if (getContentFrame()) {
                loadMoreMovementsStep();
            } else {
                 alert('Error: No se puede acceder al frame de contenido. Asegúrate de estar en la página de movimientos.');
                 updateButtonStates(false);
            }
        }
    }

    // --- DRAG-AND-DROP UI LOGIC (Only runs in the TOP frame) ---

    function updateButtonStates(isLoading) {
        if (window.self !== window.top) {
            return;
        }

        const startBtn = document.getElementById('tm_start_btn');
        const stopBtn = document.getElementById('tm_stop_btn');

        if (startBtn && stopBtn) {
            startBtn.disabled = isLoading;
            startBtn.style.cursor = isLoading ? 'not-allowed' : 'pointer';
            startBtn.style.backgroundColor = isLoading ? '#007AA6' : COLOR_BLUE_TURQUOISE;

            stopBtn.disabled = !isLoading;
            stopBtn.style.cursor = isLoading ? 'pointer' : 'not-allowed';
            stopBtn.style.backgroundColor = isLoading ? COLOR_RED_CORAL : '#b23703';
        }
    }

    /**
     * @function setupDrag
     * @description Sets up robust drag functionality by disabling iframe pointer-events.
     */
    function setupDrag(container, handle) {
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        let originalUserSelectStyle = '';

        const setIframesPointerEvents = (value) => {
            const iframes = document.getElementsByTagName('iframe');
            for (let i = 0; i < iframes.length; i++) {
                iframes[i].style.pointerEvents = value;
            }
        };

        const startDrag = (e) => {
            isDragging = true;
            container.style.position = 'fixed';
            offset.x = e.clientX - container.getBoundingClientRect().left;
            offset.y = e.clientY - container.getBoundingClientRect().top;
            handle.style.cursor = 'grabbing';
            e.preventDefault();

            // CRITICAL FIX: Disable text selection AND iframe mouse events
            originalUserSelectStyle = document.body.style.userSelect;
            document.body.style.userSelect = 'none';
            setIframesPointerEvents('none'); // Disable iframes
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            container.style.left = e.clientX - offset.x + 'px';
            container.style.top = e.clientY - offset.y + 'px';
        };

        const endDrag = () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'grab';
                document.body.style.userSelect = originalUserSelectStyle;
                setIframesPointerEvents('auto'); // Re-enable iframes
            }
        };

        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', endDrag);
    }

    // --- DYNAMIC UI LIFECYCLE FUNCTIONS ---

    function createButtons() {
        if (window.self !== window.top || document.getElementById('tm_control_panel')) {
            return; // Exit if not top window or UI already exists
        }

        const container = document.createElement('div');
        container.id = 'tm_control_panel';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            width: 250px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            font-family: 'Open Sans', Arial, sans-serif;
            overflow: hidden;
        `;

        const dragHandle = document.createElement('div');
        dragHandle.id = 'tm_drag_handle';
        dragHandle.textContent = 'MOVER PANEL';
        dragHandle.style.cssText = `
            background-color: ${COLOR_YELLOW_GOLD};
            color: #333;
            padding: 8px 0;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
            cursor: grab;
            user-select: none;
            border-bottom: 2px solid #e0b028;
            border-radius: 8px 8px 0 0;
        `;

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = `
            display: flex;
            gap: 5px;
            padding: 10px;
            justify-content: space-around;
            background-color: white;
        `;


        const startBtn = document.createElement('button');
        startBtn.id = 'tm_start_btn';
        startBtn.textContent = '▶️ Desplegar Movimientos';
        startBtn.style.cssText = `
            flex-grow: 1;
            background-color: ${COLOR_BLUE_TURQUOISE};
            color: white;
            border: none;
            padding: 8px 5px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            transition: background-color 0.3s;
        `;
        startBtn.onclick = startLoading;

        const stopBtn = document.createElement('button');
        stopBtn.id = 'tm_stop_btn';
        stopBtn.textContent = '⏹️ Detener Carga';
        stopBtn.disabled = true;
        stopBtn.style.cssText = `
            flex-grow: 1;
            background-color: ${COLOR_RED_CORAL};
            color: white;
            border: none;
            padding: 8px 5px;
            border-radius: 4px;
            cursor: not-allowed;
            font-weight: bold;
            font-size: 12px;
            transition: background-color 0.3s;
        `;
        stopBtn.onclick = stopLoading;

        buttonWrapper.appendChild(startBtn);
        buttonWrapper.appendChild(stopBtn);
        container.appendChild(dragHandle);
        container.appendChild(buttonWrapper);
        document.body.appendChild(container);

        setupDrag(container, dragHandle);
        updateButtonStates(false);
    }

    function destroyButtons() {
        if (window.self !== window.top) return;
        const panel = document.getElementById('tm_control_panel');
        if (panel) {
            panel.remove();
        }
    }

    /**
     * @function syncUIVisibility
     * @description Checks every second if the UI should be visible or not.
     */
    function syncUIVisibility() {
        const buttonPresent = isPaginationButtonPresent();
        const uiExists = !!document.getElementById('tm_control_panel');

        if (buttonPresent) {
            if (!uiExists) {
                createButtons();
            }
        } else { // button is NOT present
            if (uiExists && loadingInterval === null) {
                // Only destroy if we are not actively loading
                destroyButtons();
            }
        }
    }

    // --- EXECUTION ---

    // Start the sync loop, but only in the top window.
    if (window.self === window.top) {
        setInterval(syncUIVisibility, 1000);
    }

})();