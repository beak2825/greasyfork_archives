// ==UserScript==
// @name         Drawaria The Hero Tools 🛡️⚔️✨
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú con efectos de héroe: Campo de Fuerza, Golpe de Espada y Aura de Sanación.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555535/Drawaria%20The%20Hero%20Tools%20%F0%9F%9B%A1%EF%B8%8F%E2%9A%94%EF%B8%8F%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555535/Drawaria%20The%20Hero%20Tools%20%F0%9F%9B%A1%EF%B8%8F%E2%9A%94%EF%B8%8F%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'hero-tools-menu-container';
    const OVERLAY_ID = 'hero-effect-overlay';
    const EFFECT_DURATION = 2500; // Duración base para los efectos

    // 1. Contenido del SVG (Añadiendo cursor interactivo)
    const menuSVG = `
        <svg id="hero-tools-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -104.672 921.487 594.369" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" xmlns:bx="https://boxy-svg.com">
          <defs>
            <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 10 10 0 0.39 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="0.78"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-0" bx:preset="outline 1 2 #060702" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
              <feFlood flood-color="#060702" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-1" bx:preset="outline 1 2 #fbfcf9" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
              <feFlood flood-color="#fbfcf9" result="flood"/>
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
                <feFuncA id="spread-ctrl-2" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-2" bx:preset="outline 1 2 #060701" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
              <feFlood flood-color="#060701" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-3" bx:preset="outline 1 3 #f9fbf5" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="3"/>
              <feFlood flood-color="#f9fbf5" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-3" type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-4" bx:preset="outline 1 2 #090b03" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="2"/>
              <feFlood flood-color="#090b03" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-5" bx:preset="outline 1 3 #fcfdf7" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="3"/>
              <feFlood flood-color="#fcfdf7" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-3" bx:preset="drop-shadow 1 5 5 0 0.32 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="5" dy="5"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="0.64"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <style bx:fonts="Asap Condensed">@import url(https://fonts.googleapis.com/css2?family=Asap+Condensed%3Aital%2Cwght%400%2C200%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C600%3B0%2C700%3B0%2C800%3B0%2C900%3B1%2C200%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C600%3B1%2C700%3B1%2C800%3B1%2C900&amp;display=swap);</style>
            <filter id="outline-filter-6" bx:preset="outline 1 4 #070804" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#070804" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-7" bx:preset="outline 1 4 #cfcfcf" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#cfcfcf" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-4" bx:preset="drop-shadow 1 10 10 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
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
            <g id="shield" style="cursor: pointer;">
              <g>
                <g>
                  <path d="M 126.309 157.903 L 126.761 157.903 L 258.634 17.298 L 390.505 157.903 L 391.293 157.903 L 391.293 419.384 L 385.083 419.384 L 259.215 472.037 L 133.345 419.384 L 126.309 419.384 L 126.309 157.903 Z" style="stroke: rgb(0, 0, 0); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(255, 255, 255);"/>
                  <path d="M 139.887 166.966 L 140.289 166.966 L 257.418 37.048 L 374.546 166.966 L 375.246 166.966 L 375.246 408.573 L 369.73 408.573 L 257.934 457.224 L 146.137 408.573 L 139.887 408.573 L 139.887 166.966 Z" style="stroke: rgb(0, 0, 0); fill: rgb(35, 119, 219); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
                  <g transform="matrix(1, 0, 0, 1, 274.217383, 61.055147)" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);">
                    <path d="M -48.201 207.684 L -16.515 266.337 L -79.887 266.337 L -48.201 207.684 Z" bx:shape="triangle -79.887 207.684 63.372 58.653 0.5 0 1@88bbbdbf" style="stroke: rgb(0, 0, 0); fill: rgb(255, 231, 134);"/>
                    <path d="M -16.886 149.684 L 14.8 208.337 L -48.572 208.337 L -16.886 149.684 Z" bx:shape="triangle -48.572 149.684 63.372 58.653 0.5 0 1@12d6d4ba" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(255, 231, 134);"/>
                    <path d="M 14.126 207.684 L 45.812 266.337 L -17.56 266.337 L 14.126 207.684 Z" bx:shape="triangle -17.56 207.684 63.372 58.653 0.5 0 1@422d65ce" style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(255, 231, 134);"/>
                  </g>
                  <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" cx="258.88" cy="111.992" rx="16.099" ry="34.434"/>
                  <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" cx="257.31" cy="179.318" rx="11.18" ry="12.969"/>
                  <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" cx="259.09" cy="390.166" rx="10.733" ry="37.117"/>
                </g>
              </g>
            </g>
            <g id="sword" style="cursor: pointer;">
              <path d="M 494.603 35.865 L 525.512 89.099 L 525.512 367.284 L 465.41 367.284 L 465.41 89.099 L 494.603 35.865 Z" style="stroke: rgb(0, 0, 0); fill: rgb(244, 254, 255); filter: url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
              <path d="M 521.795 451.425 L 471.997 451.425 L 471.997 384.455 L 444.804 384.455 L 444.804 360.414 L 549.553 360.414 L 549.553 384.455 L 521.795 384.455 Z" style="stroke: rgb(0, 0, 0); fill: rgb(93, 92, 184); filter: url(&quot;#outline-filter-2&quot;) url(&quot;#outline-filter-3&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
              <path style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-2&quot;);" d="M 494.494 78.333 L 494.494 352.818"/>
              <path style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 2px;" d="M 496.517 92.859 L 496.517 354.34"/>
            </g>
            <g id="magic" style="cursor: pointer;">
              <path d="M 871.602 307.859 C 871.602 393.5 810.667 462.925 735.5 462.925 C 660.333 462.925 599.398 393.5 599.398 307.859 C 599.398 263.896 615.456 224.206 641.254 195.987 C 638.212 189.588 636.403 181.572 636.403 172.873 C 636.403 151.925 646.892 134.943 659.83 134.943 C 660.733 134.943 661.624 135.026 662.5 135.187 C 663.082 106.954 679.334 84.321 699.298 84.321 C 710.578 84.321 720.673 91.546 727.426 102.925 C 733.312 88.519 742.817 79.165 753.54 79.165 C 769.654 79.165 783.018 100.292 785.484 127.941 C 789.139 123.901 793.491 121.557 798.163 121.557 C 811.101 121.557 821.59 139.538 821.59 161.718 C 821.59 170.032 820.116 177.757 817.592 184.165 C 850.404 212.477 871.602 257.348 871.602 307.859 Z" style="stroke: rgb(0, 0, 0); fill: rgb(124, 59, 34); filter: url(&quot;#outline-filter-4&quot;) url(&quot;#outline-filter-5&quot;) url(&quot;#drop-shadow-filter-3&quot;);"/>
              <path d="M 598.726 268.376 C 598.802 259.003 882.126 255.889 882.085 268.376 C 892.283 270.642 885.841 358.587 867.635 354.541 C 867.635 335.334 610.767 333.264 610.767 355.746 C 595.157 365.39 582.243 277.993 598.726 268.376 Z" style="stroke: rgb(0, 0, 0); fill: rgb(255, 253, 197); filter: url(&quot;#outline-filter-4&quot;) url(&quot;#outline-filter-5&quot;) url(&quot;#drop-shadow-filter-3&quot;);"/>
              <path d="M 740.037 264.268 L 749.612 291.295 L 778.769 291.878 L 755.53 309.164 L 763.975 336.551 L 740.037 320.208 L 716.099 336.551 L 724.544 309.164 L 701.305 291.878 L 730.462 291.295 Z" bx:shape="star 740.037 304.225 40.725 39.957 0.4 5 1@10b683f9" style="stroke: rgb(0, 0, 0); fill: rgb(255, 180, 42); filter: url(&quot;#outline-filter-4&quot;) url(&quot;#outline-filter-5&quot;) url(&quot;#drop-shadow-filter-3&quot;);"/>
            </g>
            <text style="fill: rgb(242, 242, 242); font-family: &quot;Asap Condensed&quot;; font-size: 88.7px; text-transform: capitalize; white-space: pre; filter: url(&quot;#outline-filter-6&quot;) url(&quot;#outline-filter-7&quot;) url(&quot;#drop-shadow-filter-4&quot;);" x="234.268" y="-8.497">the hero tools</text>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -6;0 0" begin="0s" dur="4.31s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
          <text style="white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 28px;" x="1079.08" y="188.77">Enter your text here</text>
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
        /* EFECTO 1: Shield (Campo de Fuerza) */
        /* --------------------------------- */
        @keyframes shield-pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 150, 255, 0.4); }
            50% { box-shadow: 0 0 50px 30px rgba(0, 150, 255, 0.8); }
            100% { box-shadow: 0 0 0 0 rgba(0, 150, 255, 0.4); }
        }
        .shield-effect {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 80vw; height: 80vh;
            border-radius: 50%;
            border: 10px solid rgba(0, 150, 255, 0.9);
            background-color: rgba(0, 150, 255, 0.1);
            animation: shield-pulse 1s ease-in-out forwards;
        }

        /* --------------------------------- */
        /* EFECTO 2: Sword (Golpe Rápido) */
        /* --------------------------------- */
        @keyframes sword-slash {
            0% { transform: translate(0, 0) scaleX(0); opacity: 1; }
            50% { transform: translate(0, 0) scaleX(1); opacity: 1; }
            100% { transform: translate(100vw, 0) scaleX(0); opacity: 0; }
        }
        .sword-effect {
            position: absolute;
            top: 50%; left: 0;
            width: 100vw; height: 5px;
            background: linear-gradient(90deg, transparent, yellow, transparent);
            animation: sword-slash 0.5s linear;
        }

        /* --------------------------------- */
        /* EFECTO 3: Magic (Aura de Sanación) */
        /* --------------------------------- */
        @keyframes heal-glow {
            0% { background-color: rgba(0, 255, 0, 0); }
            50% { background-color: rgba(0, 255, 0, 0.3); }
            100% { background-color: rgba(0, 255, 0, 0); }
        }
        .magic-effect {
            animation: heal-glow 1.5s ease-in-out infinite;
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
     * EFECTO 1: Shield (Campo de Fuerza Protector)
     */
    function effectShield() {
        const overlay = getOverlay();
        overlay.classList.add('effect-active');

        const shieldElement = document.createElement('div');
        shieldElement.className = 'shield-effect';
        overlay.appendChild(shieldElement);

        // El efecto visual es la animación del pulso del div 'shield-effect'
        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, 1500); // Duración corta para el pulso
    }

    /**
     * EFECTO 2: Sword (Golpe Rápido de Energía)
     */
    function effectSword() {
        const overlay = getOverlay();

        // La animación es muy rápida, solo necesitamos un pulso de opacidad en el overlay
        overlay.classList.add('effect-active');

        // Generar múltiples "slashes"
        for (let i = 0; i < 3; i++) {
            const slash = document.createElement('div');
            slash.className = 'sword-effect';
            slash.style.top = `${30 + (i * 20)}vh`;
            slash.style.animationDelay = `${i * 0.1}s`;
            overlay.appendChild(slash);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, 800); // Muy corta para un golpe rápido
    }

    /**
     * EFECTO 3: Magic (Aura de Sanación)
     */
    function effectMagic() {
        const overlay = getOverlay();
        // Aplicar el aura al overlay principal
        overlay.classList.add('magic-effect', 'effect-active');

        setTimeout(() => {
            overlay.classList.remove('magic-effect', 'effect-active');
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleButtonClick(event) {
        event.preventDefault();

        const buttonId = event.currentTarget.id;
        const effectMap = {
            'shield': effectShield,
            'sword': effectSword,
            'magic': effectMagic
        };

        if (effectMap[buttonId]) {
            // Ocultar el menú temporalmente
            const menuContainer = document.getElementById(MENU_ID);
            if(menuContainer) menuContainer.style.opacity = '0.3';

            effectMap[buttonId]();

            // Mostrar el menú de nuevo
            setTimeout(() => {
                 if(menuContainer) menuContainer.style.opacity = '1';
            }, EFFECT_DURATION);
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
            // No iniciar el drag si se hace clic en un botón
            if (e.target.closest('#shield, #sword, #magic')) return;

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
        ['shield', 'sword', 'magic'].forEach(id => {
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