// ==UserScript==
// @name         Hummingand Stickman Menu for Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A draggable menu with a random-moving stickman for drawaria.online
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555155/Hummingand%20Stickman%20Menu%20for%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/555155/Hummingand%20Stickman%20Menu%20for%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- START OF SVG DATA ---
    const menuSVGText = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 830.65 841.431" xmlns:bx="https://boxy-svg.com">
  <defs>
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
    <g style="filter: url(&quot;#drop-shadow-filter-0&quot;);">
      <rect x="67.571" y="67.222" width="663.096" height="682.862" rx="198.483" ry="198.483" style="stroke: rgb(0, 0, 0); stroke-width: 12px; fill: rgb(255, 246, 190);"/>
      <path d="M 279.247 58.424 L 523.813 58.424 C 633.432 58.424 705.42 133.891 705.42 172.101 C 705.42 210.311 633.432 196.794 523.813 196.794 L 279.247 196.794 C 169.628 196.794 96.106 205.708 96.106 167.498 C 96.106 129.288 169.628 58.424 279.247 58.424 Z" style="stroke: rgb(0, 0, 0); stroke-width: 12; fill: rgb(139, 121, 12);"/>
    </g>
    <text style="fill: rgb(51, 51, 51); font-family: Britannic; font-size: 28px; stroke: rgb(255, 236, 0); white-space: pre;" transform="matrix(2.231888, 0, 0, 1.774273, -377.998543, -94.134935)" x="229.301" y="137.305">Hummingand Menu</text>
  </g>
  <g transform="matrix(1, 0, 0, 1, 1.513063, 36.314305)" style="filter: url(&quot;#drop-shadow-filter-1&quot;);" id="button1">
    <title>button1</title>
    <rect x="162.812" y="216.374" width="466.154" height="135.149" rx="8" ry="8" style="fill: rgb(103, 84, 62); stroke-width: 14px; stroke: rgb(173, 125, 37);"/>
    <text style="fill: rgb(51, 51, 51); font-family: Britannic; font-size: 28px; stroke: rgb(255, 236, 0); white-space: pre;" transform="matrix(2.231888, 0, 0, 1.774273, -313.438758, 50.160043)" x="229.301" y="137.305">start stickman</text>
  </g>
  <g style="filter: url(&quot;#drop-shadow-filter-1&quot;);" id="button2">
    <title>button2</title>
    <rect x="149.103" y="481.428" width="491.877" height="135.149" rx="8" ry="8" style="fill: rgb(103, 84, 62); stroke-width: 14; stroke: rgb(173, 125, 37);"/>
    <text style="fill: rgb(51, 51, 51); font-family: Britannic; font-size: 28px; stroke: rgb(255, 236, 0); white-space: pre;" transform="matrix(2.231888, 0, 0, 1.774273, -330.738716, 317.491279)" x="229.301" y="137.305">delete stickman</text>
  </g>
