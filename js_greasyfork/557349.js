// ==UserScript==
// @name         Pentagon Engine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The Pentagon Engine is connected to Drawaria.online's stories and is designed for Utilities. It's made for the Pentagon Fairy and it serves a critical role in the story to save the game.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://i.ibb.co/TDtBp9cr/pentagon2.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557349/Pentagon%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/557349/Pentagon%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =====================================================================
    //                            A. RECURSOS (SVGs)
    // =====================================================================

    // 1. MENÚ PRINCIPAL (Tu archivo original limpiado)
    const SVG_MAIN = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -56.46 1139.321 711.453">
      <defs>
        <style>@import url(https://fonts.googleapis.com/css2?family=Allan%3Aital%2Cwght%400%2C400%3B0%2C700&amp;display=swap);</style>
        <filter id="drop-shadow-filter-0" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
          <feOffset dx="2" dy="2"/>
          <feComponentTransfer result="offsetblur"><feFuncA type="linear" slope="1"/></feComponentTransfer>
          <feFlood flood-color="rgba(0,0,0,0.3)"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="inner-shadow-filter-0" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="0"/><feGaussianBlur stdDeviation="10"/><feComposite operator="out" in="SourceGraphic"/>
          <feComponentTransfer result="choke"><feFuncA type="linear" slope="1"/></feComponentTransfer>
          <feFlood flood-color="#f7a4e2b3" result="color"/>
          <feComposite operator="in" in="color" in2="choke" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
        <filter id="drop-shadow-filter-1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="7"/>
          <feOffset dx="0" dy="0"/>
          <feComponentTransfer result="offsetblur"><feFuncA type="linear" slope="1"/></feComponentTransfer>
          <feFlood flood-color="#ffcffc4d"/>
          <feComposite in2="offsetblur" operator="in"/>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g transform="matrix(1, 0, 0, 1, -150, -1)">
        <g>
          <path d="M 858.492 13.13 L 896.836 127.244 L 1013.596 129.706 L 920.534 202.694 L 954.352 318.329 L 858.492 249.324 L 762.632 318.329 L 796.45 202.694 L 703.388 129.706 L 820.148 127.244 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(254, 209, 254); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.998051, -0.062409, 0.062409, 0.998051, 0.000245, 0.00004)"/>
          <path d="M 604.28 29.679 L 642.624 143.793 L 759.384 146.255 L 666.322 219.243 L 700.14 334.878 L 604.28 265.873 L 508.42 334.878 L 542.238 219.243 L 449.176 146.255 L 565.936 143.793 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(254, 209, 254); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999433, -0.033674, 0.033674, 0.999433, 0.000058, 0.000004)"/>
          <path d="M 856.404 -533.18 L 894.748 -419.066 L 1011.508 -416.604 L 918.446 -343.616 L 952.264 -227.981 L 856.404 -296.986 L 760.544 -227.981 L 794.362 -343.616 L 701.3 -416.604 L 818.06 -419.066 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(254, 209, 254); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.999683, -0.025188, -0.025188, -0.999683, 2.000276, 763.161008)"/>
          <path d="M 606.193 -553.24 L 644.537 -439.126 L 761.297 -436.664 L 668.235 -363.676 L 702.053 -248.041 L 606.193 -317.046 L 510.333 -248.041 L 544.151 -363.676 L 451.089 -436.664 L 567.849 -439.126 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(254, 209, 254); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
          <path d="M 731.365 -29.691 L 883.733 23.886 L 825.533 110.575 L 637.197 110.575 L 578.997 23.886 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(77, 11, 75); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
          <path d="M 633.802 1.641 L 786.17 55.218 L 727.97 141.907 L 539.634 141.907 L 481.434 55.218 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(77, 11, 75); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0, 1, -1, 0, 364.577445, 195.125862)"/>
          <path d="M 633.802 1.641 L 786.17 55.218 L 727.97 141.907 L 539.634 141.907 L 481.434 55.218 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(77, 11, 75); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-origin: 633.802px 71.774px;" transform="matrix(0, 1, 1, 0, -176.640518, 221.82756)"/>
          <path d="M 736.499 -606.107 L 888.867 -552.53 L 830.667 -465.841 L 642.331 -465.841 L 584.131 -552.53 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(77, 11, 75); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-origin: 736.499px -535.968px;" transform="matrix(1, 0, 0, -1, 0, 1071.936035)"/>
          <rect x="517.753" y="96.678" width="437.493" height="379.982" rx="6" ry="6" style="fill: rgb(103, 11, 100); stroke-width: 4px; stroke: rgb(252, 190, 252); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
          <path d="M 731.448 126.931 L 910.62 242.341 L 842.183 429.078 L 620.713 429.078 L 552.276 242.341 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(139, 32, 136); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
          <path d="M 571.598 123.034 H 893.823 L 913.823 143.034 V 201.303 L 893.823 221.303 H 571.598 L 551.598 201.303 V 143.034 L 571.598 123.034 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(252, 133, 252); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
          <text style="fill: rgb(255, 206, 248); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);" transform="matrix(2.287659, 0, 0, 1.64183, -23.274017, -6.2808)" x="258.793" y="115.282">Pentagon Engine</text>
        </g>
        <g transform="matrix(1, 0, 0, 1, -503.429565, 3.216802)" id="btn-open-options" style="cursor: pointer;">
          <rect x="1143.95" y="262.78" width="183.347" height="100.881" rx="22" ry="22" style="fill: rgb(255, 134, 221); stroke: rgb(252, 190, 252); stroke-miterlimit: 6.84; stroke-width: 4px; filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
          <path d="M 1236.241 250.415 H 1236.241 A 60.561 65.703 0 0 0 1296.801 316.118 V 316.118 A 60.561 65.703 0 0 0 1236.241 381.821 H 1236.241 A 60.561 65.703 0 0 0 1175.68 316.118 V 316.118 A 60.561 65.703 0 0 0 1236.241 250.415 Z" style="stroke-width: 4px; stroke: rgb(252, 190, 252); fill: rgb(241, 153, 241); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
          <text style="fill: rgb(74, 14, 66); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);" transform="matrix(2.287659, 0, 0, 1.64183, 565.276489, 138.929993)" x="258.793" y="115.282">Options</text>
        </g>
      </g>
    </svg>`;

    // 2. MENÚ DE OPCIONES (Hexagonal HUD)
    // Se han añadido IDs a los grupos para poder detectarlos con JS
    const SVG_OPTIONS = `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="main-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4a004a;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#2e002e;stop-opacity:0.9" />
        </linearGradient>
        <radialGradient id="center-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#ffb3ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d600d6;stop-opacity:1" />
        </radialGradient>
      </defs>
      <style>
        text { font-family: 'Courier New', monospace; font-weight: bold; pointer-events: none; }
        .bg-rect { fill: #1a051a; }
        .hex-btn { cursor: pointer; transition: all 0.3s ease; }
        .hex-shape { fill: url(#main-grad); stroke: #d600d6; stroke-width: 2; filter: url(#neon-glow); }
        .hex-label { fill: #ffffff; font-size: 14px; text-shadow: 0 0 5px #d600d6; }
        .hex-btn:hover .hex-shape { fill: #5e005e; stroke: #ffffff; stroke-width: 3; }
        .hex-btn:hover .hex-label { fill: #ffb3ff; font-size: 15px; }
        .overdrive .hex-shape { stroke: #ffb3ff; }
        .overdrive:hover .hex-shape { fill: #d600d6; stroke: #ffffff; }
        .grid-line { stroke: #4a004a; stroke-width: 1; opacity: 0.5; }
      </style>
      <rect class="bg-rect" width="100%" height="100%" />
      <line x1="400" y1="300" x2="400" y2="130" class="grid-line" stroke="#d600d6" stroke-width="2"/>
      <line x1="400" y1="300" x2="550" y2="210" class="grid-line" stroke="#d600d6" stroke-width="2"/>
      <line x1="400" y1="300" x2="550" y2="390" class="grid-line" stroke="#d600d6" stroke-width="2"/>
      <line x1="400" y1="300" x2="400" y2="470" class="grid-line" stroke="#d600d6" stroke-width="2"/>
      <line x1="400" y1="300" x2="250" y2="390" class="grid-line" stroke="#d600d6" stroke-width="2"/>
      <line x1="400" y1="300" x2="250" y2="210" class="grid-line" stroke="#d600d6" stroke-width="2"/>
      <text x="400" y="50" text-anchor="middle" fill="#ffb3ff" font-size="24" filter="url(#neon-glow)">PENTAGON ENGINE</text>

      <g transform="translate(400, 300)" id="btn-options-back" style="cursor: pointer;">
        <polygon points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#ffb3ff" stroke-width="4" filter="url(#neon-glow)"/>
        <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" fill="url(#center-grad)" opacity="0.8"/>
        <text x="0" y="5" text-anchor="middle" fill="#2e002e" font-size="16">CLOSE</text>
      </g>
      <g class="hex-btn" transform="translate(400, 130)" id="btn-audio">
        <polygon class="hex-shape" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />
        <text class="hex-label" x="0" y="5" text-anchor="middle">AUDIO</text>
      </g>
      <g class="hex-btn" transform="translate(550, 210)" id="btn-visual">
        <polygon class="hex-shape" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />
        <text class="hex-label" x="0" y="5" text-anchor="middle">VISUAL</text>
      </g>
      <g class="hex-btn" transform="translate(550, 390)" id="btn-net">
        <polygon class="hex-shape" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />
        <text class="hex-label" x="0" y="5" text-anchor="middle">NET</text>
      </g>
      <g class="hex-btn" transform="translate(400, 470)" id="btn-data">
        <polygon class="hex-shape" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />
        <text class="hex-label" x="0" y="5" text-anchor="middle">DATA</text>
      </g>
      <g class="hex-btn" transform="translate(250, 390)" id="btn-debug">
        <polygon class="hex-shape" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />
        <text class="hex-label" x="0" y="5" text-anchor="middle">DEBUG</text>
      </g>
      <g class="hex-btn overdrive" transform="translate(250, 210)" id="btn-overdrive">
        <polygon points="0,-45 40,-22 40,22 0,45 -40,22 -40,-22" fill="none" stroke="#ffb3ff" stroke-width="1" opacity="0.5"/>
        <polygon class="hex-shape" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />
        <text class="hex-label" x="0" y="5" text-anchor="middle" font-weight="900">POWER</text>
      </g>
    </svg>`;

    // 3. UTILIDADES (SVGs 1-6)
    const SVG_AUDIO = `
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="audio-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="bar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style="stop-color:#4a004a;stop-opacity:1" /><stop offset="60%" style="stop-color:#d600d6;stop-opacity:1" /><stop offset="100%" style="stop-color:#ffb3ff;stop-opacity:1" />
        </linearGradient>
        <style>.hud-text { font-family: 'Courier New', monospace; fill: #ffb3ff; font-weight: bold; } .label-text { font-family: Arial, sans-serif; fill: #d600d6; font-size: 12px; }</style>
      </defs>
      <rect x="10" y="10" width="580" height="380" rx="15" fill="#1a051a" stroke="#d600d6" stroke-width="2" filter="url(#audio-glow)"/>
      <text x="30" y="40" class="hud-text" font-size="18">:: AUDIO_SYNTH MODULE // v1.4 ::</text>
      <line x1="30" y1="300" x2="570" y2="300" stroke="#4a004a" stroke-width="2"/>
      <g filter="url(#audio-glow)">
        <rect x="50" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="20;200;50;250;20" dur="2s" repeatCount="indefinite" /><animate attributeName="y" values="280;100;250;50;280" dur="2s" repeatCount="indefinite" /></rect>
        <rect x="100" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="30;150;80;120;30" dur="1.3s" repeatCount="indefinite" /><animate attributeName="y" values="270;150;220;180;270" dur="1.3s" repeatCount="indefinite" /></rect>
        <rect x="150" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="50;220;100;180;50" dur="1.7s" repeatCount="indefinite" /><animate attributeName="y" values="250;80;200;120;250" dur="1.7s" repeatCount="indefinite" /></rect>
        <rect x="200" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="10;100;30;80;10" dur="0.8s" repeatCount="indefinite" /><animate attributeName="y" values="290;200;270;220;290" dur="0.8s" repeatCount="indefinite" /></rect>
        <rect x="250" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="40;180;60;140;40" dur="1.5s" repeatCount="indefinite" /><animate attributeName="y" values="260;120;240;160;260" dur="1.5s" repeatCount="indefinite" /></rect>
        <rect x="300" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="20;230;40;190;20" dur="1.9s" repeatCount="indefinite" /><animate attributeName="y" values="280;70;260;110;280" dur="1.9s" repeatCount="indefinite" /></rect>
        <rect x="350" width="40" fill="url(#bar-grad)"><animate attributeName="height" values="10;80;20;60;10" dur="0.5s" repeatCount="indefinite" /><animate attributeName="y" values="290;220;280;240;290" dur="0.5s" repeatCount="indefinite" /></rect>
      </g>
    </svg>`;

    const SVG_VISUAL = `
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="visual-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4a004a" stroke-width="1"/></pattern>
        <style>.header-text { font-family: 'Courier New', monospace; fill: #ffb3ff; font-weight: bold; font-size: 18px; } .label-text { font-family: Arial, sans-serif; fill: #d600d6; font-size: 12px; font-weight: bold; } .value-text { font-family: 'Courier New', monospace; fill: #ffffff; font-size: 12px; } .fps-text { font-family: 'Courier New', monospace; fill: #ffb3ff; font-size: 24px; font-weight: bold; }</style>
      </defs>
      <rect x="10" y="10" width="580" height="380" rx="15" fill="#1a051a" stroke="#d600d6" stroke-width="2" filter="url(#visual-glow)"/>
      <text x="30" y="40" class="header-text">:: VISUAL_CORE // RENDER SETTINGS ::</text>
      <g transform="translate(40, 80)">
        <text x="0" y="0" class="label-text">BLOOM INTENSITY</text><line x1="0" y1="15" x2="200" y2="15" stroke="#4a004a" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="15" x2="140" y2="15" stroke="#d600d6" stroke-width="4" stroke-linecap="round"><animate attributeName="x2" values="50;180;120;140" dur="4s" repeatCount="indefinite" /></line><circle cy="15" r="6" fill="#ffb3ff" filter="url(#visual-glow)"><animate attributeName="cx" values="50;180;120;140" dur="4s" repeatCount="indefinite" /></circle><text x="210" y="20" class="value-text">HIGH</text>
        <g transform="translate(0, 60)"><text x="0" y="0" class="label-text">CHROMATIC ABERRATION</text><line x1="0" y1="15" x2="200" y2="15" stroke="#4a004a" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="15" x2="40" y2="15" stroke="#d600d6" stroke-width="4" stroke-linecap="round"><animate attributeName="x2" values="20;80;10;40" dur="5s" repeatCount="indefinite" /></line><circle cy="15" r="6" fill="#ffb3ff" filter="url(#visual-glow)"><animate attributeName="cx" values="20;80;10;40" dur="5s" repeatCount="indefinite" /></circle><text x="210" y="20" class="value-text">LOW</text></g>
        <g transform="translate(0, 120)"><text x="0" y="0" class="label-text">PARTICLE DENSITY</text><line x1="0" y1="15" x2="200" y2="15" stroke="#4a004a" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="15" x2="190" y2="15" stroke="#d600d6" stroke-width="4" stroke-linecap="round"/><circle cx="190" cy="15" r="6" fill="#ffb3ff" filter="url(#visual-glow)"/><text x="210" y="20" class="value-text">ULTRA</text></g>
      </g>
      <g transform="translate(320, 80)">
        <rect x="0" y="0" width="240" height="240" fill="url(#grid)" stroke="#4a004a" stroke-width="2"/>
        <text x="10" y="30" class="fps-text">FPS: <animate attributeName="opacity" values="1;0.7;1" dur="0.1s" repeatCount="indefinite"/></text>
        <text x="70" y="30" class="fps-text" fill="#ffffff">60<animate attributeName="innerHTML" values="60;59;60;61;120;58" dur="1s" repeatCount="indefinite"/></text>
        <g transform="translate(120, 120)"><g filter="url(#visual-glow)"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite"/><rect x="-40" y="-40" width="80" height="80" fill="none" stroke="#4a004a" stroke-width="2"/><line x1="-40" y1="-40" x2="-25" y2="-25" stroke="#d600d6" stroke-width="1"/><line x1="40" y1="-40" x2="55" y2="-25" stroke="#d600d6" stroke-width="1"/><line x1="40" y1="40" x2="55" y2="55" stroke="#d600d6" stroke-width="1"/><line x1="-40" y1="40" x2="-25" y2="55" stroke="#d600d6" stroke-width="1"/><g><rect x="-55" y="-55" width="110" height="110" fill="none" stroke="#ffb3ff" stroke-width="2" opacity="0.8"/><animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="5s" repeatCount="indefinite"/></g></g></g>
      </g>
    </svg>`;

    const SVG_NET = `
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="net-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <g id="server-node"><polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#1a051a" stroke="#d600d6" stroke-width="2"/><circle cx="0" cy="0" r="3" fill="#ffb3ff"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/></circle></g>
        <style>.tech-text { font-family: 'Courier New', monospace; fill: #ffb3ff; font-size: 14px; } .tiny-text { font-family: Arial, sans-serif; fill: #d600d6; font-size: 10px; }</style>
      </defs>
      <rect x="10" y="10" width="580" height="380" rx="15" fill="#1a051a" stroke="#d600d6" stroke-width="2" filter="url(#net-glow)"/>
      <text x="30" y="40" class="tech-text" font-size="18">:: NET_LINK // SERVER STATUS ::</text>
      <g transform="translate(40, 60)">
        <path d="M0 0 L350 0 M0 50 L350 50 M0 100 L350 100 M0 150 L350 150 M0 200 L350 200" stroke="#4a004a" stroke-width="1" stroke-dasharray="2,2"/>
        <path id="link1" d="M50 50 L250 150" stroke="#4a004a" stroke-width="2"/>
        <path id="link2" d="M250 150 L300 50" stroke="#4a004a" stroke-width="2"/>
        <path id="link3" d="M300 50 L50 50" stroke="#4a004a" stroke-width="2"/>
        <circle r="3" fill="#ffb3ff" filter="url(#net-glow)"><animateMotion dur="1.5s" repeatCount="indefinite"><mpath href="#link1"/></animateMotion></circle>
        <use href="#server-node" x="50" y="50" /><text x="40" y="40" class="tiny-text">US-EAST</text>
        <use href="#server-node" x="250" y="150" /><text x="240" y="170" class="tiny-text">SA-BRAZIL</text>
        <use href="#server-node" x="300" y="50" /><text x="290" y="40" class="tiny-text">EU-WEST</text>
        <g transform="translate(175, 100)"><path d="M0 0 L150 -50 A 160 160 0 0 1 150 50 Z" fill="#d600d6" opacity="0.1"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite"/></path></g>
      </g>
    </svg>`;

    const SVG_DATA = `
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="data-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <symbol id="hex-folder" viewBox="0 0 40 40"><polygon points="20,5 35,12 35,28 20,35 5,28 5,12" fill="none" stroke="#d600d6" stroke-width="2"/><rect x="12" y="15" width="16" height="10" fill="#d600d6" opacity="0.5"/><path d="M12 15 L16 12 L24 12 L28 15" fill="#d600d6" opacity="0.5"/></symbol>
        <linearGradient id="usage-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#d600d6;stop-opacity:1" /><stop offset="100%" style="stop-color:#ffb3ff;stop-opacity:1" /></linearGradient>
        <style>.header-text { font-family: 'Courier New', monospace; fill: #ffb3ff; font-weight: bold; font-size: 18px; } .file-text { font-family: 'Courier New', monospace; fill: #ffffff; font-size: 12px; } .meta-text { font-family: Arial, sans-serif; fill: #d600d6; font-size: 10px; }</style>
      </defs>
      <rect x="10" y="10" width="580" height="380" rx="15" fill="#1a051a" stroke="#d600d6" stroke-width="2" filter="url(#data-glow)"/>
      <text x="30" y="40" class="header-text">:: DATA_VAULT // FILE MANAGER ::</text>
      <g transform="translate(30, 70)">
        <use href="#hex-folder" x="0" y="0" width="40" height="40" /><text x="45" y="25" class="file-text" fill="#ffb3ff">/ROOT</text>
        <g transform="translate(20, 60)"><line x1="-20" y1="20" x2="0" y2="20" stroke="#d600d6" stroke-width="2"/><use href="#hex-folder" x="0" y="0" width="40" height="40"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></use><text x="45" y="25" class="file-text" font-weight="bold" fill="#ffb3ff">/SAVES</text></g>
      </g>
      <g transform="translate(250, 70)">
        <rect x="0" y="0" width="320" height="230" fill="#000000" fill-opacity="0.3" stroke="#4a004a"/>
        <g class="file-row" transform="translate(0, 30)"><rect x="2" y="-10" width="316" height="25" fill="transparent" rx="5"/><text x="10" y="5" class="file-text">save_slot_01.sav</text><text x="180" y="5" class="meta-text">12.4 MB</text></g>
        <g class="file-row" transform="translate(0, 120)"><text x="10" y="5" class="file-text" fill="#ff0055">!! CORRUPTED_DATA !!</text><animate attributeName="opacity" values="1;0.5;1" dur="0.2s" repeatCount="indefinite"/></g>
      </g>
      <g transform="translate(30, 320)"><text x="0" y="-10" class="meta-text">MEMORY USAGE: 74%</text><path d="M0,0 L540,0 L530,15 L-10,15 Z" fill="#2e002e" stroke="#4a004a"/><path d="M0,0 L400,0 L390,15 L-10,15 Z" fill="url(#usage-grad)" filter="url(#data-glow)"/></g>
    </svg>`;

    const SVG_DEBUG = `
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="4" height="1" fill="#000000" opacity="0.3"/></pattern>
        <clipPath id="screen-mask"><rect x="20" y="60" width="560" height="280"/></clipPath>
        <style>.term-text { font-family: 'Courier New', monospace; fill: #ffb3ff; font-size: 12px; } .term-highlight { fill: #ffffff; font-weight: bold; }</style>
      </defs>
      <rect x="10" y="10" width="580" height="380" rx="5" fill="#0f000f" stroke="#d600d6" stroke-width="2"/>
      <rect x="12" y="12" width="576" height="30" fill="#2e002e" opacity="0.8"/>
      <text x="30" y="32" class="term-text" font-weight="bold">root@pentagon_engine:~/kernel/debug_log</text>
      <g clip-path="url(#screen-mask)">
        <g font-family="'Courier New', monospace" font-size="12">
          <animateTransform attributeName="transform" type="translate" from="0 280" to="0 -200" dur="15s" repeatCount="indefinite" />
          <text x="30" y="0" class="term-text">[INIT] Boot sequence started...</text><text x="30" y="40" class="term-text">[MEM] Checking RAM integrity (64GB)...</text><text x="30" y="100" class="term-highlight">>> MOUNTING VIRTUAL DRIVES...</text><text x="30" y="360" class="term-highlight">>> ENGINE READY.</text>
        </g>
      </g>
      <rect x="420" y="60" width="160" height="280" fill="#000000" opacity="0.5"/>
      <g font-family="'Courier New', monospace" font-size="10" fill="#d600d6" transform="translate(430, 80)"><text x="0" y="0">00 4F A2 1B</text><g><animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite"/><text x="0" y="105" fill="#ffb3ff">DANGER CODE</text></g></g>
      <rect x="10" y="10" width="580" height="380" fill="url(#scanlines)" pointer-events="none"/>
    </svg>`;

    const SVG_OVERDRIVE = `
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="overdrive-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#d600d6;stop-opacity:1" />
        </radialGradient>
        <pattern id="warning-stripe" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect x="0" y="0" width="10" height="20" fill="#2e002e"/><rect x="10" y="0" width="10" height="20" fill="#4a004a"/></pattern>
        <style>.big-number { font-family: 'Arial Black', sans-serif; fill: #ffffff; font-size: 48px; font-weight: 900; } .warning-text { font-family: Arial, sans-serif; fill: #ffffff; font-weight: bold; font-size: 14px; letter-spacing: 2px; }</style>
      </defs>
      <rect x="10" y="10" width="580" height="380" rx="15" fill="url(#warning-stripe)" stroke="#ffffff" stroke-width="3"/>
      <rect x="10" y="10" width="580" height="380" rx="15" fill="#d600d6" opacity="0"><animate attributeName="opacity" values="0;0.3;0" dur="0.5s" repeatCount="indefinite"/></rect>
      <text x="300" y="50" text-anchor="middle" font-family="'Courier New', monospace" font-weight="bold" font-size="24" fill="#ffffff" filter="url(#overdrive-glow)">!!! SYSTEM OVERDRIVE !!!</text>
      <g transform="translate(300, 200)">
        <animateTransform attributeName="transform" type="translate" values="299,199; 301,201; 298,202; 302,198; 300,200" dur="0.1s" repeatCount="indefinite"/>
        <circle cx="0" cy="0" r="120" fill="none" stroke="#d600d6" stroke-width="10" stroke-dasharray="20,10"><animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite"/></circle>
        <circle cx="0" cy="0" r="80" fill="url(#core-grad)" filter="url(#overdrive-glow)"><animate attributeName="r" values="80;85;78;88;80" dur="0.2s" repeatCount="indefinite"/></circle>
        <text x="0" y="15" text-anchor="middle" class="big-number">145%</text>
      </g>
      <rect x="150" y="350" width="300" height="30" fill="#d600d6"><animate attributeName="fill" values="#d600d6;#4a004a;#d600d6" dur="0.5s" repeatCount="indefinite"/></rect>
      <text x="300" y="370" text-anchor="middle" class="warning-text">WARNING: CORE UNSTABLE</text>
    </svg>`;

    // =====================================================================
    //                            B. CONFIGURACIÓN
    // =====================================================================

    const ACTIVATOR_GIF = 'https://i.ibb.co/TDtBp9cr/pentagon2.gif';
    const STARTUP_SOUND = 'https://www.myinstants.com/media/sounds/windows-vista-beta-2006-startup.mp3';
    const CLICK_SOUND = 'https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3';

    const VIEWS = ['main', 'options', 'audio', 'visual', 'net', 'data', 'debug', 'overdrive'];

    let startupAudio;
    let clickAudio;

    // =====================================================================
    //                            C. FUNCIONES DE LÓGICA
    // =====================================================================

    function playSound(audioObject) {
        if (audioObject) {
            audioObject.currentTime = 0;
            audioObject.play().catch(e => console.log("Error al reproducir audio:", e));
        }
    }

    function showView(viewId, isStartup = false) {
        VIEWS.forEach(id => {
            const container = document.getElementById(`pentagon-engine-${id}`);
            if (container) {
                container.style.display = (id === viewId) ? 'block' : 'none';
            }
        });

        // Controlar visibilidad del botón de "ATRAS" universal para los sub-menús
        const backBtn = document.getElementById('pentagon-universal-back');
        if (backBtn) {
            // Mostrar botón "BACK" solo si NO estamos en main ni en options (los modulos necesitan volver a options)
            // O si estamos en options y queremos volver a main, usamos el boton central del SVG, pero
            // podemos poner un back flotante para los módulos.
            if (viewId !== 'main' && viewId !== 'options') {
                backBtn.style.display = 'block';
                backBtn.onclick = () => showView('options');
            } else {
                backBtn.style.display = 'none';
            }
        }

        if (!isStartup) playSound(clickAudio);
    }

    function activateEngine() {
        const activator = document.getElementById('pentagon-engine-activator');
        const mainContainer = document.getElementById('pentagon-engine-container');

        if (activator) activator.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';

        playSound(startupAudio);
        showView('main', true);

        // Adjuntar listeners después de que el DOM está listo
        attachListeners();
    }

    function attachListeners() {
        const mainContainer = document.getElementById('pentagon-engine-container');
        if (!mainContainer) return;

        // 1. Botón OPTIONS en el Menú Principal
        const btnOpenOptions = document.getElementById('btn-open-options');
        if (btnOpenOptions) {
            btnOpenOptions.addEventListener('click', () => showView('options'));
        }

        // 2. Botones del Menú de Opciones (Hexagonal)
        const btnAudio = document.getElementById('btn-audio');
        const btnVisual = document.getElementById('btn-visual');
        const btnNet = document.getElementById('btn-net');
        const btnData = document.getElementById('btn-data');
        const btnDebug = document.getElementById('btn-debug');
        const btnOverdrive = document.getElementById('btn-overdrive');
        const btnOptionsBack = document.getElementById('btn-options-back'); // El botón central

        if (btnAudio) btnAudio.addEventListener('click', () => showView('audio'));
        if (btnVisual) btnVisual.addEventListener('click', () => showView('visual'));
        if (btnNet) btnNet.addEventListener('click', () => showView('net'));
        if (btnData) btnData.addEventListener('click', () => showView('data'));
        if (btnDebug) btnDebug.addEventListener('click', () => showView('debug'));
        if (btnOverdrive) btnOverdrive.addEventListener('click', () => showView('overdrive'));

        // Botón central del menú de opciones para volver al Main
        if (btnOptionsBack) btnOptionsBack.addEventListener('click', () => showView('main'));
    }

    // =====================================================================
    //                            D. CSS Y DOM SETUP
    // =====================================================================

    GM_addStyle(`
        @keyframes circular-motion {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, 20px) rotate(90deg); }
            50% { transform: translate(0, 40px) rotate(180deg); }
            75% { transform: translate(-20px, 20px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        #pentagon-engine-activator {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 99999; cursor: pointer; width: 100px; height: 100px;
            animation: circular-motion 8s linear infinite;
            filter: drop-shadow(0 0 5px #00FFFF) drop-shadow(0 0 10px #0000FF);
        }
        #pentagon-engine-activator img { width: 100%; height: 100%; }

        #pentagon-engine-container {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 99999; display: none;
        }
        #pentagon-engine-container > div {
            display: none; width: 800px; height: 600px;
        }
        #pentagon-engine-container svg { width: 100%; height: 100%; }

        /* Botón Universal de Regreso (Flotante) */
        #pentagon-universal-back {
            position: absolute; top: 20px; right: 20px;
            padding: 10px 20px; background: rgba(0,0,0,0.8);
            border: 2px solid #ffb3ff; color: #ffb3ff;
            font-family: 'Courier New', monospace; font-weight: bold;
            cursor: pointer; z-index: 100000; border-radius: 5px;
            box-shadow: 0 0 10px #d600d6; display: none;
            transition: all 0.2s;
        }
        #pentagon-universal-back:hover {
            background: #d600d6; color: white;
        }
    `);

    startupAudio = new Audio(STARTUP_SOUND);
    clickAudio = new Audio(CLICK_SOUND);

    function createActivator() {
        const activatorDiv = document.createElement('div');
        activatorDiv.id = 'pentagon-engine-activator';
        const img = document.createElement('img');
        img.src = ACTIVATOR_GIF;
        activatorDiv.appendChild(img);
        activatorDiv.addEventListener('click', activateEngine);
        document.body.appendChild(activatorDiv);
    }

    function createMenuContainers() {
        const mainContainer = document.createElement('div');
        mainContainer.id = 'pentagon-engine-container';

        // Helper para crear vistas
        const createView = (id, content) => {
            const div = document.createElement('div');
            div.id = `pentagon-engine-${id}`;
            div.innerHTML = content;
            mainContainer.appendChild(div);
        };

        createView('main', SVG_MAIN);
        createView('options', SVG_OPTIONS);
        createView('audio', SVG_AUDIO);
        createView('visual', SVG_VISUAL);
        createView('net', SVG_NET);
        createView('data', SVG_DATA);
        createView('debug', SVG_DEBUG);
        createView('overdrive', SVG_OVERDRIVE);

        // Crear el botón de regreso flotante dentro del contenedor principal
        const backBtn = document.createElement('button');
        backBtn.id = 'pentagon-universal-back';
        backBtn.innerText = "<< BACK";
        mainContainer.appendChild(backBtn);

        document.body.appendChild(mainContainer);
    }

    // INICIO
    createActivator();
    createMenuContainers();

})();