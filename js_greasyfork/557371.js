// ==UserScript==
// @name         Diamond Engine
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  The Diamond Engine is connected to Drawaria.online's stories and is designed for Decorations. It's made for the Diamond Queen and it serves a critical role in the story to save the game.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://i.ibb.co/zV5sXzkz/diamond2.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557371/Diamond%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/557371/Diamond%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperamos a que la página cargue completamente (LOAD) para evitar pantalla blanca
    window.addEventListener('load', function() {
        console.log("Diamond Engine: Inicializando...");

        // 1. CONFIGURACIÓN DE URLS Y SONIDOS
        const STARTUP_SOUND_URL = 'https://www.myinstants.com/media/sounds/windows-vista-beta-2006-startup.mp3';
        const CLICK_SOUND_URL = 'https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3';
        const GIF_ICON_URL = 'https://i.ibb.co/zV5sXzkz/diamond2.gif';

        // Método de audio corregido (más compatible que AudioContext para scripts externos)
        const startupAudio = new Audio(STARTUP_SOUND_URL);
        const clickAudio = new Audio(CLICK_SOUND_URL);

        function playSound(audioObj) {
            audioObj.currentTime = 0;
            audioObj.play().catch(e => console.warn("Audio bloqueado por el navegador (interactúa primero):", e));
        }

        // 2. ESTILOS CSS
        GM_addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

            #diamond-gif-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 99999;
                cursor: pointer;
                transition: opacity 0.5s;
            }
            #diamond-gif {
                width: 100px;
                height: 100px;
                animation: spin 4s linear infinite, float 3s ease-in-out infinite alternate;
                border-radius: 50%;
                box-shadow: 0 0 15px #00CED1;
            }

            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes float { 0% { transform: translateY(0px); } 100% { transform: translateY(-15px); } }

            #diamond-engine-container, #options-container, #game-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99998;
                background-color: rgba(2, 5, 7, 0.95); /* Fondo oscuro azulado */
                display: none;
                overflow: auto;
                justify-content: center;
                align-items: center;
            }
            #diamond-engine-svg { display: block; margin: 50px auto; max-width: 900px; height: auto; }
            #options-svg { display: block; margin: 50px auto; max-width: 800px; height: auto; }

            #game-iframe { width: 100%; height: 100%; border: none; display: block; }
            .game-back-btn {
                position: absolute;
                top: 10px; right: 10px;
                padding: 10px 20px;
                background: #008B8B; color: #E0FFFF;
                border: 2px solid #00CED1;
                box-shadow: 0 0 5px #00CED1;
                cursor: pointer;
                font-family: 'Orbitron', sans-serif;
                font-size: 14px;
                z-index: 100001;
                transition: background 0.3s;
            }
            .game-back-btn:hover { background: #00CED1; color: #000; }
        `);

        // 3. CONTENIDO SVG PRINCIPAL (MENU DE INICIO)
        const DIAMOND_ENGINE_SVG_CONTENT = `
        <?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 903.846 508.547" xmlns:bx="https://boxy-svg.com">
  <defs>
    <style bx:fonts="Allan">@import url(https://fonts.googleapis.com/css2?family=Allan%3Aital%2Cwght%400%2C400%3B0%2C700&amp;display=swap);</style>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 2 2 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
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
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 #aee6ffb3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#aee6ffb3" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 0 0 9 1 #b6f5f44d" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="9"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-2" type="linear" slope="2"/>
      </feComponentTransfer>
      <feFlood flood-color="#b6f5f44d"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <bx:export>
      <bx:file format="png" path="diamond-engine.png"/>
    </bx:export>
  </defs>
  <g transform="matrix(1, 0, 0, 1, -154.830566, -22.727423)">
    <g>
      <path d="M 405.067 132.607 H 524.205 A 15 15 0 0 0 539.205 147.607 V 361.964 A 15 15 0 0 0 524.205 376.964 H 405.067 A 15 15 0 0 0 390.067 361.964 V 147.607 A 15 15 0 0 0 405.067 132.607 Z" bx:shape="rect 390.067 132.607 149.138 244.357 2 15 15 2@5175b24e" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(98, 220, 222); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
      <path style="stroke-width: 3.59301px; stroke: rgb(191, 249, 246); fill: rgb(81, 166, 174); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(-0.852843, -0.767306, 0.721903, -0.802379, -104.675919, -44.009132)" d="M 628 296.5 A 84.5 84.5 0 1 1 543.5 212 L 543.5 296.5 Z" bx:shape="pie 543.5 296.5 0 84.5 90 360 1@6b86ec00"/>
      <path d="M -825.35 134.328 H -706.212 A 15 15 0 0 0 -691.212 149.328 V 363.685 A 15 15 0 0 0 -706.212 378.685 H -825.35 A 15 15 0 0 0 -840.35 363.685 V 149.328 A 15 15 0 0 0 -825.35 134.328 Z" bx:shape="rect -840.35 134.328 149.138 244.357 2 15 15 2@e44f1bcc" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(98, 220, 222); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(-1, 0, 0, 1, 0, 0)"/>
      <path style="stroke-width: 3.59301px; stroke: rgb(191, 249, 246); fill: rgb(81, 166, 174); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-origin: 543.5px 296.5px;" transform="matrix(0.852843, -0.767306, -0.721903, -0.802379, 248.092773, -42.288418)" d="M 628 296.5 A 84.5 84.5 0 1 1 543.5 212 L 543.5 296.5 Z" bx:shape="pie 543.5 296.5 0 84.5 90 360 1@6b86ec00"/>
      <path d="M 337.808 188.83 H 442.848 A 15 15 0 0 0 457.848 203.83 V 488.532 A 15 15 0 0 0 442.848 503.532 H 337.808 A 15 15 0 0 0 322.808 488.532 V 203.83 A 15 15 0 0 0 337.808 188.83 Z" bx:shape="rect 322.808 188.83 135.04 314.702 2 15 15 2@78628f30" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(98, 220, 222); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0, -1, 1, 0, 225.868225, 38.058777)"/>
      <path style="stroke-width: 3.79735px; stroke: rgb(191, 249, 246); fill: rgb(81, 166, 174); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-origin: 543.5px 296.5px;" transform="matrix(-0.866239, 0.676913, -0.904163, -0.57193, 71.313789, 116.258781)" d="M 628 296.5 A 84.5 84.5 0 1 1 543.5 212 L 543.5 296.5 Z" bx:shape="pie 543.5 296.5 0 84.5 90 360 1@6b86ec00"/>
      <path d="M -715.51 191.05 H -610.47 A 15 15 0 0 0 -595.47 206.05 V 490.752 A 15 15 0 0 0 -610.47 505.752 H -715.51 A 15 15 0 0 0 -730.51 490.752 V 206.05 A 15 15 0 0 0 -715.51 191.05 Z" bx:shape="rect -730.51 191.05 135.04 314.702 2 15 15 2@638278b0" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(98, 220, 222); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0, 1, 1, 0, 1281.396347, -236.824829)"/>
      <path style="stroke-width: 3.79735px; stroke: rgb(191, 249, 246); fill: rgb(81, 166, 174); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-origin: 543.5px 296.5px;" transform="matrix(0.91608, -0.607766, 0.857135, 0.640261, 74.633957, -209.036057)" d="M 628 296.5 A 84.5 84.5 0 1 1 543.5 212 L 543.5 296.5 Z" bx:shape="pie 543.5 296.5 0 84.5 90 360 1@6b86ec00"/>
      <rect x="425.66" y="86.079" width="379.198" height="331.178" rx="9" ry="9" style="fill: rgb(17, 140, 152); stroke-width: 4px; stroke: rgb(191, 249, 246); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
      <path d="M 379.472 132.533 L 452.871 132.533 L 462.247 101.559 L 412.881 24.225 L 368.21 101.969 L 379.472 132.533 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(21, 89, 96); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.707107, -0.707107, 0.707107, 0.707107, 0.000008, 0.00001)"/>
      <path d="M 379.472 368.65 L 452.871 368.65 L 462.247 399.624 L 412.881 476.958 L 368.21 399.214 L 379.472 368.65 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(21, 89, 96); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-origin: 415.228px 422.804px;" transform="matrix(0.707107, 0.707107, -0.707107, 0.707107, 0.00002, -0.000004)"/>
      <path d="M 777.735 26.988 L 851.135 26.988 L 860.511 57.962 L 811.145 135.297 L 766.473 57.552 L 777.735 26.988 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(21, 89, 96); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-origin: 813.492px 81.142px;" transform="matrix(-0.707107, -0.707107, 0.707107, -0.707107, -0.000058, -0.000004)"/>
      <path d="M 777.735 479.721 L 851.134 479.721 L 860.51 448.747 L 811.144 371.413 L 766.473 449.157 L 777.735 479.721 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(21, 89, 96); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;); transform-origin: 813.491px 425.567px;" transform="matrix(-0.707107, 0.707107, -0.707107, -0.707107, -0.000007, 0.000018)"/>
      <path d="M 528.868 255.827 L 503.458 211.604 L 484.232 211.604 L 469.232 196.604 L 469.232 124.745 L 484.232 109.745 L 742.681 109.745 L 757.681 124.745 L 757.681 196.604 L 742.681 211.604 L 729.266 211.604 L 701.036 255.828 L 675.625 211.604 L 643.075 211.604 L 644.711 217.007 L 613.6 265.744 L 585.448 216.749 L 587.344 211.604 L 557.098 211.604 L 528.868 255.827 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(110, 205, 215); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
      <text style="fill: rgb(218, 251, 253); font-family: Allan; font-size: 28px; stroke: rgba(253, 82, 81, 0); stroke-width: 2.40696px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(1.859248, 0, 0, 1.474997, -0.827607, 1.207167)" x="258.793" y="115.282">Diamond Engine</text>
    </g>
    <g id="options" transform="matrix(1, 0, 0, 1, 6.8165, 5.840668)">
      <path d="M 726.335 267.904 L 684.563 283.875 L 685.165 284.427 C 683.947 284.323 682.716 284.27 681.471 284.27 L 543.557 284.27 C 541.509 284.27 539.494 284.414 537.522 284.692 L 497.858 269.527 L 507.641 303.769 C 503.277 310.477 500.741 318.486 500.74 327.086 C 500.74 338.075 504.881 348.099 511.686 355.68 L 508.293 393.427 L 546.329 369.905 L 546.325 369.903 L 680.483 369.903 L 715.899 391.805 L 712.714 356.364 C 719.892 348.707 724.288 338.41 724.288 327.086 C 724.287 317.902 721.396 309.392 716.473 302.42 L 726.335 267.904 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(51, 100, 105); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
      <text style="fill: rgb(137, 220, 225); font-family: Allan; font-size: 28px; stroke: rgba(253, 82, 81, 0); stroke-width: 2.40696px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);" transform="matrix(2.375307, 0, 0, 1.972286, -78.43644, 114.86554)" x="258.793" y="115.282">Options</text>
    </g>
    <animate attributeName="display" values="none;inline" dur="3s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 340.911346, -28.988813)">
    <path d="M 92.182 257.936 L 165.581 257.936 L 174.957 288.91 L 125.591 366.244 L 80.92 288.5 L 92.182 257.936 Z" style="fill: rgb(17, 140, 152); stroke-width: 4px; stroke: rgb(191, 249, 246); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
    <path d="M 105.405 272.961 L 151.662 272.961 L 157.571 292.481 L 126.46 341.218 L 98.308 292.223 L 105.405 272.961 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(170, 254, 255); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 100" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1"/>
    <animate attributeName="opacity" values="1;0" begin="2s" dur="1.02s" fill="freeze" keyTimes="0; 1"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 347.00174, 71.472374)">
    <path d="M 87.332 154.018 L 160.731 154.018 L 170.107 123.044 L 120.741 45.71 L 76.07 123.454 L 87.332 154.018 Z" style="fill: rgb(17, 140, 152); stroke-width: 4px; stroke: rgb(191, 249, 246); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
    <path d="M 100.555 138.993 L 146.812 138.993 L 152.721 119.473 L 121.61 70.736 L 93.458 119.731 L 100.555 138.993 Z" style="stroke-width: 4px; stroke: rgb(191, 249, 246); fill: rgb(170, 254, 255); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-1&quot;);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -100" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1"/>
    <animate attributeName="opacity" values="1;0" begin="2s" dur="0.98s" fill="freeze" keyTimes="0; 1"/>
  </g>
