// ==UserScript==
// @name         Drawaria Duality System 🌓
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú que activa/desactiva el modo de escala de grises (Blanco y Negro) en todo el sitio web.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555468/Drawaria%20Duality%20System%20%F0%9F%8C%93.user.js
// @updateURL https://update.greasyfork.org/scripts/555468/Drawaria%20Duality%20System%20%F0%9F%8C%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'duality-menu-container';
    const START_BUTTON_ID = 'start-btn';

    // 1. Contenido del SVG (Con el ID del botón de inicio)
    const menuSVG = `
        <svg id="duality-system-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -48.715 599.929 606.174" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" xmlns:bx="https://boxy-svg.com">
          <g>
            <g transform="matrix(1, 0, 0, 1, -9.992859, 31.227545)">
              <path d="M 196.541 127.377 H 572.803 V 127.377 H 572.803 V 503.639 H 572.803 V 503.639 H 196.541 V 503.639 H 196.541 V 127.377 H 196.541 V 127.377 Z" bx:shape="rect 196.541 127.377 376.262 376.262 3 0 0 2@16a327ca" style="transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(252, 249, 249); stroke-width: 6px;" transform="matrix(0.707108, -0.707106, 0.707108, 0.707106, -75.716196, -87.65945)"/>
              <path d="M 138.454 17.375 H 479.459 V 17.375 H 479.459 V 432.077 H 479.459 V 432.077 H 138.454 V 432.077 H 138.454 V 17.375 H 138.454 V 17.375 Z" bx:shape="rect 138.454 17.375 341.005 414.702 3 0 0 2@90d785fc" style="stroke: rgb(252, 249, 249); stroke-width: 6px;"/>
            </g>
            <g id="${START_BUTTON_ID}">
              <path d="M 157.223 228.7 H 431.966 V 228.7 H 431.966 V 345.466 H 431.966 V 345.466 H 157.223 V 345.466 H 157.223 V 228.7 H 157.223 V 228.7 Z" bx:shape="rect 157.223 228.7 274.743 116.766 3 0 0 2@5b534dbc" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); cursor: pointer;"/>
              <text style="fill: rgb(7, 7, 7); font-family: Alata; font-size: 28px; stroke-width: 2.98071px; text-transform: capitalize; white-space: pre; vector-effect: non-scaling-stroke; filter: url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(2.772351, 0, 0, 2.588779, -307.257483, -168.726902)" x="188.364" y="183.857">start</text>
            </g>
            <text style="fill: rgb(249, 245, 245); font-family: Alata; font-size: 28px; text-transform: capitalize; white-space: pre; filter: drop-shadow(rgba(62, 60, 60, 0.3) 4px 4px 0px);" transform="matrix(1.78884, 0, 0, 1.822851, -201.911824, -206.320256)" x="188.364" y="183.857">duality system</text>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 4;0 0" begin="0s" dur="3.15s" fill="freeze" keyTimes="0; 0.538166; 1" repeatCount="indefinite"/>
          </g>
          <defs>
            <style bx:fonts="Alata">@import url(https://fonts.googleapis.com/css2?family=Alata%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
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
            <filter id="outline-filter-0" bx:preset="outline 1 4 #020302" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#020302" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-1" bx:preset="outline 1 4 #fff" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#fff" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 2 2 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="2" dy="2"/>
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
        </svg>
    `;

    // 2. CSS Styles
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 450px; /* Tamaño grande para ver bien el SVG */
            height: auto;
            z-index: 10001;
            cursor: grab;
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }

        /* EFECTO BLANCO Y NEGRO */
        .grayscale-mode {
            /* Aplica escala de grises a todo el contenido, incluyendo imágenes y videos */
            filter: grayscale(100%);
            -webkit-filter: grayscale(100%);
            transition: filter 0.5s ease-in-out; /* Transición suave */
        }
    `);

    // 3. Funciones de Efectos

    /**
     * Alterna la escala de grises en el body (todo el sitio).
     */
    function toggleGrayscale() {
        const body = document.body;
        // Si tiene la clase, la quita (vuelve a color); si no, la añade (va a B&N)
        body.classList.toggle('grayscale-mode');

        // Almacenar el estado para que persista a través de recargas (opcional, pero útil)
        if (body.classList.contains('grayscale-mode')) {
            localStorage.setItem('dualitySystemGrayscale', 'active');
            console.log("Duality System: Modo Blanco y Negro ACTIVADO.");
        } else {
            localStorage.removeItem('dualitySystemGrayscale');
            console.log("Duality System: Modo Blanco y Negro DESACTIVADO.");
        }
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleStartButtonClick(event) {
        event.preventDefault();
        
        // 1. Alternar el modo de escala de grises
        toggleGrayscale();
        
        // 2. Feedback visual opcional al presionar el botón
        const buttonGroup = document.getElementById(START_BUTTON_ID);
        if (buttonGroup) {
            buttonGroup.style.opacity = 0.5;
            setTimeout(() => {
                buttonGroup.style.opacity = 1;
            }, 100);
        }
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
            // Solo permitir el clic/drag si el clic es dentro del SVG
            if (!e.target.closest('#duality-system-svg')) return;

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
            // Si no hubo arrastre, el evento de mousedown ya se encargó de la lógica
            // de clic, pero lo dejamos acá por si se necesita añadir lógica de click
            // que dependa de 'mouseup'
        }
    }


    // 5. Inicialización
    window.addEventListener('load', () => {
        // 5.1. Verificar estado persistente (si existe)
        if (localStorage.getItem('dualitySystemGrayscale') === 'active') {
            document.body.classList.add('grayscale-mode');
        }

        // 5.2. Crear el contenedor del menú e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.3. Asignar eventos
        const startButton = document.querySelector(`#${MENU_ID} #${START_BUTTON_ID}`);
        if (startButton) {
             // Usamos mousedown/mouseup para que funcione con el dragElement
             startButton.addEventListener('click', handleStartButtonClick);
        }

        // 5.4. Hacer el menú arrastrable
        dragElement(menuContainer);
    });

})();