// ==UserScript==
// @name         Triangle Engine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The Triangle Engine is connected to Drawaria.online's stories and is designed for interactive games. It serves a critical role in the story to save the game.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-end
// @icon         https://i.ibb.co/qFRdG3Gk/triangle2.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557256/Triangle%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/557256/Triangle%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- VARIABLES GLOBALES DE CONTROL ---
    let container;
    window.currentGameAnimationFrame = null; // Controla el loop del juego actual
    window.currentAudioContext = null;       // Controla el audio del juego actual

    // --- SONIDOS DEL MOTOR ---
    const startUpSound = new Audio("https://www.myinstants.com/media/sounds/windows-vista-beta-2006-startup.mp3");
    const clickSound = new Audio("https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3");
    clickSound.preload = 'auto';
    startUpSound.preload = 'auto';

    function playClick() {
        const clone = clickSound.cloneNode();
        clone.play().catch(e => console.error("Sound playback failed:", e));
    }
    function playStartup() {
        startUpSound.play().catch(e => console.error("Sound playback failed:", e));
    }

    // --- STRINGS DE ASSETS Y JUEGOS (MODIFICADOS PARA FUNCIONAR) ---

    const TRIANGLE_ENGINE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-333.971 -188.099 2155.343 1472.145" xmlns:bx="https://boxy-svg.com">
  <defs>
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 #fec932b3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke"><feFuncA type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="#fec932b3" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 0 0 5 0.5 #aba12a" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur"><feFuncA id="spread-ctrl" type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="#aba12a"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 0 0 7 0.5 #9d9329" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="7"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur"><feFuncA id="spread-ctrl-2" type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="#9d9329"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="filter-1" bx:preset="drop-shadow 1 0 0 7 0.5 #9d9329" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="7"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur"><feFuncA id="feFuncA-1" type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="#9d9329"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="inner-shadow-filter-1" bx:preset="inner-shadow 1 0 0 10 0.5 #908424" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke"><feFuncA type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="#908424" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <style bx:fonts="Allan">@import url(https://fonts.googleapis.com/css2?family=Allan%3Aital%2Cwght%400%2C400%3B0%2C700&amp;display=swap);</style>
    <filter id="drop-shadow-filter-3" bx:preset="drop-shadow 1 2 2 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
      <feOffset dx="2" dy="2"/>
      <feComponentTransfer result="offsetblur"><feFuncA id="spread-ctrl-5" type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.3)"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="filter-2" bx:preset="drop-shadow 1 2 2 0 0.5 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
      <feOffset dx="2" dy="2"/>
      <feComponentTransfer result="offsetblur"><feFuncA id="feFuncA-2" type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="rgba(0,0,0,0.3)"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 0 0 10 0.5 #afa53c" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur"><feFuncA id="spread-ctrl-6" type="linear" slope="1"/></feComponentTransfer>
      <feFlood flood-color="#afa53c"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g transform="matrix(1, 0, 0, 1, -269.711182, 0)">
    <g transform="matrix(4.300354, 0, 0, -1.217598, 899.939453, 799.908386)" style="transform-origin: 95.9705px 154.066px;">
      <path d="M 95.97 76.841 L 176.472 231.292 L 15.469 231.292 L 95.97 76.841 Z" bx:shape="triangle 15.469 76.841 161.003 154.451 0.5 0 1@e226e17b" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
      <path d="M 94.753 134.012 L 131.513 203.224 L 57.993 203.224 L 94.753 134.012 Z" bx:shape="triangle 57.993 134.012 73.52 69.212 0.5 0 1@386d41bd" style="stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);"/>
    </g>
    <g transform="matrix(4.300354, 0, 0, 1.217598, 899.939453, 2.626526)" style="transform-origin: 95.9705px 154.066px;">
      <path d="M 95.97 76.841 L 176.472 231.292 L 15.469 231.292 L 95.97 76.841 Z" bx:shape="triangle 15.469 76.841 161.003 154.451 0.5 0 1@e226e17b" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
      <path d="M 94.753 134.012 L 131.513 203.224 L 57.993 203.224 L 94.753 134.012 Z" bx:shape="triangle 57.993 134.012 73.52 69.212 0.5 0 1@386d41bd" style="stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);"/>
    </g>
    <g transform="matrix(0, -3.978036, -1.316252, 0, 1344.052368, 408.611389)" style="transform-origin: 95.9705px 154.066px;">
      <path d="M 95.97 76.841 L 176.472 231.292 L 15.469 231.292 L 95.97 76.841 Z" bx:shape="triangle 15.469 76.841 161.003 154.451 0.5 0 1@e226e17b" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
      <path d="M 94.753 134.012 L 131.513 203.224 L 57.993 203.224 L 94.753 134.012 Z" bx:shape="triangle 57.993 134.012 73.52 69.212 0.5 0 1@386d41bd" style="stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);"/>
    </g>
    <g transform="matrix(0, -3.978036, 1.316252, 0, 482.171478, 408.611389)" style="transform-origin: 95.9705px 154.066px;">
      <path d="M 95.97 76.841 L 176.472 231.292 L 15.469 231.292 L 95.97 76.841 Z" bx:shape="triangle 15.469 76.841 161.003 154.451 0.5 0 1@e226e17b" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
      <path d="M 94.753 134.012 L 131.513 203.224 L 57.993 203.224 L 94.753 134.012 Z" bx:shape="triangle 57.993 134.012 73.52 69.212 0.5 0 1@386d41bd" style="stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);"/>
    </g>
    <path d="M 504.689 217.117 L 734.345 225.274 L 727.078 236.918 L 1287.33 236.918 L 1280.06 225.271 L 1509.72 217.115 L 1387.25 397.017 L 1381.74 388.186 L 1381.74 733.467 L 1502.66 911.104 L 1273.01 902.947 L 1284.81 884.031 L 715.485 884.031 L 727.292 902.949 L 497.636 911.107 L 620.101 731.205 L 626.816 741.965 L 626.816 396.524 L 504.689 217.117 Z" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 7.64; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
    <path d="M 119.147 172.789 L 165.37 262.028 L 72.923 262.028 L 119.147 172.789 Z" bx:shape="triangle 72.923 172.789 92.447 89.239 0.5 0 1@e6a03e5e" style="stroke: rgb(249, 255, 114); stroke-width: 7.64; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);" transform="matrix(-0.52946808, 0.84832986, -0.88409029, -0.47217163, 1654.14892578, 855.51068115)"/>
    <g transform="matrix(1, 0, 0, 1, 852.044128, 389.260101)">
      <text style="fill: rgb(250, 245, 102); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(&quot;#filter-2&quot;) url(&quot;#drop-shadow-filter-2&quot;);" transform="matrix(3.395972, 0, 0, 2.818273, -945.366292, -329.732032)" x="258.793" y="115.282">Triangle Engine</text>
    </g>
    <path d="M 119.147 172.79 L 165.37 262.029 L 72.923 262.029 L 119.147 172.79 Z" bx:shape="triangle 72.923 172.79 92.447 89.239 0.5 0 1@4634c4cc" style="stroke: rgb(249, 255, 114); stroke-width: 7.64; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);" transform="matrix(0.52946808, 0.84832986, 0.88409029, -0.47217163, 346.15226971, 855.51132524)"/>
    <path d="M 119.147 172.79 L 165.37 262.029 L 72.923 262.029 L 119.147 172.79 Z" bx:shape="triangle 72.923 172.79 92.447 89.239 0.5 0 1@4634c4cc" style="stroke: rgb(249, 255, 114); stroke-width: 7.64; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);" transform="matrix(-0.52946808, -0.84832986, -0.88409029, 0.47217163, 1661.19984211, 272.70995772)"/>
    <path d="M 119.147 172.789 L 165.37 262.028 L 72.923 262.028 L 119.147 172.789 Z" bx:shape="triangle 72.923 172.789 92.447 89.239 0.5 0 1@e6a03e5e" style="stroke: rgb(249, 255, 114); stroke-width: 7.64; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);" transform="matrix(0.52946808, -0.84832986, 0.88409029, 0.47217163, 353.20245361, 272.70993042)"/>
    <animate attributeName="display" values="none;inline" begin="-0.09s" dur="3s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/>
  </g>
  <g id="options" transform="matrix(1, 0, 0, 1, -265.872467, 3.838752)">
    <g transform="matrix(1.89495, 0, 0, 1.89495, 383.920959, 384.384674)" style="">
      <g>
        <rect x="192.509" y="42.594" width="278.912" height="137.972" rx="12" ry="12" style="fill: rgb(106, 94, 34); stroke-width: 6px; stroke: rgb(250, 240, 96); filter: url(&quot;#drop-shadow-filter-1&quot;) url(&quot;#inner-shadow-filter-1&quot;);"/>
        <rect x="234.155" y="74.197" width="196.386" height="74.582" rx="12" ry="12" style="stroke-width: 5.57402; stroke: rgb(250, 240, 96); filter: url(&quot;#filter-1&quot;); vector-effect: non-scaling-stroke; fill: rgb(249, 254, 112);"/>
        <text style="fill: rgb(108, 96, 34); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(&quot;#drop-shadow-filter-3&quot;);" transform="matrix(1.795923, 0, 0, 1.517241, -209.738663, -50.400024)" x="258.793" y="115.282">OPTIONS</text>
      </g>
    </g>
    <animate attributeName="display" values="none;inline" begin="-0.07s" dur="3s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/>
  </g>
  <g transform="matrix(-1, 0, 0, -1, 822.56665, 798.849915)" style="">
    <path d="M 95.97 76.841 L 176.472 231.292 L 15.469 231.292 L 95.97 76.841 Z" bx:shape="triangle 15.469 76.841 161.003 154.451 0.5 0 1@e226e17b" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
    <path d="M 94.753 134.012 L 131.513 203.224 L 57.993 203.224 L 94.753 134.012 Z" bx:shape="triangle 57.993 134.012 73.52 69.212 0.5 0 1@386d41bd" style="stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -180" begin="0s" dur="1.3s" fill="freeze" keyTimes="0; 1"/>
    <animate attributeName="opacity" values="1;0" begin="2.04s" dur="0.98s" fill="freeze" keyTimes="0; 1"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 630.62561, 331.089081)">
    <path d="M 95.97 76.841 L 176.472 231.292 L 15.469 231.292 L 95.97 76.841 Z" bx:shape="triangle 15.469 76.841 161.003 154.451 0.5 0 1@e226e17b" style="fill: rgb(99, 89, 33); stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;);"/>
    <path d="M 94.753 134.012 L 131.513 203.224 L 57.993 203.224 L 94.753 134.012 Z" bx:shape="triangle 57.993 134.012 73.52 69.212 0.5 0 1@386d41bd" style="stroke: rgb(249, 255, 114); stroke-width: 6; filter: url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-0&quot;); fill: rgb(249, 255, 114);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -250" begin="0s" dur="1.3s" fill="freeze" keyTimes="0; 1"/>
    <animate attributeName="opacity" values="1;0" begin="2.01s" dur="1s" fill="freeze" keyTimes="0; 1"/>
  </g>
</svg>
    `;

    // SVG LIMPIO PARA INYECCIÓN
    const OPTIONS_MENU_SVG = `
