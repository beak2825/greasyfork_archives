// ==UserScript==
// @name         The Super Icecream Machine 🍦🍧
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú con tres efectos temáticos de helado: lluvia, rave de colores y chispas.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555484/The%20Super%20Icecream%20Machine%20%F0%9F%8D%A6%F0%9F%8D%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/555484/The%20Super%20Icecream%20Machine%20%F0%9F%8D%A6%F0%9F%8D%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'icecream-menu-container';
    const OVERLAY_ID = 'icecream-overlay';
    const EFFECT_DURATION = 3500; // Duración base para la mayoría de los efectos

    // 1. Contenido del SVG
    const menuSVG = `
        <svg id="icecream-machine-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1281.446 726.871" xmlns:bx="https://boxy-svg.com">
          <g>
            <g id="btn1">
              <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(151, 251, 243); cursor: pointer;" cx="244.847" cy="331.466" rx="148.401" ry="127.052"/>
              <path d="M 243.807 -639.73 L 392.208 -376.254 L 95.405 -376.254 L 243.807 -639.73 Z" bx:shape="triangle 95.405 -639.73 296.803 263.476 0.5 0 1@368ed6f2" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
            </g>
            <g id="btn2" transform="matrix(1, 0, 0, 1, 243.744878, 65.099405)">
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(245, 152, 152); cursor: pointer;" cx="385.088" cy="257.622" rx="148.401" ry="127.052"/>
              <path d="M 384.048 -565.89 L 532.449 -302.414 L 235.646 -302.414 L 384.048 -565.89 Z" bx:shape="triangle 235.646 -565.89 296.803 263.476 0.5 0 1@e7b5cb58" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
            </g>
            <g id="btn3" transform="matrix(1, 0, 0, 1, 575.298535, 131.712756)">
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(117, 184, 253); cursor: pointer;" cx="453.509" cy="198.202" rx="148.401" ry="127.052"/>
              <path d="M 452.469 -506.47 L 600.87 -242.994 L 304.067 -242.994 L 452.469 -506.47 Z" bx:shape="triangle 304.067 -506.47 296.803 263.476 0.5 0 1@94d9b743" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
            </g>
            <text style="fill: rgb(51, 51, 51); font-family: Asimovian; font-size: 84.3px; text-transform: capitalize; white-space: pre; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);" x="114.129" y="111.464">the super icecream machine</text>
            <animateMotion path="M 0 0 C 4.713997798409228 -3.812003453180161 -3.4498424714884464 -62.90452718939114 -0.303 0.13" calcMode="linear" begin="0s" dur="4.54s" fill="freeze" keyTimes="0; 0.491869; 1" keyPoints="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
          <defs>
            <style bx:fonts="Asimovian">@import url(https://fonts.googleapis.com/css2?family=Asimovian%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
            <filter id="outline-filter-0" bx:preset="outline 1 4 #bada55" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#bada55" result="flood"/>
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
          </defs>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo keyframes para los efectos)
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 700px; /* Tamaño grande para ver bien el SVG */
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
        /* EFECTO 1: ICE CREAM RAIN */
        /* --------------------------------- */
        @keyframes icecream-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .icecream-cone::before {
            content: '🍦'; /* Emoji de helado */
            position: absolute;
            font-size: 30px;
            animation: icecream-fall 3s linear infinite;
        }

        /* --------------------------------- */
        /* EFECTO 2: FLAVORTOWN RAVE */
        /* --------------------------------- */
        @keyframes rave-hue {
            0% { filter: hue-rotate(0deg) brightness(1); }
            50% { filter: hue-rotate(180deg) brightness(1.5); }
            100% { filter: hue-rotate(360deg) brightness(1); }
        }
        .flavortown-rave {
            animation: rave-hue 1s linear infinite; /* Rápido y psicodélico */
        }

        /* --------------------------------- */
        /* EFECTO 3: SPARKLE MODE (Chispas) */
        /* --------------------------------- */
        @keyframes sparkle-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
        }
        .sparkle-particle {
            position: absolute;
            width: 5px; height: 5px;
            border-radius: 50%;
            box-shadow: 0 0 10px 5px yellow, 0 0 5px 2px white;
            background-color: white;
            animation: sparkle-flicker 0.1s infinite alternate;
        }
        /* Ocultar el contenido principal */
        .hide-main-content {
            opacity: 0.9 !important;
            transition: opacity 0.5s ease-out;
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
     * EFECTO 1: Ice Cream Rain (Lluvia de Heladitos)
     */
    function effectIceCreamRain() {
        const overlay = getOverlay();
        overlay.classList.add('effect-active');

        for (let i = 0; i < 40; i++) {
            const cone = document.createElement('div');
            cone.className = 'icecream-cone';
            cone.style.left = `${Math.random() * 100}vw`;
            cone.style.animationDelay = `${-Math.random() * 3}s`; // Desfase
            cone.style.fontSize = `${20 + Math.random() * 20}px`; // Tamaño aleatorio
            overlay.appendChild(cone);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2: Flavortown Rave (Modo Fiesta de Colores y Sabores)
     */
    function effectFlavortownRave() {
        const body = document.body;
        // Aplicar la animación de rave de color al body
        body.classList.add('flavortown-rave');

        setTimeout(() => {
            body.classList.remove('flavortown-rave');
            // Asegurarse de que el filtro se restablece completamente
            body.style.filter = '';
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 3: Sparkle Mode (Ocultar y Chispas Brillantes)
     */
    function effectSparkleMode() {
        const overlay = getOverlay();
        const mainContainer = document.querySelector('body > :not(#icecream-menu-container):not(#icecream-overlay)');

        // 1. Ocultar todo el contenido (excepto el menú y el overlay)
        document.body.classList.add('hide-main-content');

        // 2. Llenar el overlay con chispas
        overlay.classList.add('effect-active');

        for (let i = 0; i < 100; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle-particle';
            sparkle.style.left = `${Math.random() * 100}vw`;
            sparkle.style.top = `${Math.random() * 100}vh`;
            sparkle.style.animationDelay = `${-Math.random() * 0.5}s`;
            overlay.appendChild(sparkle);
        }

        setTimeout(() => {
            // 3. Mostrar el contenido y limpiar
            document.body.classList.remove('hide-main-content');
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleButtonClick(event) {
        event.preventDefault();

        // Identificar el botón (ID)
        const buttonGroup = event.currentTarget;
        const buttonId = buttonGroup.id;

        // Mapeo de IDs a funciones de efecto
        const effectMap = {
            'btn1': effectIceCreamRain,
            'btn2': effectFlavortownRave,
            'btn3': effectSparkleMode
        };

        if (effectMap[buttonId]) {
            // 1. Feedback visual
            buttonGroup.style.opacity = 0.5;
            setTimeout(() => { buttonGroup.style.opacity = 1; }, 100);

            // 2. Ejecutar efecto
            effectMap[buttonId]();
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
            // Solo permitir el drag si no se hace clic en un botón (elemento interactivo)
            if (e.target.closest(`#${START_BUTTON_ID}`)) return;

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
        // 5.1. Crear el contenedor del menú e insertar SVG
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.2. Asignar eventos a los botones
        ['btn1', 'btn2', 'btn3'].forEach(id => {
            const button = document.querySelector(`#${MENU_ID} #${id}`);
            if (button) {
                button.addEventListener('click', handleButtonClick);
            }
        });

        // 5.3. Crear el overlay
        getOverlay();

        // 5.4. Hacer el menú arrastrable
        dragElement(menuContainer);
    });

})();