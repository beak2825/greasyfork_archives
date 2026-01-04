// ==UserScript==
// @name         🎄 Drawaria.online Christmas Effects Mod Menu 🎅
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Añade efectos de nieve, música y decoraciones navideñas a Drawaria.online con un menú de mod.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @require      https://update.greasyfork.org/scripts/554529/1688219/Torn%20Radial%20UI%20Components%20Library.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554753/%F0%9F%8E%84%20Drawariaonline%20Christmas%20Effects%20Mod%20Menu%20%F0%9F%8E%85.user.js
// @updateURL https://update.greasyfork.org/scripts/554753/%F0%9F%8E%84%20Drawariaonline%20Christmas%20Effects%20Mod%20Menu%20%F0%9F%8E%85.meta.js
// ==/UserScript==

/* global TornRadialUI */

(function() {
    'use strict';

    // ==================== CONFIGURACIÓN Y UTILIDADES ====================
    const STORAGE_KEY = 'drawaria-christmas-mod-settings';
    const DEFAULT_SETTINGS = {
        snowfallEnabled: false,
        christmasBgEnabled: false,
        christmasColorsEnabled: false,
        musicEnabled: false
    };

    let settings = loadSettings();
    let audioElement = null;

    /**
     * Carga la configuración desde localStorage.
     * @returns {object} La configuración actual o la predeterminada.
     */
    function loadSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        } catch (e) {
            console.error('Drawaria Christmas Mod: Error al cargar la configuración.', e);
            return DEFAULT_SETTINGS;
        }
    }

    /**
     * Guarda la configuración en localStorage.
     */
    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Drawaria Christmas Mod: Error al guardar la configuración.', e);
        }
    }

    // ==================== APLICACIÓN DE EFECTOS ====================

    /**
     * Aplica o remueve las clases y elementos de efectos navideños según la configuración.
     */
    function applyChristmasEffects() {
        const body = document.body;

        // 1. Nieve
        let snowContainer = document.getElementById('drawaria-christmas-snow');
        if (settings.snowfallEnabled) {
            if (!snowContainer) {
                snowContainer = document.createElement('div');
                snowContainer.id = 'drawaria-christmas-snow';
                body.appendChild(snowContainer);
                // Generar los copos de nieve (CSS-only solution for performance)
                for (let i = 0; i < 50; i++) {
                    const flake = document.createElement('div');
                    flake.className = 'snow-flake';
                    flake.style.left = `${Math.random() * 100}%`;
                    flake.style.animationDuration = `${(Math.random() * 10) + 5}s`; // 5 to 15 seconds
                    flake.style.animationDelay = `-${Math.random() * 15}s`; // Start at random phase
                    flake.style.opacity = `${(Math.random() * 0.5) + 0.5}`; // 0.5 to 1.0
                    flake.style.fontSize = `${(Math.random() * 10) + 10}px`; // 10px to 20px
                    snowContainer.appendChild(flake);
                }
            }
            snowContainer.style.display = 'block';
        } else {
            if (snowContainer) {
                snowContainer.style.display = 'none';
            }
        }

        // 2. Fondo (Background)
        if (settings.christmasBgEnabled) {
            body.classList.add('christmas-bg');
        } else {
            body.classList.remove('christmas-bg');
        }

        // 3. Colores de la Interfaz (Red/Green)
        if (settings.christmasColorsEnabled) {
            body.classList.add('christmas-ui-colors');
        } else {
            body.classList.remove('christmas-ui-colors');
        }

        // 4. Música
        if (settings.musicEnabled) {
            if (!audioElement) {
                audioElement = new Audio('https://www.myinstants.com/media/sounds/jingle-bells-8bit.mp3'); // URL de ejemplo
                audioElement.loop = true;
                audioElement.volume = 0.3;
            }
            // Intentar reproducir (puede requerir interacción del usuario)
            audioElement.play().catch(e => {
                console.log('Drawaria Christmas Mod: Reproducción de audio bloqueada, requiere interacción del usuario.', e);
                // Se podría añadir un botón de "Play" si el navegador lo bloquea.
            });
        } else {
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
            }
        }
    }


    // ==================== CREACIÓN DE LA INTERFAZ (UI) ====================

    /**
     * Genera el modal del Mod Menu usando TornRadialUI.UIComponents.
     * @returns {HTMLElement} El elemento DOM del modal.
     */
    function createModMenuModal() {
        if (!window.TornRadialUI || !window.TornRadialUI.UIComponents) {
            console.error('Torn Radial UI Components Library no está disponible.');
            return null;
        }

        const UIComponents = window.TornRadialUI.UIComponents;
        const modal = document.createElement('div');
        modal.id = 'drawaria-christmas-mod-menu';
        modal.className = 'torn-radial-overlay';
        modal.style.display = 'none'; // Se oculta inicialmente

        modal.innerHTML = `
            <div class="torn-radial-container-base" style="max-width: 500px;">
                <div class="torn-radial-header-base christmas-header">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                        <h2>🎄 Menú de Efectos de Navidad 🎅</h2>
                    </div>
                    <button class="modal-close" id="mod-menu-close-btn">✕</button>
                </div>
                <div class="torn-radial-body-base">
                    <div class="torn-radial-section">
                        <h3>Opciones de Decoración</h3>

                        <div class="setting-item">
                            <label>Efecto de Nieve</label>
                            <input type="checkbox" id="snowfall-toggle" ${settings.snowfallEnabled ? 'checked' : ''}>
                        </div>

                        <div class="setting-item">
                            <label>Fondo de Pantalla Navideño</label>
                            <input type="checkbox" id="bg-toggle" ${settings.christmasBgEnabled ? 'checked' : ''}>
                        </div>

                        <div class="setting-item">
                            <label>Colores Interfaz (Rojo/Verde)</label>
                            <input type="checkbox" id="colors-toggle" ${settings.christmasColorsEnabled ? 'checked' : ''}>
                        </div>
                    </div>

                    <div class="torn-radial-section">
                        <h3>Opciones de Sonido</h3>

                        <div class="setting-item">
                            <label>Música Navideña (8-bit Jingle Bells)</label>
                            <input type="checkbox" id="music-toggle" ${settings.musicEnabled ? 'checked' : ''}>
                        </div>
                        <p style="font-size: 11px; opacity: 0.7; margin-top: 5px;">*La reproducción de música puede requerir que hagas clic en la página primero.</p>
                    </div>

                    <div class="torn-radial-section" style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                        <p>Desarrollado por YouTubeDrawaria | Usando Torn Radial UI Library</p>
                    </div>
                </div>
                <div class="torn-radial-footer-base" style="justify-content: flex-end;">
                    <button class="torn-radial-btn-base btn-primary" id="mod-menu-save-btn">Guardar y Aplicar</button>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * Abre el modal del Mod Menu y adjunta los manejadores de eventos.
     */
    function openModMenu() {
        const modal = document.getElementById('drawaria-christmas-mod-menu');
        if (!modal) return;

        // Mostrar el modal
        modal.style.display = 'flex';

        // 1. Cierre del modal
        const closeBtn = document.getElementById('mod-menu-close-btn');
        closeBtn.onclick = () => { modal.style.display = 'none'; };

        // 2. Guardar y Aplicar
        const saveBtn = document.getElementById('mod-menu-save-btn');
        saveBtn.onclick = () => {
            // Recoger los valores de los checkboxes
            settings.snowfallEnabled = document.getElementById('snowfall-toggle').checked;
            settings.christmasBgEnabled = document.getElementById('bg-toggle').checked;
            settings.christmasColorsEnabled = document.getElementById('colors-toggle').checked;
            settings.musicEnabled = document.getElementById('music-toggle').checked;

            saveSettings();
            applyChristmasEffects();
            modal.style.display = 'none';
        };

        // 3. Manejadores de cambios instantáneos (opcional, para feedback)
        // Aunque se usará el botón de guardar, los toggles deben reflejar el estado actual.
        document.getElementById('snowfall-toggle').onchange = (e) => settings.snowfallEnabled = e.target.checked;
        document.getElementById('bg-toggle').onchange = (e) => settings.christmasBgEnabled = e.target.checked;
        document.getElementById('colors-toggle').onchange = (e) => settings.christmasColorsEnabled = e.target.checked;
        document.getElementById('music-toggle').onchange = (e) => settings.musicEnabled = e.target.checked;
    }

    // ==================== ESTILOS CSS ====================

    function addStyles() {
        // Estilos base para la librería Torn Radial UI (oscuro y minimalista)
        GM_addStyle(`
            /* Estilos base del modal y overlay */
            .torn-radial-overlay {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                z-index: 1000000;
                justify-content: center;
                align-items: center;
                padding: 20px;
                overflow-y: auto;
            }
            .torn-radial-container-base {
                background: #1e1e1e; /* Color de fondo oscuro */
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                width: 100%;
                max-width: 600px;
                color: #ffffff;
                overflow: hidden;
                border: 1px solid #333;
            }
            .torn-radial-header-base {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: #252525;
                border-bottom: 1px solid #333;
            }
            .torn-radial-header-base h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            .torn-radial-body-base {
                padding: 20px;
                max-height: 70vh;
                overflow-y: auto;
            }
            .torn-radial-footer-base {
                display: flex;
                gap: 10px;
                padding: 15px 20px;
                background: #252525;
                border-top: 1px solid #333;
                flex-wrap: wrap;
            }

            /* Componentes */
            .torn-radial-section {
                margin-bottom: 15px;
                padding: 15px;
                background: #2a2a2a;
                border-radius: 6px;
                border: 1px solid #333;
            }
            .torn-radial-section h3 {
                margin-top: 0;
                font-size: 16px;
                color: #4aa3df; /* Color de énfasis */
                margin-bottom: 10px;
            }
            .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px dashed #333;
            }
            .setting-item:last-child {
                border-bottom: none;
            }

            /* Botones */
            .torn-radial-btn-base {
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
                font-size: 13px;
                font-weight: 500;
            }
            .btn-primary {
                background-color: #4aa3df;
                color: white;
            }
            .btn-primary:hover {
                background-color: #378ac0;
            }
            .btn-success {
                background-color: #3ea34a;
                color: white;
            }
            .btn-danger {
                background-color: #a33a3a;
                color: white;
            }
            .modal-close {
                background: none;
                border: none;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.8;
            }
            .modal-close:hover {
                opacity: 1;
            }

            /* Estilos del Toggle (Mejora visual) */
            input[type="checkbox"] {
                appearance: none;
                -webkit-appearance: none;
                position: relative;
                width: 38px;
                height: 20px;
                border-radius: 20px;
                background: #444;
                transition: background 0.3s;
                cursor: pointer;
            }
            input[type="checkbox"]:checked {
                background: #3ea34a; /* Success color for ON state */
            }
            input[type="checkbox"]::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 16px;
                height: 16px;
                background: #fff;
                border-radius: 50%;
                transition: left 0.3s;
            }
            input[type="checkbox"]:checked::after {
                left: 20px;
            }


            /* ==================== ESTILOS NAVIDEÑOS ==================== */

            /* 1. Fondo de Pantalla */
            .christmas-bg {
                background-image: url('https://ibb.co/6N9T1L8') !important; /* URL de una imagen de fondo festivo (ejemplo) */
                background-size: cover !important;
                background-position: center center !important;
                background-attachment: fixed !important;
            }

            /* 2. Colores de Interfaz (Estiliza los headers para el look navideño) */
            .christmas-header {
                background: linear-gradient(135deg, #a33a3a 0%, #3ea34a 100%); /* Rojo y Verde */
                color: white !important;
            }
            .christmas-ui-colors .torn-radial-section h3 {
                color: #a33a3a !important; /* Rojo Navidad */
            }
            .christmas-ui-colors .btn-primary {
                background-color: #3ea34a; /* Verde Navidad */
            }

            /* 3. Efecto de Nieve */
            #drawaria-christmas-snow {
                pointer-events: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                overflow: hidden;
            }
            .snow-flake {
                position: absolute;
                color: white;
                text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                top: -20px;
                animation: snowfall linear infinite;
            }
            .snow-flake::before {
                content: '❅'; /* Carácter de copo de nieve */
            }

            @keyframes snowfall {
                0% { transform: translate(0, 0); opacity: 1; }
                100% { transform: translate(0, 100vh); opacity: 0.5; }
            }
        `);
    }

    // ==================== INICIALIZACIÓN ====================

    function initialize() {
        // 1. Añadir estilos CSS
        addStyles();

        // 2. Crear y añadir el modal al DOM
        const modMenuModal = createModMenuModal();
        if (modMenuModal) {
            document.body.appendChild(modMenuModal);
        }

        // 3. Registrar el comando del menú de Tampermonkey/Greasemonkey
        GM_registerMenuCommand("🎄 Abrir Menú de Navidad", openModMenu);

        // 4. Aplicar los efectos iniciales según la configuración cargada
        // Se hace un pequeño retraso para asegurar que el DOM esté más listo.
        setTimeout(applyChristmasEffects, 1000);
    }

    // Esperar a que el cuerpo del documento esté disponible
    if (document.body) {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }

})();