</svg>`;

    const stickSVGText = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <ellipse style="stroke: rgb(0, 0, 0);" cx="239.153" cy="117.282" rx="98.934" ry="98.413"/>
  <rect x="207.91" y="196.95" width="47.905" height="171.832" style="stroke: rgb(0, 0, 0);"/>
  <rect style="stroke-width: 1; transform-box: fill-box; transform-origin: 50% 50%; stroke: rgb(0, 0, 0);" height="29.888" x="213.12" y="210.49" width="158.462" transform="matrix(0.676915, 0.736061, 0.736061, -0.676915, 0.955022, 191.25332)">
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-30 -40;0 0" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-40;0" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
  </rect>
  <rect style="stroke-width: 1; transform-origin: -133.889px -195.546px; stroke: rgb(0, 0, 0);" height="29.888" x="-213.12" y="-210.49" width="158.462" transform="matrix(-0.676915, 0.736061, -0.736061, -0.676915, 303.267147, 608.869524)">
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-30 -40;0 0" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-40;0" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
  </rect>
  <rect style="stroke-width: 1; transform-origin: -133.889px -195.546px; stroke: rgb(0, 0, 0);" height="29.888" x="-213.12" y="-210.49" width="158.462" transform="matrix(-0.676915, 0.736061, -0.736061, -0.676915, 296.13356, 472.543858)">
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-30 -40;0 0" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-40;0" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
  </rect>
  <rect style="stroke-width: 1; transform-origin: -133.889px -195.546px; stroke: rgb(0, 0, 0);" height="29.888" x="-213.12" y="-210.49" width="158.462" transform="matrix(0.676915, 0.736061, 0.736061, -0.676915, 433.599908, 470.461061)">
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-30 -40;0 0" begin="0s" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
    <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-40;0" dur="4s" fill="freeze" keyTimes="0; 0.5; 1" repeatCount="indefinite"/>
  </rect>
</svg>`;
    // --- END OF SVG DATA ---

    let stickmanInterval = null;

    // 1. Creación e inyección de Contenedores
    function createContainers() {
        // Contenedor del Menú (Draggable)
        const menuContainer = document.createElement('div');
        menuContainer.id = 'drawaria-menu-container';
        menuContainer.innerHTML = menuSVGText;
        menuContainer.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50px;
            z-index: 10000;
            cursor: grab;
            width: 415px; /* Ajuste del tamaño para que se vea mejor */
            height: 420px;
        `;
        document.body.appendChild(menuContainer);

        // Contenedor del Stickman (Móvil)
        const stickContainer = document.createElement('div');
        stickContainer.id = 'drawaria-stickman-container';
        stickContainer.innerHTML = stickSVGText;
        stickContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            z-index: 9999;
            width: 200px; /* Tamaño del stickman */
            height: 200px;
            display: none; /* Inicialmente oculto */
            /* Transición CSS para movimiento suave */
            transition: left 1.5s ease-in-out, top 1.5s ease-in-out, transform 1.5s ease-in-out;
            pointer-events: none; /* Ignorar clics en el stickman */
        `;
        document.body.appendChild(stickContainer);

        return { menuContainer, stickContainer };
    }

    // 2. Comportamiento Draggable (Arrastrable)
    function makeDraggable(element, dragHandleSelector) {
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        const dragHandle = element;

        dragHandle.addEventListener('mousedown', (e) => {
            // No arrastrar si el clic es dentro de un botón (para que los botones sean clickables)
            if (e.target.closest('#button1') || e.target.closest('#button2')) {
                return;
            }
            isDragging = true;
            offset.x = e.clientX - element.offsetLeft;
            offset.y = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
            e.preventDefault(); // Prevenir selección de texto
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = (e.clientX - offset.x) + 'px';
            element.style.top = (e.clientY - offset.y) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
            }
        });
    }

    // 3. Lógica del Stickman
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function startStickmanMovement(element) {
        // Limpiar cualquier intervalo existente
        if (stickmanInterval) return;

        function moveStickman() {
            // Posición random (dentro del viewport, dejando un margen)
            const size = 200; // Ancho/Alto del contenedor
            const vpWidth = window.innerWidth;
            const vpHeight = window.innerHeight;
            const newX = getRandom(50, vpWidth - size - 50);
            const newY = getRandom(50, vpHeight - size - 50);

            // Rotación y Escala random
            const newRotate = getRandom(-90, 90);
            const newScale = getRandom(0.8, 1.5);

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.transform = `scale(${newScale}) rotate(${newRotate}deg)`;
        }

        // Ejecutar inmediatamente
        moveStickman();
        // Mover cada 1.5 segundos
        stickmanInterval = setInterval(moveStickman, 1500);
    }

    function stopStickmanMovement(element) {
        if (stickmanInterval) {
            clearInterval(stickmanInterval);
            stickmanInterval = null;
            // Resetear la transformación
            element.style.transform = 'none';
        }
    }


    // 4. Inicialización
    function initialize() {
        const { menuContainer, stickContainer } = createContainers();
        makeDraggable(menuContainer);

        const svgElement = menuContainer.querySelector('svg');
        const button1 = svgElement.querySelector('#button1');
        const button2 = svgElement.querySelector('#button2');

        // Configurar los botones para ser clickables (cursor)
        if (button1) {
            button1.style.cursor = 'pointer';
            button1.addEventListener('click', () => {
                console.log('Button 1 (start stickman) pressed.');
                stickContainer.style.display = 'block';
                startStickmanMovement(stickContainer);
            });
        }

        if (button2) {
            button2.style.cursor = 'pointer';
            button2.addEventListener('click', () => {
                console.log('Button 2 (delete stickman) pressed.');
                stopStickmanMovement(stickContainer);
                stickContainer.style.display = 'none';
            });
        }
    }

    initialize();

})();