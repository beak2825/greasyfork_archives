// ==UserScript==
// @name         🎁❄ Drawaria The Cool Box ❄🎁
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Habilita un menú arrastrable con tres efectos visuales alternantes al presionar 'play'.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555257/%F0%9F%8E%81%E2%9D%84%20Drawaria%20The%20Cool%20Box%20%E2%9D%84%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/555257/%F0%9F%8E%81%E2%9D%84%20Drawaria%20The%20Cool%20Box%20%E2%9D%84%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Duración de cada efecto en milisegundos
    const EFFECT_DURATION = 2500;
    let effectCounter = 0; // 0: Brillos, 1: Destellos, 2: Flores

    // 1. SVG Menu Content
    const menuSVG = `
        <svg id="cool-menu-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-419.479 0 919.479 1044.696" xmlns:bx="https://boxy-svg.com">
          <defs>
            <style bx:fonts="ADLaM Display">@import url(https://fonts.googleapis.com/css2?family=ADLaM+Display%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
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
            <filter id="grayscale-filter-0" bx:preset="grayscale 1 0.36" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feColorMatrix type="matrix" values="0.717 0.257 0.026 0 0 0.077 0.897 0.026 0 0 0.077 0.257 0.666 0 0 0 0 0 1 0"/>
            </filter>
          </defs>
          <path d="M -993.97 307.441 L -788.62 374.971 L -576.48 262.037 L -412.55 420.177 L -317.1 324.729 L -96.575 437.093 L -94.725 376.967 L 166.425 300.89 L 273.415 458.085 L 394.925 338.047 L 670.525 480.583 L 654.115 580.227 L 654.115 910.429 C 654.115 913.19 651.875 915.429 649.115 915.429 L -1114.1 915.429 C -1116.9 915.429 -1119.1 913.191 -1119.1 910.429 L -1119.1 570.639 C -1119.1 569.462 -1118.7 568.38 -1118 567.526 L -1150.9 521.887 L -993.97 307.441 Z" style="fill: rgb(112, 8, 8); stroke: rgb(255, 165, 165); stroke-width: 0px; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#grayscale-filter-0&quot;);">
            <animateMotion path="M 0 0 L 128 0" calcMode="linear" begin="0.13s" dur="6.87s" fill="freeze" repeatCount="indefinite"/>
          </path>
          <path d="M -1192 486.528 L -986.62 554.058 L -774.49 441.124 L -610.55 599.264 L -515.11 503.816 L -294.58 616.18 L -292.74 556.054 L -31.585 479.977 L 75.405 637.172 L 196.915 517.134 L 472.515 659.67 L 456.105 759.314 L 456.105 1089.52 C 456.105 1092.28 453.865 1094.52 451.105 1094.52 L -1312.1 1094.52 C -1314.9 1094.52 -1317.1 1092.28 -1317.1 1089.52 L -1317.1 749.726 C -1317.1 748.549 -1316.7 747.467 -1316 746.613 L -1348.9 700.974 L -1192 486.528 Z" style="fill: rgb(112, 8, 8); stroke: rgb(255, 165, 165); stroke-width: 0px; filter: url(&quot;#drop-shadow-filter-0&quot;);">
            <animateMotion path="M 0 0 L 100 0" calcMode="linear" begin="0s" dur="7.13s" fill="freeze" repeatCount="indefinite"/>
          </path>
          <g style="transform-origin: 30.023px 458.321px; filter: url(&quot;#drop-shadow-filter-0&quot;);">
            <rect x="-216.79" y="223.129" width="367.688" height="99.392" style="stroke: rgb(255, 64, 103); stroke-width: 11px; fill: rgb(27, 15, 137);"/>
            <rect x="-215.8" y="463.143" width="325.675" height="235.152" style="stroke: rgb(255, 64, 103); stroke-width: 11px; fill: rgb(137, 15, 127);"/>
            <rect x="-215.92" y="301.433" width="286.682" height="190.247" rx="5" ry="5" style="stroke: rgb(255, 64, 103); stroke-width: 11px; fill: rgb(78, 22, 0);"/>
            <path d="M 776.667 93.069 L 1012.369 213.79 L 922.339 409.121 L 630.995 409.121 L 540.965 213.79 Z" bx:shape="n-gon 776.667 267.778 247.832 174.709 5 0 1@e4409137" style="stroke: rgb(255, 64, 103); stroke-width: 11px; fill: rgb(137, 15, 52);" transform="matrix(-0.09596144, 0.99538505, -0.99538509, -0.09596101, 421.3866317, -290.66663332)"/>
            <ellipse style="fill: rgb(255, 158, 0); stroke: rgb(255, 64, 103); stroke-width: 11px;" cx="-140.94" cy="604.553" rx="44.559" ry="45.638"/>
            <path d="M -149.702 305.62 H -120.194 V 377.335 H -61.177 V 413.193 H -120.194 V 484.907 H -149.702 V 413.193 H -208.72 V 377.335 H -149.702 Z" bx:shape="cross -208.72 305.62 147.543 179.287 35.858 29.508 0.5 1@6d9cbc95" style="stroke-width: 5px; stroke: rgb(255, 64, 103); fill: rgb(255, 64, 103);"/>
            <rect x="-201.78" y="227.819" width="155.815" height="54.247" rx="5" ry="5" style="stroke: rgb(0, 0, 0); fill: rgb(11, 11, 11); opacity: 0.13;"/>
            <text style="fill: rgb(255, 0, 0); font-family: &quot;ADLaM Display&quot;; font-size: 28px; stroke-width: 7px; text-transform: capitalize; white-space: pre;" transform="matrix(1.272813, 0, 0, 1.193667, -534.39674, 62.17418)" x="256.349" y="170.202">the cool box</text>
            <g id="play" style="transform-origin: 317.268px 243.881px; cursor: pointer;" transform="matrix(1, 0, 0, 1, -231.652944, 200.34795)">
              <ellipse style="stroke: rgb(255, 64, 103); stroke-width: 11; fill: rgb(174, 27, 89);" cx="317.268" cy="243.881" rx="95.343" ry="95.845"/>
              <path d="M -241.094 -198.29 L -192.619 -108.263 L -289.57 -108.263 L -241.094 -198.29 Z" bx:shape="triangle -289.57 -198.29 96.951 90.027 0.5 0 1@35e1acec" style="fill: rgb(255, 150, 150); stroke: rgb(251, 97, 97); stroke-width: 9px; transform-origin: -241.09px -153.276px;" transform="matrix(0, -1, -1, 0, 571.053333, 394.271893)"/>
              <animate attributeName="opacity" values="1;0.77;1" begin="click" dur="1.04s" fill="freeze" keyTimes="0; 0.472338; 1"/>
              <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.7 0.7;1 1" begin="click" dur="1.02s" fill="freeze" keyTimes="0; 0.45382; 1"/>
            </g>
            <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.02 1.02;1 1" begin="0s" dur="5.04s" fill="freeze" keyTimes="0; 0.49076; 1" repeatCount="indefinite"/>
          </g>
          <path d="M -291.38 97.821 L -271.546 145.062 L -221.255 163.694 L -271.546 182.326 L -291.38 229.567 L -311.214 182.326 L -361.505 163.694 L -311.214 145.062 Z" bx:shape="star -291.38 163.694 70.125 65.873 0.4 4 1@3653ca62" style="fill: rgb(252, 248, 248); stroke: rgba(0, 0, 0, 0); filter: url(&quot;#drop-shadow-filter-0&quot;);">
            <animate attributeName="opacity" values="1;0;0;1" begin="0s" dur="3.98s" fill="freeze" keyTimes="0; 0.34192; 0.665465; 1" repeatCount="indefinite"/>
          </path>
          <path d="M -3.696 11.192 L 16.138 58.433 L 66.429 77.065 L 16.138 95.697 L -3.696 142.938 L -23.53 95.697 L -73.821 77.065 L -23.53 58.433 Z" bx:shape="star -3.696 77.065 70.125 65.873 0.4 4 1@24b3968a" style="fill: rgb(252, 248, 248); stroke: rgba(0, 0, 0, 0); stroke-width: 1; filter: url(&quot;#drop-shadow-filter-0&quot;);">
            <animate attributeName="opacity" values="1;0;0;1" begin="0.02s" dur="6.74s" fill="freeze" keyTimes="0; 0.34192; 0.665465; 1" repeatCount="indefinite"/>
          </path>
          <path d="M 304.617 117.162 L 324.451 164.403 L 374.742 183.035 L 324.451 201.667 L 304.617 248.908 L 284.783 201.667 L 234.492 183.035 L 284.783 164.403 Z" bx:shape="star 304.617 183.035 70.125 65.873 0.4 4 1@a9738637" style="fill: rgb(252, 248, 248); stroke: rgba(0, 0, 0, 0); stroke-width: 1; filter: url(&quot;#drop-shadow-filter-0&quot;);">
            <animate attributeName="opacity" values="1;0;0;1" dur="5.2s" fill="freeze" keyTimes="0; 0.34192; 0.665465; 1" repeatCount="indefinite" begin="0.02s"/>
          </path>
        </svg>
    `;

    // 2. Inject CSS Styles
    GM_addStyle(`
        /* Estilos del contenedor del menú (Draggable) */
        #cool-menu-container {
            position: fixed;
            top: 50px; /* Posición inicial */
            left: 50px;
            width: 350px; /* Ajusta el tamaño del SVG para mejor visualización */
            height: auto;
            z-index: 10000;
            cursor: grab; /* Indica que es arrastrable */
        }
        #cool-menu-container:active {
            cursor: grabbing;
        }

        /* Estilos generales del Overlay de Efectos */
        #cool-effect-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999; /* Asegura que cubra todo */
            pointer-events: none; /* Permite interactuar con el juego si no está activo */
            opacity: 0;
            transition: opacity 0.5s ease-in-out, background-color 0.5s;
        }

        /* Clase para activar el Overlay */
        .cool-effect-active {
            pointer-events: all !important; /* Bloquea la interacción del juego mientras está activo */
            opacity: 1 !important;
        }

        /* --------------------------------- */
        /* EFECTO 1: BRILLOS (AURA) */
        /* --------------------------------- */
        .aura-effect {
            background: radial-gradient(circle at center, rgba(255, 255, 100, 0.2) 0%, rgba(255, 100, 255, 0.2) 30%, rgba(0, 0, 255, 0) 70%);
            backdrop-filter: brightness(1.3) blur(1px);
            -webkit-backdrop-filter: brightness(1.3) blur(1px);
        }

        /* --------------------------------- */
        /* EFECTO 3: FLORES (PETALS) */
        /* --------------------------------- */
        .flower-effect {
            background: linear-gradient(45deg, rgba(255, 105, 180, 0.2), rgba(255, 160, 122, 0.2), rgba(255, 218, 185, 0.2));
            backdrop-filter: hue-rotate(90deg) saturate(1.5);
            -webkit-backdrop-filter: hue-rotate(90deg) saturate(1.5);
        }
    `);

    // 3. Funciones de Efectos y Lógica Principal

    /**
     * Muestra el overlay y aplica una clase de efecto.
     * @param {string} effectClass - Clase CSS del efecto a aplicar.
     */
    function activateOverlay(effectClass) {
        let overlay = document.getElementById('cool-effect-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cool-effect-overlay';
            document.body.appendChild(overlay);
        }

        // Limpia clases anteriores
        overlay.className = '';

        // Aplica nueva clase y activa
        overlay.classList.add(effectClass);
        // Usa un pequeño retardo para asegurar que la clase se aplique antes de la transición
        setTimeout(() => {
            overlay.classList.add('cool-effect-active');
        }, 10);

        // Programa la desactivación
        setTimeout(() => {
            overlay.classList.remove('cool-effect-active');
            // Eliminar el overlay después de la transición de salida
            setTimeout(() => {
                overlay.className = '';
            }, 600); // 600ms > transition (0.5s)
        }, EFFECT_DURATION);
    }

    /**
     * Alterna entre los tres efectos al presionar el botón.
     */
    function handlePlayClick() {
        const menuContainer = document.getElementById('cool-menu-container');

        // Ocultar el menú temporalmente para evitar interacciones accidentales
        if(menuContainer) menuContainer.style.opacity = '0.3';

        switch (effectCounter) {
            case 0:
                activateOverlay('aura-effect'); // Brillos
                break;
            case 1:
                activateOverlay('flash-effect'); // Destellos
                break;
            case 2:
                activateOverlay('flower-effect'); // Flores
                break;
        }

        // Mover al siguiente efecto
        effectCounter = (effectCounter + 1) % 3;

        // Mostrar el menú después de que el efecto haya terminado
        setTimeout(() => {
             if(menuContainer) menuContainer.style.opacity = '1';
        }, EFFECT_DURATION);
    }


    /**
     * Función para hacer un elemento arrastrable (reutilizada del script anterior).
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
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calcula la nueva posición y establece la posición del elemento
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 4. Inicialización
    window.addEventListener('load', () => {
        // Crear contenedor e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = 'cool-menu-container';
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        const svgElement = document.getElementById('cool-menu-svg');
        if (!svgElement) return;

        // 4.1. Hacer el menú arrastrable
        dragElement(menuContainer);

        // 4.2. Asignar el evento al botón 'play'
        const playButton = svgElement.querySelector('#play');
        if (playButton) {
            playButton.addEventListener('click', handlePlayClick);
        }
    });

})();