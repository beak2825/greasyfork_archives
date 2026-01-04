// ==UserScript==
// @name         Drawaria The Camera Mode Menu 🎥🎬
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú arrastrable que cicla entre efectos de cine al hacer clic en las cámaras.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555566/Drawaria%20The%20Camera%20Mode%20Menu%20%F0%9F%8E%A5%F0%9F%8E%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555566/Drawaria%20The%20Camera%20Mode%20Menu%20%F0%9F%8E%A5%F0%9F%8E%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'camera-menu-container';
    let cam1State = 0; // Estilo: 0=Vintage, 1=Comic, 2=Sci-Fi
    let cam2State = 0; // Movimiento: 0=Zoom, 1=Blur, 2=Tilt-Shift
    let cam3State = 0; // Atmósfera: 0=Noir, 1=Saturación, 2=NightVision

    // 1. Contenido del SVG (Con los IDs de las cámaras)
    const menuSVG = `
        <svg id="camera-mode-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840.458 583.719" xmlns:bx="https://boxy-svg.com">
          <defs>
            <filter id="outline-filter-0" bx:preset="outline 1 4 #fdfdfd" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#fdfdfd" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <style bx:fonts="Abril Fatface">@import url(https://fonts.googleapis.com/css2?family=Abril+Fatface%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
            <filter id="outline-filter-1" bx:preset="outline 1 4 #fce9d1" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#fce9d1" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g>
            <g id="cam1" transform="matrix(1, 0, 0, 1, -98.812761, 69.765886)" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); cursor: pointer;">
              <g>
                <path d="M 130.685 183.063 L 200.124 183.063 L 200.124 154.747 L 297.878 154.747 L 297.878 183.063 L 364.622 183.063 L 364.622 328.009 L 130.685 328.009 Z" style="stroke: rgb(0, 0, 0); fill: rgb(90, 202, 153);"/>
              </g>
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(150, 255, 202);" cx="244.957" cy="248.457" rx="47.529" ry="48.54"/>
              <g transform="matrix(0.397548, 0, 0, 0.397548, 127.113017, 120.227412)">
                <path d="m581.35 146.42h-128.26l-4.336-30.646-3.326-20.661c-1.343-8.323-5.75-15.224-12.665-20.988-7.079-5.899-14.655-8.991-22.985-8.991h-208.55c-8.33 0-15.991 2.992-22.992 8.991-6.994 5.999-10.711 13.035-11.99 20.988l-3.333 20.661-4.663 30.646h-127.6c-16.994 0-30.654 13.661-30.654 29.986v339.81c0 16.986 13.66 30.646 30.654 30.646h550.69c16.993 0 30.653-13.66 30.653-30.646v-339.81c0-16.325-13.66-29.986-30.653-29.986zm-6.326 363.47h-538.37v-326.82h121.6c18.323 0 34.144-13.632 36.645-31.314l4.329-30.646 3.333-18.991h206.55l3 18.991 4.662 30.646c2.687 17.654 18.656 31.314 36.318 31.314h121.93v326.82z" style="fill: #5a5a5a;"/>
                <path d="m515.72 270.02c15.991 0 29.317-13.653 29.317-29.644 0-16.326-12.992-29.986-29.317-29.986s-29.317 13.66-29.317 29.986c-1e-3 15.991 13.326 29.644 29.317 29.644z" style="fill: #5a5a5a;"/>
                <path d="m305.5 192.73c-37.64 0-70.291 13.653-97.277 40.639s-40.646 59.637-40.646 97.285c0 37.64 13.66 70.291 40.646 97.277s59.637 39.751 97.277 40.312c74.634 1.102 138.8-63.625 137.92-137.59-0.448-37.981-13.66-70.298-40.64-97.285-26.986-26.985-59.303-40.638-97.284-40.638zm71.293 209.55c-19.651 19.651-43.305 29.311-71.293 29.311-27.647 0-51.3-9.659-70.959-29.311-19.659-19.659-29.317-43.646-29.317-71.627 0-27.654 9.659-51.642 29.317-71.3 19.659-19.652 43.312-29.645 70.959-29.645 27.988 0 51.642 9.993 71.293 29.645 19.658 19.659 29.651 43.646 29.651 71.3 0 27.982-9.993 51.968-29.651 71.627z" style="fill: #1f1f1f;"/>
              </g>
            </g>
            <g id="cam2" transform="matrix(1, 0, 0, 1, 172.485447, 112.193865)" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); cursor: pointer;">
              <g>
                <path d="M 130.685 183.063 L 200.124 183.063 L 200.124 154.747 L 297.878 154.747 L 297.878 183.063 L 364.622 183.063 L 364.622 328.009 L 130.685 328.009 Z" style="stroke: rgb(0, 0, 0); fill: rgb(201, 13, 13);"/>
              </g>
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(150, 255, 202);" cx="244.957" cy="248.457" rx="47.529" ry="48.54"/>
              <g transform="matrix(0.397548, 0, 0, 0.397548, 127.113017, 120.227412)">
                <path d="m581.35 146.42h-128.26l-4.336-30.646-3.326-20.661c-1.343-8.323-5.75-15.224-12.665-20.988-7.079-5.899-14.655-8.991-22.985-8.991h-208.55c-8.33 0-15.991 2.992-22.992 8.991-6.994 5.999-10.711 13.035-11.99 20.988l-3.333 20.661-4.663 30.646h-127.6c-16.994 0-30.654 13.661-30.654 29.986v339.81c0 16.986 13.66 30.646 30.654 30.646h550.69c16.993 0 30.653-13.66 30.653-30.646v-339.81c0-16.325-13.66-29.986-30.653-29.986zm-6.326 363.47h-538.37v-326.82h121.6c18.323 0 34.144-13.632 36.645-31.314l4.329-30.646 3.333-18.991h206.55l3 18.991 4.662 30.646c2.687 17.654 18.656 31.314 36.318 31.314h121.93v326.82z" style="fill: #5a5a5a;"/>
                <path d="m515.72 270.02c15.991 0 29.317-13.653 29.317-29.644 0-16.326-12.992-29.986-29.317-29.986s-29.317 13.66-29.317 29.986c-1e-3 15.991 13.326 29.644 29.317 29.644z" style="fill: #5a5a5a;"/>
                <path d="m305.5 192.73c-37.64 0-70.291 13.653-97.277 40.639s-40.646 59.637-40.646 97.285c0 37.64 13.66 70.291 40.646 97.277s59.637 39.751 97.277 40.312c74.634 1.102 138.8-63.625 137.92-137.59-0.448-37.981-13.66-70.298-40.64-97.285-26.986-26.985-59.303-40.638-97.284-40.638zm71.293 209.55c-19.651 19.651-43.305 29.311-71.293 29.311-27.647 0-51.3-9.659-70.959-29.311-19.659-19.659-29.317-43.646-29.317-71.627 0-27.654 9.659-51.642 29.317-71.3 19.659-19.652 43.312-29.645 70.959-29.645 27.988 0 51.642 9.993 71.293 29.645 19.658 19.659 29.651 43.646 29.651 71.3 0 27.982-9.993 51.968-29.651 71.627z" style="fill: #1f1f1f;"/>
              </g>
            </g>
            <g id="cam3" transform="matrix(1, 0, 0, 1, 438.78364, 78.032655)" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); cursor: pointer;">
              <g>
                <path d="M 130.685 183.063 L 200.124 183.063 L 200.124 154.747 L 297.878 154.747 L 297.878 183.063 L 364.622 183.063 L 364.622 328.009 L 130.685 328.009 Z" style="stroke: rgb(0, 0, 0); fill: rgb(13, 110, 201);"/>
              </g>
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(150, 255, 202);" cx="244.957" cy="248.457" rx="47.529" ry="48.54"/>
              <g transform="matrix(0.397548, 0, 0, 0.397548, 127.113017, 120.227412)">
                <path d="m581.35 146.42h-128.26l-4.336-30.646-3.326-20.661c-1.343-8.323-5.75-15.224-12.665-20.988-7.079-5.899-14.655-8.991-22.985-8.991h-208.55c-8.33 0-15.991 2.992-22.992 8.991-6.994 5.999-10.711 13.035-11.99 20.988l-3.333 20.661-4.663 30.646h-127.6c-16.994 0-30.654 13.661-30.654 29.986v339.81c0 16.986 13.66 30.646 30.654 30.646h550.69c16.993 0 30.653-13.66 30.653-30.646v-339.81c0-16.325-13.66-29.986-30.653-29.986zm-6.326 363.47h-538.37v-326.82h121.6c18.323 0 34.144-13.632 36.645-31.314l4.329-30.646 3.333-18.991h206.55l3 18.991 4.662 30.646c2.687 17.654 18.656 31.314 36.318 31.314h121.93v326.82z" style="fill: #5a5a5a;"/>
                <path d="m515.72 270.02c15.991 0 29.317-13.653 29.317-29.644 0-16.326-12.992-29.986-29.317-29.986s-29.317 13.66-29.317 29.986c-1e-3 15.991 13.326 29.644 29.317 29.644z" style="fill: #5a5a5a;"/>
                <path d="m305.5 192.73c-37.64 0-70.291 13.653-97.277 40.639s-40.646 59.637-40.646 97.285c0 37.64 13.66 70.291 40.646 97.277s59.637 39.751 97.277 40.312c74.634 1.102 138.8-63.625 137.92-137.59-0.448-37.981-13.66-70.298-40.64-97.285-26.986-26.985-59.303-40.638-97.284-40.638zm71.293 209.55c-19.651 19.651-43.305 29.311-71.293 29.311-27.647 0-51.3-9.659-70.959-29.311-19.659-19.659-29.317-43.646-29.317-71.627 0-27.654 9.659-51.642 29.317-71.3 19.659-19.652 43.312-29.645 70.959-29.645 27.988 0 51.642 9.993 71.293 29.645 19.658 19.659 29.651 43.646 29.651 71.3 0 27.982-9.993 51.968-29.651 71.627z" style="fill: #1f1f1f;"/>
              </g>
            </g>
            <text style="fill: rgb(51, 51, 51); font-family: &quot;Abril Fatface&quot;; font-size: 62.5px; stroke-width: 0.796313px; text-transform: capitalize; white-space: pre; vector-effect: non-scaling-stroke; filter: url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-1&quot;);" x="81.612" y="120.673">the camera mode menu</text>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 10;0 0" begin="0s" dur="3.26s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo keyframes para los efectos de cine)
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 750px; /* Tamaño grande para ver bien el SVG */
            height: auto;
            z-index: 10001;
            cursor: grab;
            transition: opacity 0.5s;
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }

        /* Contenedor de efectos - Se aplica a :root o <body> para afectar a todo */
        /* Limpiador de efectos: Vuelve al estado normal */
        html.camera-clean {
            filter: none !important;
            transform: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }

        /* --------------------------------- */
        /* CÁMARA 1 - Efectos de Estilo */
        /* --------------------------------- */
        .effect-vintage {
            filter: sepia(70%) saturate(200%) brightness(80%) contrast(120%);
        }
        .effect-comic {
            /* Colores planos, alto contraste (simulado), y un poco de pixelado */
            filter: contrast(3) saturate(1.5) url(#svg-blur-filter); /* Usaremos una SVG Filter interna */
            /* Se necesita un filtro SVG real para el pixelado, simplificamos con alto contraste/saturación */
        }
        .effect-scifi {
            filter: hue-rotate(200deg) saturate(2) brightness(1.5);
            backdrop-filter: blur(2px) contrast(1.5);
            -webkit-backdrop-filter: blur(2px) contrast(1.5);
        }

        /* --------------------------------- */
        /* CÁMARA 2 - Efectos de Movimiento/Composición */
        /* --------------------------------- */
        @keyframes dramatic-zoom {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .effect-zoom-dramatic {
            animation: dramatic-zoom 1s ease-in-out forwards;
        }
        .effect-lens-blur {
            filter: blur(5px);
        }
        .effect-tilt-shift {
            /* Crea dos zonas de desenfoque, dejando una banda enfocada en el centro */
            filter: blur(5px);
            mask-image: linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%);
        }

        /* --------------------------------- */
        /* CÁMARA 3 - Efectos de Atmósfera */
        /* --------------------------------- */
        .effect-noir {
            filter: grayscale(100%) contrast(1.5) brightness(0.8);
        }
        .effect-saturation-extreme {
            filter: saturate(5);
        }
        .effect-night-vision {
            filter: grayscale(100%) sepia(100%) hue-rotate(90deg) brightness(1.5);
            background-color: rgba(0, 50, 0, 0.5); /* Fondo verdoso tenue */
            mix-blend-mode: multiply;
        }
    `);

    // 3. Funciones de Control de Efectos

    /** Aplica o limpia una lista de clases de efectos en el elemento HTML. */
    function applyEffect(element, newClass, allClasses) {
        // 1. Limpiar todas las clases de ese grupo
        allClasses.forEach(c => element.classList.remove(c));

        // 2. Aplicar la nueva clase (si no es 'off')
        if (newClass) {
            element.classList.add(newClass);
        }
    }

    /** Mapeo de todos los efectos por grupo. */
    const EFFECT_GROUPS = {
        'cam1': {
            state: cam1State,
            classes: ['effect-vintage', 'effect-comic', 'effect-scifi'],
            currentClass: null
        },
        'cam2': {
            state: cam2State,
            classes: ['effect-zoom-dramatic', 'effect-lens-blur', 'effect-tilt-shift'],
            currentClass: null
        },
        'cam3': {
            state: cam3State,
            classes: ['effect-noir', 'effect-saturation-extreme', 'effect-night-vision'],
            currentClass: null
        }
    };

    /** Elemento al que se aplican los efectos */
    let rootElement;

    /**
     * Alterna el efecto para una cámara específica.
     * @param {string} camId - ID de la cámara ('cam1', 'cam2', 'cam3').
     */
    function cycleEffect(camId) {
        const group = EFFECT_GROUPS[camId];
        if (!group) return;

        // 1. Calcular el nuevo estado: 0 -> 1 -> 2 -> 0 (desactivado)
        group.state = (group.state + 1) % (group.classes.length + 1);

        // 2. Determinar la nueva clase
        const newIndex = group.state - 1; // -1, 0, 1, 2
        const newClass = newIndex >= 0 ? group.classes[newIndex] : null;

        // 3. Aplicar/Limpiar Clases en el elemento raíz (BODY o HTML)
        // Resetear propiedades que podrían interferir (como transform en cam2)
        rootElement.style.transform = 'none';
        rootElement.style.maskImage = 'none';
        rootElement.style.backgroundColor = 'transparent';

        applyEffect(rootElement, newClass, group.classes);

        // 4. Resetear los otros grupos a 'off' si es necesario (para que no se mezclen los filtros de forma rara)
        // En este caso, solo aplicaremos un efecto a la vez por simplicidad de filtrado.
        Object.keys(EFFECT_GROUPS).forEach(id => {
            if (id !== camId) {
                const otherGroup = EFFECT_GROUPS[id];
                otherGroup.state = 0; // Desactivar el otro
                applyEffect(rootElement, null, otherGroup.classes);
            }
        });

        // 5. Aplicar la clase de limpieza si todos están off
        const allOff = Object.values(EFFECT_GROUPS).every(g => g.state === 0);
        if (allOff) {
            rootElement.classList.add('camera-clean');
        } else {
            rootElement.classList.remove('camera-clean');
        }

        console.log(`Cámara ${camId} -> Efecto: ${newClass || 'OFF'}`);
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleButtonClick(event) {
        event.preventDefault();

        // Identificar la cámara clicada (ID)
        const buttonId = event.currentTarget.id;

        // Ejecutar el ciclo de efectos para esa cámara
        cycleEffect(buttonId);
    }

    /**
     * Hace un elemento HTML arrastrable.
     */
    function dragElement(element) {
        let pos3 = 0, pos4 = 0;
        let isDragging = false;
        const DRAG_THRESHOLD = 5;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Solo permitir el drag si el clic no es en una de las cámaras
            if (e.target.closest('#cam1, #cam2, #cam3')) return;

            isDragging = false;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            const dx = e.clientX - pos3;
            const dy = e.clientY - pos4;

            if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
                isDragging = true;

                element.style.top = (element.offsetTop + dy) + "px";
                element.style.left = (element.offsetLeft + dx) + "px";

                pos3 = e.clientX;
                pos4 = e.clientY;
            }
        }

        function closeDragElement(e) {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    // 5. Inicialización
    window.addEventListener('load', () => {
        // Establecer el elemento raíz para aplicar los filtros (HTML o BODY)
        rootElement = document.documentElement; // Usar HTML para el mejor soporte de filtros

        // 5.1. Crear el contenedor del menú e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.2. Asignar eventos a los botones (cámaras)
        ['cam1', 'cam2', 'cam3'].forEach(id => {
            const button = document.querySelector(`#${MENU_ID} #${id}`);
            if (button) {
                button.addEventListener('click', handleButtonClick);
            }
        });

        // 5.3. Iniciar el estado de limpieza
        rootElement.classList.add('camera-clean');

        // 5.4. Hacer el menú arrastrable
        dragElement(menuContainer);
    });

})();