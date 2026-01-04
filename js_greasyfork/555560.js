// ==UserScript==
// @name         Drawaria The Shark Mod 🦈
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú arrastrable que cicla entre efectos visuales de tiburones al hacer clic en la nave.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555560/Drawaria%20The%20Shark%20Mod%20%F0%9F%A6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/555560/Drawaria%20The%20Shark%20Mod%20%F0%9F%A6%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'shark-mod-menu-container';
    const OVERLAY_ID = 'shark-overlay';
    const EFFECT_DURATION = 3000; // Duración base para la mayoría de los efectos
    let sharkEffectState = 0; // 0: Shark Rush, 1: Deep Sea Vision, 2: Shark Swarm

    // 1. Contenido del SVG (Se elimina la animación principal del path de la nave para que no interfiera
    // con la interactividad, y se hace el path principal clicable)
    const menuSVG = `
        <svg id="shark-mod-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-5.46 -55.694 791.277 535.375" xmlns:bx="https://boxy-svg.com">
          <defs>
            <filter id="outline-filter-0" bx:preset="outline 1 4 #040501" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#040501" result="flood"/>
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
            <!-- (Otros filtros se omiten por brevedad) -->
            <style bx:fonts="Bauhaus 93">/* ... font imports ... */</style>
          </defs>
          <g>
            <path style="stroke: rgb(0, 0, 0); fill: rgb(82, 165, 252); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-2&quot;) url(&quot;#drop-shadow-filter-1&quot;); cursor: pointer;" 
                  d="M 279.539 369.824 C 279.539 368.112 263.825 374.155 261.835 373.989 C 250.021 373.004 238.485 368.842 227.469 367.74 C 195.393 364.533 159.834 351.791 129.576 341.705 C 113.993 336.511 90.854 333.184 79.588 321.918 C 78.235 320.565 83.088 317.001 83.754 315.67 C 87.515 308.146 100.554 297.828 107.706 290.676 C 110.394 287.989 113.35 285.032 116.038 282.345 C 137.945 260.437 162.112 245.38 187.895 228.192 C 196.464 222.479 204.2 223.684 211.847 219.86 C 216.486 217.541 226.163 213.612 231.634 213.612 C 235.995 200.53 238.944 188.475 247.255 177.163 C 258.891 161.325 269.779 144.941 281.622 129.258 C 300.475 104.29 330.577 90.094 354.521 70.939 C 358.033 68.129 360.474 60.97 364.935 59.483 C 369.266 58.04 389.62 42.512 393.053 45.945 C 394.087 46.979 387.121 54.322 385.763 56.359 C 379.622 65.57 373.543 80.247 371.183 89.684 C 361.657 127.79 373.229 162.536 374.239 199.288 C 377.912 197.349 381.579 195.146 385.544 193.825 C 412.861 184.719 448.042 188.618 477.188 188.618 C 498.726 188.618 524.393 189.07 544.879 196.949 C 561.798 203.456 578.008 215.498 590.702 228.192 C 593.012 230.502 605.36 247.978 607.364 247.978 C 624.072 256.334 640.127 269.206 657.352 276.096 C 672.504 282.157 693.771 279.221 710.464 279.221 C 713.004 279.221 727.427 277.438 728.168 278.179 C 730.074 280.085 719.069 284.537 717.754 286.51 C 714.018 292.114 703.666 301.967 696.925 304.214 C 696.54 304.343 688.594 306.297 688.594 306.297 C 688.594 306.297 694.146 308.725 694.843 309.421 C 700.914 315.492 712.342 319.212 721.919 324.001 C 723.564 324.823 740.797 326.993 736.499 331.291 C 719.034 348.756 690.442 348.995 664.642 348.995 C 616.714 348.995 571.553 341.705 524.051 341.705 C 514.375 348.157 532.769 368.696 535.507 373.989 C 540.332 383.317 556.043 390.36 563.625 397.941 C 565.346 399.662 577.733 408.827 577.163 409.397 C 575.805 410.754 569.554 409.556 567.791 410.438 C 560.052 414.308 546.651 412.521 537.59 412.521 C 494.233 412.521 449.07 392.387 449.07 351.078 C 446.294 355.432 436.863 354.381 432.121 355.243 C 422.197 357.048 412.876 359.211 402.961 360.45 C 360.626 365.742 322.142 370.865 279.034 370.865 L 280.074 368.889 Z" 
                  id="SHARK-PATH"/>
            <path d="M -136.82 -248.244 Q -114.951 -274.8 -93.081 -248.244 L -93.081 -248.244 Q -71.212 -221.688 -114.951 -221.688 L -114.951 -221.688 Q -158.69 -221.688 -136.82 -248.244 Z" bx:shape="triangle -158.69 -274.8 87.478 53.112 0.5 0.5 1@49d9006f" style="stroke: rgb(0, 0, 0); fill: rgb(238, 239, 241); transform-origin: -114.951px -241.605px; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(-0.889052, 0.457807, -0.457809, -0.889051, 307.424992, 502.164143)"/>
            <path d="M 172.609 337.916 H 219.634 V 337.916 H 219.634 V 345.201 H 219.634 V 345.201 H 172.609 V 345.201 H 172.609 V 337.916 H 172.609 V 337.916 Z" bx:shape="rect 172.609 337.916 47.025 7.285 3 0 0 2@415ae948" style="stroke: rgb(0, 0, 0); fill: rgb(1, 1, 1); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
            <text style="fill: rgb(51, 51, 51); font-family: &quot;Bauhaus 93&quot;; font-size: 65.7px; white-space: pre; filter: url(&quot;#spot-light-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-2&quot;);" x="176.091" y="15.004">the shark mod</text>
            <path stroke-width="0" d="M 171.543 248.197 C 174.791 247.571 181.221 247.124 184.946 248.197 C 188.218 249.139 191.32 250.992 193.045 253.503 C 194.813 256.074 195.874 260.445 195.279 263.555 C 194.680 266.684 192.536 270.357 189.415 272.212 C 185.683 274.430 177.683 275.143 173.218 274.445 C 169.498 273.865 166.008 272.254 164.003 269.698 C 161.912 267.033 160.679 261.822 161.211 258.529 C 161.706 255.456 164.563 252.147 166.516 250.430 C 168.074 249.061 169.269 248.635 171.543 248.197 Z" style="stroke-width: 2px; fill: rgb(4, 4, 3); stroke: rgb(5, 5, 4);"/>
          </g>
        </svg>
    `;

    // Mini-SVG para el clon del tiburón (para el enjambre y el ataque)
    const SHARK_FIN_SVG_CONTENT = `
        <svg viewBox="0 0 100 100" width="100%" height="100%" style="transform: rotate(90deg);">
            <path d="M 10 90 L 50 10 L 90 90 Z" fill="rgba(100, 100, 100, 0.8)" stroke="black" stroke-width="3"/>
            <path d="M 50 10 L 50 90" stroke="white" stroke-width="1" opacity="0.5"/>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo keyframes para los efectos)
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 500px; /* Tamaño del menú */
            height: auto;
            z-index: 10001;
            cursor: grab;
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }

        /* Contenedor de efectos */
        #${OVERLAY_ID} {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }
        .effect-active {
            opacity: 1 !important;
        }

        /* --------------------------------- */
        /* EFECTO 0: SHARK RUSH (Ataque Rápido) */
        /* --------------------------------- */
        @keyframes rush-across {
            0% { transform: translate(-100vw, var(--shark-y, 0)) scaleX(-1); } /* Viene de la izquierda */
            100% { transform: translate(100vw, var(--shark-y, 0)); } /* Cruza a la derecha */
        }
        .shark-rush-fin {
            position: absolute;
            width: 100px; height: 100px;
            animation: rush-across 0.6s linear forwards; /* ¡Muy rápido! */
            pointer-events: none;
        }

        /* --------------------------------- */
        /* EFECTO 1: DEEP SEA VISION */
        /* --------------------------------- */
        .deep-sea-vision {
            background-color: rgba(0, 50, 100, 0.5); /* Azul profundo */
            backdrop-filter: blur(5px) sepia(0.8) contrast(1.2);
            -webkit-backdrop-filter: blur(5px) sepia(0.8) contrast(1.2);
            transition: backdrop-filter ${EFFECT_DURATION}ms, background-color ${EFFECT_DURATION}ms;
        }

        /* --------------------------------- */
        /* EFECTO 2: SHARK SWARM */
        /* --------------------------------- */
        @keyframes swim-circle {
            0% { transform: rotate(0deg) translate(200px) rotate(0deg); }
            100% { transform: rotate(360deg) translate(200px) rotate(-360deg); }
        }
        .shark-swarm-container {
            position: absolute;
            top: 50%; left: 50%;
            width: 1px; height: 1px;
        }
        .shark-swarm-fin {
            position: absolute;
            width: 50px; height: 50px;
            left: 0; top: 0;
            transform-origin: 0 0;
            animation: swim-circle 5s linear infinite;
        }
    `);

    // 3. Funciones de Efectos

    /** Obtiene el overlay de efectos (o lo crea) y lo devuelve. */
    function getOverlay() {
        let overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            document.body.appendChild(overlay);
        }
        // Limpia el contenido y las clases antes de usar
        overlay.innerHTML = '';
        overlay.className = '';
        return overlay;
    }

    /**
     * EFECTO 0: Shark Rush (Ataque Rápido)
     */
    function effectSharkRush() {
        // No necesita overlay, usa el body
        const body = document.body;
        const rushFin = document.createElement('div');
        
        rushFin.className = 'shark-rush-fin';
        rushFin.innerHTML = SHARK_FIN_SVG_CONTENT;

        // Posición inicial aleatoria en la vertical
        const startY = Math.random() * (window.innerHeight - 100);
        rushFin.style.top = '0'; // Se usa el translate en el keyframe
        rushFin.style.setProperty('--shark-y', `${startY}px`);
        
        // Lo añadimos directamente al body para que esté por encima de todo
        body.appendChild(rushFin);

        // Eliminar después de que termine la animación
        setTimeout(() => rushFin.remove(), 700); // 700ms > 600ms de animación
    }

    /**
     * EFECTO 1: Deep Sea Vision (Visión Submarina)
     */
    function effectDeepSeaVision() {
        const overlay = getOverlay();
        overlay.classList.add('deep-sea-vision', 'effect-active');
        
        setTimeout(() => {
            overlay.classList.remove('deep-sea-vision', 'effect-active');
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2: Shark Swarm (Enjambre de Tiburones)
     */
    function effectSharkSwarm() {
        const overlay = getOverlay();
        // Usaremos un contenedor para el swarm que se centra en la pantalla
        const swarmContainer = document.createElement('div');
        swarmContainer.className = 'shark-swarm-container';
        overlay.appendChild(swarmContainer);
        
        overlay.classList.add('effect-active');

        const SWARM_COUNT = 15;
        for (let i = 0; i < SWARM_COUNT; i++) {
            const fin = document.createElement('div');
            fin.className = 'shark-swarm-fin';
            fin.innerHTML = SHARK_FIN_SVG_CONTENT;
            fin.style.animationDelay = `${i * 0.1}s`; // Desfase
            fin.style.width = `${40 + Math.random() * 20}px`; // Tamaño variable
            fin.style.height = fin.style.width;
            // Rotación inicial para la posición en el círculo
            fin.style.transform = `rotate(${i * (360 / SWARM_COUNT)}deg) translate(200px) rotate(-${i * (360 / SWARM_COUNT)}deg)`;
            swarmContainer.appendChild(fin);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Clic y Dragging

    function cycleSharkEffect() {
        // Mapeo de estado a función de efecto
        const effects = [
            effectSharkRush,
            effectDeepSeaVision,
            effectSharkSwarm
        ];

        // Ejecutar el efecto actual
        effects[sharkEffectState]();

        // Ciclar al siguiente estado (0 -> 1 -> 2 -> 0)
        sharkEffectState = (sharkEffectState + 1) % effects.length;
    }

    function handleMenuClick(event) {
        // Clic en la nave: cambiar el efecto de tiburón
        cycleSharkEffect();
    }

    /**
     * Hace un elemento HTML arrastrable y maneja el evento de clic.
     */
    function dragElement(element) {
        let pos3 = 0, pos4 = 0;
        let isDragging = false;
        const DRAG_THRESHOLD = 5;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Solo permitir el clic/drag si el clic es dentro del SVG (en el path principal)
            if (!e.target.closest('#SHARK-PATH')) return;

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

            if (!isDragging) {
                // Si no hubo arrastre, se considera un clic en la nave
                handleMenuClick(e);
            }
        }
    }


    // 5. Inicialización
    window.addEventListener('load', () => {
        // 5.1. Crear el contenedor del menú e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.2. Crear el overlay
        getOverlay();

        // 5.3. Asignar eventos y funcionalidad
        dragElement(menuContainer);
    });

})();