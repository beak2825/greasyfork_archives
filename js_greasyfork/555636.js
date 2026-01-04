// ==UserScript==
// @name         Drawaria Bot Machines Complex 🤖⚙️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú arrastrable con 3 botones que simulan efectos de máquinas y tecnología.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555636/Drawaria%20Bot%20Machines%20Complex%20%F0%9F%A4%96%E2%9A%99%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555636/Drawaria%20Bot%20Machines%20Complex%20%F0%9F%A4%96%E2%9A%99%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'bot-machines-menu-container';
    const EFFECT_DURATION = 3500; // Duración base de los efectos
    const OVERLAY_ID = 'bot-effect-overlay';

    // 1. Contenido del SVG (Con los IDs de los botones)
    const menuSVG = `
        <?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -109.925 1236.99 635.395" xmlns:bx="https://boxy-svg.com">
  <g>
    <g id="bot1">
      <path d="M 79.485 52.456 L 184.36 52.456 L 184.36 85.416 L 157.393 85.416 L 157.393 152.837 L 104.955 152.837 L 104.955 85.416 L 79.485 85.416 Z" style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(251, 162, 162);"/>
      <path d="M 284.741 53.205 L 389.616 53.205 L 389.616 86.165 L 362.649 86.165 L 362.649 153.586 L 310.211 153.586 L 310.211 86.165 L 284.741 86.165 L 284.741 53.205 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(251, 162, 162);"/>
      <path d="M 85.479 137.855 H 388.118 V 137.855 H 388.118 V 433.003 H 388.118 V 433.003 H 85.479 V 433.003 H 85.479 V 137.855 H 85.479 V 137.855 Z" bx:shape="rect 85.479 137.855 302.639 295.148 3 0 0 2@0674d964" style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(251, 162, 162);"/>
      <path d="M 143.905 325.132 H 335.676 V 325.132 H 335.676 V 364.086 H 335.676 V 364.086 H 143.905 V 364.086 H 143.905 V 325.132 H 143.905 V 325.132 Z" bx:shape="rect 143.905 325.132 191.771 38.954 3 0 0 2@fab49f14" style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(162, 246, 251);"/>
      <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(162, 246, 251);" cx="240.544" cy="244.228" rx="63.674" ry="52.437"/>
    </g>
    <g id="bot2">
      <path d="M 478.895 55.454 L 583.77 55.454 L 583.77 88.413 L 556.803 88.413 L 556.803 155.834 L 504.365 155.834 L 504.365 88.413 L 478.895 88.413 L 478.895 55.454 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(181, 251, 162);"/>
      <path d="M 684.151 56.204 L 789.026 56.204 L 789.026 89.162 L 762.059 89.162 L 762.059 156.583 L 709.621 156.583 L 709.621 89.162 L 684.151 89.162 L 684.151 56.204 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(181, 251, 162);"/>
      <path d="M 484.889 140.852 H 787.528 V 140.852 H 787.528 V 436 H 787.528 V 436 H 484.889 V 436 H 484.889 V 140.852 H 484.889 V 140.852 Z" bx:shape="rect 484.889 140.852 302.639 295.148 3 0 0 2@3498230b" style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(181, 251, 162);"/>
      <path d="M 560.055 189.65 H 719.801 V 189.65 H 719.801 V 292.344 H 719.801 V 292.344 H 560.055 V 292.344 H 560.055 V 189.65 H 560.055 V 189.65 Z" bx:shape="rect 560.055 189.65 159.746 102.694 3 0 0 2@e21d4240" style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(162, 246, 251);"/>
      <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(162, 246, 251);" cx="634.749" cy="346.685" rx="119.438" ry="20.074"/>
    </g>
    <g id="bot3">
      <path d="M 962.879 91.176 L 1091.71 91.176 L 1091.71 131.667 L 1058.6 131.667 L 1058.6 214.499 L 994.169 214.499 L 994.169 131.667 L 962.879 131.667 L 962.879 91.176 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(251, 242, 162);"/>
      <path d="M 923.175 251.719 Q 1027.301 85.417 1131.427 251.719 L 1131.427 251.719 Q 1235.553 418.021 1027.301 418.021 L 1027.301 418.021 Q 819.049 418.021 923.175 251.719 Z" bx:shape="triangle 819.049 85.417 416.504 332.604 0.5 0.5 1@4ac63e29" style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(251, 242, 162);"/>
      <path d="M 938.907 320.636 H 1118.693 V 320.636 H 1118.693 V 356.594 H 1118.693 V 356.594 H 938.907 V 356.594 H 938.907 V 320.636 H 938.907 V 320.636 Z" bx:shape="rect 938.907 320.636 179.786 35.958 3 0 0 2@934a6971" style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(162, 246, 251);"/>
      <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(162, 246, 251);" cx="1027.31" cy="263.704" rx="80.904" ry="22.473"/>
    </g>
    <text style="fill: rgb(43, 99, 116); font-family: &quot;Agu Display&quot;; font-size: 83.7px; text-transform: capitalize; white-space: pre; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" x="158.689" y="-18.916">bot machines complex</text>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 10;0 0" begin="0s" dur="3.06s" fill="freeze" keyTimes="0; 0.510388; 1" repeatCount="indefinite"/>
  </g>
  <defs>
    <style bx:fonts="Agu Display">@import url(https://fonts.googleapis.com/css2?family=Agu+Display%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
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
    <filter id="outline-filter-0" bx:preset="outline 1 2 #050504" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
      <feFlood flood-color="#050504" result="flood"/>
      <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
      <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="outline-filter-1" bx:preset="outline 1 2 #f9fcf1" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
      <feFlood flood-color="#f9fcf1" result="flood"/>
      <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
      <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
</svg>
    `;

    // 2. CSS Styles (Incluyendo keyframes para los efectos de fuego)
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

        /* Contenedor de efectos (Overlay de pantalla completa) */
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
        /* EFECTO 1: EMBER RAIN (Ascuas) */
        /* --------------------------------- */
        @keyframes ember-rise {
            0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
            100% { transform: translateY(-10vh) scale(1); opacity: 0.8; }
        }
        .ember-particle {
            position: absolute;
            width: 8px; height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle, #FF4500 0%, #FFA500 50%, transparent 70%); /* Naranja-Rojo */
            box-shadow: 0 0 5px #ff4500;
            animation: ember-rise 3s linear infinite alternate;
        }

        /* --------------------------------- */
        /* EFECTO 2: HEAT WAVE (Onda de Calor) */
        /* --------------------------------- */
        @keyframes heat-haze {
            0% { transform: scale(1); filter: hue-rotate(0deg) brightness(1); }
            50% { transform: scale(1.01) translateX(1px); filter: hue-rotate(5deg) brightness(1.1); }
            100% { transform: scale(1) translateX(-1px); filter: hue-rotate(0deg) brightness(1); }
        }
        .heat-wave-effect {
            /* Se aplica al BODY para simular la distorsión del aire */
            animation: heat-haze 0.1s linear infinite alternate;
            background-color: rgba(255, 100, 0, 0.1); /* Fondo rojizo-cálido */
            transition: none !important; /* Desactiva transiciones en el body */
        }

        /* --------------------------------- */
        /* EFECTO 3: PURE FLAME (Llama Pura) */
        /* --------------------------------- */
        @keyframes flame-flicker {
            0%, 100% { opacity: 0.5; }
            20%, 80% { opacity: 0.9; }
            50% { opacity: 0.2; }
        }
        .pure-flame-effect {
            background:
                radial-gradient(circle at 50% 120%, rgba(255, 200, 0, 0.5), rgba(255, 0, 0, 0) 50%),
                radial-gradient(circle at 50% 120%, rgba(255, 160, 0, 0.5), rgba(255, 0, 0, 0) 60%);
            animation: flame-flicker 0.2s linear infinite;
            backdrop-filter: blur(4px) saturate(2);
            -webkit-backdrop-filter: blur(4px) saturate(2);
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
     * EFECTO 1: Ember Rain (Lluvia de Ascuas)
     */
    function effectEmberRain() {
        const overlay = getOverlay();
        overlay.classList.add('effect-active');

        for (let i = 0; i < 50; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember-particle';
            ember.style.left = `${Math.random() * 100}vw`;
            ember.style.animationDelay = `${-Math.random() * 3}s`;
            overlay.appendChild(ember);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2: Heat Wave (Onda de Calor)
     */
    function effectHeatWave() {
        const body = document.body;
        // Aplicar la animación de distorsión de calor al body
        body.classList.add('heat-wave-effect');

        setTimeout(() => {
            // Limpiar la clase y restablecer la transición (requerido para Heat Wave)
            body.classList.remove('heat-wave-effect');
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 3: Pure Flame (Llama Pura)
     */
    function effectPureFlame() {
        const overlay = getOverlay();
        // Aplicar filtros de distorsión de color y efecto de parpadeo
        overlay.classList.add('pure-flame-effect', 'effect-active');

        setTimeout(() => {
            // Limpiar la clase y el backdrop-filter
            overlay.classList.remove('pure-flame-effect', 'effect-active');
            overlay.style.backdropFilter = 'none';
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleButtonClick(event) {
        event.preventDefault();

        const buttonGroup = event.currentTarget;
        const buttonId = buttonGroup.id;

        const effectMap = {
            'blue': effectEmberRain,
            'orange': effectHeatWave,
            'pink': effectPureFlame
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
            // No iniciar drag si se hace clic en un botón interactivo
            if (e.target.closest(`#btn1, #btn2, #btn3`)) return;

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
        // Escalar el SVG para que se ajuste mejor en la pantalla sin cortar el texto
        menuContainer.style.transform = 'scale(0.7)';
        menuContainer.style.transformOrigin = 'top left';
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