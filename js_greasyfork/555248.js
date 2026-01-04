// ==UserScript==
// @name         Drawaria Ice Menu & Freeze Effect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enables a draggable menu with a freeze effect on startup.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555248/Drawaria%20Ice%20Menu%20%20Freeze%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/555248/Drawaria%20Ice%20Menu%20%20Freeze%20Effect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. SVG Menu Content
    const menuSVG = `
        <svg id="ice-menu-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-7.29 0 498.268 637.2" xmlns:bx="https://boxy-svg.com">
          <defs>
            <filter id="round-edges-filter-0" bx:preset="round-edges 1 5" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
              <feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 200 -100"/>
              <feComposite in="SourceGraphic" operator="atop"/>
            </filter>
            <filter id="filter-1" bx:preset="round-edges 1 5" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
              <feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 200 -100"/>
              <feComposite in="SourceGraphic" operator="atop"/>
            </filter>
            <filter id="filter-2" bx:preset="round-edges 1 5" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
              <feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 200 -100"/>
              <feComposite in="SourceGraphic" operator="atop"/>
            </filter>
            <filter id="filter-4" bx:preset="round-edges 1 5" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
              <feColorMatrix mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 200 -100"/>
              <feComposite in="SourceGraphic" operator="atop"/>
            </filter>
            <style bx:fonts="Varela Round">@import url(https://fonts.googleapis.com/css2?family=Varela+Round%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
          </defs>
          <g>
            <rect x="59.522" y="64.28" width="387.916" height="433.271" style="filter: url(&quot;#round-edges-filter-0&quot;); stroke-width: 9px; fill: rgb(51, 79, 154); stroke: rgb(181, 201, 255);" rx="27.184" ry="27.184"/>
            <path d="M 104.45 616.131 L 347.035 616.131 C 362.048 616.131 374.219 603.96 374.219 588.947 L 374.219 583.673 L 379.039 583.673 C 427.369 583.673 466.549 544.493 466.549 496.163 C 466.549 447.833 427.369 408.653 379.039 408.653 L 374.209 408.653 C 325.879 408.653 286.699 447.833 286.699 496.163 C 286.699 496.983 286.71 497.801 286.733 498.616 L 104.45 498.616 C 89.437 498.616 77.266 510.787 77.266 525.8 L 77.266 588.947 C 77.266 603.96 89.437 616.131 104.45 616.131 Z" style="stroke-width: 9px; filter: url(&quot;#filter-1&quot;); fill: rgb(54, 104, 141); stroke: rgb(206, 234, 255); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, 0.000071, 0.000051)"/>
            <path d="M 162.186 91.356 L 162.186 59.615 C 162.186 40.255 146.491 24.561 127.132 24.561 L 76.184 24.561 C 56.825 24.561 41.13 40.255 41.13 59.615 L 41.13 91.356 C 41.13 108.411 53.309 122.622 69.446 125.763 C 69.266 127.203 69.173 128.671 69.173 130.159 L 69.173 161.9 C 69.173 181.26 84.868 196.954 104.227 196.954 L 261.266 196.954 C 280.625 196.954 296.32 181.26 296.32 161.9 L 296.32 130.159 C 296.32 110.799 280.625 95.105 261.266 95.105 L 161.987 95.105 C 162.119 93.873 162.186 92.622 162.186 91.356 Z" style="stroke-width: 9; filter: url(&quot;#filter-4&quot;); stroke: rgb(206, 255, 255); fill: rgb(54, 141, 132); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-1, 0, 0, -1, -0.000075, 0.000004)"/>
            <text style="fill: rgb(132, 127, 31); font-family: &quot;Varela Round&quot;; font-size: 46px; font-weight: 700; stroke: rgb(218, 176, 85); stroke-width: 0.1px; white-space: pre;" x="54.696" y="87.199">ice menu</text>
            <g style="transform-origin: 252.149px 291.615px; cursor: pointer;" id="start">
              <rect x="87.71" y="252.124" width="328.879" height="78.983" style="stroke-width: 9; filter: url(&quot;#filter-2&quot;); stroke: rgb(255, 206, 231); fill: rgb(141, 54, 96);" rx="27.184" ry="27.184"/>
              <text style="fill: rgb(116, 31, 132); font-family: &quot;Varela Round&quot;; font-size: 46px; font-weight: 700; stroke: rgb(218, 85, 133); stroke-width: 0.1px; white-space: pre;" x="204.533" y="302.179">start</text>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.8 0.8;1 1" dur="1.13s" fill="freeze" keyTimes="0; 0.46529; 1" begin="click">
                <title>click</title>
              </animateTransform>
              <animate attributeName="opacity" values="1;0.75;1" begin="click" dur="1.11s" fill="freeze" keyTimes="0; 0.45757; 1">
                <title>click</title>
              </animate>
            </g>
            <text style="fill: rgb(31, 99, 132); font-family: &quot;Varela Round&quot;; font-size: 46px; font-weight: 700; stroke: rgb(85, 207, 218); stroke-width: 0.1px; white-space: pre;" x="204.195" y="477.235">drawaria</text>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 3;0 0" begin="0s" dur="2s" fill="freeze" repeatCount="indefinite" keyTimes="0; 0.472338; 1"/>
          </g>
        </svg>
    `;

    // 2. Inject CSS Styles
    GM_addStyle(`
        /* Estilos del contenedor del menú */
        #ice-menu-container {
            position: fixed;
            top: 50px; /* Posición inicial */
            left: 50px;
            width: 300px; /* Ajusta el tamaño del SVG */
            height: auto;
            z-index: 10000;
            cursor: grab; /* Indica que es arrastrable */
        }
        #ice-menu-container:active {
            cursor: grabbing;
        }

        /* Estilos de la pantalla de congelamiento */
        #ice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(173, 216, 230, 0.1); /* Azul claro con opacidad */
            z-index: 99999; /* Asegura que cubra todo */
            pointer-events: all; /* Bloquea la interacción del juego */
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            /* Efecto de hielo/frío */
            backdrop-filter: blur(3px) brightness(1.2);
            -webkit-backdrop-filter: blur(3px) brightness(1.2);
        }
        #ice-overlay.active {
            opacity: 1;
        }

        /* Oculta la animación de salto SVG si no se quiere que se repita */
        /* #ice-menu-svg animateTransform[repeatCount="indefinite"] { display: none; } */
    `);

    // 3. Main Script Logic (after DOM is ready)
    window.addEventListener('load', () => {
        // Create container and insert SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = 'ice-menu-container';
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        const svgElement = document.getElementById('ice-menu-svg');
        if (!svgElement) return;

        // 3.1. Draggable functionality
        dragElement(menuContainer);

        // 3.2. Freeze Screen functionality
        const startButton = svgElement.querySelector('#start');
        if (startButton) {
            startButton.addEventListener('click', handleStartClick);
        }
    });

    /**
     * Hace un elemento HTML arrastrable.
     * @param {HTMLElement} element - El elemento a hacer arrastrable.
     */
    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Detiene el evento de propagarse para evitar que arrastre otros elementos
            e.preventDefault();
            // Obtiene la posición inicial del cursor
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            // Llama a una función cada vez que se mueve el cursor
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calcula la nueva posición del cursor
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Establece la nueva posición del elemento
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Detiene el movimiento al soltar el botón del ratón
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    /**
     * Maneja el clic en el botón 'start' para congelar la pantalla.
     */
    function handleStartClick() {
        const freezeDuration = 3000; // 3 segundos de congelamiento

        // Crear y añadir la pantalla de hielo
        let overlay = document.getElementById('ice-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ice-overlay';
            document.body.appendChild(overlay);
        }

        // Activar el efecto de congelamiento (cambia la opacidad via CSS)
        overlay.classList.add('active');

        // Opcional: Ocultar el menú mientras la pantalla está congelada
        const menuContainer = document.getElementById('ice-menu-container');
        if(menuContainer) menuContainer.style.display = 'none';

        // Desactivar el efecto después de la duración
        setTimeout(() => {
            overlay.classList.remove('active');

            // Volver a mostrar el menú después de un pequeño retraso
            setTimeout(() => {
                 if(menuContainer) menuContainer.style.display = 'block';
                 overlay.remove(); // Elimina el overlay del DOM para limpieza
            }, 500); // 500ms para permitir la transición de desvanecimiento
        }, freezeDuration);
    }
})();