<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFA0;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B8860B;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="darkBase" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a4a2a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2a2a15;stop-opacity:1" />
    </linearGradient>

    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6b6b3b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3d3d22;stop-opacity:1" />
    </linearGradient>

    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <style>
      .title { font-family: 'Courier New', monospace; font-weight: bold; font-size: 32px; fill: #FFFFA0; text-anchor: middle; filter: url(#neonGlow); }
      .btn-text { font-family: sans-serif; font-weight: bold; font-size: 16px; fill: #FFD700; text-anchor: middle; pointer-events: none; }
      .btn-rect { fill: url(#btnGrad); stroke: url(#goldGrad); stroke-width: 2; cursor: pointer; transition: all 0.3s; }
      .btn-rect:hover { fill: #8a8a4b; stroke: #FFF; stroke-width: 3; filter: url(#neonGlow); }
    </style>
  </defs>

  <polygon points="100,50 700,50 750,150 750,450 700,550 100,550 50,450 50,150"
           fill="url(#darkBase)" stroke="url(#goldGrad)" stroke-width="4" />

  <path d="M 50 150 L 150 150 L 180 180" fill="none" stroke="#6b6b3b" stroke-width="2"/>
  <path d="M 750 150 L 650 150 L 620 180" fill="none" stroke="#6b6b3b" stroke-width="2"/>
  <path d="M 50 450 L 150 450 L 180 420" fill="none" stroke="#6b6b3b" stroke-width="2"/>
  <path d="M 750 450 L 650 450 L 620 420" fill="none" stroke="#6b6b3b" stroke-width="2"/>

  <text x="400" y="110" class="title">OPTIONS MENU</text>
  <line x1="250" y1="125" x2="550" y2="125" stroke="#FFD700" stroke-width="2" opacity="0.5"/>

  <g transform="translate(200, 180)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">AURUM CORE</text>
  </g>

  <g transform="translate(200, 245)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">SOLAR CIRCUIT</text>
  </g>

  <g transform="translate(200, 310)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">DUNE DRIFTER</text>
  </g>

  <g transform="translate(200, 375)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">TRIANGLE TACTICS</text>
  </g>

  <g transform="translate(420, 180)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">GILDED ROGUE</text>
  </g>

  <g transform="translate(420, 245)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">AMBER ECHO</text>
  </g>

  <g transform="translate(420, 310)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">HEXA-VAULT</text>
  </g>

  <g transform="translate(420, 375)">
    <path d="M 0,10 L 10,0 L 190,0 L 200,10 L 200,40 L 190,50 L 10,50 L 0,40 Z" class="btn-rect" />
    <text x="100" y="32" class="btn-text">LIGHT PRISM</text>
  </g>

  <g transform="translate(350, 480)">
     <rect x="0" y="0" width="100" height="30" rx="5" fill="#2a2a15" stroke="#FFD700" stroke-width="1" />
     <text x="50" y="20" font-family="sans-serif" font-size="12" fill="#FFD700" text-anchor="middle">BACK</text>
  </g>

</svg>
    `;

    // GAME 1: AURUM CORE (Modificado para usar loops globales y asignar audio context)
    const GAME_AURUM_CORE_HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aurum Core - Triangle Engine</title>
    <style>
        body { margin: 0; padding: 0; background: radial-gradient(circle, #4a4a2a 0%, #1a1a0d 100%); overflow: hidden; font-family: 'Courier New', Courier, monospace; color: #FFD700; user-select: none; }
        #ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; box-sizing: border-box; padding: 20px; }
        .back-btn { pointer-events: auto; position: absolute; top: 20px; left: 20px; background: rgba(0, 0, 0, 0.5); border: 2px solid #FFD700; color: #FFD700; padding: 10px 20px; font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.3s; clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%); text-decoration: none; display: inline-block; }
        .back-btn:hover { background: #FFD700; color: #000; box-shadow: 0 0 15px #FFD700; }
        .hud { position: absolute; top: 20px; right: 20px; text-align: right; text-shadow: 0 0 5px #FFD700; }
        .hud h2 { margin: 0; font-size: 24px; }
        .hud p { margin: 5px 0; font-size: 14px; color: #FFFFA0; }
        #game-over { display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.9); border: 2px solid #FFD700; padding: 40px; text-align: center; pointer-events: auto; box-shadow: 0 0 30px rgba(255, 215, 0, 0.3); }
        button.restart { background: #FFD700; border: none; padding: 10px 30px; font-weight: bold; margin-top: 20px; cursor: pointer; clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%); }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <div id="ui-layer">
        <a href="#" class="back-btn">&#9664; BACK</a>
        <div class="hud"><h2 id="scoreDisplay">SCORE: 0</h2><p id="goldDisplay">GOLD: 100</p><p id="waveDisplay">WAVE: 1</p><p style="font-size: 10px; opacity: 0.7;">CLICK TO PLACE TURRET (50G)</p></div>
        <div id="game-over"><h1>SYSTEM FAILURE</h1><p>THE CORE HAS BEEN BREACHED</p><h3 id="finalScore">SCORE: 0</h3><button class="restart" onclick="location.reload()">REBOOT SYSTEM</button></div>
    </div>
    <script>
        const DrawariaMusicEngine = (function() {
            'use strict';
            let audioContext;
            let mainGainNode;
            const noteFrequencies = { 'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88 };
            function initAudio() {
                if (!audioContext) {
                    try {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                        window.currentAudioContext = audioContext; // Register for cleanup
                        mainGainNode = audioContext.createGain();
                        mainGainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                        mainGainNode.connect(audioContext.destination);
                    } catch (e) { console.error('Audio API not supported'); }
                }
            }
            function playGameSound(note, duration = 0.1, type = 'sine', volume = 0.4) {
                initAudio();
                if (!audioContext) return;
                const freq = noteFrequencies[note];
                if (!freq) return;
                const oscillator = audioContext.createOscillator();
                const noteGain = audioContext.createGain();
                oscillator.type = type;
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                const now = audioContext.currentTime;
                noteGain.gain.setValueAtTime(0, now);
                noteGain.gain.linearRampToValueAtTime(volume, now + 0.01);
                noteGain.gain.linearRampToValueAtTime(0, now + duration);
                oscillator.connect(noteGain);
                noteGain.connect(mainGainNode);
                oscillator.start(now);
                oscillator.stop(now + duration);
            }
            return { playGameSound: playGameSound, initAudio: initAudio };
        })();
        document.addEventListener('mousedown', DrawariaMusicEngine.initAudio, { once: true });
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        window.addEventListener('resize', resize);
        resize();
        const gameState = { gold: 100, score: 0, wave: 1, gameOver: false, coreHp: 100 };
        const entities = { turrets: [], enemies: [], projectiles: [], particles: [] };
        class Core {
            draw() {
                ctx.shadowBlur = 20; ctx.shadowColor = "#FFD700"; ctx.fillStyle = "#FFD700"; ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 20 + Math.sin(Date.now()/200)*2, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = "red"; ctx.fillRect(canvas.width/2 - 20, canvas.height/2 + 30, 40, 5); ctx.fillStyle = "#0f0"; ctx.fillRect(canvas.width/2 - 20, canvas.height/2 + 30, 40 * (gameState.coreHp/100), 5);
            }
        }
        class Turret {
            constructor(x, y) { this.x = x; this.y = y; this.range = 150; this.cooldown = 0; this.maxCooldown = 30; this.angle = 0; }
            update() {
                if (this.cooldown > 0) this.cooldown--;
                let nearest = null; let minDist = Infinity;
                entities.enemies.forEach(e => { const d = Math.hypot(e.x - this.x, e.y - this.y); if (d < this.range && d < minDist) { minDist = d; nearest = e; } });
                if (nearest) { this.angle = Math.atan2(nearest.y - this.y, nearest.x - this.x); if (this.cooldown <= 0) { this.shoot(nearest); this.cooldown = this.maxCooldown; } }
            }
            shoot(target) { DrawariaMusicEngine.playGameSound('A#', 0.05, 'square', 0.2); entities.projectiles.push(new Projectile(this.x, this.y, target)); }
            draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.fillStyle = "#6b6b3b"; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill(); ctx.rotate(this.angle); ctx.fillStyle = "#FFFFA0"; ctx.shadowBlur = 10; ctx.shadowColor = "#FFD700"; ctx.fillRect(-5, -5, 20, 10); ctx.restore(); ctx.strokeStyle = "rgba(255, 215, 0, 0.1)"; ctx.beginPath(); ctx.arc(this.x, this.y, this.range, 0, Math.PI*2); ctx.stroke(); }
        }
        class Enemy {
            constructor() {
                const side = Math.floor(Math.random() * 4);
                if (side === 0) { this.x = Math.random() * canvas.width; this.y = -20; }
                if (side === 1) { this.x = canvas.width + 20; this.y = Math.random() * canvas.height; }
                if (side === 2) { this.x = Math.random() * canvas.width; this.y = canvas.height + 20; }
                if (side === 3) { this.x = -20; this.y = Math.random() * canvas.height; }
                this.speed = 1 + (gameState.wave * 0.1); this.hp = 2 + Math.floor(gameState.wave / 2); this.size = 10;
            }
            update() {
                const dx = (canvas.width/2) - this.x; const dy = (canvas.height/2) - this.y; const dist = Math.hypot(dx, dy);
                this.x += (dx / dist) * this.speed; this.y += (dy / dist) * this.speed;
                if (dist < 30) { gameState.coreHp -= 10; this.hp = 0; createExplosion(this.x, this.y, "red"); DrawariaMusicEngine.playGameSound('C#', 0.3, 'sawtooth', 0.8); }
            }
            draw() { ctx.save(); ctx.translate(this.x, this.y); const angle = Math.atan2((canvas.height/2) - this.y, (canvas.width/2) - this.x); ctx.rotate(angle); ctx.fillStyle = "#800000"; ctx.strokeStyle = "#ff4444"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-10, 10); ctx.lineTo(-10, -10); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
        }
        class Projectile {
            constructor(x, y, target) { this.x = x; this.y = y; this.target = target; this.speed = 8; this.active = true; }
            update() {
                if (!this.target || this.target.hp <= 0) { this.active = false; return; }
                const dx = this.target.x - this.x; const dy = this.target.y - this.y; const dist = Math.hypot(dx, dy);
                if (dist < this.speed) { this.x = this.target.x; this.y = this.target.y; this.hit(); } else { this.x += (dx / dist) * this.speed; this.y += (dy / dist) * this.speed; }
            }
            hit() { this.active = false; this.target.hp--; DrawariaMusicEngine.playGameSound('E', 0.05, 'sine', 0.15); if (this.target.hp <= 0) { gameState.score += 10; gameState.gold += 5; updateUI(); createExplosion(this.target.x, this.target.y, "#FFD700"); DrawariaMusicEngine.playGameSound('F#', 0.1, 'sawtooth', 0.5); } }
            draw() { ctx.fillStyle = "#FFF"; ctx.shadowBlur = 5; ctx.shadowColor = "#FFF"; ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0; }
        }
        class Particle {
            constructor(x, y, color) { this.x = x; this.y = y; this.color = color; this.life = 1.0; this.vx = (Math.random() - 0.5) * 5; this.vy = (Math.random() - 0.5) * 5; }
            update() { this.x += this.vx; this.y += this.vy; this.life -= 0.05; }
            draw() { ctx.globalAlpha = this.life; ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, 3, 3); ctx.globalAlpha = 1.0; }
        }
        function createExplosion(x, y, color) { for(let i=0; i<10; i++) { entities.particles.push(new Particle(x, y, color)); } }
        const core = new Core();
        function update() {
            if (gameState.gameOver) { if (!gameState.gameOverSoundPlayed) { DrawariaMusicEngine.playGameSound('G', 3.0, 'square', 0.9); gameState.gameOverSoundPlayed = true; } return; }
            if (Math.random() < 0.02 + (gameState.wave * 0.005)) { entities.enemies.push(new Enemy()); }
            if (gameState.score > gameState.wave * 500) { gameState.wave++; DrawariaMusicEngine.playGameSound('A', 0.1, 'sine', 0.3); updateUI(); }
            entities.turrets.forEach(t => t.update());
            entities.projectiles.forEach((p, index) => { p.update(); if (!p.active) entities.projectiles.splice(index, 1); });
            entities.enemies.forEach((e, index) => { e.update(); if (e.hp <= 0) entities.enemies.splice(index, 1); });
            entities.particles.forEach((p, index) => { p.update(); if (p.life <= 0) entities.particles.splice(index, 1); });
            if (gameState.coreHp <= 0) { gameState.gameOver = true; document.getElementById('game-over').style.display = 'block'; document.getElementById('finalScore').innerText = 'SCORE: ' + gameState.score; }
        }
        function draw() {
            ctx.fillStyle = 'rgba(42, 42, 21, 0.3)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            core.draw(); entities.turrets.forEach(t => t.draw()); entities.enemies.forEach(e => e.draw()); entities.projectiles.forEach(p => p.draw()); entities.particles.forEach(p => p.draw());
        }
        function loop() {
            if (!document.getElementById('gameCanvas')) return; // Safety check
            update(); draw();
            window.currentGameAnimationFrame = requestAnimationFrame(loop);
        }
        canvas.addEventListener('mousedown', (e) => {
            if (gameState.gameOver) return;
            if (gameState.gold >= 50) {
                const rect = canvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const distToCore = Math.hypot(x - canvas.width/2, y - canvas.height/2);
                if (distToCore > 50) { entities.turrets.push(new Turret(x, y)); gameState.gold -= 50; createExplosion(x, y, "#FFFFA0"); updateUI(); DrawariaMusicEngine.playGameSound('C', 0.2, 'triangle', 0.7); }
            }
        });
        function updateUI() { document.getElementById('scoreDisplay').innerText = 'SCORE: ' + gameState.score; document.getElementById('goldDisplay').innerText = 'GOLD: ' + gameState.gold; document.getElementById('waveDisplay').innerText = 'WAVE: ' + gameState.wave; }
        window.currentGameAnimationFrame = requestAnimationFrame(loop);
    </script>
</body>
</html>
    `;

    // GAME 2: SOLAR CIRCUIT
    const GAME_SOLAR_CIRCUIT_HTML = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Solar Circuit</title>
<style>body{margin:0;padding:0;background-color:#1a1a0d;background-image:linear-gradient(rgba(255,215,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.05) 1px,transparent 1px);background-size:40px 40px;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;}
.back-btn{position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.8);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}
#game-container{position:relative;border:4px solid #4a4a2a;box-shadow:0 0 30px rgba(0,0,0,0.8);background:#000;}canvas{display:block;cursor:pointer;}
#ui-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between;padding:20px;box-sizing:border-box;}
.hud-text{text-shadow:0 0 5px #FFD700;font-size:20px;font-weight:bold;}
#start-screen,#level-complete{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;pointer-events:auto;}
#level-complete{display:none;}h1{font-size:40px;margin-bottom:10px;color:#FFFFA0;text-shadow:0 0 10px #FFD700;}
.action-btn{margin-top:20px;padding:15px 40px;font-size:24px;background:#FFD700;border:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);cursor:pointer;font-weight:bold;color:#2a2a15;transition:0.2s;}.action-btn:hover{transform:scale(1.05);background:#FFF;box-shadow:0 0 20px #FFD700;}</style></head>
<body><a href="#" class="back-btn">&#9664; BACK</a><div id="game-container"><canvas id="gameCanvas" width="600" height="600"></canvas><div id="ui-overlay"><div class="hud-text">LEVEL: <span id="levelDisplay">1</span></div><div class="hud-text" style="text-align:right;">POWER: <span id="powerDisplay">0%</span></div></div><div id="start-screen"><h1>SOLAR CIRCUIT</h1><p style="color:#ccc;">CLICK TO INITIALIZE SYSTEMS</p><button class="action-btn" onclick="startGame()">ENGAGE</button></div><div id="level-complete"><h1>CIRCUIT STABLE</h1><p style="color:#FFD700;">POWER RESTORED</p><button class="action-btn" onclick="nextLevel()">NEXT SECTOR</button></div></div>
<script>
const AudioEngine={ctx:null,isMuted:false,bgOsc:null,bgGain:null,init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},startMusic:function(){if(!this.ctx)this.init();this.bgOsc=this.ctx.createOscillator();this.bgGain=this.ctx.createGain();this.bgOsc.type='sawtooth';this.bgOsc.frequency.value=50;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=200;const lfo=this.ctx.createOscillator();lfo.type='sine';lfo.frequency.value=0.2;const lfoGain=this.ctx.createGain();lfoGain.gain.value=100;lfo.connect(lfoGain);lfoGain.connect(filter.frequency);this.bgOsc.connect(filter);filter.connect(this.bgGain);this.bgGain.connect(this.ctx.destination);this.bgGain.gain.value=0.05;this.bgOsc.start();lfo.start();},playClick:function(){if(!this.ctx)return;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='square';osc.frequency.setValueAtTime(800,this.ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(100,this.ctx.currentTime+0.1);gain.gain.setValueAtTime(0.1,this.ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+0.1);osc.connect(gain);gain.connect(this.ctx.destination);osc.start();osc.stop(this.ctx.currentTime+0.1);},playWin:function(){if(!this.ctx)return;const now=this.ctx.currentTime;[440,554,659,880].forEach((freq,i)=>{const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(0,now+i*0.1);gain.gain.linearRampToValueAtTime(0.1,now+i*0.1+0.05);gain.gain.exponentialRampToValueAtTime(0.001,now+i*0.1+0.5);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(now+i*0.1);osc.stop(now+i*0.1+0.6);});}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const GRID_SIZE=6;const TILE_SIZE=canvas.width/GRID_SIZE;let level=1;let grid=[];let isLevelComplete=false;
const TILE_TYPES={LINE:[1,0,1,0],CORNER:[1,1,0,0],TEE:[1,1,1,0],CROSS:[1,1,1,1],END:[1,0,0,0],SOURCE:[1,1,1,1]};
class Tile{constructor(x,y,typeKey){this.x=x;this.y=y;this.typeKey=typeKey;this.connections=[...TILE_TYPES[typeKey]];this.rotation=0;this.powered=false;this.isSource=(typeKey==='SOURCE');}rotate(){this.rotation=(this.rotation+1)%4;this.connections.unshift(this.connections.pop());}setRotation(r){this.rotation=0;this.connections=[...TILE_TYPES[this.typeKey]];for(let i=0;i<r;i++)this.rotate();}}
function startGame(){document.getElementById('start-screen').style.display='none';AudioEngine.startMusic();initLevel();}
function initLevel(){document.getElementById('level-complete').style.display='none';isLevelComplete=false;generateSolvableGrid();draw();checkPowerFlow();}
function generateSolvableGrid(){grid=[];for(let y=0;y<GRID_SIZE;y++){let row=[];for(let x=0;x<GRID_SIZE;x++){if(x===Math.floor(GRID_SIZE/2)&&y===Math.floor(GRID_SIZE/2)){row.push(new Tile(x,y,'SOURCE'));}else{const rand=Math.random();let type='LINE';if(rand>0.4)type='CORNER';if(rand>0.7)type='TEE';if(rand>0.9)type='CROSS';if(x===0||x===GRID_SIZE-1||y===0||y===GRID_SIZE-1){if(Math.random()>0.8)type='END';}let t=new Tile(x,y,type);let randomRot=Math.floor(Math.random()*4);t.setRotation(randomRot);row.push(t);}}grid.push(row);}}
function getTile(x,y){if(x<0||x>=GRID_SIZE||y<0||y>=GRID_SIZE)return null;return grid[y][x];}
function checkPowerFlow(){let totalTiles=0;let poweredTiles=0;for(let y=0;y<GRID_SIZE;y++){for(let x=0;x<GRID_SIZE;x++){grid[y][x].powered=false;totalTiles++;}}let source=grid[Math.floor(GRID_SIZE/2)][Math.floor(GRID_SIZE/2)];source.powered=true;let queue=[source];let visited=new Set();visited.add(source.x+","+source.y);while(queue.length>0){let current=queue.shift();poweredTiles++;const directions=[{dx:0,dy:-1,idx:0,opp:2},{dx:1,dy:0,idx:1,opp:3},{dx:0,dy:1,idx:2,opp:0},{dx:-1,dy:0,idx:3,opp:1}];directions.forEach(dir=>{if(current.connections[dir.idx]===1){let neighbor=getTile(current.x+dir.dx,current.y+dir.dy);if(neighbor){if(neighbor.connections[dir.opp]===1){if(!visited.has(neighbor.x+","+neighbor.y)){neighbor.powered=true;visited.add(neighbor.x+","+neighbor.y);queue.push(neighbor);}}}}});}let allEndsPowered=true;let endsCount=0;for(let y=0;y<GRID_SIZE;y++){for(let x=0;x<GRID_SIZE;x++){if(grid[y][x].typeKey==='END'){endsCount++;if(!grid[y][x].powered)allEndsPowered=false;}}}let percent=Math.floor((poweredTiles/totalTiles)*100);document.getElementById('powerDisplay').innerText=percent+"%";if(endsCount>0&&allEndsPowered&&!isLevelComplete){levelComplete();}}
function levelComplete(){isLevelComplete=true;AudioEngine.playWin();setTimeout(()=>{document.getElementById('level-complete').style.display='flex';},500);}
function nextLevel(){level++;document.getElementById('levelDisplay').innerText=level;initLevel();}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let y=0;y<GRID_SIZE;y++){for(let x=0;x<GRID_SIZE;x++){drawTile(grid[y][x]);}}}
function drawTile(tile){const px=tile.x*TILE_SIZE;const py=tile.y*TILE_SIZE;const cx=px+TILE_SIZE/2;const cy=py+TILE_SIZE/2;ctx.save();ctx.translate(cx,cy);ctx.strokeStyle="#333";ctx.strokeRect(-TILE_SIZE/2,-TILE_SIZE/2,TILE_SIZE,TILE_SIZE);ctx.rotate(tile.rotation*(Math.PI/2));if(tile.powered){ctx.strokeStyle="#FFD700";ctx.lineWidth=6;ctx.shadowBlur=15;ctx.shadowColor="#FFD700";ctx.fillStyle="#FFFFA0";}else{ctx.strokeStyle="#555533";ctx.lineWidth=4;ctx.shadowBlur=0;ctx.fillStyle="#4a4a2a";}ctx.beginPath();const baseConns=TILE_TYPES[tile.typeKey];if(baseConns[0]){ctx.moveTo(0,0);ctx.lineTo(0,-TILE_SIZE/2+5);}if(baseConns[1]){ctx.moveTo(0,0);ctx.lineTo(TILE_SIZE/2-5,0);}if(baseConns[2]){ctx.moveTo(0,0);ctx.lineTo(0,TILE_SIZE/2-5);}if(baseConns[3]){ctx.moveTo(0,0);ctx.lineTo(-TILE_SIZE/2+5,0);}ctx.stroke();ctx.beginPath();if(tile.isSource){ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();}else if(tile.typeKey==='END'){ctx.rect(-10,-10,20,20);ctx.fill();}else{ctx.arc(0,0,5,0,Math.PI*2);ctx.stroke();}ctx.restore();}
canvas.addEventListener('mousedown',(e)=>{if(isLevelComplete)return;const rect=canvas.getBoundingClientRect();const x=Math.floor((e.clientX-rect.left)/TILE_SIZE);const y=Math.floor((e.clientY-rect.top)/TILE_SIZE);const tile=getTile(x,y);if(tile&&!tile.isSource){tile.rotate();AudioEngine.playClick();checkPowerFlow();draw();}});
function animLoop(){
    if(!document.getElementById('gameCanvas')) return;
    if(Math.random()>0.95&&AudioEngine.ctx) draw();
    window.currentGameAnimationFrame = requestAnimationFrame(animLoop);
}
window.currentGameAnimationFrame = requestAnimationFrame(animLoop);
</script></body></html>`;

    // GAME 3: DUNE DRIFTER
    const GAME_DUNE_DRIFTER_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Dune Drifter</title><style>body{margin:0;padding:0;background-color:#0d0d05;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;}#ui-layer{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;}.back-btn{pointer-events:auto;position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.6);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}.hud{position:absolute;top:20px;right:20px;text-align:right;text-shadow:0 0 10px #FFD700;}.hud h2{margin:0;font-size:32px;letter-spacing:2px;}.hud p{margin:0;font-size:14px;color:#FFFFA0;opacity:0.8;}#start-screen,#game-over{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,5,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;z-index:50;}#game-over{display:none;}h1{font-size:60px;color:#FFD700;text-shadow:0 0 20px #FFD700;margin-bottom:10px;text-transform:uppercase;font-style:italic;}.btn-action{margin-top:30px;padding:15px 50px;font-size:24px;background:transparent;color:#FFD700;border:2px solid #FFD700;cursor:pointer;font-family:inherit;font-weight:bold;transition:0.2s;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);}.btn-action:hover{background:#FFD700;color:#000;box-shadow:0 0 30px #FFD700;}.scanlines{position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0) 50%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.2));background-size:100% 4px;pointer-events:none;opacity:0.3;z-index:10;}</style></head>
<body><div class="scanlines"></div><canvas id="gameCanvas"></canvas><div id="ui-layer"><a href="#" class="back-btn">&#9664; BACK</a><div class="hud"><h2 id="score">00000</h2><p>DISTANCE</p><p id="speed" style="margin-top:5px;color:#b8860b">SPD: 100%</p></div><div id="start-screen"><h1>DUNE DRIFTER</h1><p>USE [LEFT] / [RIGHT] ARROWS TO STEER</p><button class="btn-action" onclick="startGame()">IGNITION</button></div><div id="game-over"><h1 style="color:#ff4444;text-shadow:0 0 20px red;">CRASHED</h1><p>FINAL DISTANCE: <span id="finalScore">0</span></p><button class="btn-action" onclick="resetGame()">RETRY</button></div></div>
<script>
const AudioSys={ctx:null,isPlaying:false,engineOsc:null,engineGain:null,nextNoteTime:0,noteIndex:0,tempo:0.15,notes:[110,110,220,110,130,110,164,146],init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},startEngine:function(){if(!this.ctx)this.init();this.engineOsc=this.ctx.createOscillator();this.engineGain=this.ctx.createGain();this.engineOsc.type='sawtooth';this.engineOsc.frequency.value=60;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=200;this.engineOsc.connect(filter);filter.connect(this.engineGain);this.engineGain.connect(this.ctx.destination);this.engineGain.gain.value=0.1;this.engineOsc.start();this.isPlaying=true;this.scheduleMusic();},scheduleMusic:function(){if(!this.isPlaying)return;const secondsPerBeat=this.tempo;const currentTime=this.ctx.currentTime;if(this.nextNoteTime<currentTime+0.1){this.playNote(this.notes[this.noteIndex],this.nextNoteTime);this.nextNoteTime+=secondsPerBeat;this.noteIndex=(this.noteIndex+1)%this.notes.length;}setTimeout(()=>this.scheduleMusic(),25);},playNote:function(freq,time){const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='square';osc.frequency.value=freq;gain.gain.setValueAtTime(0.05,time);gain.gain.exponentialRampToValueAtTime(0.001,time+0.1);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(time);osc.stop(time+0.15);},stop:function(){this.isPlaying=false;if(this.engineOsc){this.engineOsc.stop();this.engineOsc=null;}},crash:function(){if(!this.ctx)return;const bufferSize=this.ctx.sampleRate*1.0;const buffer=this.ctx.createBuffer(1,bufferSize,this.ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++){data[i]=Math.random()*2-1;}const noise=this.ctx.createBufferSource();noise.buffer=buffer;const gain=this.ctx.createGain();gain.gain.setValueAtTime(0.5,this.ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+1.0);noise.connect(gain);gain.connect(this.ctx.destination);noise.start();this.stop();}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}window.addEventListener('resize',resize);resize();let gameRunning=false;let score=0;let speed=0;let playerX=0;const obstacles=[];let gridOffset=0;const MAX_SPEED=2.5;const ACCEL=0.005;const INPUT_SENSITIVITY=0.08;const keys={ArrowLeft:false,ArrowRight:false};window.addEventListener('keydown',e=>{if(keys.hasOwnProperty(e.code))keys[e.code]=true;});window.addEventListener('keyup',e=>{if(keys.hasOwnProperty(e.code))keys[e.code]=false;});window.addEventListener('touchstart',e=>{if(e.touches[0].clientX<window.innerWidth/2)keys.ArrowLeft=true;else keys.ArrowRight=true;});window.addEventListener('touchend',()=>{keys.ArrowLeft=false;keys.ArrowRight=false;});function startGame(){document.getElementById('start-screen').style.display='none';document.getElementById('game-over').style.display='none';score=0;speed=0.5;playerX=0;obstacles.length=0;gameRunning=true;AudioSys.startEngine();loop();}function resetGame(){startGame();}function spawnObstacle(){const type=Math.random()>0.5?'PYRAMID':'BLOCK';obstacles.push({x:(Math.random()*4)-2,z:2.0,type:type,active:true});}function update(){if(!gameRunning)return;speed=Math.min(speed+0.0005,MAX_SPEED);score+=Math.floor(speed*10);if(keys.ArrowLeft)playerX-=INPUT_SENSITIVITY;if(keys.ArrowRight)playerX+=INPUT_SENSITIVITY;if(playerX<-1.5)playerX=-1.5;if(playerX>1.5)playerX=1.5;gridOffset=(gridOffset+speed*0.05)%1;if(Math.random()<0.02*speed)spawnObstacle();for(let i=obstacles.length-1;i>=0;i--){let ob=obstacles[i];ob.z-=(0.01*speed);if(ob.z<0.1&&ob.z>-0.1){if(Math.abs(ob.x-playerX)<0.3){gameOver();}}if(ob.z<-0.5)obstacles.splice(i,1);}document.getElementById('score').innerText=score.toString().padStart(6,'0');document.getElementById('speed').innerText='SPD: '+Math.floor((speed/MAX_SPEED)*100)+'%';}
function draw(){const h=canvas.height;const w=canvas.width;const horizon=h*0.45;ctx.fillStyle='#111';ctx.fillRect(0,0,w,horizon);ctx.fillStyle='#FFD700';ctx.shadowBlur=40;ctx.shadowColor='#FFD700';ctx.beginPath();ctx.arc(w/2,horizon-50,40,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;let grad=ctx.createLinearGradient(0,horizon,0,h);grad.addColorStop(0,'#2a2a15');grad.addColorStop(1,'#0f0f05');ctx.fillStyle=grad;ctx.fillRect(0,horizon,w,h-horizon);ctx.strokeStyle='rgba(255, 215, 0, 0.3)';ctx.lineWidth=1;const perspectiveOffset=playerX*-200;for(let i=-10;i<=10;i++){let xStart=(w/2)+(i*100)+(perspectiveOffset*0.1);let xEnd=(w/2)+(i*600)+perspectiveOffset;ctx.beginPath();ctx.moveTo(xStart,horizon);ctx.lineTo(xEnd,h);ctx.stroke();}let zPos=gridOffset;while(zPos<10){let p=1/zPos;let yLine=horizon+(h-horizon)*p;if(yLine<h&&yLine>horizon){ctx.strokeStyle=\`rgba(255, 215, 0, \${p})\`;ctx.beginPath();ctx.moveTo(0,yLine);ctx.lineTo(w,yLine);ctx.stroke();}zPos+=0.2;}obstacles.sort((a,b)=>b.z-a.z);obstacles.forEach(ob=>{if(ob.z<=0)return;const scale=1/ob.z;const screenX=(w/2)+((ob.x-playerX)*(w/2))*scale;const screenY=horizon+((h-horizon)*0.2)*scale;const size=30*scale;ctx.globalAlpha=Math.min(1,scale*0.5);if(ob.type==='PYRAMID'){ctx.fillStyle='#6b6b3b';ctx.strokeStyle='#FFD700';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(screenX,screenY-size*2);ctx.lineTo(screenX+size,screenY);ctx.lineTo(screenX-size,screenY);ctx.closePath();ctx.fill();ctx.stroke();}else{ctx.fillStyle='#800000';ctx.strokeStyle='#ff4444';ctx.lineWidth=2;ctx.fillRect(screenX-size,screenY-size,size*2,size);ctx.strokeRect(screenX-size,screenY-size,size*2,size);}ctx.globalAlpha=1.0;});const shipX=w/2;const shipY=h-80;ctx.fillStyle=\`rgba(0, 255, 255, \${0.5+Math.random()*0.5})\`;ctx.beginPath();ctx.moveTo(shipX-10,shipY+20);ctx.lineTo(shipX+10,shipY+20);ctx.lineTo(shipX,shipY+40+(Math.random()*20));ctx.fill();ctx.fillStyle='#111';ctx.strokeStyle='#FFD700';ctx.shadowBlur=15;ctx.shadowColor='#FFD700';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(shipX,shipY);ctx.lineTo(shipX+25,shipY+30);ctx.lineTo(shipX,shipY+20);ctx.lineTo(shipX-25,shipY+30);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;}
function gameOver(){gameRunning=false;AudioSys.crash();document.getElementById('game-over').style.display='flex';document.getElementById('finalScore').innerText=Math.floor(score);}
function loop(){
    if (!document.getElementById('gameCanvas')) return;
    if(gameRunning) window.currentGameAnimationFrame = requestAnimationFrame(loop);
    update(); draw();
}
</script></body></html>`;

    // GAME 4: TRIANGLE TACTICS
    const GAME_TRIANGLE_TACTICS_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Triangle Tactics</title><style>body{margin:0;padding:0;background-color:#050500;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;}.back-btn{position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.8);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;transition:0.3s;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}#game-container{position:relative;box-shadow:0 0 50px rgba(74,74,42,0.5);border:2px solid #4a4a2a;}canvas{display:block;cursor:crosshair;}#ui-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:flex;justify-content:space-between;padding:10px 20px;box-sizing:border-box;}.score-box{background:rgba(0,0,0,0.6);padding:10px 20px;border:1px solid #FFD700;font-size:20px;font-weight:bold;text-shadow:0 0 5px #FFD700;}#turn-indicator{position:absolute;bottom:20px;width:100%;text-align:center;font-size:24px;font-weight:bold;text-shadow:0 0 10px #FFD700;transition:color 0.3s;}#menu-screen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,5,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;z-index:50;}h1{color:#FFD700;font-size:48px;margin-bottom:0px;text-shadow:0 0 20px #FFD700;}p{color:#FFFFA0;opacity:0.7;margin-bottom:30px;}.btn-start{background:transparent;color:#FFD700;border:2px solid #FFD700;padding:15px 40px;font-size:24px;cursor:pointer;font-family:inherit;font-weight:bold;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);transition:0.2s;}.btn-start:hover{background:#FFD700;color:#000;box-shadow:0 0 20px #FFD700;}</style></head>
<body><a href="#" class="back-btn">&#9664; BACK</a><div id="game-container"><canvas id="gameCanvas" width="600" height="600"></canvas><div id="ui-overlay"><div class="score-box" style="color:#FFD700">PLAYER: <span id="scoreP1">2</span></div><div class="score-box" style="color:#ff4444;border-color:#ff4444;">CPU: <span id="scoreP2">2</span></div></div><div id="turn-indicator">PLAYER TURN</div><div id="menu-screen"><h1>TRIANGLE TACTICS</h1><p>CONQUER THE GRID. CLONE (1 STEP) OR JUMP (2 STEPS).</p><button class="btn-start" onclick="initGame()">DEPLOY UNITS</button><h2 id="winnerText" style="display:none;margin-top:20px;"></h2></div></div>
<script>
const AudioSys={ctx:null,init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},playTone:function(freq,type,duration,vol){if(!this.ctx)return;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,this.ctx.currentTime);gain.gain.setValueAtTime(vol,this.ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+duration);osc.connect(gain);gain.connect(this.ctx.destination);osc.start();osc.stop(this.ctx.currentTime+duration);},playSelect:function(){this.playTone(800,'sine',0.1,0.1);},playMove:function(){if(!this.ctx)return;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.frequency.setValueAtTime(200,this.ctx.currentTime);osc.frequency.linearRampToValueAtTime(600,this.ctx.currentTime+0.1);gain.gain.setValueAtTime(0.1,this.ctx.currentTime);gain.gain.linearRampToValueAtTime(0,this.ctx.currentTime+0.1);osc.connect(gain);gain.connect(this.ctx.destination);osc.start();osc.stop(this.ctx.currentTime+0.1);},playCapture:function(){this.playTone(150,'sawtooth',0.3,0.1);this.playTone(100,'square',0.3,0.1);},playWin:function(){this.playTone(440,'triangle',0.2,0.2);setTimeout(()=>this.playTone(554,'triangle',0.2,0.2),100);setTimeout(()=>this.playTone(659,'triangle',0.4,0.2),200);},playLose:function(){this.playTone(300,'sawtooth',0.3,0.2);setTimeout(()=>this.playTone(200,'sawtooth',0.5,0.2),200);}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const BOARD_SIZE=6;const TILE_SIZE=canvas.width/BOARD_SIZE;let board=[];let selectedTile=null;let validMoves=[];let turn=1;let isGameOver=false;let isAnimating=false;
function initGame(){AudioSys.init();document.getElementById('menu-screen').style.display='none';document.getElementById('winnerText').style.display='none';board=Array(BOARD_SIZE).fill().map(()=>Array(BOARD_SIZE).fill(0));board[0][0]=1;board[BOARD_SIZE-1][BOARD_SIZE-1]=1;board[0][BOARD_SIZE-1]=2;board[BOARD_SIZE-1][0]=2;for(let i=0;i<4;i++){let rx=Math.floor(Math.random()*(BOARD_SIZE-2))+1;let ry=Math.floor(Math.random()*(BOARD_SIZE-2))+1;board[ry][rx]=3;}turn=1;isGameOver=false;updateUI();draw();}
function getValidMoves(player,x,y){let moves=[];for(let dy=-2;dy<=2;dy++){for(let dx=-2;dx<=2;dx++){let nx=x+dx;let ny=y+dy;if(nx>=0&&nx<BOARD_SIZE&&ny>=0&&ny<BOARD_SIZE){if(board[ny][nx]===0){let dist=Math.max(Math.abs(dx),Math.abs(dy));if(dist===1)moves.push({x:nx,y:ny,type:'clone'});else if(dist===2)moves.push({x:nx,y:ny,type:'jump'});}}}}return moves;}
function executeMove(fromX,fromY,toX,toY,player){AudioSys.playMove();const dist=Math.max(Math.abs(toX-fromX),Math.abs(toY-fromY));if(dist===2){board[fromY][fromX]=0;}board[toY][toX]=player;let converted=false;for(let dy=-1;dy<=1;dy++){for(let dx=-1;dx<=1;dx++){let nx=toX+dx;let ny=toY+dy;if(nx>=0&&nx<BOARD_SIZE&&ny>=0&&ny<BOARD_SIZE){let content=board[ny][nx];if(content!==0&&content!==3&&content!==player){board[ny][nx]=player;converted=true;}}}}if(converted)AudioSys.playCapture();draw();updateScores();turn=(turn===1)?2:1;updateUI();if(!canMove(turn)){turn=(turn===1)?2:1;if(!canMove(turn)){endGame();return;}}if(turn===2){isAnimating=true;setTimeout(cpuTurn,1000);}else{isAnimating=false;}}
function canMove(player){for(let y=0;y<BOARD_SIZE;y++){for(let x=0;x<BOARD_SIZE;x++){if(board[y][x]===player){if(getValidMoves(player,x,y).length>0)return true;}}}return false;}
function cpuTurn(){let bestMove=null;let maxGain=-Infinity;const player=2;for(let y=0;y<BOARD_SIZE;y++){for(let x=0;x<BOARD_SIZE;x++){if(board[y][x]===player){let moves=getValidMoves(player,x,y);moves.forEach(m=>{let gain=0;if(m.type==='clone')gain+=1;for(let dy=-1;dy<=1;dy++){for(let dx=-1;dx<=1;dx++){let nx=m.x+dx;let ny=m.y+dy;if(nx>=0&&nx<BOARD_SIZE&&ny>=0&&ny<BOARD_SIZE){if(board[ny][nx]===1){gain+=1;}}}}gain+=Math.random()*0.5;if(gain>maxGain){maxGain=gain;bestMove={fromX:x,fromY:y,toX:m.x,toY:m.y};}});}}}if(bestMove){executeMove(bestMove.fromX,bestMove.fromY,bestMove.toX,bestMove.toY,player);}else{turn=1;isAnimating=false;updateUI();}}
function draw(){ctx.fillStyle="#111";ctx.fillRect(0,0,canvas.width,canvas.height);for(let y=0;y<BOARD_SIZE;y++){for(let x=0;x<BOARD_SIZE;x++){let px=x*TILE_SIZE;let py=y*TILE_SIZE;ctx.strokeStyle="#333";ctx.strokeRect(px,py,TILE_SIZE,TILE_SIZE);if(board[y][x]===3){ctx.fillStyle="#222";ctx.fillRect(px+2,py+2,TILE_SIZE-4,TILE_SIZE-4);ctx.strokeStyle="#444";ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+TILE_SIZE,py+TILE_SIZE);ctx.stroke();ctx.beginPath();ctx.moveTo(px+TILE_SIZE,py);ctx.lineTo(px,py+TILE_SIZE);ctx.stroke();}}}if(turn===1&&selectedTile){ctx.fillStyle="rgba(255, 215, 0, 0.2)";ctx.fillRect(selectedTile.x*TILE_SIZE,selectedTile.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);validMoves.forEach(m=>{ctx.fillStyle=(m.type==='clone')?"rgba(0, 255, 0, 0.2)":"rgba(255, 255, 0, 0.1)";ctx.fillRect(m.x*TILE_SIZE,m.y*TILE_SIZE,TILE_SIZE,TILE_SIZE);ctx.fillStyle="#FFFFA0";ctx.beginPath();ctx.arc(m.x*TILE_SIZE+TILE_SIZE/2,m.y*TILE_SIZE+TILE_SIZE/2,5,0,Math.PI*2);ctx.fill();});}for(let y=0;y<BOARD_SIZE;y++){for(let x=0;x<BOARD_SIZE;x++){let val=board[y][x];if(val===1||val===2){drawTriangle(x,y,val);}}}}
function drawTriangle(x,y,type){let px=x*TILE_SIZE+TILE_SIZE/2;let py=y*TILE_SIZE+TILE_SIZE/2;let size=TILE_SIZE*0.4;ctx.beginPath();if(type===1){ctx.moveTo(px,py-size);ctx.lineTo(px+size,py+size);ctx.lineTo(px-size,py+size);ctx.fillStyle="#FFD700";ctx.shadowColor="#FFD700";}else{ctx.moveTo(px,py+size);ctx.lineTo(px+size,py-size);ctx.lineTo(px-size,py-size);ctx.fillStyle="#ff4444";ctx.shadowColor="#ff0000";}ctx.shadowBlur=15;ctx.closePath();ctx.fill();ctx.lineWidth=2;ctx.strokeStyle="#FFF";ctx.stroke();ctx.shadowBlur=0;}
function updateScores(){let p1=0,p2=0;for(let row of board){for(let cell of row){if(cell===1)p1++;if(cell===2)p2++;}}document.getElementById('scoreP1').innerText=p1;document.getElementById('scoreP2').innerText=p2;let empty=false;for(let row of board){for(let cell of row){if(cell===0)empty=true;}}if(!empty||p1===0||p2===0){endGame(p1,p2);}}
function endGame(p1,p2){isGameOver=true;document.getElementById('menu-screen').style.display='flex';let txt=document.getElementById('winnerText');let btn=document.querySelector('.btn-start');txt.style.display='block';btn.innerText="PLAY AGAIN";if(p1>p2){txt.innerText="VICTORY";txt.style.color="#FFD700";AudioSys.playWin();}else if(p2>p1){txt.innerText="DEFEAT";txt.style.color="#ff4444";AudioSys.playLose();}else{txt.innerText="DRAW";txt.style.color="#FFF";}}
function updateUI(){const ind=document.getElementById('turn-indicator');if(turn===1){ind.innerText="PLAYER TURN";ind.style.color="#FFD700";}else{ind.innerText="CPU THINKING...";ind.style.color="#ff4444";}}
canvas.addEventListener('mousedown',(e)=>{if(turn!==1||isGameOver||isAnimating)return;const rect=canvas.getBoundingClientRect();const x=Math.floor((e.clientX-rect.left)/TILE_SIZE);const y=Math.floor((e.clientY-rect.top)/TILE_SIZE);if(x<0||x>=BOARD_SIZE||y<0||y>=BOARD_SIZE)return;let move=validMoves.find(m=>m.x===x&&m.y===y);if(move&&selectedTile){executeMove(selectedTile.x,selectedTile.y,x,y,1);selectedTile=null;validMoves=[];}else{if(board[y][x]===1){selectedTile={x,y};validMoves=getValidMoves(1,x,y);AudioSys.playSelect();draw();}else{selectedTile=null;validMoves=[];draw();}}});
function loop(){
    if (!document.getElementById('gameCanvas')) return;
    window.currentGameAnimationFrame = requestAnimationFrame(loop);
}
loop();
</script></body></html>`;

    // GAME 5: GILDED ROGUE
    const GAME_GILDED_ROGUE_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Gilded Rogue</title><style>body{margin:0;padding:0;background-color:#080804;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;display:flex;align-items:center;justify-content:center;height:100vh;}.back-btn{position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.8);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;transition:0.3s;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}#game-frame{position:relative;width:800px;height:600px;background:#151510;border:4px solid #4a4a2a;box-shadow:0 0 40px rgba(0,0,0,0.8);display:grid;grid-template-columns:3fr 1fr;}canvas{display:block;background:#000;cursor:crosshair;}#sidebar{padding:20px;border-left:2px solid #4a4a2a;display:flex;flex-direction:column;gap:20px;background:repeating-linear-gradient(45deg,#1a1a0d,#1a1a0d 10px,#222211 10px,#222211 20px);}.stat-box{background:rgba(0,0,0,0.8);border:1px solid #FFD700;padding:10px;box-shadow:0 0 10px rgba(255,215,0,0.1);}.stat-label{font-size:12px;color:#FFFFA0;opacity:0.7;}.stat-value{font-size:24px;font-weight:bold;text-shadow:0 0 5px #FFD700;}.log-box{flex-grow:1;background:#000;border:1px solid #444;padding:10px;font-size:12px;overflow-y:hidden;color:#ccc;display:flex;flex-direction:column-reverse;}.log-msg{margin-bottom:4px;border-bottom:1px solid #222;padding-bottom:2px;}.log-gold{color:#FFD700;}.log-dmg{color:#ff4444;}#overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;}h1{font-size:48px;color:#FFD700;text-shadow:0 0 20px #FFD700;margin:0 0 10px 0;}p{color:#888;margin-bottom:30px;}.btn-rpg{background:#2a2a15;color:#FFD700;border:2px solid #FFD700;padding:15px 30px;font-size:18px;cursor:pointer;font-family:inherit;margin:5px;transition:0.2s;clip-path:polygon(5% 0,100% 0,100% 70%,95% 100%,0 100%,0 30%);}.btn-rpg:hover{background:#FFD700;color:#000;}.btn-rpg:disabled{opacity:0.5;cursor:not-allowed;border-color:#555;color:#555;background:#111;}#shop-menu{display:none;text-align:center;width:100%;}.shop-item{display:inline-block;margin:10px;padding:20px;border:1px solid #555;cursor:pointer;}.shop-item:hover{border-color:#FFD700;background:#111;}</style></head>
<body><a href="#" class="back-btn">&#9664; BACK</a><div id="game-frame"><canvas id="gameCanvas" width="600" height="600"></canvas><div id="sidebar"><div class="stat-box"><div class="stat-label">FLOOR</div><div class="stat-value" id="ui-floor">1</div></div><div class="stat-box"><div class="stat-label">HP</div><div class="stat-value" style="color:#ff4444" id="ui-hp">20/20</div></div><div class="stat-box"><div class="stat-label">GOLD</div><div class="stat-value" style="color:#FFD700" id="ui-gold">0</div></div><div class="stat-box"><div class="stat-label">POWER</div><div class="stat-value" style="color:#aaaaff" id="ui-atk">2</div></div><div class="log-box" id="game-log"><div class="log-msg">Welcome to the Crypt...</div></div></div><div id="overlay"><div id="start-menu"><h1>GILDED ROGUE</h1><p>ARROW KEYS TO MOVE/ATTACK. DESCEND.</p><button class="btn-rpg" onclick="initGame()">ENTER DUNGEON</button></div><div id="shop-menu"><h1>FLOOR CLEARED</h1><p>REST & UPGRADE</p><button class="btn-rpg" id="btn-heal" onclick="buyUpgrade('heal')">HEAL (+10HP) <br><small>25 G</small></button><button class="btn-rpg" id="btn-atk" onclick="buyUpgrade('atk')">SHARPEN (+1 ATK) <br><small>50 G</small></button><br><br><button class="btn-rpg" onclick="nextFloor()">DESCEND DEEPER</button></div><div id="death-menu" style="display:none;"><h1 style="color:#ff4444">YOU DIED</h1><p>THE GOLD REMAINS BURIED.</p><button class="btn-rpg" onclick="initGame()">TRY AGAIN</button></div></div></div>
<script>
const AudioSys={ctx:null,init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},playStep:function(){if(!this.ctx)return;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(100,this.ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(10,this.ctx.currentTime+0.1);gain.gain.setValueAtTime(0.1,this.ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+0.1);osc.connect(gain);gain.connect(this.ctx.destination);osc.start();osc.stop(this.ctx.currentTime+0.1);},playHit:function(){if(!this.ctx)return;const bufferSize=this.ctx.sampleRate*0.1;const buffer=this.ctx.createBuffer(1,bufferSize,this.ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++)data[i]=Math.random()*2-1;const noise=this.ctx.createBufferSource();noise.buffer=buffer;const gain=this.ctx.createGain();gain.gain.setValueAtTime(0.2,this.ctx.currentTime);gain.gain.linearRampToValueAtTime(0,this.ctx.currentTime+0.1);noise.connect(gain);gain.connect(this.ctx.destination);noise.start();},playCoin:function(){if(!this.ctx)return;const t=this.ctx.currentTime;const o1=this.ctx.createOscillator();o1.frequency.value=1200;const o2=this.ctx.createOscillator();o2.frequency.value=1600;const g=this.ctx.createGain();g.gain.setValueAtTime(0.1,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o1.connect(g);o2.connect(g);g.connect(this.ctx.destination);o1.start(t);o1.stop(t+0.3);o2.start(t+0.05);o2.stop(t+0.35);},playLevelUp:function(){if(!this.ctx)return;const now=this.ctx.currentTime;[440,554,659,880].forEach((f,i)=>{const o=this.ctx.createOscillator();o.type='square';o.frequency.value=f;const g=this.ctx.createGain();g.gain.value=0.05;g.gain.exponentialRampToValueAtTime(0.001,now+i*0.1+0.5);o.connect(g);g.connect(this.ctx.destination);o.start(now+i*0.1);o.stop(now+i*0.1+0.5);});}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const TILE_SIZE=40;const COLS=15;const ROWS=15;let player={x:1,y:1,hp:20,maxHp:20,gold:0,atk:2};let enemies=[];let particles=[];let floor=1;let map=[];let gameState="MENU";
function log(msg,type=''){const box=document.getElementById('game-log');const el=document.createElement('div');el.className='log-msg '+type;el.innerText='> '+msg;box.prepend(el);if(box.children.length>10)box.removeChild(box.lastChild);}
function generateMap(){map=[];for(let y=0;y<ROWS;y++){let row=[];for(let x=0;x<COLS;x++)row.push(1);map.push(row);}for(let y=2;y<ROWS-2;y++){for(let x=2;x<COLS-2;x++){if(Math.random()>0.1)map[y][x]=0;else map[y][x]=1;}}player.x=2;player.y=2;map[2][2]=0;enemies=[];let enemyCount=2+Math.floor(floor*1.5);for(let i=0;i<enemyCount;i++){spawnEntity('enemy');}}
function spawnEntity(type){let placed=false;while(!placed){let rx=Math.floor(Math.random()*(COLS-2))+1;let ry=Math.floor(Math.random()*(ROWS-2))+1;if(map[ry][rx]===0&&(Math.abs(rx-player.x)>2||Math.abs(ry-player.y)>2)){if(!enemies.some(e=>e.x===rx&&e.y===ry)){let hp=5+floor*2;enemies.push({x:rx,y:ry,hp:hp,maxHp:hp,type:'skull'});placed=true;}}}}
function initGame(){AudioSys.init();player.hp=20;player.maxHp=20;player.gold=0;player.atk=2;floor=1;gameState="PLAY";document.getElementById('overlay').style.display='none';document.getElementById('start-menu').style.display='none';document.getElementById('death-menu').style.display='none';document.getElementById('game-log').innerHTML='';log("Entered the Dungeon.");startFloor();}
function startFloor(){generateMap();updateUI();draw();}
function nextFloor(){floor++;gameState="PLAY";document.getElementById('overlay').style.display='none';document.getElementById('shop-menu').style.display='none';AudioSys.playLevelUp();log("Descended to Floor "+floor+".");startFloor();}
function openShop(){gameState="SHOP";document.getElementById('overlay').style.display='flex';document.getElementById('shop-menu').style.display='block';updateShopButtons();}
function updateShopButtons(){document.getElementById('btn-heal').disabled=(player.gold<25||player.hp>=player.maxHp);document.getElementById('btn-atk').disabled=(player.gold<50);}
function buyUpgrade(type){if(type==='heal'&&player.gold>=25){player.gold-=25;player.hp=Math.min(player.hp+10,player.maxHp);AudioSys.playCoin();}if(type==='atk'&&player.gold>=50){player.gold-=50;player.atk+=1;AudioSys.playCoin();}updateUI();updateShopButtons();}
function movePlayer(dx,dy){if(gameState!=="PLAY")return;let nx=player.x+dx;let ny=player.y+dy;if(map[ny][nx]===1)return;let target=enemies.find(e=>e.x===nx&&e.y===ny);if(target){attackEnemy(target);}else{player.x=nx;player.y=ny;AudioSys.playStep();}endTurn();}
function attackEnemy(target){let dmg=player.atk+Math.floor(Math.random()*2);target.hp-=dmg;AudioSys.playHit();createParticle(target.x,target.y,dmg,"#fff");log("Hit enemy for "+dmg+" dmg.",'log-dmg');if(target.hp<=0){let goldDrop=5+Math.floor(Math.random()*5)+floor;player.gold+=goldDrop;log("Enemy slain! Found "+goldDrop+" Gold.",'log-gold');AudioSys.playCoin();enemies=enemies.filter(e=>e!==target);}}
function endTurn(){enemies.forEach(e=>{let dx=player.x-e.x;let dy=player.y-e.y;let dist=Math.abs(dx)+Math.abs(dy);if(dist===1){let dmg=Math.floor(floor*0.8)+1;player.hp-=dmg;createParticle(player.x,player.y,"-"+dmg,"#ff0000");AudioSys.playHit();ctx.translate(Math.random()*4-2,Math.random()*4-2);setTimeout(()=>ctx.setTransform(1,0,0,1,0,0),50);}else if(dist<6){let moveX=(dx>0)?1:(dx<0?-1:0);let moveY=(dy>0)?1:(dy<0?-1:0);if(Math.abs(dx)>Math.abs(dy)){if(map[e.y][e.x+moveX]===0&&!isOccupied(e.x+moveX,e.y))e.x+=moveX;else if(map[e.y+moveY][e.x]===0&&!isOccupied(e.x,e.y+moveY))e.y+=moveY;}else{if(map[e.y+moveY][e.x]===0&&!isOccupied(e.x,e.y+moveY))e.y+=moveY;else if(map[e.y][e.x+moveX]===0&&!isOccupied(e.x+moveX,e.y))e.x+=moveX;}}});checkStatus();draw();}
function isOccupied(x,y){return(player.x===x&&player.y===y)||enemies.some(e=>e.x===x&&e.y===y);}
function checkStatus(){if(player.hp<=0){gameState="DEAD";document.getElementById('overlay').style.display='flex';document.getElementById('death-menu').style.display='block';}else if(enemies.length===0){setTimeout(openShop,500);}updateUI();}
function createParticle(x,y,text,color){particles.push({x:x,y:y,text:text,color:color,life:1.0});}
function updateUI(){document.getElementById('ui-floor').innerText=floor;document.getElementById('ui-hp').innerText=player.hp+"/"+player.maxHp;document.getElementById('ui-gold').innerText=player.gold;document.getElementById('ui-atk').innerText=player.atk;}
function draw(){ctx.fillStyle="#000";ctx.fillRect(0,0,canvas.width,canvas.height);let offsetX=(canvas.width-COLS*TILE_SIZE)/2;let offsetY=(canvas.height-ROWS*TILE_SIZE)/2;ctx.save();ctx.translate(offsetX,offsetY);for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++){let px=x*TILE_SIZE;let py=y*TILE_SIZE;if(map[y][x]===1){ctx.fillStyle="#222";ctx.fillRect(px,py,TILE_SIZE,TILE_SIZE);ctx.strokeStyle="#333";ctx.strokeRect(px,py,TILE_SIZE,TILE_SIZE);}else{ctx.fillStyle="#111";ctx.fillRect(px,py,TILE_SIZE,TILE_SIZE);ctx.fillStyle="#222";ctx.fillRect(px+TILE_SIZE/2,py+TILE_SIZE/2,2,2);}}}enemies.forEach(e=>{let px=e.x*TILE_SIZE+TILE_SIZE/2;let py=e.y*TILE_SIZE+TILE_SIZE/2;ctx.fillStyle="#aa0000";ctx.beginPath();ctx.arc(px,py-2,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#000";ctx.beginPath();ctx.arc(px-4,py-2,3,0,Math.PI*2);ctx.arc(px+4,py-2,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="red";ctx.fillRect(px-15,py+12,30*(e.hp/e.maxHp),3);});let pX=player.x*TILE_SIZE+TILE_SIZE/2;let pY=player.y*TILE_SIZE+TILE_SIZE/2;ctx.shadowBlur=20;ctx.shadowColor="#FFD700";ctx.fillStyle="#FFD700";ctx.beginPath();ctx.arc(pX,pY,14,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle="#000";ctx.fillRect(pX-10,pY-2,20,4);ctx.fillRect(pX-2,pY,4,10);for(let i=particles.length-1;i>=0;i--){let p=particles[i];let px=p.x*TILE_SIZE+TILE_SIZE/2;let py=p.y*TILE_SIZE;ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.font="bold 20px Courier New";ctx.fillText(p.text,px,py-(1.0-p.life)*30);p.life-=0.05;if(p.life<=0)particles.splice(i,1);ctx.globalAlpha=1.0;}ctx.restore();}
function animate(){
    if(!document.getElementById('gameCanvas')) return;
    if(gameState==="PLAY"){draw();}
    window.currentGameAnimationFrame = requestAnimationFrame(animate);
}
window.currentGameAnimationFrame = requestAnimationFrame(animate);
window.addEventListener('keydown',(e)=>{if(gameState!=="PLAY")return;if(e.key==='ArrowUp')movePlayer(0,-1);else if(e.key==='ArrowDown')movePlayer(0,1);else if(e.key==='ArrowLeft')movePlayer(-1,0);else if(e.key==='ArrowRight')movePlayer(1,0);});
</script></body></html>`;

    // GAME 6: AMBER ECHO
    const GAME_AMBER_ECHO_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Amber Echo</title><style>body{margin:0;padding:0;background-color:#050505;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;display:flex;align-items:center;justify-content:center;height:100vh;}.back-btn{position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.8);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;transition:0.3s;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}#game-container{position:relative;width:100%;height:100%;background:radial-gradient(circle at center bottom,#2a2a15 0%,#000 70%);}canvas{display:block;width:100%;height:100%;}#hud{position:absolute;top:50px;left:50%;transform:translateX(-50%);text-align:center;pointer-events:none;}#score{font-size:40px;font-weight:bold;text-shadow:0 0 10px #FFD700;}#combo{font-size:24px;color:#FFFFA0;opacity:0;transition:opacity 0.2s;}#feedback{font-size:30px;font-weight:bold;margin-top:10px;height:30px;}.perfect{color:#00ffff;text-shadow:0 0 10px cyan;}.good{color:#00ff00;text-shadow:0 0 10px lime;}.miss{color:#ff4444;text-shadow:0 0 10px red;}#start-screen,#end-screen{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;}h1{font-size:60px;color:#FFD700;text-shadow:0 0 20px #FFD700;margin:0;font-style:italic;}p{color:#ccc;margin-top:10px;letter-spacing:2px;}.key-guide{display:flex;gap:20px;margin:30px 0;}.key{border:2px solid #FFD700;width:50px;height:50px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:#FFD700;box-shadow:0 0 10px rgba(255,215,0,0.3);}.btn-action{padding:15px 50px;font-size:24px;background:#FFD700;border:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);cursor:pointer;font-weight:bold;color:#000;transition:0.2s;}.btn-action:hover{background:#FFF;box-shadow:0 0 20px #FFD700;transform:scale(1.05);}</style></head>
<body><a href="#" class="back-btn" onclick="stopGame();">&#9664; BACK</a><div id="game-container"><canvas id="gameCanvas"></canvas><div id="hud"><div id="score">000000</div><div id="combo">COMBO x1</div><div id="feedback"></div></div><div id="start-screen"><h1>AMBER ECHO</h1><p>SYNC YOUR SENSES</p><div class="key-guide"><div class="key">D</div><div class="key">F</div><div class="key">J</div><div class="key">K</div></div><button class="btn-action" onclick="startGame()">START TRACK</button></div><div id="end-screen" style="display:none;"><h1>TRACK COMPLETE</h1><p>FINAL SCORE</p><h2 id="finalScore" style="font-size:40px;color:#FFF;">0</h2><button class="btn-action" onclick="startGame()">REPLAY</button></div></div>
<script>
const AudioSys={ctx:null,bpm:128,nextNoteTime:0,schedulerLookahead:0.1,scheduleAheadTime:0.1,isPlaying:false,init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},playKick:function(time){const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.frequency.setValueAtTime(150,time);osc.frequency.exponentialRampToValueAtTime(0.01,time+0.5);gain.gain.setValueAtTime(1,time);gain.gain.exponentialRampToValueAtTime(0.01,time+0.5);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(time);osc.stop(time+0.5);},playHiHat:function(time){const bufferSize=this.ctx.sampleRate*0.05;const buffer=this.ctx.createBuffer(1,bufferSize,this.ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++)data[i]=Math.random()*2-1;const noise=this.ctx.createBufferSource();noise.buffer=buffer;const filter=this.ctx.createBiquadFilter();filter.type='highpass';filter.frequency.value=5000;const gain=this.ctx.createGain();gain.gain.setValueAtTime(0.3,time);gain.gain.exponentialRampToValueAtTime(0.01,time+0.05);noise.connect(filter);filter.connect(gain);gain.connect(this.ctx.destination);noise.start(time);},playSynth:function(time,freq){const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='sawtooth';osc.frequency.value=freq;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(500,time);filter.frequency.linearRampToValueAtTime(3000,time+0.1);filter.frequency.exponentialRampToValueAtTime(500,time+0.3);gain.gain.setValueAtTime(0.1,time);gain.gain.exponentialRampToValueAtTime(0.001,time+0.3);osc.connect(filter);filter.connect(gain);gain.connect(this.ctx.destination);osc.start(time);osc.stop(time+0.4);},playHitSound:function(){const osc=this.ctx.createOscillator();osc.type='sine';osc.frequency.setValueAtTime(800,this.ctx.currentTime);const gain=this.ctx.createGain();gain.gain.setValueAtTime(0.1,this.ctx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+0.1);osc.connect(gain);gain.connect(this.ctx.destination);osc.start();osc.stop(this.ctx.currentTime+0.1);}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const LANES=4;const KEYS=['KeyD','KeyF','KeyJ','KeyK'];const LANE_COLORS=['#FFD700','#FFA500','#FFA500','#FFD700'];const HIT_Y=window.innerHeight-100;const NOTE_SPEED=500;const SPAWN_OFFSET=1.5;let gameStartTime=0;let notes=[];let score=0;let combo=0;let isRunning=false;let particles=[];let keyState=[false,false,false,false];
function generateTrack(){const track=[];const seconds=60;const beats=(seconds/60)*AudioSys.bpm;const melody=[220,261,329,261,392,329,261,220];for(let i=0;i<beats;i++){const time=i*(60/AudioSys.bpm);if(i%1===0){const lane=Math.floor(Math.random()*4);track.push({time:time,lane:lane,hit:false,type:'beat'});}if(i%2!==0&&Math.random()>0.4){const lane=Math.floor(Math.random()*4);track.push({time:time,lane:lane,hit:false,type:'off'});}}return track;}
function startGame(){AudioSys.init();resize();document.getElementById('start-screen').style.display='none';document.getElementById('end-screen').style.display='none';score=0;combo=0;updateUI();notes=generateTrack();gameStartTime=AudioSys.ctx.currentTime+SPAWN_OFFSET;isRunning=true;scheduleAudio();loop();}function stopGame(){isRunning=false;}
let audioPointer=0;function scheduleAudio(){if(!isRunning)return;const currentTime=AudioSys.ctx.currentTime;const absoluteStartTime=gameStartTime;while(audioPointer<notes.length){const note=notes[audioPointer];const noteTime=absoluteStartTime+note.time;if(noteTime<currentTime+0.5){if(note.type==='beat'){AudioSys.playKick(noteTime);AudioSys.playSynth(noteTime,110);}else{AudioSys.playHiHat(noteTime);AudioSys.playSynth(noteTime,220);}audioPointer++;}else{break;}}if(audioPointer>=notes.length&&currentTime>absoluteStartTime+notes[notes.length-1].time+2){endGame();}setTimeout(scheduleAudio,100);}
function endGame(){isRunning=false;document.getElementById('end-screen').style.display='flex';document.getElementById('finalScore').innerText=score;}
window.addEventListener('keydown',e=>{if(!isRunning||e.repeat)return;const lane=KEYS.indexOf(e.code);if(lane!==-1){keyState[lane]=true;checkHit(lane);}});window.addEventListener('keyup',e=>{const lane=KEYS.indexOf(e.code);if(lane!==-1)keyState[lane]=false;});
function checkHit(lane){const currentTime=AudioSys.ctx.currentTime;const trackTime=currentTime-gameStartTime;const hittableNote=notes.find(n=>n.lane===lane&&!n.hit&&Math.abs(n.time-trackTime)<0.2);if(hittableNote){const diff=Math.abs(hittableNote.time-trackTime);hittableNote.hit=true;let points=0;let text="";let className="";if(diff<0.05){points=300;text="PERFECT";className="perfect";}else if(diff<0.1){points=100;text="GOOD";className="good";}else{points=50;text="OK";className="good";}combo++;score+=points*Math.min(combo,10);showFeedback(text,className);AudioSys.playHitSound();const laneX=getLaneX(lane);createExplosion(laneX,HIT_Y,LANE_COLORS[lane]);}updateUI();}
function showFeedback(text,cls){const el=document.getElementById('feedback');el.innerText=text;el.className=cls;el.style.opacity=1;setTimeout(()=>el.style.opacity=0,500);}function updateUI(){document.getElementById('score').innerText=score.toString().padStart(6,'0');const comboEl=document.getElementById('combo');comboEl.innerText="COMBO x"+combo;comboEl.style.opacity=combo>1?1:0;}
function getLaneX(lane){const w=canvas.width;const laneWidth=80;const totalW=laneWidth*LANES;const startX=(w-totalW)/2;return startX+(lane*laneWidth)+(laneWidth/2);}
function loop(){
    if(!isRunning || !document.getElementById('gameCanvas')) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);const w=canvas.width;const h=canvas.height;const currentTime=AudioSys.ctx.currentTime;const trackTime=currentTime-gameStartTime;const laneW=80;const totalW=laneW*LANES;const startX=(w-totalW)/2;const vanishPointX=w/2;const vanishPointY=h*0.2;const grad=ctx.createLinearGradient(0,vanishPointY,0,h);grad.addColorStop(0,"rgba(0,0,0,0)");grad.addColorStop(1,"rgba(74, 74, 42, 0.3)");ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(vanishPointX-20,vanishPointY);ctx.lineTo(startX,h);ctx.lineTo(startX+totalW,h);ctx.lineTo(vanishPointX+20,vanishPointY);ctx.fill();ctx.strokeStyle="rgba(255, 215, 0, 0.2)";ctx.lineWidth=2;for(let i=0;i<=LANES;i++){const x1=startX+(i*laneW);const y1=h;const x2=vanishPointX+((i-LANES/2)*10);const y2=vanishPointY;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}ctx.lineWidth=4;for(let i=0;i<LANES;i++){const lx=getLaneX(i);if(keyState[i]){ctx.fillStyle="rgba(255, 215, 0, 0.5)";ctx.shadowBlur=20;ctx.shadowColor="#FFD700";ctx.beginPath();ctx.arc(lx,HIT_Y,35,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}ctx.strokeStyle=LANE_COLORS[i];ctx.beginPath();ctx.arc(lx,HIT_Y,30,0,Math.PI*2);ctx.stroke();}notes.forEach(note=>{if(note.hit)return;const timeDiff=note.time-trackTime;if(timeDiff>-0.2&&timeDiff<SPAWN_OFFSET){const y=HIT_Y-(timeDiff*NOTE_SPEED);const progress=(y-vanishPointY)/(HIT_Y-vanishPointY);if(progress<0)return;const lx=getLaneX(note.lane);const perspX=vanishPointX+(lx-vanishPointX)*progress;const size=30*progress;ctx.fillStyle=LANE_COLORS[note.lane];ctx.shadowBlur=15;ctx.shadowColor=LANE_COLORS[note.lane];ctx.beginPath();ctx.moveTo(perspX,y-size);ctx.lineTo(perspX+size,y);ctx.lineTo(perspX,y+size);ctx.lineTo(perspX-size,y);ctx.fill();ctx.fillStyle="#FFF";ctx.beginPath();ctx.arc(perspX,y,size*0.3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(timeDiff<-0.15&&!note.hit){note.hit=true;combo=0;showFeedback("MISS","miss");updateUI();}}});updateParticles();
    window.currentGameAnimationFrame = requestAnimationFrame(loop);
}
function createExplosion(x,y,color){for(let i=0;i<10;i++){particles.push({x:x,y:y,vx:(Math.random()-0.5)*10,vy:(Math.random()-0.5)*10,life:1.0,color:color});}}function updateParticles(){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.05;if(p.life<=0){particles.splice(i,1);}else{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);ctx.globalAlpha=1.0;}}}function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}window.addEventListener('resize',resize);resize();
</script></body></html>`;

    // GAME 7: HEXA-VAULT
    const GAME_HEXA_VAULT_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Hexa-Vault</title><style>body{margin:0;padding:0;background-color:#0a0a05;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;display:flex;align-items:center;justify-content:center;height:100vh;}.back-btn{position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.8);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;transition:0.3s;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}#game-container{position:relative;box-shadow:0 0 50px rgba(184,134,11,0.2);border-radius:50%;}canvas{display:block;cursor:pointer;}#hud{position:absolute;top:20px;right:20px;text-align:right;pointer-events:none;}.hud-text{font-size:20px;font-weight:bold;text-shadow:0 0 5px #FFD700;margin-bottom:5px;}.sub-text{font-size:14px;color:#888;}#overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(10,10,5,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;border-radius:10px;}h1{font-size:40px;color:#FFD700;text-shadow:0 0 15px #FFD700;margin-bottom:10px;}p{color:#aaa;margin-bottom:30px;text-align:center;max-width:400px;}.btn-hex{background:transparent;color:#FFD700;border:2px solid #FFD700;padding:15px 40px;font-size:20px;font-weight:bold;cursor:pointer;position:relative;transition:0.3s;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);}.btn-hex:hover{background:#FFD700;color:#000;box-shadow:0 0 20px #FFD700;}.bg-hex{position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;background-image:radial-gradient(#1a1a0d 15%,transparent 16%),radial-gradient(#1a1a0d 15%,transparent 16%);background-size:60px 60px;background-position:0 0,30px 30px;opacity:0.2;}</style></head>
<body><div class="bg-hex"></div><a href="#" class="back-btn">&#9664; BACK</a><div id="game-container"><canvas id="gameCanvas" width="600" height="600"></canvas><div id="hud"><div class="hud-text">SECURE LEVEL: <span id="levelDisplay">1</span></div><div class="sub-text" id="statusText">SYSTEM LOCKED</div></div><div id="overlay"><h1 id="titleText">HEXA-VAULT</h1><p id="descText">DECRYPT THE SECURITY LAYER. ROTATE TILES TO CONNECT POWER FROM CENTER TO ALL OUTER LOCKS.</p><button class="btn-hex" onclick="startGame()">INITIATE HACK</button></div></div>
<script>
const AudioSys={ctx:null,init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},playClick:function(){if(!this.ctx)return;const t=this.ctx.currentTime;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='square';osc.frequency.setValueAtTime(200,t);osc.frequency.exponentialRampToValueAtTime(50,t+0.05);gain.gain.setValueAtTime(0.05,t);gain.gain.exponentialRampToValueAtTime(0.001,t+0.05);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(t);osc.stop(t+0.05);},playPower:function(){if(!this.ctx)return;const t=this.ctx.currentTime;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(100,t);osc.frequency.linearRampToValueAtTime(400,t+0.2);const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=500;gain.gain.setValueAtTime(0.05,t);gain.gain.linearRampToValueAtTime(0,t+0.3);osc.connect(filter);filter.connect(gain);gain.connect(this.ctx.destination);osc.start(t);osc.stop(t+0.3);},playWin:function(){if(!this.ctx)return;const t=this.ctx.currentTime;[523.25,659.25,783.99].forEach((f,i)=>{const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='triangle';osc.frequency.value=f;gain.gain.setValueAtTime(0,t+i*0.1);gain.gain.linearRampToValueAtTime(0.1,t+i*0.1+0.1);gain.gain.exponentialRampToValueAtTime(0.001,t+i*0.1+0.8);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(t+i*0.1);osc.stop(t+i*0.1+1);});}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const HEX_SIZE=45;const GRID_RADIUS=3;function hexToPixel(q,r){const x=HEX_SIZE*(Math.sqrt(3)*q+Math.sqrt(3)/2*r);const y=HEX_SIZE*(3/2*r);return{x:x+canvas.width/2,y:y+canvas.height/2};}let level=1;let grid=[];let isLevelComplete=false;const NEIGHBORS=[{dq:1,dr:-1},{dq:1,dr:0},{dq:0,dr:1},{dq:-1,dr:1},{dq:-1,dr:0},{dq:0,dr:-1}];class Tile{constructor(q,r,isSource=false,isLock=false){this.q=q;this.r=r;this.isSource=isSource;this.isLock=isLock;this.powered=false;this.connections=[false,false,false,false,false,false];this.rotation=0;}rotate(){const last=this.connections.pop();this.connections.unshift(last);}}
function generateLevel(){grid=new Map();let locks=[];for(let q=-GRID_RADIUS;q<=GRID_RADIUS;q++){let r1=Math.max(-GRID_RADIUS,-q-GRID_RADIUS);let r2=Math.min(GRID_RADIUS,-q+GRID_RADIUS);for(let r=r1;r<=r2;r++){const isSource=(q===0&&r===0);const dist=(Math.abs(q)+Math.abs(q+r)+Math.abs(r))/2;const isLock=(dist===GRID_RADIUS);const tile=new Tile(q,r,isSource,isLock);grid.set(\`\${q},\${r}\`,tile);if(isLock)locks.push(tile);}}let visited=new Set();visited.add("0,0");let queue=[grid.get("0,0")];grid.forEach(t=>t.connections.fill(false));let stack=[grid.get("0,0")];let carved=new Set(["0,0"]);while(stack.length>0){let current=stack[stack.length-1];let neighbors=[];NEIGHBORS.forEach((n,idx)=>{let nKey=\`\${current.q+n.dq},\${current.r+n.dr}\`;if(grid.has(nKey)&&!carved.has(nKey)){neighbors.push({tile:grid.get(nKey),dir:idx});}});if(neighbors.length>0){let next=neighbors[Math.floor(Math.random()*neighbors.length)];current.connections[next.dir]=true;let oppDir=(next.dir+3)%6;next.tile.connections[oppDir]=true;carved.add(\`\${next.tile.q},\${next.tile.r}\`);stack.push(next.tile);}else{stack.pop();}}grid.forEach(t=>{if(Math.random()<0.2){let dir=Math.floor(Math.random()*6);t.connections[dir]=true;}});grid.forEach(t=>{if(!t.isSource){let rots=Math.floor(Math.random()*6);for(let i=0;i<rots;i++)t.rotate();}});}
function startGame(){AudioSys.init();document.getElementById('overlay').style.display='none';document.getElementById('levelDisplay').innerText=level;isLevelComplete=false;generateLevel();checkPower();draw();}function nextLevel(){level++;startGame();}function checkPower(){grid.forEach(t=>t.powered=false);let source=grid.get("0,0");source.powered=true;let queue=[source];let visited=new Set(["0,0"]);while(queue.length>0){let curr=queue.shift();NEIGHBORS.forEach((n,i)=>{if(curr.connections[i]){let nKey=\`\${curr.q+n.dq},\${curr.r+n.dr}\`;let neighbor=grid.get(nKey);if(neighbor){let opp=(i+3)%6;if(neighbor.connections[opp]){if(!visited.has(nKey)){neighbor.powered=true;visited.add(nKey);queue.push(neighbor);}}}}});}let locks=Array.from(grid.values()).filter(t=>t.isLock);let allPowered=locks.every(t=>t.powered);if(allPowered&&!isLevelComplete){isLevelComplete=true;document.getElementById('statusText').innerText="ACCESS GRANTED";document.getElementById('statusText').style.color="#00ff00";AudioSys.playWin();setTimeout(()=>{document.getElementById('overlay').style.display='flex';document.getElementById('titleText').innerText="VAULT OPENED";document.getElementById('descText').innerText="SECURITY BYPASSED. PROCEED TO NEXT LAYER.";document.querySelector('.btn-hex').innerText="NEXT LEVEL";document.querySelector('.btn-hex').onclick=nextLevel;},1000);}else{let poweredLocks=locks.filter(t=>t.powered).length;document.getElementById('statusText').innerText=\`LOCKS: \${poweredLocks}/\${locks.length}\`;document.getElementById('statusText').style.color="#888";}}
function drawHexagon(ctx,x,y,size,filled=false){ctx.beginPath();for(let i=0;i<6;i++){const angle_deg=30+60*i;const angle_rad=Math.PI/180*angle_deg;ctx.lineTo(x+size*Math.cos(angle_rad),y+size*Math.sin(angle_rad));}ctx.closePath();if(filled)ctx.fill();else ctx.stroke();}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);grid.forEach(tile=>{const pos=hexToPixel(tile.q,tile.r);if(tile.isSource){ctx.fillStyle="#333311";ctx.strokeStyle="#FFD700";}else if(tile.isLock){ctx.fillStyle=tile.powered?"#113311":"#221111";ctx.strokeStyle=tile.powered?"#00ff00":"#ff4444";}else{ctx.fillStyle="#1a1a0d";ctx.strokeStyle="#4a4a2a";}ctx.lineWidth=2;drawHexagon(ctx,pos.x,pos.y,HEX_SIZE-2,true);ctx.stroke();tile.connections.forEach((active,i)=>{if(active){const angles=[330,30,90,150,210,270];const rad=angles[i]*(Math.PI/180);ctx.beginPath();ctx.moveTo(pos.x,pos.y);const endX=pos.x+(HEX_SIZE*0.7)*Math.cos(rad);const endY=pos.y+(HEX_SIZE*0.7)*Math.sin(rad);ctx.lineTo(endX,endY);if(tile.powered){ctx.strokeStyle=(tile.isLock)?"#00ff00":"#FFD700";ctx.lineWidth=4;ctx.shadowBlur=10;ctx.shadowColor=ctx.strokeStyle;}else{ctx.strokeStyle="#555533";ctx.lineWidth=3;ctx.shadowBlur=0;}ctx.stroke();ctx.shadowBlur=0;if(tile.powered){ctx.fillStyle="#FFF";ctx.beginPath();ctx.arc(endX,endY,3,0,Math.PI*2);ctx.fill();}}});if(tile.isSource){ctx.fillStyle="#FFD700";ctx.beginPath();ctx.arc(pos.x,pos.y,8,0,Math.PI*2);ctx.fill();}else if(tile.isLock){ctx.fillStyle=tile.powered?"#00ff00":"#ff4444";ctx.fillRect(pos.x-5,pos.y-5,10,10);}else{ctx.fillStyle="#333";ctx.beginPath();ctx.arc(pos.x,pos.y,4,0,Math.PI*2);ctx.fill();}});}
canvas.addEventListener('mousedown',e=>{if(isLevelComplete)return;const rect=canvas.getBoundingClientRect();const mouseX=e.clientX-rect.left;const mouseY=e.clientY-rect.top;let clickedTile=null;let minD=Infinity;grid.forEach(tile=>{const pos=hexToPixel(tile.q,tile.r);const dx=mouseX-pos.x;const dy=mouseY-pos.y;const dist=Math.sqrt(dx*dx+dy*dy);if(dist<HEX_SIZE*0.8&&dist<minD){minD=dist;clickedTile=tile;}});if(clickedTile&&!clickedTile.isSource){clickedTile.rotate();AudioSys.playClick();checkPower();if(clickedTile.powered)AudioSys.playPower();draw();}});
</script></body></html>`;

    // GAME 8: LIGHT PRISM
    const GAME_LIGHT_PRISM_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Light Prism</title><style>body{margin:0;padding:0;background-color:#050505;overflow:hidden;font-family:'Courier New',monospace;color:#FFD700;user-select:none;display:flex;align-items:center;justify-content:center;height:100vh;}.back-btn{position:absolute;top:20px;left:20px;background:rgba(0,0,0,0.8);border:2px solid #FFD700;color:#FFD700;padding:10px 20px;font-weight:bold;text-transform:uppercase;cursor:pointer;text-decoration:none;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);z-index:100;transition:0.3s;}.back-btn:hover{background:#FFD700;color:#000;box-shadow:0 0 15px #FFD700;}#game-area{position:relative;border:4px solid #4a4a2a;box-shadow:0 0 60px rgba(255,215,0,0.1);background:#0f0f0a;}canvas{display:block;cursor:pointer;}#hud{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:flex;flex-direction:column;justify-content:space-between;padding:20px;box-sizing:border-box;}.level-ind{font-size:24px;font-weight:bold;text-shadow:0 0 10px #FFD700;}#overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(5,5,5,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;}h1{font-size:50px;color:#FFD700;text-shadow:0 0 20px #FFD700;margin:0;letter-spacing:5px;}p{color:#888;margin-bottom:40px;}.btn-prism{background:transparent;color:#FFD700;border:2px solid #FFD700;padding:15px 50px;font-size:20px;font-weight:bold;cursor:pointer;transition:0.3s;clip-path:polygon(10% 0,100% 0,100% 70%,90% 100%,0 100%,0 30%);}.btn-prism:hover{background:#FFD700;color:#000;box-shadow:0 0 30px #FFD700;}</style></head>
<body><a href="#" class="back-btn">&#9664; BACK</a><div id="game-area"><canvas id="gameCanvas" width="800" height="600"></canvas><div id="hud"><div class="level-ind">PRISM: <span id="levelNum">1</span></div><div style="text-align:right;color:#FFFFA0">CHARGE: <span id="chargeNum">0%</span></div></div><div id="overlay"><h1>LIGHT PRISM</h1><p>ROTATE MIRRORS. GUIDE THE LASER.</p><button class="btn-prism" onclick="startGame()">ACTIVATE LASER</button></div></div>
<script>
const AudioSys={ctx:null,humOsc:null,humGain:null,init:function(){window.AudioContext=window.AudioContext||window.webkitAudioContext;this.ctx=new AudioContext();window.currentAudioContext=this.ctx;},startHum:function(){if(!this.ctx)this.init();if(this.humOsc)return;this.humOsc=this.ctx.createOscillator();this.humGain=this.ctx.createGain();this.humOsc.type='sawtooth';this.humOsc.frequency.value=50;const lfo=this.ctx.createOscillator();lfo.frequency.value=10;const lfoGain=this.ctx.createGain();lfoGain.gain.value=0.02;this.humOsc.connect(this.humGain);lfo.connect(lfoGain);lfoGain.connect(this.humGain.gain);this.humGain.connect(this.ctx.destination);this.humGain.gain.value=0.05;this.humOsc.start();lfo.start();},stopHum:function(){if(this.humOsc){this.humOsc.stop();this.humOsc=null;}},playGlass:function(){if(!this.ctx)return;const t=this.ctx.currentTime;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(2000,t);osc.frequency.exponentialRampToValueAtTime(1000,t+0.1);gain.gain.setValueAtTime(0.1,t);gain.gain.exponentialRampToValueAtTime(0.001,t+0.2);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(t);osc.stop(t+0.2);},playCharge:function(){if(!this.ctx)return;const t=this.ctx.currentTime;const osc=this.ctx.createOscillator();const gain=this.ctx.createGain();osc.frequency.setValueAtTime(400,t);osc.frequency.linearRampToValueAtTime(800,t+0.1);gain.gain.setValueAtTime(0.02,t);gain.gain.linearRampToValueAtTime(0,t+0.1);osc.connect(gain);gain.connect(this.ctx.destination);osc.start(t);osc.stop(t+0.1);}};
const canvas=document.getElementById('gameCanvas');const ctx=canvas.getContext('2d');const TILE_SIZE=50;const COLS=16;const ROWS=12;let level=1;let map=[];let laserPath=[];let targetCharge=0;let isLevelComplete=false;let particles=[];
function loadLevel(lvl){map=[];targetCharge=0;isLevelComplete=false;laserPath=[];for(let y=0;y<ROWS;y++){let row=[];for(let x=0;x<COLS;x++){if(x===0||x===COLS-1||y===0||y===ROWS-1)row.push(1);else if(Math.random()<0.1)row.push(1);else if(Math.random()<0.15)row.push(Math.random()>0.5?2:3);else row.push(0);}map.push(row);}map[2][2]=8;map[ROWS-3][COLS-3]=9;map[2][3]=0;map[3][2]=0;map[ROWS-3][COLS-4]=0;map[ROWS-4][COLS-3]=0;}
function startGame(){AudioSys.startHum();document.getElementById('overlay').style.display='none';loadLevel(level);loop();}function nextLevel(){level++;document.getElementById('levelNum').innerText=level;ctx.fillStyle="#FFF";ctx.fillRect(0,0,canvas.width,canvas.height);loadLevel(level);}
function calculateLaser(){laserPath=[];let startX=2,startY=2;let dirX=1;let dirY=0;let currX=startX*TILE_SIZE+TILE_SIZE/2;let currY=startY*TILE_SIZE+TILE_SIZE/2;laserPath.push({x:currX,y:currY});let maxSteps=100;let hitTarget=false;for(let i=0;i<maxSteps;i++){let nextGridX=Math.floor((currX+dirX*TILE_SIZE)/TILE_SIZE);let nextGridY=Math.floor((currY+dirY*TILE_SIZE)/TILE_SIZE);currX+=dirX*TILE_SIZE;currY+=dirY*TILE_SIZE;laserPath.push({x:currX,y:currY});if(nextGridX<0||nextGridX>=COLS||nextGridY<0||nextGridY>=ROWS)break;let tile=map[nextGridY][nextGridX];if(tile===1){createSparks(currX-dirX*20,currY-dirY*20);break;}else if(tile===9){hitTarget=true;break;}else if(tile===2){let oldDx=dirX;dirX=-dirY;dirY=-oldDx;}else if(tile===3){let oldDx=dirX;dirX=dirY;dirY=oldDx;}}if(hitTarget){targetCharge+=0.5;AudioSys.playCharge();if(Math.random()>0.5)createSparks(currX,currY,"#00ff00");}else{targetCharge=Math.max(0,targetCharge-1);}targetCharge=Math.min(100,targetCharge);document.getElementById('chargeNum').innerText=Math.floor(targetCharge)+"%";if(targetCharge>=100&&!isLevelComplete){nextLevel();}}
function createSparks(x,y,color="#FFD700"){if(particles.length>50)return;for(let i=0;i<3;i++){particles.push({x:x,y:y,vx:(Math.random()-0.5)*5,vy:(Math.random()-0.5)*5,life:1.0,color:color});}}
function draw(){ctx.fillStyle="rgba(15, 15, 10, 0.4)";ctx.fillRect(0,0,canvas.width,canvas.height);for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++){let tile=map[y][x];let px=x*TILE_SIZE;let py=y*TILE_SIZE;ctx.strokeStyle="#222";ctx.strokeRect(px,py,TILE_SIZE,TILE_SIZE);if(tile===1){ctx.fillStyle="#222";ctx.fillRect(px+2,py+2,TILE_SIZE-4,TILE_SIZE-4);ctx.fillStyle="#111";ctx.fillRect(px+10,py+10,TILE_SIZE-20,TILE_SIZE-20);}else if(tile===2||tile===3){ctx.save();ctx.translate(px+TILE_SIZE/2,py+TILE_SIZE/2);ctx.fillStyle="#333";ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(200, 200, 255, 0.8)";ctx.lineWidth=4;ctx.shadowBlur=10;ctx.shadowColor="cyan";ctx.beginPath();if(tile===2){ctx.moveTo(15,-15);ctx.lineTo(-15,15);}else{ctx.moveTo(-15,-15);ctx.lineTo(15,15);}ctx.stroke();ctx.restore();}else if(tile===8){ctx.fillStyle="#FFD700";ctx.shadowBlur=20;ctx.shadowColor="#FFD700";ctx.fillRect(px+10,py+10,30,30);ctx.shadowBlur=0;}else if(tile===9){ctx.fillStyle="#222";ctx.fillRect(px+5,py+5,40,40);ctx.fillStyle=targetCharge>0?"#00ff00":"#444";let size=30*(targetCharge/100);ctx.fillRect(px+25-size/2,py+25-size/2,size,size);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.strokeRect(px+5,py+5,40,40);}}}if(laserPath.length>1){ctx.beginPath();ctx.moveTo(laserPath[0].x,laserPath[0].y);for(let i=1;i<laserPath.length;i++){ctx.lineTo(laserPath[i].x,laserPath[i].y);}ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowBlur=15;ctx.shadowColor="#FFD700";ctx.strokeStyle="rgba(255, 215, 0, 0.5)";ctx.lineWidth=6;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle="#FFF";ctx.lineWidth=2;ctx.stroke();}for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.05;if(p.life<=0)particles.splice(i,1);else{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3);ctx.globalAlpha=1;}}}
function loop(){
    if (!document.getElementById('gameCanvas')) return;
    if(document.getElementById('overlay').style.display==='none'){calculateLaser();draw();}
    window.currentGameAnimationFrame = requestAnimationFrame(loop);
}
canvas.addEventListener('mousedown',e=>{const rect=canvas.getBoundingClientRect();const x=Math.floor((e.clientX-rect.left)/TILE_SIZE);const y=Math.floor((e.clientY-rect.top)/TILE_SIZE);if(x>=0&&x<COLS&&y>=0&&y<ROWS){let tile=map[y][x];if(tile===2){map[y][x]=3;AudioSys.playGlass();createSparks(x*TILE_SIZE+25,y*TILE_SIZE+25,"cyan");}else if(tile===3){map[y][x]=2;AudioSys.playGlass();createSparks(x*TILE_SIZE+25,y*TILE_SIZE+25,"cyan");}}});
</script></body></html>`;

    // MAPA DE JUEGOS
    const GAME_MAPPING = {
        'AURUM CORE': { content: GAME_AURUM_CORE_HTML, title: 'Aurum Core' },
        'SOLAR CIRCUIT': { content: GAME_SOLAR_CIRCUIT_HTML, title: 'Solar Circuit' },
        'DUNE DRIFTER': { content: GAME_DUNE_DRIFTER_HTML, title: 'Dune Drifter' },
        'TRIANGLE TACTICS': { content: GAME_TRIANGLE_TACTICS_HTML, title: 'Triangle Tactics' },
        'GILDED ROGUE': { content: GAME_GILDED_ROGUE_HTML, title: 'Gilded Rogue' },
        'AMBER ECHO': { content: GAME_AMBER_ECHO_HTML, title: 'Amber Echo' },
        'HEXA-VAULT': { content: GAME_HEXA_VAULT_HTML, title: 'Hexa-Vault' },
        'LIGHT PRISM': { content: GAME_LIGHT_PRISM_HTML, title: 'Light Prism' },
    };

    // --- ESTILOS CSS DEL MOTOR ---
    GM_addStyle(`
        body { margin: 0; padding: 0; background: #000 !important; overflow: hidden; }
        .original-site-content { display: none !important; }
        #triangle-engine-container {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000;
            z-index: 99999; display: flex; justify-content: center; align-items: center; overflow: hidden;
        }
        #engine-splash-gif {
            cursor: pointer; width: 200px; height: 200px; border-radius: 0%;

            animation: pulse 1.5s infinite alternate;
        }
        @keyframes pulse { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.1); opacity: 1; } }
    `);

    // --- INICIALIZACIÓN ---
    function init() {
        container = document.createElement('div');
        container.id = 'triangle-engine-container';
        if (document.body) {
            document.body.prepend(container);
            hideOriginalContent();
            showSplash();
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.prepend(container);
                hideOriginalContent();
                showSplash();
            });
        }
    }

    function hideOriginalContent() {
        Array.from(document.body.children).forEach(child => {
            if (child.id !== 'triangle-engine-container') {
                child.classList.add('original-site-content');
            }
        });
    }

    // --- MOTOR: LIMPIEZA Y EJECUCIÓN ---
    function cleanupEnvironment() {
        // 1. Matar loop del juego anterior
        if (window.currentGameAnimationFrame) {
            cancelAnimationFrame(window.currentGameAnimationFrame);
            window.currentGameAnimationFrame = null;
        }
        // 2. Intentar cerrar AudioContext del juego anterior
        if (window.currentAudioContext) {
            try {
                window.currentAudioContext.close();
            } catch(e) {}
            window.currentAudioContext = null;
        }
        // 3. Limpiar HTML
        container.innerHTML = '';
        document.title = 'Triangle Engine';
    }

    function setContentAndRun(htmlContent) {
        cleanupEnvironment();
        container.innerHTML = htmlContent;
        // Reinyección de scripts para forzar ejecución
        const scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }

    // --- PANTALLAS ---
    function showSplash() {
        cleanupEnvironment();
        const splashGif = document.createElement('img');
        splashGif.id = 'engine-splash-gif';
        splashGif.src = 'https://i.ibb.co/qFRdG3Gk/triangle2.gif';
        splashGif.onclick = showEngine;
        container.appendChild(splashGif);
    }

    function showEngine() {
        cleanupEnvironment();
        playStartup();
        container.innerHTML = TRIANGLE_ENGINE_SVG;
        setTimeout(() => {
            const optionsBtn = document.getElementById('options');
            if (optionsBtn) {
                optionsBtn.style.cursor = 'pointer';
                optionsBtn.addEventListener('click', showOptionsMenu);
            }
        }, 100);
    }

    function showOptionsMenu() {
        playClick();
        cleanupEnvironment();
        container.innerHTML = OPTIONS_MENU_SVG; // SVG Limpio
        setTimeout(() => {
            const svgDoc = container.querySelector('svg');
            if (!svgDoc) return;
            const gameButtonTexts = svgDoc.querySelectorAll('.btn-text');
            gameButtonTexts.forEach(textEl => {
                const gameName = textEl.textContent.trim();
                const btnGroup = textEl.closest('g');
                if (btnGroup) {
                    btnGroup.style.cursor = 'pointer';
                    btnGroup.addEventListener('click', () => {
                        if (GAME_MAPPING[gameName]) {
                            showGame(GAME_MAPPING[gameName]);
                        }
                    });
                }
            });
            // Buscar Botón BACK (buscando texto dentro de grupos)
            const allGroups = Array.from(svgDoc.querySelectorAll('g'));
            const backBtnGroup = allGroups.find(g => g.textContent.includes('BACK'));
            if (backBtnGroup) {
                backBtnGroup.style.cursor = 'pointer';
                backBtnGroup.addEventListener('click', showEngine);
            }
        }, 100);
    }

    function showGame(gameData) {
        playClick();
        setContentAndRun(gameData.content);
        document.title = gameData.title;
        setTimeout(() => {
            const backBtn = container.querySelector('.back-btn');
            if (backBtn) {
                backBtn.onclick = (e) => {
                    e.preventDefault();
                    showOptionsMenu();
                };
            }
        }, 100);
    }

    init();

})();