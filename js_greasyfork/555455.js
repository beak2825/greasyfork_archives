// ==UserScript==
// @name         The Clock Work 🕰️⚙️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú arrastrable con efectos visuales aleatorios y anti-tiempo.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555455/The%20Clock%20Work%20%F0%9F%95%B0%EF%B8%8F%E2%9A%99%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555455/The%20Clock%20Work%20%F0%9F%95%B0%EF%B8%8F%E2%9A%99%EF%B8%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'clock-work-menu-container';
    const EFFECT_DURATION = 3500; // Duración para todos los efectos.

    // 1. Contenido del SVG
    const menuSVG = `
        <svg id="clock-work-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-420.482 -393.911 2783.21 1934.25" xmlns:bx="https://boxy-svg.com">
          <g id="clock-main-group" transform="matrix(1, 0, 0, 1, 716.779678, -9.886476)">
            <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="250.697" cy="234.268" rx="187.234" ry="196.897"/>
            <path d="M 245.231 226.89 m -287.61 0 a 287.61 293.692 0 1 0 575.22 0 a 287.61 293.692 0 1 0 -575.22 0 Z M 245.231 226.89 m -172.566 0 a 172.566 176.216 0 0 1 345.132 0 a 172.566 176.216 0 0 1 -345.132 0 Z" bx:shape="ring 245.231 226.89 172.566 176.216 287.61 293.692 1@028a6bbb" style="stroke: rgb(0, 0, 0); fill: rgb(150, 84, 55); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);"/>
            <g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 304.808px 237.029px;">
                <g>
                  <path d="M 228.954 216.149 H 360.622 V 216.149 H 360.622 V 254.804 H 360.622 V 254.804 H 228.954 V 254.804 H 228.954 V 216.149 H 228.954 V 216.149 Z" bx:shape="rect 228.954 216.149 131.668 38.655 3 0 0 2@36a9f0f3" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);"/>
                  <path d="M -299.017 -200.45 L -265.194 -126.764 L -332.84 -126.764 L -299.017 -200.45 Z" bx:shape="triangle -332.84 -200.45 67.646 73.686 0.5 0 1@1b87e16e" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4); transform-origin: -299.014px -163.604px;" transform="matrix(0, -1, -1, 0, 678.962941, 402.100787)"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;10" begin="0s" dur="2s" repeatCount="indefinite" keyTimes="0; 1"/>
              </g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 241.745px 171.627px;">
                <g>
                  <path d="M 228.954 83.273 H 255.529 V 83.273 H 255.529 V 245.14 H 255.529 V 245.14 H 228.954 V 245.14 H 228.954 V 83.273 H 228.954 V 83.273 Z" bx:shape="rect 228.954 83.273 26.575 161.867 3 0 0 2@18b8d04f" style="stroke: rgb(0, 0, 0);"/>
                  <path d="M 241.637 55.491 L 273.648 113.473 L 209.626 113.473 L 241.637 55.491 Z" bx:shape="triangle 209.626 55.491 64.022 57.982 0.5 0 1@7135a702" style="stroke: rgb(0, 0, 0);"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </g>
            </g>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 6;0 0" begin="0s" dur="1.31s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0; 0 0" begin="7.16s" dur="2s" fill="freeze"/>
          <animateTransform type="scale" additive="sum" attributeName="transform" values="1; 1" begin="7.16s" dur="2s" fill="freeze"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 10;0 0" begin="0s" dur="3.2s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          <text style="fill: rgb(51, 51, 51); font-family: Aclonica; font-size: 204.4px; text-transform: capitalize; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;);" x="105.066" y="-182">the clock work</text>
          <defs>
            <style bx:fonts="Aclonica">@import url(https://fonts.googleapis.com/css2?family=Aclonica%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
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
            <filter id="outline-filter-0" bx:preset="outline 1 4 #010101" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#010101" result="flood"/>
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
          </defs>
          <g id="secondary-clock-1" transform="matrix(1, 0, 0, 1, -115.952899, 368.446083)">
            <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="250.697" cy="234.268" rx="187.234" ry="196.897"/>
            <path d="M 245.231 226.89 m -287.61 0 a 287.61 293.692 0 1 0 575.22 0 a 287.61 293.692 0 1 0 -575.22 0 Z M 245.231 226.89 m -172.566 0 a 172.566 176.216 0 0 1 345.132 0 a 172.566 176.216 0 0 1 -345.132 0 Z" bx:shape="ring 245.231 226.89 172.566 176.216 287.61 293.692 1@028a6bbb" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(150, 55, 69);"/>
            <g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 304.808px 237.029px;">
                <g>
                  <path d="M 228.954 216.149 H 360.622 V 216.149 H 360.622 V 254.804 H 360.622 V 254.804 H 228.954 V 254.804 H 228.954 V 216.149 H 228.954 V 216.149 Z" bx:shape="rect 228.954 216.149 131.668 38.655 3 0 0 2@36a9f0f3" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);"/>
                  <path d="M -299.017 -200.45 L -265.194 -126.764 L -332.84 -126.764 L -299.017 -200.45 Z" bx:shape="triangle -332.84 -200.45 67.646 73.686 0.5 0 1@1b87e16e" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4); transform-origin: -299.014px -163.604px;" transform="matrix(0, -1, -1, 0, 678.962941, 402.100787)"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;10" begin="0s" dur="2s" repeatCount="indefinite" keyTimes="0; 1"/>
              </g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 241.745px 171.627px;">
                <g>
                  <path d="M 228.954 83.273 H 255.529 V 83.273 H 255.529 V 245.14 H 255.529 V 245.14 H 228.954 V 245.14 H 228.954 V 83.273 H 228.954 V 83.273 Z" bx:shape="rect 228.954 83.273 26.575 161.867 3 0 0 2@18b8d04f" style="stroke: rgb(0, 0, 0);"/>
                  <path d="M 241.637 55.491 L 273.648 113.473 L 209.626 113.473 L 241.637 55.491 Z" bx:shape="triangle 209.626 55.491 64.022 57.982 0.5 0 1@7135a702" style="stroke: rgb(0, 0, 0);"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </g>
            </g>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 6;0 0" begin="0s" dur="1.31s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
          <g id="secondary-clock-2" transform="matrix(1, 0, 0, 1, 714.523086, 798.51259)">
            <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="250.697" cy="234.268" rx="187.234" ry="196.897"/>
            <path d="M 245.231 226.89 m -287.61 0 a 287.61 293.692 0 1 0 575.22 0 a 287.61 293.692 0 1 0 -575.22 0 Z M 245.231 226.89 m -172.566 0 a 172.566 176.216 0 0 1 345.132 0 a 172.566 176.216 0 0 1 -345.132 0 Z" bx:shape="ring 245.231 226.89 172.566 176.216 287.61 293.692 1@028a6bbb" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(57, 150, 55);"/>
            <g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 304.808px 237.029px;">
                <g>
                  <path d="M 228.954 216.149 H 360.622 V 216.149 H 360.622 V 254.804 H 360.622 V 254.804 H 228.954 V 254.804 H 228.954 V 216.149 H 228.954 V 216.149 Z" bx:shape="rect 228.954 216.149 131.668 38.655 3 0 0 2@36a9f0f3" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);"/>
                  <path d="M -299.017 -200.45 L -265.194 -126.764 L -332.84 -126.764 L -299.017 -200.45 Z" bx:shape="triangle -332.84 -200.45 67.646 73.686 0.5 0 1@1b87e16e" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4); transform-origin: -299.014px -163.604px;" transform="matrix(0, -1, -1, 0, 678.962941, 402.100787)"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;10" begin="0s" dur="2s" repeatCount="indefinite" keyTimes="0; 1"/>
              </g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 241.745px 171.627px;">
                <g>
                  <path d="M 228.954 83.273 H 255.529 V 83.273 H 255.529 V 245.14 H 255.529 V 245.14 H 228.954 V 245.14 H 228.954 V 83.273 H 228.954 V 83.273 Z" bx:shape="rect 228.954 83.273 26.575 161.867 3 0 0 2@18b8d04f" style="stroke: rgb(0, 0, 0);"/>
                  <path d="M 241.637 55.491 L 273.648 113.473 L 209.626 113.473 L 241.637 55.491 Z" bx:shape="triangle 209.626 55.491 64.022 57.982 0.5 0 1@7135a702" style="stroke: rgb(0, 0, 0);"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </g>
            </g>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 6;0 0" begin="0s" dur="1.31s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
          <g id="secondary-clock-3" transform="matrix(1, 0, 0, 1, 1540.055697, 383.276009)">
            <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="250.697" cy="234.268" rx="187.234" ry="196.897"/>
            <path d="M 245.231 226.89 m -287.61 0 a 287.61 293.692 0 1 0 575.22 0 a 287.61 293.692 0 1 0 -575.22 0 Z M 245.231 226.89 m -172.566 0 a 172.566 176.216 0 0 1 345.132 0 a 172.566 176.216 0 0 1 -345.132 0 Z" bx:shape="ring 245.231 226.89 172.566 176.216 287.61 293.692 1@028a6bbb" style="stroke: rgb(0, 0, 0); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(55, 72, 150);"/>
            <g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 304.808px 237.029px;">
                <g>
                  <path d="M 228.954 216.149 H 360.622 V 216.149 H 360.622 V 254.804 H 360.622 V 254.804 H 228.954 V 254.804 H 228.954 V 216.149 H 228.954 V 216.149 Z" bx:shape="rect 228.954 216.149 131.668 38.655 3 0 0 2@36a9f0f3" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);"/>
                  <path d="M -299.017 -200.45 L -265.194 -126.764 L -332.84 -126.764 L -299.017 -200.45 Z" bx:shape="triangle -332.84 -200.45 67.646 73.686 0.5 0 1@1b87e16e" style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4); transform-origin: -299.014px -163.604px;" transform="matrix(0, -1, -1, 0, 678.962941, 402.100787)"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;10" begin="0s" dur="2s" repeatCount="indefinite" keyTimes="0; 1"/>
              </g>
              <g style="filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;); transform-origin: 241.745px 171.627px;">
                <g>
                  <path d="M 228.954 83.273 H 255.529 V 83.273 H 255.529 V 245.14 H 255.529 V 245.14 H 228.954 V 245.14 H 228.954 V 83.273 H 228.954 V 83.273 Z" bx:shape="rect 228.954 83.273 26.575 161.867 3 0 0 2@18b8d04f" style="stroke: rgb(0, 0, 0);"/>
                  <path d="M 241.637 55.491 L 273.648 113.473 L 209.626 113.473 L 241.637 55.491 Z" bx:shape="triangle 209.626 55.491 64.022 57.982 0.5 0 1@7135a702" style="stroke: rgb(0, 0, 0);"/>
                </g>
                <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(4, 4, 4);" cx="241.745" cy="237.029" rx="48.923" ry="50.734"/>
                <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;-3" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
              </g>
            </g>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 6;0 0" begin="0s" dur="1.31s" fill="freeze" keyTimes="0; 0.491869; 1" repeatCount="indefinite"/>
          </g>
          <animate attributeName="opacity" values="1;0.33;1" begin="click" dur="0.72s" fill="freeze" keyTimes="0; 0.543328; 1"/>
        </svg>
    `;

    // 2. CSS Styles
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 400px; /* Tamaño del menú ajustado al contenido visible */
            height: auto;
            z-index: 10001;
            cursor: grab;
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }
        #clock-work-svg {
            /* Asegura que el SVG en sí sea interactivo para el clic */
            pointer-events: auto;
        }

        /* --------------------------------- */
        /* EFECTO: GRAVITY FLIP */
        /* --------------------------------- */
        @keyframes flip-flop {
            0% { transform: scale(1) rotate(0deg); }
            5% { transform: scale(1.05) rotate(180deg); } /* Gira y se agranda */
            15% { transform: scale(1) rotate(360deg); }  /* Vuelve al revés */
            90% { transform: scale(1) rotate(360deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
        .gravity-flip {
            transform-origin: center center;
            transition: transform ${EFFECT_DURATION}ms ease-in-out;
            animation: flip-flop ${EFFECT_DURATION}ms ease-in-out forwards;
        }

        /* --------------------------------- */
        /* EFECTO: COLOR RAVE */
        /* --------------------------------- */
        @keyframes color-rave {
            0%, 100% { filter: hue-rotate(0deg) contrast(1); }
            10% { filter: hue-rotate(60deg) contrast(1.5); }
            20% { filter: hue-rotate(120deg) contrast(1); }
            30% { filter: hue-rotate(180deg) contrast(1.5); }
            40% { filter: hue-rotate(240deg) contrast(1); }
            50% { filter: hue-rotate(300deg) contrast(1.5); }
            60% { filter: hue-rotate(360deg) contrast(1); }
        }
        .color-rave {
            animation: color-rave 0.4s linear infinite; /* Rápido y continuo */
            /* El color base lo maneja el JS */
        }

        /* --------------------------------- */
        /* EFECTO: SHRINK VISION (Viñeta y Zoom) */
        /* --------------------------------- */
        .shrink-vision-wrapper {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center;
            pointer-events: none;
            z-index: 9999;
        }
        .shrink-vision-vignette {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            /* Desenfoque y Oscurecimiento para simular viñeta y agujero */
            backdrop-filter: blur(10px) brightness(0.5);
            -webkit-backdrop-filter: blur(10px) brightness(0.5);
            clip-path: circle(20% at 50% 50%); /* El 'agujero' */
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .shrink-vision-vignette.active {
            opacity: 1;
        }
    `);


    // 3. Funciones de Efectos (Locos y Anti-Tiempo)

    /**
     * Genera un color aleatorio vibrante para el modo rave.
     */
    function getRandomVibrantColor() {
        // HSL para asegurar viveza: Hue aleatorio (0-360), Saturación 90-100%, Luminosidad 50-70%
        const h = Math.floor(Math.random() * 360);
        const s = 90 + Math.floor(Math.random() * 10);
        const l = 50 + Math.floor(Math.random() * 20);
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    /**
     * EFECTO 1: Gravity Flip
     * Voltea todo el contenido del <body>.
     */
    function effectGravityFlip() {
        const body = document.body;
        // La animación se maneja con keyframes CSS
        body.classList.add('gravity-flip');

        // Eliminar la clase después de la duración para restaurar el estado
        setTimeout(() => {
            body.classList.remove('gravity-flip');
            // Nota: La animación en CSS se encarga de devolverlo a 0deg al final
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2: Color Rave
     * Aplica un color de fondo y un filtro de color rotativo al <body>.
     */
    function effectColorRave() {
        const body = document.body;
        // 1. Establecer color base y filtro
        body.style.backgroundColor = getRandomVibrantColor();
        body.classList.add('color-rave');

        // 2. Limpiar después de la duración
        setTimeout(() => {
            body.classList.remove('color-rave');
            // Restaurar a los estilos originales (o transparente si el body no tenía bg)
            body.style.backgroundColor = '';
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 3: Shrink Vision
     * Crea un efecto de viñeta que hace que la vista parezca un círculo pequeño.
     */
    function effectShrinkVision() {
        // Crear el wrapper (si no existe)
        let wrapper = document.getElementById('shrink-vision-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'shrink-vision-wrapper';
            wrapper.innerHTML = '<div id="shrink-vision-vignette" class="shrink-vision-vignette"></div>';
            document.body.appendChild(wrapper);
        }

        const vignette = document.getElementById('shrink-vision-vignette');

        // 1. Activar el efecto (transición CSS de opacidad)
        vignette.classList.add('active');

        // 2. Limpiar después de la duración
        setTimeout(() => {
            vignette.classList.remove('active');
            // Eliminar el wrapper del DOM (limpieza)
            setTimeout(() => wrapper.remove(), 600);
        }, EFFECT_DURATION);
    }

    /**
     * Selecciona y ejecuta un efecto aleatorio.
     */
    function runRandomEffect() {
        const effects = [
            effectGravityFlip,
            effectColorRave,
            effectShrinkVision
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleMenuClick(event) {
        // Ciclar el color del menú SVG para feedback visual
        const mainClock = document.querySelector('#clock-main-group path:nth-child(2)');
        if (mainClock) {
            mainClock.style.fill = getRandomVibrantColor();
            // Restablecer el color después de un tiempo
            setTimeout(() => mainClock.style.fill = 'rgb(150, 84, 55)', 500);
        }

        // Ejecutar un efecto loco aleatorio
        runRandomEffect();
    }

    /**
     * Hace un elemento HTML arrastrable. (Ajustado para un elemento interactivo en sí)
     */
    function dragElement(element) {
        let pos3 = 0, pos4 = 0;
        let isDragging = false;
        const DRAG_THRESHOLD = 5;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Solo permitir el clic/drag si el clic es dentro del SVG
            if (!e.target.closest('#clock-work-svg')) return;

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

        // 5.2. Asignar eventos y funcionalidad
        const svgElement = document.getElementById('clock-work-svg');
        if (!svgElement) return;

        // El menú es arrastrable
        dragElement(menuContainer);
    });

})();