// ==UserScript==
// @name         Cubic Engine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The Cubic Engine is connected to Drawaria.online's stories and is designed for magic effects. It's made for the Cube Fairy and it serves a critical role in the story to save the game.
// @author       YouTubeDrawaria
// @match        *://drawaria.online/*
// @match        *://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://i.ibb.co/mLKfYmc/cube2.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557337/Cubic%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/557337/Cubic%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CORE CONFIGURATIONS ---
    const CUBE_GIF_URL = 'https://i.ibb.co/mLKfYmc/cube2.gif';
    const STARTUP_SOUND_URL = 'https://www.myinstants.com/media/sounds/windows-vista-beta-2006-startup.mp3';
    const CLICK_SOUND_URL = 'https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3';
    const menuContainerId = 'cubic-engine-container';
    let menuContainer = null;
    let initialCube = null;

    // --- CONTENIDO SVG (OPTIMIZADO) ---
    // Nota: Se mantiene tu SVG original, funciona bien.

    let CUBE_ENGINE_SVG = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 822.838 504.166" xmlns:bx="https://boxy-svg.com">
  <defs>
    <style bx:fonts="Allan">@import url(https://fonts.googleapis.com/css2?family=Allan%3Aital%2Cwght%400%2C400%3B0%2C700&amp;display=swap);</style>
    <bx:export>
      <bx:file format="png" path="cubic-engine.png"/>
    </bx:export>
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
    <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 10 0.5 #86f6f7b3" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="0" dy="0"/>
      <feGaussianBlur stdDeviation="10"/>
      <feComposite operator="out" in="SourceGraphic"/>
      <feComponentTransfer result="choke">
        <feFuncA type="linear" slope="1"/>
      </feComponentTransfer>
      <feFlood flood-color="#86f6f7b3" result="color"/>
      <feComposite operator="in" in="color" in2="choke" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
    <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 0 0 13 1 #a2ccfe4d" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="13"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-2" type="linear" slope="2"/>
      </feComponentTransfer>
      <feFlood flood-color="#a2ccfe4d"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="drop-shadow-filter-3" bx:preset="drop-shadow 1 0 0 13 1 #a2ccfec6" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="13"/>
      <feOffset dx="0" dy="0"/>
      <feComponentTransfer result="offsetblur">
        <feFuncA id="spread-ctrl-3" type="linear" slope="2"/>
      </feComponentTransfer>
      <feFlood flood-color="#a2ccfec6"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g transform="matrix(1, 0, 0, 1, -101.264099, -46.93655)">
    <path d="M 338.54 83.203 H 682.366 V 83.203 H 682.366 V 172.419 H 682.366 V 172.419 H 338.54 V 172.419 H 338.54 V 83.203 H 338.54 V 83.203 Z" bx:shape="rect 338.54 83.203 343.826 89.216 3 0 0 2@3e05f2ae" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(36, 195, 235); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 340.839 316.551 H 680.278 V 316.551 H 680.278 V 399.187 H 680.278 V 399.187 H 340.839 V 399.187 H 340.839 V 316.551 H 340.839 V 316.551 Z" bx:shape="rect 340.839 316.551 339.439 82.636 3 0 0 2@7d1af0a0" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(36, 195, 235); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 325.298 133.927 H 422.42 V 133.927 H 422.42 V 351.885 H 422.42 V 351.885 H 325.298 V 351.885 H 325.298 V 133.927 H 325.298 V 133.927 Z" bx:shape="rect 325.298 133.927 97.122 217.958 3 0 0 2@38ccb5e1" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(17, 27, 194); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 388.54 75.203 H 635.861 V 75.203 H 635.861 V 164.419 H 635.861 V 164.419 H 388.54 V 164.419 H 388.54 V 75.203 H 388.54 V 75.203 Z" bx:shape="rect 388.54 75.203 247.321 89.216 3 0 0 2@8b60e454" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(17, 27, 194); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 620.05 132.799 H 692.326 V 132.799 H 692.326 V 341.723 H 692.326 V 341.723 H 620.05 V 341.723 H 620.05 V 132.799 H 620.05 V 132.799 Z" bx:shape="rect 620.05 132.799 72.276 208.924 3 0 0 2@2081d5bd" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(17, 27, 194); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 381.764 327.041 H 647.155 V 327.041 H 647.155 V 413.999 H 647.155 V 413.999 H 381.764 V 413.999 H 381.764 V 327.041 H 381.764 V 327.041 Z" bx:shape="rect 381.764 327.041 265.391 86.958 3 0 0 2@8f7cc8c9" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(17, 27, 194); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 358.048 102.306 H 661.835 V 102.306 H 661.835 V 384.636 H 661.835 V 384.636 H 358.048 V 384.636 H 358.048 V 102.306 H 358.048 V 102.306 Z" bx:shape="rect 358.048 102.306 303.787 282.33 3 0 0 2@29f19b1b" style="fill: rgb(25, 38, 255); stroke: rgb(101, 252, 255); stroke-width: 2.696; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 379.144 117.711 H 632.905 V 126.815 H 642.009 V 161.78 H 632.905 V 170.884 H 379.144 V 161.78 H 370.04 V 126.815 H 379.144 V 117.711 Z" bx:shape="rect 370.04 117.711 271.969 53.173 3 9.104 9.104 2@3e7b4b2e" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(29, 34, 212); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 381.784 184.832 H 633.751 V 193.089 H 642.008 V 350.913 H 633.751 V 359.17 H 381.784 V 350.913 H 373.527 V 193.089 H 381.784 V 184.832 Z" bx:shape="rect 373.527 184.832 268.481 174.338 3 8.257 8.257 2@888b19d7" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(36, 195, 235); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <text style="fill: rgb(102, 242, 250); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-3&quot;);" transform="matrix(1.61565, 0, 0, 1.340809, 5.713329, 0.613102)"><tspan x="258.793" y="115.282" style="fill: rgb(159, 250, 255);">Cube Engine</tspan></text>
    <animate attributeName="display" values="none;inline" begin="-0.07s" dur="3s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, -103.418617, -51.245663)" id="options">
    <path d="M 413.324 230.18 H 610.173 V 239.284 H 619.277 V 302.704 H 610.173 V 311.808 H 413.324 V 302.704 H 404.22 V 239.284 H 413.324 V 230.18 Z" bx:shape="rect 404.22 230.18 215.057 81.628 3 9.104 9.104 2@57afc897" style="stroke: rgb(101, 252, 255); stroke-width: 2.696; fill: rgb(34, 43, 207); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <text style="fill: rgb(159, 191, 255); font-family: Allan; font-size: 28px; stroke-width: 1.20731px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-3&quot;);" transform="matrix(1.61565, 0, 0, 1.340809, 41.847286, 126.34494)" x="258.793" y="115.282">Options</text>
    <animate attributeName="display" values="none;inline" dur="3s" fill="freeze" calcMode="discrete" keyTimes="0; 1" begin="-0.06s"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 243.464752, 161.983444)">
    <path d="M 114.216 34.994 H 211.478 V 34.994 H 211.478 V 143.604 H 211.478 V 143.604 H 114.216 V 143.604 H 114.216 V 34.994 H 114.216 V 34.994 Z" bx:shape="rect 114.216 34.994 97.262 108.61 3 0 0 2@dfe4e0af" style="fill: rgb(25, 38, 255); stroke: rgb(101, 252, 255); stroke-width: 3px; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 132.15 53.805 H 195.484 V 53.805 H 195.484 V 124.109 H 195.484 V 124.109 H 132.15 V 124.109 H 132.15 V 53.805 H 132.15 V 53.805 Z" bx:shape="rect 132.15 53.805 63.334 70.304 3 0 0 2@e7727a04" style="stroke: rgb(101, 252, 255); stroke-width: 3; fill: rgb(36, 195, 235); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 100" begin="0.15s" dur="2s" fill="freeze" keyTimes="0; 1"/>
    <animate attributeName="opacity" values="1;0" begin="2.2s" dur="0.8s" fill="freeze" keyTimes="0; 1"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 246.453033, -231.478821)">
    <path d="M 114.381 324.36 H 207.491 V 324.36 H 207.491 V 425.707 H 207.491 V 425.707 H 114.381 V 425.707 H 114.381 V 324.36 H 114.381 V 324.36 Z" bx:shape="rect 114.381 324.36 93.11 101.347 3 0 0 2@0f3d8e6e" style="fill: rgb(25, 38, 255); stroke: rgb(101, 252, 255); stroke-width: 3; filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <path d="M 131.549 341.912 H 192.18 V 341.912 H 192.18 V 407.514 H 192.18 V 407.514 H 131.549 V 407.514 H 131.549 V 341.912 H 131.549 V 341.912 Z" bx:shape="rect 131.549 341.912 60.631 65.602 3 0 0 2@bbfd82bc" style="stroke: rgb(101, 252, 255); stroke-width: 3; fill: rgb(36, 195, 235); filter: url(&quot;#drop-shadow-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#drop-shadow-filter-2&quot;);"/>
    <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -100" begin="0.07s" dur="2s" fill="freeze" keyTimes="0; 1"/>
    <animate attributeName="opacity" values="1;0" begin="2.07s" dur="0.95s" fill="freeze" keyTimes="0; 1"/>
  </g>
</svg>`;

    let CUBIC_OPTIONS_MENU_SVG = `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#020b26;stop-opacity:1"/><stop offset="100%" style="stop-color:#0a2463;stop-opacity:1"/></linearGradient><linearGradient id="btnGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00c6ff;stop-opacity:0.2"/><stop offset="100%" style="stop-color:#0072ff;stop-opacity:0.4"/></linearGradient><filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><style>.title{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;font-weight:bold;font-size:32px;fill:#e0ffff;text-transform:uppercase;letter-spacing:4px;filter:url(#neonGlow)}.btn-text{font-family:'Courier New',monospace;font-weight:bold;font-size:14px;fill:#b3e5fc;letter-spacing:1px;pointer-events:none}.btn-shape{fill:url(#btnGradient);stroke:#00ffff;stroke-width:2;transition:all 0.3s ease}.btn-group:hover .btn-shape{fill-opacity:0.8;stroke:#ffffff;filter:url(#neonGlow);cursor:pointer}.btn-group:hover .btn-text{fill:#ffffff;text-shadow:0 0 5px #00ffff}.decor-line{stroke:#00ffff;stroke-width:1;opacity:0.5} .close-group { cursor: pointer; } .close-group:hover circle { stroke: red; } .close-group:hover line { stroke: red; }</style></defs><rect width="100%" height="100%" fill="url(#bgGradient)"/><path d="M 50,50 L 750,50 L 750,550 L 50,550 Z" fill="none" stroke="#00ffff" stroke-width="2" stroke-opacity="0.3"/><path d="M 40,40 L 60,40 L 60,60 L 40,60 Z M 760,40 L 740,40 L 740,60 L 760,60 Z M 760,560 L 740,560 L 740,540 L 760,540 Z M 40,560 L 60,560 L 60,540 L 40,540 Z" fill="#00ffff" filter="url(#neonGlow)"/><text x="400" y="100" text-anchor="middle" class="title">System Options</text><line x1="250" y1="115" x2="550" y2="115" class="decor-line"/><rect x="395" y="112" width="10" height="6" fill="#00ffff"/><g transform="translate(100, 150)"><g class="btn-group" transform="translate(0, 0)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">CHROMA FLUX</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(320, 0)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">NEON SYNTH</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(0, 90)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">GRAVITY PRISM</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(320, 90)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">MIRROR VOID</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(0, 180)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">STAR GLYPH</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(320, 180)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">TIME WARP</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(0, 270)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">CRYSTAL LOGIC</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g><g class="btn-group" transform="translate(320, 270)"><path d="M 10,0 L 250,0 L 260,10 L 260,60 L 250,70 L 10,70 L 0,60 L 0,10 Z" class="btn-shape"/><text x="130" y="40" text-anchor="middle" class="btn-text">AETHER STORM</text><rect x="5" y="25" width="3" height="20" fill="#00ffff" opacity="0.7"/></g></g><g transform="translate(750, 50)" class="close-group" id="close-menu-btn"><circle cx="0" cy="0" r="15" fill="#020b26" stroke="#00ffff" stroke-width="2"/><line x1="-8" y1="-8" x2="8" y2="8" stroke="#00ffff" stroke-width="2"/><line x1="8" y1="-8" x2="-8" y2="8" stroke="#00ffff" stroke-width="2"/></g></svg>`;

    // --- GAME FILES (CORREGIDOS PARA POSTMESSAGE) ---

    // Función auxiliar para generar el botón de cierre estandarizado
    const getExitButtonHTML = () => `<button class="exit-btn" onclick="window.parent.postMessage('closeGame', '*')">RETURN TO MENU</button>`;

    let GAME_HTML_CHROMA_FLUX = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Chroma Flux</title><style>body{margin:0;overflow:hidden;background:#020b26;font-family:'Courier New',monospace}canvas{display:block}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:rgba(10,36,99,0.6);color:#00ffff;text-transform:uppercase;cursor:pointer;box-shadow:0 0 10px #00ffff;transition:.3s;z-index:100}.exit-btn:hover{background:#00ffff;color:#020b26;box-shadow:0 0 20px #00ffff}#instructions{position:absolute;bottom:20px;width:100%;text-align:center;color:rgba(0,255,255,.5);pointer-events:none}</style></head><body>
    ${getExitButtonHTML()}
    <div id="instructions">Mueve el cursor para liberar energía Chroma</div><canvas id="canvas"></canvas><script>const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let width,height,particles=[];function resize(){width=canvas.width=window.innerWidth,height=canvas.height=window.innerHeight}window.addEventListener('resize',resize),resize();class Particle{constructor(t,i){this.x=t,this.y=i,this.size=5*Math.random()+2,this.speedX=3*Math.random()-1.5,this.speedY=3*Math.random()-1.5,this.color=\`hsl(\${40*Math.random()+180}, 100%, 50%)\`,this.life=100}update(){this.x+=this.speedX,this.y+=this.speedY,this.life-=1.5,this.size*=.95}draw(){ctx.fillStyle=this.color,ctx.globalAlpha=this.life/100,ctx.beginPath(),ctx.arc(this.x,this.y,this.size,0,2*Math.PI),ctx.fill(),ctx.globalAlpha=1,ctx.shadowBlur=10,ctx.shadowColor=this.color}}function handleParticles(){for(let t=0;t<particles.length;t++)particles[t].update(),particles[t].draw(),particles[t].life<=0&&(particles.splice(t,1),t--)}function animate(){ctx.fillStyle='rgba(2, 11, 38, 0.2)',ctx.fillRect(0,0,width,height),ctx.shadowBlur=0,handleParticles(),requestAnimationFrame(animate)}window.addEventListener('mousemove',t=>{for(let i=0;i<5;i++)particles.push(new Particle(t.x,t.y))}),animate();</script></body></html>`;

    let GAME_HTML_NEON_SYNTH = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Neon Synth</title><style>body{margin:0;background:#020b26;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;font-family:'Courier New',monospace;overflow:hidden}.synth-container{display:flex;gap:10px}.key{width:60px;height:200px;border:2px solid #0a2463;background:rgba(10,36,99,.3);border-radius:0 0 10px 10px;position:relative;transition:.1s;box-shadow:0 0 10px rgba(0,0,0,.5)}.key::after{content:attr(data-note);position:absolute;bottom:10px;width:100%;text-align:center;color:#00ffff;font-weight:700}.key.active{background:#00ffff;box-shadow:0 0 30px #00ffff,0 0 60px #0072ff;border-color:#fff;transform:translateY(5px)}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:0 0;color:#00ffff;cursor:pointer;box-shadow:0 0 10px #00ffff}h2{color:#00ffff;text-transform:uppercase;letter-spacing:5px;text-shadow:0 0 10px #0072ff;margin-bottom:40px}</style></head><body>
    ${getExitButtonHTML()}
    <h2>Neon Synth</h2><div class="synth-container" id="keyboard"></div><p style="color:#0072ff;margin-top:20px">Presiona A S D F G H J K</p><script>const notes=[{key:'a',note:'C4',freq:261.63},{key:'s',note:'D4',freq:293.66},{key:'d',note:'E4',freq:329.63},{key:'f',note:'F4',freq:349.23},{key:'g',note:'G4',freq:392},{key:'h',note:'A4',freq:440},{key:'j',note:'B4',freq:493.88},{key:'k',note:'C5',freq:523.25}],container=document.getElementById('keyboard'),audioCtx=new(window.AudioContext||window.webkitAudioContext);notes.forEach(e=>{const t=document.createElement('div');t.className='key',t.dataset.key=e.key,t.dataset.note=e.note,t.id=\`key-\${e.key}\`,container.appendChild(t)});function playSound(e){const t=audioCtx.createOscillator(),n=audioCtx.createGain();t.type='sawtooth',t.frequency.value=e,t.connect(n),n.connect(audioCtx.destination),t.start(),n.gain.setValueAtTime(.1,audioCtx.currentTime),n.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.5),t.stop(audioCtx.currentTime+.5)}window.addEventListener('keydown',e=>{'suspended'===audioCtx.state&&audioCtx.resume();const t=notes.find(t=>t.key===e.key);if(t){const n=document.getElementById(\`key-\${e.key}\`);n.classList.contains('active')||(playSound(t.freq),n.classList.add('active'))}}),window.addEventListener('keyup',e=>{const t=notes.find(t=>t.key===e.key);if(t){document.getElementById(\`key-\${e.key}\`).classList.remove('active')}});</script></body></html>`;

    let GAME_HTML_GRAVITY_PRISM = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Gravity Prism</title><style>body{margin:0;overflow:hidden;background:#020b26}canvas{display:block;border:5px solid #0a2463;box-sizing:border-box}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:#020b26;color:#00ffff;cursor:pointer;z-index:10;font-family:sans-serif;text-transform:uppercase}.overlay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:rgba(0,255,255,.3);font-family:sans-serif;pointer-events:none}</style></head><body>
    ${getExitButtonHTML()}
    <div class="overlay">CLICK PARA IMPULSO DE GRAVEDAD</div><canvas id="canvas"></canvas><script>const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let width,height,cubes=[];function resize(){width=canvas.width=window.innerWidth,height=canvas.height=window.innerHeight}window.addEventListener('resize',resize),resize();class Cube{constructor(){this.size=30*Math.random()+10,this.x=Math.random()*(width-this.size),this.y=Math.random()*(height-this.size),this.vx=2*(Math.random()-.5),this.vy=2*(Math.random()-.5),this.color=Math.random()>.5?'#00ffff':'#0072ff',this.rotation=0,this.rotSpeed=.1*(Math.random()-.5)}update(){this.x+=this.vx,this.y+=this.vy,this.rotation+=this.rotSpeed,(this.x<0||this.x+this.size>width)&&(this.vx*=-1),(this.y<0||this.y+this.size>height)&&(this.vy*=-1)}draw(){ctx.save(),ctx.translate(this.x+this.size/2,this.y+this.size/2),ctx.rotate(this.rotation),ctx.strokeStyle=this.color,ctx.lineWidth=2,ctx.shadowBlur=10,ctx.shadowColor=this.color,ctx.strokeRect(-this.size/2,-this.size/2,this.size,this.size),ctx.globalAlpha=.5,ctx.strokeRect(-this.size/4,-this.size/4,this.size/2,this.size/2),ctx.restore()}}for(let i=0;i<30;i++)cubes.push(new Cube);window.addEventListener('mousedown',i=>{cubes.forEach(t=>{let e=(t.x+t.size/2)-i.clientX,o=(t.y+t.size/2)-i.clientY,s=Math.sqrt(e*e+o*o);if(s<300){let h=(300-s)/10;t.vx+=e/s*h,t.vy+=o/s*h}})}),function t(){ctx.fillStyle='rgba(2, 11, 38, 0.3)',ctx.fillRect(0,0,width,height),cubes.forEach(i=>{i.update(),i.draw()}),requestAnimationFrame(t)}();</script></body></html>`;

    let GAME_HTML_MIRROR_VOID = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Mirror Void</title><style>body{margin:0;overflow:hidden;background:#020b26;cursor:crosshair}canvas{display:block}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:rgba(2,11,38,.8);color:#00ffff;font-family:'Courier New',monospace;text-transform:uppercase;cursor:pointer;z-index:100;transition:.3s}.exit-btn:hover{background:#00ffff;color:#020b26;box-shadow:0 0 15px #00ffff}.controls{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#00ffff;font-family:monospace;user-select:none;pointer-events:none;text-align:center}</style></head><body>
    ${getExitButtonHTML()}
    <div class="controls">Haz clic y arrastra para dibujar en el Vacío<br>Presiona ESPACIO para limpiar</div><canvas id="canvas"></canvas><script>const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let width,height,centerX,centerY,isDrawing=!1,hue=180;function resize(){width=canvas.width=window.innerWidth,height=canvas.height=window.innerHeight,centerX=width/2,centerY=height/2,ctx.fillStyle='#020b26',ctx.fillRect(0,0,width,height)}window.addEventListener('resize',resize),resize();function draw(e,t){ctx.save(),ctx.translate(centerX,centerY);const i=Math.PI*2/8,n=e-centerX,r=t-centerY;ctx.lineWidth=4,ctx.lineCap='round',ctx.strokeStyle=\`hsl(\${hue}, 100%, 50%)\`,ctx.shadowBlur=10,ctx.shadowColor=\`hsl(\${hue}, 100%, 50%)\`;for(let e=0;e<8;e++)ctx.rotate(i),ctx.beginPath(),ctx.moveTo(n,r),ctx.lineTo(n+2,r+2),ctx.stroke(),ctx.save(),ctx.scale(1,-1),ctx.beginPath(),ctx.moveTo(n,r),ctx.lineTo(n+2,r+2),ctx.stroke(),ctx.restore();ctx.restore(),hue=(hue+1)%360,(hue<160||hue>280)&&(hue=160)}window.addEventListener('mousedown',()=>isDrawing=!0),window.addEventListener('mouseup',()=>isDrawing=!1),window.addEventListener('mousemove',e=>{isDrawing&&draw(e.clientX,e.clientY)}),window.addEventListener('keydown',e=>{'Space'===e.code&&(ctx.fillStyle='#020b26',ctx.fillRect(0,0,width,height))});</script></body></html>`;

    let GAME_HTML_STAR_GLYPH = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Star Glyph</title><style>body{margin:0;overflow:hidden;background:#020b26}canvas{display:block}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:0 0;color:#00ffff;font-family:sans-serif;text-transform:uppercase;cursor:pointer}</style></head><body>
    ${getExitButtonHTML()}
    <canvas id="canvas"></canvas><script>const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let width,height,particles=[],mouse={x:null,y:null,radius:150};window.addEventListener('mousemove',t=>{mouse.x=t.x,mouse.y=t.y});function resize(){width=canvas.width=window.innerWidth,height=canvas.height=window.innerHeight,init()}window.addEventListener('resize',resize);class Particle{constructor(){this.x=Math.random()*width,this.y=Math.random()*height,this.size=3*Math.random()+1,this.speedX=2*Math.random()-1,this.speedY=2*Math.random()-1}update(){this.x+=this.speedX,this.y+=this.speedY,(this.x<0||this.x>width)&&(this.speedX*=-1),(this.y<0||this.y>height)&&(this.speedY*=-1);let t=mouse.x-this.x,e=mouse.y-this.y;Math.sqrt(t*t+e*e)<mouse.radius&&(mouse.x<this.x&&this.x<width-10&&(this.x+=2),mouse.x>this.x&&this.x>10&&(this.x-=2),mouse.y<this.y&&this.y<height-10&&(this.y+=2),mouse.y>this.y&&this.y>10&&(this.y-=2))}draw(){ctx.beginPath(),ctx.rect(this.x,this.y,this.size,this.size),ctx.fillStyle='#00ffff',ctx.fill()}}function init(){particles=[];let t=width*height/9e3;for(let e=0;e<t;e++)particles.push(new Particle)}function connect(){for(let t=0;t<particles.length;t++)for(let e=t;e<particles.length;e++){let i=(particles[t].x-particles[e].x)**2+(particles[t].y-particles[e].y)**2;if(i<canvas.width/7*(canvas.height/7)){let n=1-i/2e4;ctx.strokeStyle='rgba(0, 114, 255,'+n+')',ctx.lineWidth=1,ctx.beginPath(),ctx.moveTo(particles[t].x,particles[t].y),ctx.lineTo(particles[e].x,particles[e].y),ctx.stroke()}}}function animate(){ctx.clearRect(0,0,width,height);for(let t=0;t<particles.length;t++)particles[t].update(),particles[t].draw();connect(),requestAnimationFrame(animate)}resize(),animate();</script></body></html>`;

    let GAME_HTML_TIME_WARP = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Time Warp</title><style>body{margin:0;background:#020b26;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;overflow:hidden;font-family:'Courier New',monospace}canvas{border-radius:50%;box-shadow:0 0 50px rgba(0,255,255,.1)}.ui-container{margin-top:30px;z-index:10;text-align:center}input[type=range]{width:300px;accent-color:#00ffff}label{color:#00ffff;display:block;margin-bottom:10px;text-transform:uppercase;letter-spacing:2px}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:0 0;color:#00ffff;cursor:pointer;text-transform:uppercase}</style></head><body>
    ${getExitButtonHTML()}
    <canvas id="clock" width="500" height="500"></canvas><div class="ui-container"><label>Time Dilation Field</label><input type="range" id="speedRange" min="-10" max="10" value="1" step=".1"><div style="color:#0072ff;font-size:12px;margin-top:5px">Reverse <--------> Forward</div></div><script>const canvas=document.getElementById('clock'),ctx=canvas.getContext('2d'),slider=document.getElementById('speedRange');let centerX=canvas.width/2,centerY=canvas.height/2,time=0,speed=1;slider.addEventListener('input',e=>{speed=parseFloat(e.target.value)});function drawRing(e,t,r,n,i){ctx.beginPath(),ctx.arc(centerX,centerY,e,0,2*Math.PI),ctx.lineWidth=t,ctx.strokeStyle='rgba(10, 36, 99, 0.3)',ctx.stroke(),ctx.beginPath(),ctx.arc(centerX,centerY,e,r,r+1.5*Math.PI),ctx.strokeStyle=n,ctx.lineWidth=t,ctx.lineCap="round",i?ctx.setLineDash([10,20]):ctx.setLineDash([]),ctx.stroke(),ctx.shadowBlur=15,ctx.shadowColor=n}function animate(){ctx.fillStyle='rgba(2, 11, 38, 0.3)',ctx.fillRect(0,0,canvas.width,canvas.height),ctx.shadowBlur=0,time+=.02*speed,drawRing(200,5,.5*time,'#0072ff',!1),drawRing(150,15,time,'#00ffff',!0),drawRing(100,8,1.5*-time,'#ffffff',!1),ctx.beginPath(),ctx.arc(centerX,centerY,50+5*Math.sin(time),0,2*Math.PI),ctx.fillStyle=\`rgba(0, 255, 255, \${Math.abs(Math.sin(time))})\`,ctx.fill(),requestAnimationFrame(animate)}animate();</script></body></html>`;

    let GAME_HTML_CRYSTAL_LOGIC = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Crystal Logic</title><style>body{margin:0;background:#020b26;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:'Courier New',monospace}canvas{border:2px solid #0072ff;box-shadow:0 0 20px rgba(0,114,255,.2);cursor:pointer}.status{margin-top:20px;color:#00ffff;font-size:20px;text-transform:uppercase;letter-spacing:3px;height:30px}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:2px solid #00ffff;background:0 0;color:#00ffff;cursor:pointer;text-transform:uppercase}</style></head><body>
    ${getExitButtonHTML()}
    <canvas id="gameCanvas" width="500" height="500"></canvas><div class="status" id="statusText">ALINEAR FLUJO DE ENERGÍA</div><script>const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d'),cellSize=100,cols=5,rows=5;let grid=[[3,0,0,0,0],[0,1,0,2,0],[0,0,1,0,0],[0,2,0,1,0],[0,0,0,0,4]];function drawGrid(){ctx.clearRect(0,0,500,500),ctx.strokeStyle='#0a2463',ctx.lineWidth=1;for(let e=0;e<=5;e++)ctx.beginPath(),ctx.moveTo(100*e,0),ctx.lineTo(100*e,500),ctx.stroke(),ctx.beginPath(),ctx.moveTo(0,100*e),ctx.lineTo(500,100*e),ctx.stroke();for(let e=0;e<5;e++)for(let t=0;t<5;t++){let r=100*t,l=100*e,o=r+50,i=l+50;3===grid[e][t]?(ctx.fillStyle='#0072ff',ctx.beginPath(),ctx.arc(o,i,20,0,2*Math.PI),ctx.fill(),ctx.fillStyle='#fff',ctx.fillText("IN",o-10,i+5)):4===grid[e][t]?(ctx.fillStyle='#444',ctx.fillRect(r+20,l+20,60,60),ctx.strokeStyle='#00ffff',ctx.strokeRect(r+20,l+20,60,60)):1===grid[e][t]?drawMirror(o,i,'/'):2===grid[e][t]&&drawMirror(o,i,'\\\\')}}function drawMirror(e,t,r){ctx.strokeStyle='#00ffff',ctx.lineWidth=5,ctx.shadowBlur=10,ctx.shadowColor='#00ffff',ctx.beginPath(),'/'===r?(ctx.moveTo(e-30,t+30),ctx.lineTo(e+30,t-30)):(ctx.moveTo(e-30,t-30),ctx.lineTo(e+30,t+30)),ctx.stroke(),ctx.shadowBlur=0}function calculateBeam(){let e=0,t=0,r='right',l=!0;ctx.strokeStyle='#ff0055',ctx.lineWidth=3,ctx.shadowBlur=15,ctx.shadowColor='#ff0055';let o=[{x:50,y:50}],i=0;for(;l&&i<100;){i++,'right'===r?t++:'left'===r?t--:'down'===r?e++:'up'===r&&e--;if(e<0||e>=5||t<0||t>=5){l=!1;break}let n=100*t+50,c=100*e+50;o.push({x:n,y:c});let a=grid[e][t];4===a?(l=!1,document.getElementById('statusText').innerText="CONEXIÓN ESTABLECIDA",document.getElementById('statusText').style.color="#00ff00",ctx.fillStyle='#00ff00',ctx.fillRect(100*t+20,100*e+20,60,60),ctx.strokeStyle='#00ff00',ctx.shadowColor='#00ff00'):1===a?'right'===r?r='up':'left'===r?r='down':'up'===r?r='right':'down'===r&&(r='left'):2===a&&('right'===r?r='down':'left'===r?r='up':'up'===r?r='left':'down'===r&&(r='right'))}ctx.beginPath(),ctx.moveTo(o[0].x,o[0].y);for(let e of o)ctx.lineTo(e.x,e.y);ctx.stroke(),ctx.shadowBlur=0}canvas.addEventListener('mousedown',e=>{const t=canvas.getBoundingClientRect(),r=Math.floor((e.clientX-t.left)/100),l=Math.floor((e.clientY-t.top)/100);1===grid[l][r]?grid[l][r]=2:2===grid[l][r]&&(grid[l][r]=1),gameLoop()});function gameLoop(){drawGrid(),calculateBeam()}gameLoop();</script></body></html>`;

    let GAME_HTML_AETHER_STORM = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Aether Storm</title><style>body{margin:0;overflow:hidden;background:#000}canvas{display:block}.exit-btn{position:absolute;top:20px;right:20px;padding:10px 20px;border:1px solid #fff;background:rgba(0,0,0,.5);color:#fff;font-family:sans-serif;cursor:pointer;z-index:10;transition:all .5s}.exit-btn:hover{background:#fff;color:#000}.title{position:absolute;bottom:20px;left:20px;color:rgba(0,255,255,.4);font-family:'Courier New',monospace;pointer-events:none}</style></head><body>
    ${getExitButtonHTML()}
    <div class="title">Generando Patrones Atmosféricos...</div><canvas id="storm"></canvas><script>const canvas=document.getElementById('storm'),ctx=canvas.getContext('2d');let w,h;function resize(){w=canvas.width=window.innerWidth,h=canvas.height=window.innerHeight}window.addEventListener('resize',resize),resize();function drawLightning(t,e,i,n,a){if(i<5||a<.5)return;const r=t+i*Math.cos(n),o=e+i*Math.sin(n);ctx.strokeStyle='#ffffff',ctx.lineWidth=a,ctx.shadowBlur=20,ctx.shadowColor='#00ffff',ctx.beginPath(),ctx.moveTo(t,e),ctx.lineTo(r,o),ctx.stroke();const l=Math.floor(3*Math.random())+1;for(let t=0;t<l;t++){const t=n+(.8*Math.random()-.4),e=i*(.6*Math.random()+.4);drawLightning(r,o,e,t,.7*a)}}let flashOpacity=0;function animate(){ctx.globalCompositeOperation='source-over',ctx.fillStyle='rgba(2, 11, 38, 0.1)',ctx.fillRect(0,0,w,h),Math.random()<.03&&(drawLightning(Math.random()*w,0,100+100*Math.random(),Math.PI/2+(Math.random()-.5),3),flashOpacity=.2),flashOpacity>0&&(ctx.fillStyle=\`rgba(0, 255, 255, \${flashOpacity})\`,ctx.fillRect(0,0,w,h),flashOpacity-=.02),requestAnimationFrame(animate)}animate();</script></body></html>`;

    const GAME_CONTENT_MAP = {
        'CHROMA FLUX': GAME_HTML_CHROMA_FLUX,
        'NEON SYNTH': GAME_HTML_NEON_SYNTH,
        'GRAVITY PRISM': GAME_HTML_GRAVITY_PRISM,
        'MIRROR VOID': GAME_HTML_MIRROR_VOID,
        'STAR GLYPH': GAME_HTML_STAR_GLYPH,
        'TIME WARP': GAME_HTML_TIME_WARP,
        'CRYSTAL LOGIC': GAME_HTML_CRYSTAL_LOGIC,
        'AETHER STORM': GAME_HTML_AETHER_STORM,
    };

    // --- HELPER FUNCTIONS ---

    function playSound(url) {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio prevented"));
    }

    function createMenuContainer() {
        menuContainer = document.createElement('div');
        menuContainer.id = menuContainerId;
        menuContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; background: rgba(0, 0, 0, 0.95); display: none; overflow: hidden;`;
        document.body.appendChild(menuContainer);
        return menuContainer;
    }

    function showMenu(content) {
        if (!menuContainer) createMenuContainer();
        menuContainer.style.display = 'block';
        menuContainer.innerHTML = content;
        // Reiniciar listeners
        attachMenuListeners();
    }

    function hideMenu() {
        if (menuContainer) {
            menuContainer.style.display = 'none';
            menuContainer.innerHTML = '';
        }
        // Mostrar el cubo flotante de nuevo si se cierra todo el menú
        if (initialCube) initialCube.style.display = 'block';
    }

    function showMainMenu() {
        playSound(STARTUP_SOUND_URL);
        showMenu(CUBE_ENGINE_SVG);
    }

    function showOptionsMenu() {
        playSound(CLICK_SOUND_URL);
        showMenu(CUBIC_OPTIONS_MENU_SVG);
    }

    function loadGame(gameName) {
        playSound(CLICK_SOUND_URL);
        const gameContent = GAME_CONTENT_MAP[gameName];

        if (gameContent) {
            const iframe = document.createElement('iframe');
            // Usar srcdoc si es posible (más moderno), o fallback a DataURI
            // Aquí usamos DataURI porque funciona consistentemente en scripts
            const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(gameContent);
            iframe.src = dataUri;
            iframe.style.cssText = 'width: 100%; height: 100%; border: none;';

            if (!menuContainer) createMenuContainer();
            menuContainer.innerHTML = ''; // Limpiar SVG
            menuContainer.appendChild(iframe);
        }
    }

    // --- LISTENER SYSTEM ---

    function attachMenuListeners() {
        // Listener Main Menu
        const optionsGroup = menuContainer.querySelector('#options');
        if (optionsGroup) {
            optionsGroup.addEventListener('click', showOptionsMenu);
        }

        // Listener Options Menu (Juegos)
        const btnGroups = menuContainer.querySelectorAll('.btn-group');
        btnGroups.forEach(group => {
            const btnTextElement = group.querySelector('.btn-text');
            if (btnTextElement) {
                const gameName = btnTextElement.textContent.trim();
                group.addEventListener('click', () => loadGame(gameName));
            }
        });

        // Listener para cerrar el menú (Nuevo Botón Añadido al SVG)
        const closeMenuBtn = menuContainer.querySelector('#close-menu-btn');
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', hideMenu);
        }
    }

    // Escuchar mensajes desde los iframes (juegos)
    window.addEventListener('message', (event) => {
        // Por seguridad, idealmente verificar origin, pero Data URIs son 'null' o opaque
        if (event.data === 'closeGame') {
            showOptionsMenu();
        }
    });

    // --- INITIALIZATION ---

    function setupInitialCube() {
        // Corrección de la animación CSS: Incluir el translate en los keyframes
        GM_addStyle(`
            @keyframes cubeFloat {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -55%) rotate(5deg); }
            }
        `);

        initialCube = document.createElement('img');
        initialCube.src = CUBE_GIF_URL;
        initialCube.id = 'initial-cubic-engine-icon';
        initialCube.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            width: 180px; height: 180px;
            cursor: pointer;
            z-index: 99998;
            /* La animación maneja la posición ahora */
            animation: cubeFloat 4s ease-in-out infinite alternate;
        `;

        initialCube.addEventListener('click', () => {
            initialCube.style.display = 'none';
            showMainMenu();
        });

        document.body.appendChild(initialCube);
    }

    // Lógica segura de arranque
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupInitialCube);
    } else {
        setupInitialCube();
    }

})();