</svg>
        `;

        // 4. CONTENIDO SVG OPCIONES (HOLOGRÁFICO)
        const OPTIONS_SVG_CONTENT = `
        <defs>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');
              .text-title { font-family: 'Orbitron', sans-serif; font-weight: 900; fill: #E0FFFF; text-transform: uppercase; letter-spacing: 4px; filter: url(#glow); }
              .text-btn { font-family: 'Orbitron', sans-serif; font-weight: 700; fill: #ffffff; font-size: 14px; letter-spacing: 1px; pointer-events: none; }
              .text-sub { font-family: 'Orbitron', sans-serif; font-weight: 500; fill: #00CED1; font-size: 10px; opacity: 0.8; pointer-events: none; }
              .btn-shape { fill: url(#btnGrad); stroke: #00CED1; stroke-width: 2; transition: all 0.3s ease; cursor: pointer; }
              .btn-shape:hover { fill: url(#btnGradHover); stroke: #E0FFFF; filter: url(#glow); stroke-width: 3; }
              .bg-panel { fill: #1a2f35; fill-opacity: 0.9; stroke: #008B8B; stroke-width: 2; }
              .deco-line { stroke: #00CED1; stroke-width: 1; opacity: 0.5; }
            </style>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#d0e4e6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#b0c4c6;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#004d4d;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#002b2b;stop-opacity:0.9" />
            </linearGradient>
            <linearGradient id="btnGradHover" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#008B8B;stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:#005555;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" style="stop-color:#E0FFFF;stop-opacity:1" />
               <stop offset="50%" style="stop-color:#00CED1;stop-opacity:1" />
               <stop offset="100%" style="stop-color:#008B8B;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGrad)" />
        <path d="M0 0 L800 600 M800 0 L0 600" stroke="#00CED1" stroke-width="1" opacity="0.1" />
        <circle cx="400" cy="300" r="250" stroke="#00CED1" stroke-width="1" opacity="0.1" fill="none"/>
        <g transform="translate(150, 50)">
            <path d="M50 0 L450 0 L500 50 L500 450 L450 500 L50 500 L0 450 L0 50 Z" class="bg-panel" />
            <path d="M20 50 L20 450 M480 50 L480 450" class="deco-line" />
            <rect x="150" y="20" width="200" height="5" fill="#00CED1" opacity="0.5" />
            <rect x="150" y="475" width="200" height="5" fill="#00CED1" opacity="0.5" />
            <text x="250" y="80" text-anchor="middle" font-size="32" class="text-title">DIMENSION GATE</text>
            <text x="250" y="100" text-anchor="middle" font-size="12" fill="#00CED1" letter-spacing="2" font-family="sans-serif">SELECT DESTINATION</text>
            <g transform="translate(250, 270)">
               <path d="M0 -40 L30 0 L0 40 L-30 0 Z" fill="url(#diamondGrad)" stroke="#E0FFFF" stroke-width="2" filter="url(#glow)">
                 <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
               </path>
               <circle cx="0" cy="0" r="50" stroke="#00CED1" stroke-width="1" fill="none" opacity="0.5">
                   <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite"/>
               </circle>
            </g>
            <g id="btn-group-left">
                <g transform="translate(40, 150)"><path d="M0 10 L10 0 L180 0 L180 50 L170 60 L0 60 Z" class="btn-shape" /><rect x="5" y="20" width="5" height="20" fill="#00CED1"/><text x="25" y="25" class="text-sub">SIMULATION 01</text><text x="25" y="45" class="text-btn">VELOCIDAD DE ESQUIRLA</text></g>
                <g transform="translate(40, 230)"><path d="M0 10 L10 0 L180 0 L180 50 L170 60 L0 60 Z" class="btn-shape" /><rect x="5" y="20" width="5" height="20" fill="#00CED1"/><text x="25" y="25" class="text-sub">SIMULATION 02</text><text x="25" y="45" class="text-btn">PRISMA LÓGICO</text></g>
                <g transform="translate(40, 310)"><path d="M0 10 L10 0 L180 0 L180 50 L170 60 L0 60 Z" class="btn-shape" /><rect x="5" y="20" width="5" height="20" fill="#00CED1"/><text x="25" y="25" class="text-sub">SIMULATION 03</text><text x="25" y="45" class="text-btn">FLUIDO DE NEÓN</text></g>
            </g>
            <g id="btn-group-right">
                <g transform="translate(280, 150)"><path d="M0 0 L170 0 L180 10 L180 60 L10 60 L0 50 Z" class="btn-shape" /><rect x="170" y="20" width="5" height="20" fill="#00CED1"/><text x="155" y="25" text-anchor="end" class="text-sub">SIMULATION 04</text><text x="155" y="45" text-anchor="end" class="text-btn">RED CUÁNTICA</text></g>
                <g transform="translate(280, 230)"><path d="M0 0 L170 0 L180 10 L180 60 L10 60 L0 50 Z" class="btn-shape" /><rect x="170" y="20" width="5" height="20" fill="#00CED1"/><text x="155" y="25" text-anchor="end" class="text-sub">SIMULATION 05</text><text x="155" y="45" text-anchor="end" class="text-btn">CAVERNAS ECO</text></g>
                <g transform="translate(280, 310)"><path d="M0 0 L170 0 L180 10 L180 60 L10 60 L0 50 Z" class="btn-shape" /><rect x="170" y="20" width="5" height="20" fill="#00CED1"/><text x="155" y="25" text-anchor="end" class="text-sub">SIMULATION 06</text><text x="155" y="45" text-anchor="end" class="text-btn">GRAVEDAD CERO</text></g>
            </g>
            <g transform="translate(200, 420)" style="cursor: pointer; opacity: 0.8" id="back-btn-opt">
               <rect x="0" y="0" width="100" height="30" rx="5" fill="#1a2f35" stroke="#00CED1" />
               <text x="50" y="20" text-anchor="middle" fill="#00CED1" font-family="sans-serif" font-size="12" font-weight="bold" style="pointer-events: none;">BACK</text>
            </g>
        </g>
        `;

        // 5. CODIGOS DE LOS JUEGOS
        const GAME1_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&display=swap');body{margin:0;overflow:hidden;background-color:#050a0c;font-family:'Orbitron',sans-serif;user-select:none}canvas{display:block}#ui-layer{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between;padding:20px;box-sizing:border-box}.hud-text{color:#00CED1;text-shadow:0 0 10px #00CED1;text-transform:uppercase}#score-display{font-size:24px;font-weight:900}#status-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;color:#E0FFFF;text-align:center;background:rgba(0,20,20,0.8);padding:40px;border:2px solid #00CED1;box-shadow:0 0 30px #00CED1;pointer-events:auto;cursor:pointer}.hidden{display:none!important}</style></head><body><div id="ui-layer"><div id="score-display">SCORE: 0</div><div id="status-msg">CLICK TO START<br><span style="font-size:16px">AVOID THE SHARDS</span></div></div><canvas id="gameCanvas"></canvas><script>const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const uiStatus=document.getElementById('status-msg');const uiScore=document.getElementById('score-display');let width,height,particles=[],obstacles=[],score=0,gameRunning=false,speed=5,player={x:0,y:0,size:20};const COLOR_PRIMARY='#00CED1',COLOR_SECONDARY='#E0FFFF',GLOW_INTENSITY=20;function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;player.y=height-100;player.x=width/2}window.addEventListener('resize',resize);resize();window.addEventListener('mousemove',e=>{if(gameRunning)player.x=e.clientX});uiStatus.addEventListener('click',()=>{if(!gameRunning)startGame()});class Obstacle{constructor(){this.x=(Math.random()-0.5)*width*0.1;this.y=height/2;this.z=0;this.type=Math.floor(3*Math.random())}update(){this.z+=speed;let scale=this.z/200;this.screenX=width/2+this.x*scale*20;this.screenY=height/2+0.1*height+200*scale;this.size=40*scale;if(this.screenY>player.y-20&&this.screenY<player.y+20&&Math.abs(this.screenX-player.x)<this.size+player.size){gameOver()}}draw(){if(this.z<1)return;ctx.shadowBlur=GLOW_INTENSITY;ctx.shadowColor=COLOR_PRIMARY;ctx.fillStyle='#002b2b';ctx.strokeStyle=COLOR_PRIMARY;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(this.screenX,this.screenY-this.size);ctx.lineTo(this.screenX+this.size,this.screenY);ctx.lineTo(this.screenX,this.screenY+this.size);ctx.lineTo(this.screenX-this.size,this.screenY);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0}}class Particle{constructor(){this.x=Math.random()*width;this.y=Math.random()*height;this.speed=10*Math.random()+2;this.len=20*Math.random()+10}update(){this.y+=this.speed*(speed/2);if(this.y>height)this.y=-50}draw(){ctx.strokeStyle='rgba(0, 206, 209, 0.1)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x,this.y-this.len);ctx.stroke()}}function startGame(){obstacles=[];particles=[];score=0;speed=2;gameRunning=true;uiStatus.classList.add('hidden');for(let i=0;i<50;i++)particles.push(new Particle());loop()}function gameOver(){gameRunning=false;uiStatus.innerHTML=\`SYSTEM FAILURE<br><span style="font-size:20px">SCORE: \${Math.floor(score)}</span><br><span style="font-size:14px">CLICK TO REBOOT</span>\`;uiStatus.classList.remove('hidden')}function drawPlayer(){ctx.save();ctx.translate(player.x,player.y);ctx.shadowBlur=30;ctx.shadowColor=COLOR_SECONDARY;ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(20,20);ctx.lineTo(0,10);ctx.lineTo(-20,20);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();ctx.restore()}let frameCount=0;function loop(){if(!gameRunning)return;ctx.fillStyle='#050a0c';ctx.fillRect(0,0,width,height);ctx.strokeStyle='rgba(0, 206, 209, 0.1)';ctx.beginPath();ctx.moveTo(width/2,height/2);ctx.lineTo(0,height);ctx.moveTo(width/2,height/2);ctx.lineTo(width,height);ctx.stroke();particles.forEach(p=>{p.update();p.draw()});frameCount++;if((frameCount%(60-Math.floor(2*speed))===0||Math.random()<0.02)){obstacles.push(new Obstacle())}speed+=0.001;score+=0.1;uiScore.innerText="SCORE: "+Math.floor(score);for(let i=obstacles.length-1;i>=0;i--){let ob=obstacles[i];ob.update();ob.draw();if(ob.screenY>height+100)obstacles.splice(i,1)}drawPlayer();requestAnimationFrame(loop)}ctx.fillStyle='#050a0c';ctx.fillRect(0,0,width,height);</script></body></html>`;

        const GAME2_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');body{margin:0;overflow:hidden;background-color:#020507;font-family:'Orbitron',sans-serif;user-select:none}#ui-layer{position:absolute;top:20px;left:20px;pointer-events:none}h1{color:#E0FFFF;font-size:24px;margin:0;text-shadow:0 0 10px #00CED1;letter-spacing:2px}p{color:#00CED1;font-size:14px;margin-top:5px;opacity:.8}#win-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;color:#fff;background:rgba(0,206,209,0.2);border:2px solid #00CED1;padding:30px 60px;display:none;backdrop-filter:blur(5px);text-align:center;box-shadow:0 0 50px #00CED1;z-index:10}canvas{display:block;cursor:crosshair}</style></head><body><div id="ui-layer"><h1>LOGIC PRISM</h1><p>CLICK PRISMS TO ROTATE // CONNECT THE BEAM</p></div><div id="win-msg"><div>SYSTEM SYNCED</div><div style="font-size: 16px; margin-top: 10px; color: #E0FFFF">GENERATING NEW PUZZLE...</div></div><canvas id="gameCanvas"></canvas><script>const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const winMsg=document.getElementById('win-msg');let cols=8,rows=6,cellSize=80,offsetX=0,offsetY=0,grid=[],source={c:0,r:0,dir:'right'},target={c:0,r:0},laserPath=[],isWin=false;const C_BG='#020507',C_GRID='#1a2f35',C_PRISM='#00CED1',C_LASER='#E0FFFF',C_TARGET='#FF0055';function init(){resize();generateLevel();loop()}function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;let gridW=cols*cellSize;let gridH=rows*cellSize;offsetX=(canvas.width-gridW)/2;offsetY=(canvas.height-gridH)/2}window.addEventListener('resize',resize);function generateLevel(){grid=[];for(let r=0;r<rows;r++){let row=[];for(let c=0;c<cols;c++){row.push(Math.random()<0.4?(Math.random()<0.5?1:2):0)}grid.push(row)}source={c:0,r:Math.floor(Math.random()*rows),dir:'right'};target={c:cols-1,r:Math.floor(Math.random()*rows)};grid[source.r][source.c]=0;grid[target.r][target.c]=0;isWin=false;winMsg.style.display='none';calculateLaser()}function calculateLaser(){laserPath=[];let curr={x:source.c,y:source.r};let dir=source.dir;let steps=0;let hitTarget=false;laserPath.push({x:offsetX+curr.x*cellSize+cellSize/2,y:offsetY+curr.y*cellSize+cellSize/2});while(steps<100){if(dir==='right')curr.x++;else if(dir==='left')curr.x--;else if(dir==='down')curr.y++;else if(dir==='up')curr.y--;if(curr.x<0||curr.x>=cols||curr.y<0||curr.y>=rows)break;laserPath.push({x:offsetX+curr.x*cellSize+cellSize/2,y:offsetY+curr.y*cellSize+cellSize/2});if(curr.x===target.c&&curr.y===target.r){hitTarget=true;break}let cell=grid[curr.y][curr.x];if(cell===1){if(dir==='right')dir='up';else if(dir==='left')dir='down';else if(dir==='up')dir='right';else if(dir==='down')dir='left'}else if(cell===2){if(dir==='right')dir='down';else if(dir==='left')dir='up';else if(dir==='up')dir='left';else if(dir==='down')dir='right'}steps++}if(hitTarget&&!isWin){isWin=true;winMsg.style.display='block';setTimeout(generateLevel,2000)}}canvas.addEventListener('mousedown',e=>{if(isWin)return;let c=Math.floor((e.clientX-offsetX)/cellSize);let r=Math.floor((e.clientY-offsetY)/cellSize);if(c>=0&&c<cols&&r>=0&&r<rows){if((c===source.c&&r===source.r)||(c===target.c&&r===target.r))return;grid[r][c]=(grid[r][c]+1)%3;calculateLaser()}});function draw(){ctx.fillStyle=C_BG;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle=C_GRID;ctx.lineWidth=2;for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){let x=offsetX+c*cellSize;let y=offsetY+r*cellSize;ctx.strokeRect(x,y,cellSize,cellSize);let cell=grid[r][c];let cx=x+cellSize/2;let cy=y+cellSize/2;if(cell===1)drawMirror(cx,cy,'/');else if(cell===2)drawMirror(cx,cy,'\\\\')}}drawSource(offsetX+source.c*cellSize+cellSize/2,offsetY+source.r*cellSize+cellSize/2);drawTarget(offsetX+target.c*cellSize+cellSize/2,offsetY+target.r*cellSize+cellSize/2);if(laserPath.length>1){ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowBlur=isWin?30:15;ctx.shadowColor=isWin?'#fff':C_PRISM;ctx.strokeStyle=isWin?'#fff':C_LASER;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(laserPath[0].x,laserPath[0].y);for(let i=1;i<laserPath.length;i++)ctx.lineTo(laserPath[i].x,laserPath[i].y);ctx.stroke();ctx.restore()}}function drawMirror(x,y,type){ctx.save();ctx.shadowBlur=10;ctx.shadowColor=C_PRISM;ctx.strokeStyle=C_PRISM;ctx.lineWidth=4;ctx.beginPath();let size=0.3*cellSize;if(type==='/'){ctx.moveTo(x-size,y+size);ctx.lineTo(x+size,y-size)}else{ctx.moveTo(x-size,y-size);ctx.lineTo(x+size,y+size)}ctx.stroke();ctx.fillStyle='rgba(0, 206, 209, 0.2)';ctx.beginPath();ctx.moveTo(x,y-size);ctx.lineTo(x+size,y);ctx.lineTo(x,y+size);ctx.lineTo(x-size,y);ctx.closePath();ctx.fill();ctx.restore()}function drawSource(x,y){ctx.fillStyle='#E0FFFF';ctx.beginPath();ctx.arc(x,y,10,0,2*Math.PI);ctx.fill();ctx.strokeStyle='#E0FFFF';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,15,0,2*Math.PI);ctx.stroke()}function drawTarget(x,y){ctx.fillStyle=isWin?'#ffffff':'transparent';ctx.strokeStyle=isWin?'#ffffff':'#555';if(isWin){ctx.shadowBlur=40;ctx.shadowColor='#00CED1'}ctx.lineWidth=4;ctx.beginPath();let size=15;ctx.rect(x-size,y-size,2*size,2*size);ctx.stroke();if(isWin)ctx.fill();ctx.shadowBlur=0}function loop(){draw();requestAnimationFrame(loop)}init();</script></body></html>`;

        const GAME3_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&display=swap');body{margin:0;overflow:hidden;background-color:#000;font-family:'Orbitron',sans-serif;cursor:none}#ui-layer{position:absolute;bottom:20px;left:20px;pointer-events:none;color:#00CED1;opacity:.7;text-transform:uppercase;font-size:12px;letter-spacing:2px}#cursor-guide{position:absolute;width:40px;height:40px;border:2px solid #E0FFFF;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;box-shadow:0 0 20px #00CED1;mix-blend-mode:screen;transition:width .1s,height .1s}.clicking{width:60px!important;height:60px!important;background:rgba(0,206,209,0.3)}canvas{display:block}</style></head><body><div id="ui-layer"><div>System: Fluid Dynamics v3.0</div><div>Interaction: Hover / Click</div></div><div id="cursor-guide"></div><canvas id="canvas"></canvas><script>const canvas=document.getElementById('canvas');const ctx=canvas.getContext('2d');const cursorDiv=document.getElementById('cursor-guide');let width,height,particles=[];const PARTICLE_COUNT=1000;const COLORS=['#00CED1','#40E0D0','#AFEEEE','#008B8B'];let mouse={x:-1000,y:-1000,down:false};function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight}window.addEventListener('resize',resize);resize();window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;cursorDiv.style.left=e.clientX+'px';cursorDiv.style.top=e.clientY+'px'});window.addEventListener('mousedown',()=>{mouse.down=true;cursorDiv.classList.add('clicking')});window.addEventListener('mouseup',()=>{mouse.down=false;cursorDiv.classList.remove('clicking')});class Particle{constructor(){this.init()}init(){this.x=Math.random()*width;this.y=Math.random()*height;this.vx=2*(Math.random()-0.5);this.vy=2*(Math.random()-0.5);this.size=3*Math.random()+1;this.color=COLORS[Math.floor(Math.random()*COLORS.length)];this.friction=0.96;this.baseSize=this.size}update(){this.x+=this.vx;this.y+=this.vy;this.vx*=this.friction;this.vy*=this.friction;const dx=mouse.x-this.x;const dy=mouse.y-this.y;const dist=Math.sqrt(dx*dx+dy*dy);if(dist<150){const force=(150-dist)/150;const angle=Math.atan2(dy,dx);if(mouse.down){const push=15*force;this.vx-=Math.cos(angle)*push;this.vy-=Math.sin(angle)*push}else{const pull=0.5*force;this.vx+=Math.cos(angle)*pull;this.vy+=Math.sin(angle)*pull}}this.vx+=0.2*(Math.random()-0.5);this.vy+=0.2*(Math.random()-0.5);if(this.x<0){this.x=0;this.vx*=-1}if(this.x>width){this.x=width;this.vx*=-1}if(this.y<0){this.y=0;this.vy*=-1}if(this.y>height){this.y=height;this.vy*=-1}}draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,2*Math.PI);ctx.fillStyle=this.color;ctx.fill()}}for(let i=0;i<PARTICLE_COUNT;i++)particles.push(new Particle());function animate(){ctx.fillStyle='rgba(5, 10, 12, 0.2)';ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation='lighter';particles.forEach(p=>{p.update();p.draw()});ctx.globalCompositeOperation='source-over';requestAnimationFrame(animate)}animate();</script></body></html>`;

        const GAME4_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');body{margin:0;overflow:hidden;background-color:#0b1013;font-family:'Orbitron',sans-serif;user-select:none}#hud{position:absolute;top:0;left:0;width:100%;height:60px;background:rgba(0,206,209,0.1);border-bottom:2px solid #00CED1;display:flex;justify-content:space-around;align-items:center;color:#E0FFFF;font-size:18px;box-shadow:0 0 20px rgba(0,206,209,0.3);z-index:10}.stat-box span{font-weight:900;color:#00CED1;font-size:22px}#game-over{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);border:2px solid #FF0055;padding:40px;text-align:center;color:#FF0055;display:none;z-index:20}button{background:transparent;border:1px solid #00CED1;color:#00CED1;padding:10px 20px;font-family:'Orbitron';margin-top:20px;cursor:pointer;transition:all .3s}button:hover{background:#00CED1;color:#000}</style></head><body><div id="hud"><div class="stat-box">CORE INTEGRITY: <span id="hp">100%</span></div><div class="stat-box">ENERGY: <span id="energy">100</span></div><div class="stat-box">WAVE: <span id="wave">1</span></div></div><div id="game-over"><h1 style="margin:0 0 20px 0;">SYSTEM BREACHED</h1><button onclick="location.reload()">REBOOT SYSTEM</button></div><canvas id="gameCanvas"></canvas><script>const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const elHp=document.getElementById('hp');const elEnergy=document.getElementById('energy');const elWave=document.getElementById('wave');const elGameOver=document.getElementById('game-over');const CELL_SIZE=60;let width,height,gridCols,gridRows,path=[],hp=100,energy=150,wave=1,towers=[],enemies=[],projectiles=[],particles=[],gameOver=false,spawnTimer=0,enemiesToSpawn=5;function init(){resize();generatePath();loop()}function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;gridCols=Math.ceil(width/CELL_SIZE);gridRows=Math.ceil(height/CELL_SIZE)}window.addEventListener('resize',()=>{resize();generatePath()});function generatePath(){path=[];let r=Math.floor(gridRows/2);for(let c=0;c<gridCols*0.2;c++)path.push({c:c,r:r});for(let i=0;i<3;i++){r++;path.push({c:Math.floor(gridCols*0.2),r:r})}for(let c=Math.floor(gridCols*0.2);c<gridCols*0.6;c++)path.push({c:c,r:r});for(let i=0;i<6;i++){r--;path.push({c:Math.floor(gridCols*0.6),r:r})}for(let c=Math.floor(gridCols*0.6);c<gridCols;c++)path.push({c:c,r:r})}class Tower{constructor(c,r){this.c=c;this.r=r;this.range=3.5;this.cooldown=0;this.maxCooldown=30}update(){if(this.cooldown>0)this.cooldown--;if(this.cooldown<=0){for(let e of enemies){let dx=e.x-(this.c*CELL_SIZE+CELL_SIZE/2);let dy=e.y-(this.r*CELL_SIZE+CELL_SIZE/2);if(Math.sqrt(dx*dx+dy*dy)<this.range*CELL_SIZE){this.shoot(e);break}}}}shoot(e){this.cooldown=this.maxCooldown;projectiles.push({sx:this.c*CELL_SIZE+CELL_SIZE/2,sy:this.r*CELL_SIZE+CELL_SIZE/2,tx:e.x,ty:e.y,life:10});e.hp-=25;createParticles(e.x,e.y,'#E0FFFF',2)}draw(){let x=this.c*CELL_SIZE+CELL_SIZE/2;let y=this.r*CELL_SIZE+CELL_SIZE/2;ctx.shadowBlur=15;ctx.shadowColor='#00CED1';ctx.fillStyle='#008B8B';ctx.beginPath();ctx.moveTo(x,y-15);ctx.lineTo(x+15,y);ctx.lineTo(x,y+15);ctx.lineTo(x-15,y);ctx.fill();ctx.fillStyle='#E0FFFF';ctx.beginPath();ctx.arc(x,y,5,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0}}class Enemy{constructor(){this.pathIndex=0;this.progress=0;this.hp=50+10*wave;this.maxHp=this.hp;this.speed=0.03+0.005*wave;let start=path[0];this.x=start.c*CELL_SIZE+CELL_SIZE/2;this.y=start.r*CELL_SIZE+CELL_SIZE/2}update(){this.progress+=this.speed;if(this.progress>=1){this.progress=0;this.pathIndex++;if(this.pathIndex>=path.length-1)return this.reachBase(),true}let curr=path[this.pathIndex];let next=path[this.pathIndex+1];let x1=curr.c*CELL_SIZE+CELL_SIZE/2;let y1=curr.r*CELL_SIZE+CELL_SIZE/2;let x2=next.c*CELL_SIZE+CELL_SIZE/2;let y2=next.r*CELL_SIZE+CELL_SIZE/2;this.x=x1+(x2-x1)*this.progress;this.y=y1+(y2-y1)*this.progress;return this.hp<=0}reachBase(){hp-=10;createParticles(this.x,this.y,'#FF0055',10);updateUI();if(hp<=0)endGame()}draw(){ctx.fillStyle='#FF0055';ctx.shadowBlur=10;ctx.shadowColor='#FF0055';ctx.beginPath();ctx.moveTo(this.x,this.y-10);ctx.lineTo(this.x+10,this.y+10);ctx.lineTo(this.x-10,this.y+10);ctx.fill();let pct=this.hp/this.maxHp;ctx.fillStyle='#555';ctx.fillRect(this.x-10,this.y-20,20,4);ctx.fillStyle='#00CED1';ctx.fillRect(this.x-10,this.y-20,20*pct,4);ctx.shadowBlur=0}}function createParticles(x,y,color,count){for(let i=0;i<count;i++){particles.push({x:x,y:y,vx:5*(Math.random()-0.5),vy:5*(Math.random()-0.5),life:20,color:color})}}canvas.addEventListener('mousedown',e=>{if(gameOver)return;let c=Math.floor(e.clientX/CELL_SIZE);let r=Math.floor(e.clientY/CELL_SIZE);if(c>=0&&c<gridCols&&r>=0&&r<gridRows){if(!path.some(p=>p.c===c&&p.r===r)&&!towers.some(t=>t.c===c&&t.r===r)){if(energy>=50){energy-=50;towers.push(new Tower(c,r));createParticles(c*CELL_SIZE+CELL_SIZE/2,r*CELL_SIZE+CELL_SIZE/2,'#00CED1',10);updateUI()}}}});function updateUI(){elHp.innerText=hp+'%';elHp.style.color=hp<30?'#FF0055':'#00CED1';elEnergy.innerText=Math.floor(energy);elWave.innerText=wave}function endGame(){gameOver=true;elGameOver.style.display='block'}function loop(){if(gameOver)return;ctx.fillStyle='#0b1013';ctx.fillRect(0,0,width,height);ctx.strokeStyle='#1a2f35';ctx.lineWidth=1;for(let c=0;c<gridCols;c++){for(let r=0;r<gridRows;r++)ctx.strokeRect(c*CELL_SIZE,r*CELL_SIZE,CELL_SIZE,CELL_SIZE)}ctx.fillStyle='#15252b';path.forEach(p=>{ctx.fillRect(p.c*CELL_SIZE,p.r*CELL_SIZE,CELL_SIZE,CELL_SIZE)});if(path.length>0){let end=path[path.length-1];ctx.shadowBlur=20;ctx.shadowColor='#00CED1';ctx.fillStyle='#00CED1';let ex=end.c*CELL_SIZE+CELL_SIZE/2;let ey=end.r*CELL_SIZE+CELL_SIZE/2;ctx.beginPath();ctx.moveTo(ex,ey-20);ctx.lineTo(ex+20,ey);ctx.lineTo(ex,ey+20);ctx.lineTo(ex-20,ey);ctx.fill();ctx.shadowBlur=0}spawnTimer++;if(enemiesToSpawn>0&&spawnTimer%60===0){enemies.push(new Enemy());enemiesToSpawn--}if(enemiesToSpawn===0&&enemies.length===0){wave++;enemiesToSpawn=5+2*wave;energy+=100;updateUI()}towers.forEach(t=>{t.update();t.draw()});for(let i=enemies.length-1;i>=0;i--){let dead=enemies[i].update();enemies[i].draw();if(dead){if(enemies[i].hp<=0){energy+=10;updateUI();createParticles(enemies[i].x,enemies[i].y,'#E0FFFF',5)}enemies.splice(i,1)}}ctx.strokeStyle='#E0FFFF';ctx.lineWidth=2;ctx.shadowBlur=10;ctx.shadowColor='#00CED1';for(let i=projectiles.length-1;i>=0;i--){let p=projectiles[i];ctx.beginPath();ctx.moveTo(p.sx,p.sy);ctx.lineTo(p.tx,p.ty);ctx.stroke();p.life--;if(p.life<=0)projectiles.splice(i,1)}ctx.shadowBlur=0;for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life--;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,2,2);if(p.life<=0)particles.splice(i,1)}if(energy<500){energy+=0.05;if(Math.floor(energy)>parseInt(elEnergy.innerText))updateUI()}requestAnimationFrame(loop)}init();</script></body></html>`;

        const GAME5_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&display=swap');body{margin:0;overflow:hidden;background-color:#020507;font-family:'Orbitron',sans-serif}#ui-layer{position:absolute;bottom:30px;width:100%;text-align:center;color:#00CED1;pointer-events:none;text-shadow:0 0 10px #00CED1;opacity:.8}.controls{font-size:14px;margin-top:10px;color:#E0FFFF}.key{border:1px solid #00CED1;padding:2px 6px;border-radius:4px;margin:0 2px;font-weight:700}canvas{display:block}</style></head><body><div id="ui-layer"><div style="font-size: 20px; letter-spacing: 4px;">ECHO CAVERNS</div><div class="controls">MOVE: <span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span> or ARROWS | SONAR PULSE: <span class="key">SPACE</span></div></div><canvas id="gameCanvas"></canvas><script>const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const shadowCanvas=document.createElement('canvas');const shadowCtx=shadowCanvas.getContext('2d');let width,height,camera={x:0,y:0},player={speed:4},keys={},crystals=[],pulses=[],particles=[];const WORLD_SIZE=4000,CRYSTAL_COUNT=300,BASE_LIGHT_RAD=80;function init(){resize();generateWorld();window.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);window.addEventListener('keydown',e=>{if(e.code==='Space')triggerPulse()});loop()}function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight;shadowCanvas.width=width;shadowCanvas.height=height}window.addEventListener('resize',resize);function generateWorld(){for(let i=0;i<CRYSTAL_COUNT;i++){crystals.push({x:(Math.random()-0.5)*WORLD_SIZE,y:(Math.random()-0.5)*WORLD_SIZE,size:15*Math.random()+5,type:Math.random()>0.8?2:1})}}function triggerPulse(){pulses.push({rad:10,maxRad:0.6*Math.max(width,height),alpha:1,speed:15})}function update(){if(keys.w||keys.arrowup)camera.y-=player.speed;if(keys.s||keys.arrowdown)camera.y+=player.speed;if(keys.a||keys.arrowleft)camera.x-=player.speed;if(keys.d||keys.arrowright)camera.x+=player.speed;camera.x=Math.max(-WORLD_SIZE/2,Math.min(WORLD_SIZE/2,camera.x));camera.y=Math.max(-WORLD_SIZE/2,Math.min(WORLD_SIZE/2,camera.y));for(let i=pulses.length-1;i>=0;i--){let p=pulses[i];p.rad+=p.speed;p.alpha=1-p.rad/p.maxRad;if(p.alpha<=0)pulses.splice(i,1)}if(Math.random()<0.2){particles.push({x:camera.x+(Math.random()-0.5)*width,y:camera.y+(Math.random()-0.5)*height,vx:0.5*(Math.random()-0.5),vy:0.5*(Math.random()-0.5)-0.5,life:100*Math.random()+50,size:2*Math.random()})}for(let i=particles.length-1;i>=0;i--){particles[i].x+=particles[i].vx;particles[i].y+=particles[i].vy;particles[i].life--;if(particles[i].life<=0)particles.splice(i,1)}}function toScreen(x,y){return{x:x-camera.x+width/2,y:y-camera.y+height/2}}function draw(){let bgGrad=ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,width);bgGrad.addColorStop(0,'#0a151a');bgGrad.addColorStop(1,'#020507');ctx.fillStyle=bgGrad;ctx.fillRect(0,0,width,height);ctx.fillStyle='rgba(0, 206, 209, 0.03)';for(let i=0;i<100;i++){let r=200*Math.random()+50;let pos=toScreen((Math.random()-0.5)*WORLD_SIZE,(Math.random()-0.5)*WORLD_SIZE);ctx.beginPath();ctx.arc(pos.x,pos.y,r,0,2*Math.PI);ctx.fill()}ctx.globalCompositeOperation='lighter';crystals.forEach(c=>{let s=toScreen(c.x,c.y);if(s.x>-50&&s.x<width+50&&s.y>-50&&s.y<height+50){let grad=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,4*c.size);if(c.type===1){grad.addColorStop(0,'rgba(224, 255, 255, 0.8)');grad.addColorStop(1,'rgba(0, 206, 209, 0)')}else{grad.addColorStop(0,'rgba(255, 255, 255, 0.9)');grad.addColorStop(0.3,'rgba(0, 206, 209, 0.5)');grad.addColorStop(1,'rgba(0, 139, 139, 0)')}ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(s.x,s.y-c.size);ctx.lineTo(s.x+0.8*c.size,s.y);ctx.lineTo(s.x,s.y+1.2*c.size);ctx.lineTo(s.x-0.8*c.size,s.y);ctx.fill()}});particles.forEach(p=>{let s=toScreen(p.x,p.y);ctx.fillStyle='rgba(224, 255, 255, '+p.life/150*0.5+')';ctx.fillRect(s.x,s.y,p.size,p.size)});ctx.globalCompositeOperation='source-over';ctx.shadowBlur=30;ctx.shadowColor='#E0FFFF';ctx.fillStyle='#E0FFFF';ctx.beginPath();ctx.arc(width/2,height/2,8,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0;shadowCtx.globalCompositeOperation='source-over';shadowCtx.fillStyle='rgba(2, 5, 7, 0.95)';shadowCtx.fillRect(0,0,width,height);shadowCtx.globalCompositeOperation='destination-out';let lightGrad=shadowCtx.createRadialGradient(width/2,height/2,10,width/2,height/2,BASE_LIGHT_RAD);lightGrad.addColorStop(0,'rgba(0,0,0,1)');lightGrad.addColorStop(1,'rgba(0,0,0,0)');shadowCtx.fillStyle=lightGrad;shadowCtx.beginPath();shadowCtx.arc(width/2,height/2,BASE_LIGHT_RAD,0,2*Math.PI);shadowCtx.fill();pulses.forEach(p=>{shadowCtx.lineWidth=40*p.alpha;shadowCtx.strokeStyle=\`rgba(0,0,0,\${0.6*p.alpha})\`;shadowCtx.beginPath();shadowCtx.arc(width/2,height/2,p.rad,0,2*Math.PI);shadowCtx.stroke()});ctx.drawImage(shadowCanvas,0,0);ctx.globalCompositeOperation='lighter';pulses.forEach(p=>{ctx.lineWidth=5;ctx.strokeStyle=\`rgba(0, 206, 209, \${p.alpha})\`;ctx.shadowBlur=20*p.alpha;ctx.shadowColor='#00CED1';ctx.beginPath();ctx.arc(width/2,height/2,p.rad,0,2*Math.PI);ctx.stroke()});ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0}function loop(){update();draw();requestAnimationFrame(loop)}init();</script></body></html>`;

        const GAME6_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');body{margin:0;overflow:hidden;background-color:#030608;font-family:'Orbitron',sans-serif;user-select:none}#ui-layer{position:absolute;top:20px;left:20px;pointer-events:none}.hud-text{color:#00CED1;font-size:16px;margin-bottom:5px;text-shadow:0 0 5px rgba(0,206,209,0.5)}#fuel-bar-container{width:200px;height:10px;border:1px solid #00CED1;background:rgba(0,20,20,0.5);margin-top:5px}#fuel-bar{width:100%;height:100%;background-color:#E0FFFF;box-shadow:0 0 10px #E0FFFF;transition:width .1s}#status-msg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;display:none;z-index:10}button{background:transparent;border:2px solid #00CED1;color:#E0FFFF;font-family:'Orbitron';font-size:18px;padding:10px 30px;cursor:pointer;margin-top:20px;box-shadow:0 0 15px #00CED1}button:hover{background:#00CED1;color:#000}canvas{display:block}</style></head><body><div id="ui-layer"><div class="hud-text">ORBITAL THRUSTERS</div><div id="fuel-bar-container"><div id="fuel-bar"></div></div><div class="hud-text" style="margin-top: 15px">SHARDS COLLECTED: <span id="score">0</span></div></div><div id="status-msg"><h1 style="color: #FF4444; font-size: 40px; margin: 0;">CRITICAL FAILURE</h1><p style="color: #00CED1;">COLLISION DETECTED</p><button onclick="resetGame()">REBOOT SEQUENCE</button></div><canvas id="gameCanvas"></canvas><script>const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const elFuel=document.getElementById('fuel-bar');const elScore=document.getElementById('score');const elStatus=document.getElementById('status-msg');let width,height,particles=[],planets=[],shards=[],score=0,gameOver=false,player={x:0,y:0,vx:3,vy:0,size:8,fuel:100,trail:[]},mouse={x:0,y:0,down:false};function init(){resize();resetGame();window.addEventListener('mousedown',()=>mouse.down=true);window.addEventListener('mouseup',()=>mouse.down=false);window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});loop()}function resize(){width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight}window.addEventListener('resize',resize);function resetGame(){gameOver=false;elStatus.style.display='none';score=0;elScore.innerText='0';player.x=0.1*width;player.y=0.5*height;player.vx=4;player.vy=-2;player.fuel=100;player.trail=[];planets=[{x:width/2,y:height/2,mass:800,r:40}];for(let i=0;i<3;i++)planets.push({x:Math.random()*width,y:Math.random()*height,mass:300*Math.random()+100,r:20*Math.random()+15});shards=[];spawnShard();spawnShard();spawnShard()}function spawnShard(){shards.push({x:Math.random()*(width-100)+50,y:Math.random()*(height-100)+50,r:6})}function update(){if(gameOver)return;planets.forEach(p=>{let dx=p.x-player.x;let dy=p.y-player.y;let dist=Math.sqrt(dx*dx+dy*dy);if(dist<p.r+player.size)crash(player.x,player.y);let force=p.mass/(dist*dist*0.05);player.vx+=dx/dist*force;player.vy+=dy/dist*force});if(mouse.down&&player.fuel>0){let dx=mouse.x-player.x;let dy=mouse.y-player.y;let dist=Math.sqrt(dx*dx+dy*dy);player.vx+=dx/dist*0.2;player.vy+=dy/dist*0.2;player.fuel-=0.5;particles.push({x:player.x,y:player.y,vx:-dx/dist*5+(Math.random()-0.5),vy:-dy/dist*5+(Math.random()-0.5),life:15,color:'#E0FFFF'})}player.x+=player.vx;player.y+=player.vy;if(player.x<0||player.x>width)player.vx*=-0.8;if(player.y<0||player.y>height)player.vy*=-0.8;player.x=Math.max(0,Math.min(width,player.x));player.y=Math.max(0,Math.min(height,player.y));for(let i=shards.length-1;i>=0;i--){let s=shards[i];if(Math.hypot(s.x-player.x,s.y-player.y)<player.size+s.r+10){shards.splice(i,1);score++;player.fuel=Math.min(100,player.fuel+15);elScore.innerText=score;spawnShard();createExplosion(s.x,s.y,'#00CED1',10)}}if(!mouse.down&&player.fuel<100)player.fuel+=0.05;elFuel.style.width=player.fuel+'%';elFuel.style.backgroundColor=player.fuel<20?'#FF4444':'#E0FFFF';player.trail.push({x:player.x,y:player.y});if(player.trail.length>50)player.trail.shift();particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.life--;if(p.life<=0)particles.splice(i,1)})}function crash(x,y){gameOver=true;createExplosion(x,y,'#FF4444',30);elStatus.style.display='block'}function createExplosion(x,y,color,count){for(let i=0;i<count;i++){particles.push({x:x,y:y,vx:10*(Math.random()-0.5),vy:10*(Math.random()-0.5),life:30*Math.random()+10,color:color})}}function draw(){ctx.fillStyle='rgba(3, 6, 8, 0.4)';ctx.fillRect(0,0,width,height);planets.forEach(p=>{ctx.strokeStyle='#1a2f35';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,2*p.r,0,2*Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,3.5*p.r,0,2*Math.PI);ctx.stroke();ctx.shadowBlur=20;ctx.shadowColor='#00CED1';let g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,'#008B8B');g.addColorStop(1,'#002b2b');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,2*Math.PI);ctx.fill();ctx.shadowBlur=0});shards.forEach(s=>{ctx.shadowBlur=10;ctx.shadowColor='#fff';ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(s.x,s.y-s.r);ctx.lineTo(s.x+s.r,s.y);ctx.lineTo(s.x,s.y+s.r);ctx.lineTo(s.x-s.r,s.y);ctx.fill();ctx.shadowBlur=0});if(!gameOver){if(player.trail.length>1){ctx.strokeStyle=\`rgba(224, 255, 255, 0.2)\`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(player.trail[0].x,player.trail[0].y);for(let i=1;i<player.trail.length;i++)ctx.lineTo(player.trail[i].x,player.trail[i].y);ctx.stroke()}ctx.save();ctx.translate(player.x,player.y);ctx.rotate(Math.atan2(player.vy,player.vx));ctx.fillStyle='#E0FFFF';ctx.shadowBlur=15;ctx.shadowColor='#E0FFFF';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-5,5);ctx.lineTo(-5,-5);ctx.fill();ctx.restore();if(mouse.down){ctx.strokeStyle='rgba(0, 206, 209, 0.3)';ctx.setLineDash([5,5]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(player.x,player.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();ctx.setLineDash([])}}particles.forEach(p=>{ctx.fillStyle=p.color;ctx.globalAlpha=p.life/30;ctx.fillRect(p.x,p.y,2,2);ctx.globalAlpha=1});requestAnimationFrame(loop)}init();</script></body></html>`;

        // 6. ESTRUCTURA Y LÓGICA DEL ENGINE

        let gifContainer, engineContainer, optionsContainer, gameContainer;

        function initElements() {
            gifContainer = document.createElement('div');
            gifContainer.id = 'diamond-gif-container';
            gifContainer.innerHTML = `<img id="diamond-gif" src="${GIF_ICON_URL}" alt="Diamond Engine">`;
            document.body.appendChild(gifContainer);

            engineContainer = document.createElement('div');
            engineContainer.id = 'diamond-engine-container';
            engineContainer.innerHTML = `<svg id="diamond-engine-svg" viewBox="0 0 903.846 508.547">${DIAMOND_ENGINE_SVG_CONTENT}</svg>`;
            document.body.appendChild(engineContainer);

            optionsContainer = document.createElement('div');
            optionsContainer.id = 'options-container';
            optionsContainer.innerHTML = `<svg id="options-svg" viewBox="0 0 800 600">${OPTIONS_SVG_CONTENT}</svg>`;
            document.body.appendChild(optionsContainer);

            gameContainer = document.createElement('div');
            gameContainer.id = 'game-container';
            gameContainer.innerHTML = `
                <button class="game-back-btn">VOLVER AL MENÚ</button>
                <iframe id="game-iframe" srcdoc="<!DOCTYPE html><html><body>Cargando...</body></html>"></iframe>
            `;
            document.body.appendChild(gameContainer);
        }

        function showView(view) {
            [engineContainer, optionsContainer, gameContainer, gifContainer].forEach(el => {
                if (el) el.style.display = 'none';
            });

            if (view === 'engine') {
                engineContainer.style.display = 'flex';
            } else if (view === 'options') {
                optionsContainer.style.display = 'flex';
            } else if (view === 'game') {
                gameContainer.style.display = 'block';
            } else if (view === 'gif') {
                gifContainer.style.display = 'block';
            }
        }

        function loadGame(gameContent) {
            const iframe = document.getElementById('game-iframe');
            showView('game');
            iframe.srcdoc = gameContent;
        }

        // 7. MANEJADORES DE EVENTOS

        function handleGifClick() {
            gifContainer.style.opacity = '0';
            setTimeout(() => {
                showView('engine');
                gifContainer.style.opacity = '1';
            }, 500);
            playSound(startupAudio);
            setupEngineListeners();
        }

        function setupEngineListeners() {
            const optionsButton = document.querySelector('#diamond-engine-svg g#options');
            if (optionsButton) {
                // Clonamos para limpiar listeners previos
                const newOptionsButton = optionsButton.cloneNode(true);
                optionsButton.parentNode.replaceChild(newOptionsButton, optionsButton);
                newOptionsButton.addEventListener('click', handleOptionsClick);
            }
        }

        function handleOptionsClick() {
            playSound(clickAudio);
            showView('options');
            setupOptionsListeners();
        }

        function setupOptionsListeners() {
            const optionsSvg = document.getElementById('options-svg');
            if (!optionsSvg) return;

            // Mapeo de botones del SVG a las variables de los juegos
            const gameButtons = [
                { selector: '#btn-group-left > g:nth-child(1)', content: GAME1_HTML }, // VELOCIDAD
                { selector: '#btn-group-left > g:nth-child(2)', content: GAME2_HTML }, // PRISMA
                { selector: '#btn-group-left > g:nth-child(3)', content: GAME3_HTML }, // FLUIDO
                { selector: '#btn-group-right > g:nth-child(1)', content: GAME4_HTML }, // RED
                { selector: '#btn-group-right > g:nth-child(2)', content: GAME5_HTML }, // CAVERNAS
                { selector: '#btn-group-right > g:nth-child(3)', content: GAME6_HTML }, // GRAVEDAD
            ];

            gameButtons.forEach(btn => {
                const el = optionsSvg.querySelector(btn.selector);
                if (el) {
                    const newEl = el.cloneNode(true);
                    el.parentNode.replaceChild(newEl, el);
                    newEl.addEventListener('click', () => {
                        playSound(clickAudio);
                        loadGame(btn.content);
                    });
                }
            });

            // Botón BACK del menú opciones
            const backBtnSpecific = optionsSvg.querySelector('#back-btn-opt');
            if (backBtnSpecific) {
                const newBack = backBtnSpecific.cloneNode(true);
                backBtnSpecific.parentNode.replaceChild(newBack, backBtnSpecific);
                newBack.addEventListener('click', () => {
                    playSound(clickAudio);
                    showView('engine');
                });
            }
        }

        function handleGameBackClick() {
            playSound(clickAudio);
            showView('options');
            // Recargar iframe vacío para detener el juego
            const iframe = document.getElementById('game-iframe');
            iframe.srcdoc = '<!DOCTYPE html><html><body style="background:#020507"></body></html>';
        }

        // 8. INICIALIZACIÓN (Ya dentro del load)
        initElements();
        gifContainer.addEventListener('click', handleGifClick, { once: true });
        const gameBackBtn = gameContainer.querySelector('.game-back-btn');
        gameBackBtn.addEventListener('click', handleGameBackClick);
        showView('gif');

    }); // Fin window load

})();