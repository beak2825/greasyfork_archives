// ==UserScript==
// @name         Hexagon Engine
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  The Hexagon Engine is connected to Drawaria.online's stories and is designed for Decorations. It's made for the Hexagon Fairy and it serves a critical role in the story to save the game.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://i.ibb.co/ZDNJ6KN/hexagon2.gif
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557367/Hexagon%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/557367/Hexagon%20Engine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Esperamos a que la página cargue completamente para evitar el error de "body null"
    window.addEventListener('load', function() {
        console.log("Hexagon Engine: Inicializando...");

        // =========================================================================
        // 1. ASSET STRINGS
        // =========================================================================

        const SVG_HEXAGON_ENGINE = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -79.272 1126.804 673.293" style="width: 80%; max-width: 1000px; height: auto;">
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
              <feFlood flood-color="#fa4deab3" result="color"/><feComposite operator="in" in="color" in2="choke" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
            <filter id="drop-shadow-filter-1" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="14"/><feOffset dx="0" dy="0"/>
              <feComponentTransfer result="offsetblur"><feFuncA type="linear" slope="1.32"/></feComponentTransfer>
              <feFlood flood-color="#ed8bd44d"/><feComposite in2="offsetblur" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <g transform="matrix(1, 0, 0, 1, -182.809723, -19.763214)">
            <g>
              <path d="M 630.1 -20.961 L 730.683 34.806 L 730.683 146.34 L 630.1 202.107 L 529.517 146.34 L 529.517 34.806 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(240, 157, 153); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-origin: 630.1px 90.573px;" transform="matrix(-0.822908, -0.568175, -0.568175, 0.822908, 18.43524, 319.853514)"/>
              <path d="M 749.009 87.808 L 1040.38 168.924 L 1040.38 331.156 L 749.009 412.272 L 457.638 331.156 L 457.638 168.924 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(88, 28, 25); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
              <path d="M 630.1 -20.961 L 730.683 34.806 L 730.683 146.34 L 630.1 202.107 L 529.517 146.34 L 529.517 34.806 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(240, 157, 153); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-origin: 630.1px 90.573px;" transform="matrix(0.822908, -0.568175, 0.568175, 0.822908, 230.050502, 317.643654)"/>
              <path d="M 630.1 -20.961 L 730.683 34.806 L 730.683 146.34 L 630.1 202.107 L 529.517 146.34 L 529.517 34.806 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(240, 157, 153); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-origin: 630.1px 90.573px;" transform="matrix(-0.822908, -0.568175, -0.568175, 0.822908, 242.256379, -25.641665)"/>
              <path d="M 630.1 -20.961 L 730.683 34.806 L 730.683 146.34 L 630.1 202.107 L 529.517 146.34 L 529.517 34.806 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(240, 157, 153); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); transform-box: fill-box; transform-origin: 50% 50%;" transform="matrix(0.822908, -0.568175, 0.568175, 0.822908, 2.858509, -29.346878)"/>
              <path d="M 744.4 10.38 L 964.725 128.367 L 964.725 364.34 L 744.4 482.326 L 524.075 364.34 L 524.075 128.366 Z" style="fill: rgb(107, 16, 12); stroke-width: 6px; stroke: rgb(253, 82, 81); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
              <path d="M 743.988 1.897 L 820.458 18.024 L 909.179 22.575 L 937.616 51.833 L 997.075 74.932 L 964.173 103.632 L 966.549 134.472 L 887.704 149.184 L 831.884 173.333 L 743.988 167.173 L 656.092 173.333 L 600.272 149.184 L 521.427 134.472 L 523.803 103.632 L 490.901 74.932 L 550.36 51.833 L 578.797 22.575 L 667.518 18.024 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(105, 35, 32); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
              <text style="fill: rgb(255, 89, 82); font-family: Allan; font-size: 28px; stroke: rgba(253, 82, 81, 0); stroke-width: 2.40696px; white-space: pre; filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);" transform="matrix(2.724512, 0, 0, 2.261037, -146.068115, -150.788544)" x="258.793" y="115.282">Hexagon Engine</text>
            </g>
            <g id="options" transform="matrix(1, 0, 0, 1, -559.072021, -13.907)" style="cursor: pointer;">
              <path d="M 1130.16 222.348 H 1483.309 A 22 22 0 0 0 1505.309 244.348 V 338.748 A 22 22 0 0 0 1483.309 360.748 H 1130.16 A 22 22 0 0 0 1108.16 338.748 V 244.348 A 22 22 0 0 0 1130.16 222.348 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(206, 115, 111); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
              <text style="fill: rgb(236, 138, 131); font-family: Allan; font-size: 28px; stroke: rgba(253, 82, 81, 0); stroke-width: 2.40696px; white-space: pre; filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1); pointer-events: none;" transform="matrix(2.724512, 0, 0, 2.261037, 516.320374, 45.685123)" x="258.793" y="115.282">Options</text>
            </g>
            <animate attributeName="opacity" values="0;1" dur="1s" fill="freeze" calcMode="linear" begin="0s"/>
          </g>
          <g transform="matrix(1.455117, 0, 0, 1.391413, 393.634125, -268.833893)">
            <path d="M 121.904 362.667 L 197.74 382.946 L 197.74 423.504 L 121.904 443.783 L 46.068 423.504 L 46.068 382.946 Z" style="fill: rgb(107, 16, 12); stroke-width: 6px; stroke: rgb(253, 82, 81); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
            <path d="M 121.904 378.895 L 167.398 391.06 L 167.398 415.39 L 121.904 427.555 L 76.41 415.39 L 76.41 391.06 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(240, 157, 153); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 100" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1"/>
            <animate attributeName="opacity" values="1;0" begin="2s" dur="1.05s" fill="freeze" keyTimes="0; 1"/>
          </g>
          <g transform="matrix(1.455117, 0, 0, 1.391413, 268.166718, -28.884727)">
            <path d="M 206.91 103.168 L 282.746 123.447 L 282.746 164.005 L 206.91 184.284 L 131.074 164.005 L 131.074 123.447 Z" style="fill: rgb(107, 16, 12); stroke-width: 6px; stroke: rgb(253, 82, 81); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
            <path d="M 206.91 119.396 L 252.404 131.561 L 252.404 155.891 L 206.91 168.056 L 161.416 155.891 L 161.416 131.561 Z" style="stroke-width: 6px; stroke: rgb(253, 82, 81); fill: rgb(240, 157, 153); filter: url(#drop-shadow-filter-0) url(#inner-shadow-filter-0) url(#drop-shadow-filter-1);"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 -100" begin="0s" dur="2s" fill="freeze" keyTimes="0; 1"/>
            <animate attributeName="opacity" values="1;0" begin="2s" dur="1.05s" fill="freeze" keyTimes="0; 1"/>
          </g>
        </svg>`;

        const SVG_OPTIONS = `
        <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="font-family: 'Segoe UI', sans-serif;">
          <defs>
            <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF2A68;stop-opacity:1" /><stop offset="100%" style="stop-color:#8B0030;stop-opacity:1" /></linearGradient>
            <linearGradient id="btnGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#4a0f1d;stop-opacity:0.9" /><stop offset="100%" style="stop-color:#2A0A12;stop-opacity:0.95" /></linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
            <filter id="innerShadow"><feOffset dx="0" dy="2"/><feGaussianBlur stdDeviation="2" result="offset-blur"/><feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/><feFlood flood-color="black" flood-opacity="0.5" result="color"/><feComposite operator="in" in="color" in2="inverse" result="shadow"/><feComposite operator="over" in="shadow" in2="SourceGraphic"/></filter>
          </defs>
          <style>
            .panel-bg { fill: rgba(255, 255, 255, 0.8); stroke: #FF2A68; stroke-width: 2; }
            .header-text { fill: #8B0030; font-weight: bold; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
            .sub-text { fill: #FF2A68; font-size: 14px; letter-spacing: 1px; }
            .btn-group { cursor: pointer; transition: all 0.3s ease; }
            .btn-shape { fill: url(#btnGrad); stroke: #FF2A68; stroke-width: 2; transition: all 0.3s ease; }
            .btn-text { fill: #FFC0CB; font-size: 14px; font-weight: 600; text-anchor: middle; pointer-events: none; }
            .btn-icon { fill: #FF2A68; transition: all 0.3s ease; pointer-events: none; }
            .btn-group:hover .btn-shape { fill: #8B0030; stroke: #FF00FF; filter: url(#neonGlow); transform: scale(1.02); transform-box: fill-box; transform-origin: center; }
            .btn-group:hover .btn-icon { fill: #ffffff; }
            .btn-group:hover .btn-text { fill: #ffffff; }
          </style>
          <pattern id="hexGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M25 0 L50 12.5 L50 37.5 L25 50 L0 37.5 L0 12.5 Z" fill="none" stroke="#e0e0e0" stroke-width="1"/></pattern>
          <rect width="100%" height="100%" fill="url(#hexGrid)" />
          <g transform="translate(200, 50)">
            <path class="panel-bg" d="M 50 0 H 350 L 400 50 V 450 L 350 500 H 50 L 0 450 V 50 Z" filter="url(#innerShadow)"/>
            <path d="M 0 60 H 400" stroke="#8B0030" stroke-width="3" opacity="0.3"/>
            <text x="200" y="40" text-anchor="middle" class="header-text">Hexagon Engine</text>
            <text x="200" y="85" text-anchor="middle" class="sub-text">SYSTEM CONFIGURATION // V.2.0</text>
            <g class="btn-group" transform="translate(40, 120)">
              <path class="btn-shape" d="M 10 0 H 140 L 150 20 V 60 L 140 80 H 10 L 0 60 V 20 Z" />
              <text x="75" y="65" class="btn-text">PULSE CORE</text>
              <path class="btn-icon" d="M40 35 L50 20 L60 45 L70 25 L80 40 L90 30 L100 40" fill="none" stroke="currentColor" stroke-width="3"/>
            </g>
            <g class="btn-group" transform="translate(210, 120)">
              <path class="btn-shape" d="M 10 0 H 140 L 150 20 V 60 L 140 80 H 10 L 0 60 V 20 Z" />
              <text x="75" y="65" class="btn-text">HEXA RAIN</text>
              <g class="btn-icon"><rect x="50" y="20" width="4" height="10" /><rect x="70" y="30" width="4" height="10" /><rect x="90" y="15" width="4" height="10" /></g>
            </g>
            <g class="btn-group" transform="translate(40, 220)">
              <path class="btn-shape" d="M 10 0 H 140 L 150 20 V 60 L 140 80 H 10 L 0 60 V 20 Z" />
              <text x="75" y="65" class="btn-text">ORBIT LOGIC</text>
              <circle cx="75" cy="35" r="10" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon"/><ellipse cx="75" cy="35" rx="20" ry="8" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(-15 75 35)" class="btn-icon"/>
            </g>
            <g class="btn-group" transform="translate(210, 220)">
              <path class="btn-shape" d="M 10 0 H 140 L 150 20 V 60 L 140 80 H 10 L 0 60 V 20 Z" />
              <text x="75" y="65" class="btn-text">NEURAL GRID</text>
              <g class="btn-icon" stroke="currentColor" stroke-width="2"><circle cx="50" cy="40" r="3" fill="currentColor"/><circle cx="100" cy="25" r="3" fill="currentColor"/><circle cx="80" cy="45" r="3" fill="currentColor"/><line x1="50" y1="40" x2="80" y2="45" /><line x1="80" y1="45" x2="100" y2="25" /></g>
            </g>
            <g class="btn-group" transform="translate(40, 320)">
              <path class="btn-shape" d="M 10 0 H 140 L 150 20 V 60 L 140 80 H 10 L 0 60 V 20 Z" />
              <text x="75" y="65" class="btn-text">FRACTAL ZOOM</text>
              <g class="btn-icon" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="65" y="25" width="20" height="20" transform="rotate(45 75 35)"/><rect x="65" y="25" width="20" height="20" transform="rotate(0 75 35)"/></g>
            </g>
            <g class="btn-group" transform="translate(210, 320)">
              <path class="btn-shape" d="M 10 0 H 140 L 150 20 V 60 L 140 80 H 10 L 0 60 V 20 Z" />
              <text x="75" y="65" class="btn-text">GLITCH CANVAS</text>
              <path class="btn-icon" d="M 50 25 H 100 M 55 35 H 95 M 50 45 H 100" stroke="currentColor" stroke-width="3" stroke-dasharray="10 5"/>
            </g>
            <path d="M 100 460 H 300 L 320 480 H 80 Z" fill="#8B0030" opacity="0.8" style="cursor: pointer;" id="back-path"/>
            <text x="200" y="475" text-anchor="middle" fill="white" font-size="10" letter-spacing="3px" style="pointer-events: none;">BACK TO MENU</text>
          </g>
          <g transform="translate(50, 150)">
            <path d="M 20 0 L 60 20 L 60 60 L 20 80 L -20 60 L -20 20 Z" fill="none" stroke="#FF2A68" stroke-width="2" opacity="0.5"/>
            <path d="M 20 100 L 50 115 L 50 145 L 20 160 L -10 145 L -10 115 Z" fill="#8B0030" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/></path>
            <path d="M 20 180 L 60 200 L 60 240 L 20 260 L -20 240 L -20 200 Z" fill="none" stroke="#FF2A68" stroke-width="2" opacity="0.5"/>
          </g>
        </svg>`;

        // 1.3 HTML GAMES
        const HTML_PULSE_CORE = `
        <style>:root { --color-bg-dark: #2A0A12; --color-red-deep: #8B0030; --color-pink-neon: #FF2A68; --color-magenta: #FF00FF; }
        canvas { background: radial-gradient(circle at center, #4a0f1d 0%, #1a0508 100%); width: 100%; height: 100%; }</style>
        <canvas id="pulseCanvas"></canvas>
        <script>
        (function(){
            const canvas = document.getElementById('pulseCanvas');
            const ctx = canvas.getContext('2d');
            let width, height;
            let bars = [];
            const barCount = 64; const barSpacing = 4;
            function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; initBars(); }
            function initBars() { bars = []; const totalBarWidth = (width / barCount) - barSpacing; for (let i = 0; i < barCount; i++) { bars.push({ x: i * (totalBarWidth + barSpacing) + barSpacing / 2, width: totalBarWidth, height: 0, offset: i * 0.1 }); }}
            function animate() {
                ctx.clearRect(0, 0, width, height);
                const time = Date.now() * 0.002; const centerY = height / 2;
                ctx.shadowBlur = 15; ctx.shadowColor = '#FF2A68';
                bars.forEach((bar, i) => {
                    let simulatedAudio = Math.sin(time + bar.offset) * 0.5 + 0.5; simulatedAudio += Math.cos(time * 2.5 + bar.offset * 2) * 0.2; simulatedAudio += Math.random() * 0.1;
                    const maxHeight = height * 0.4; bar.height = simulatedAudio * maxHeight;
                    const colorIntensity = Math.min(1, bar.height / (maxHeight * 0.8));
                    const r = Math.floor(255 - (colorIntensity * 50)); const g = 0; const b = Math.floor(100 + (colorIntensity * 155));
                    const barColor = 'rgb('+r+','+g+','+b+')';
                    drawBar(bar.x, centerY, width / barCount - barSpacing, -bar.height, barColor);
                    drawBar(bar.x, centerY + 2, width / barCount - barSpacing, bar.height * 0.5, barColor, 0.3);
                });
                ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.strokeStyle = '#FF2A68'; ctx.lineWidth = 2; ctx.shadowBlur = 20; ctx.stroke();
                requestAnimationFrame(animate);
            }
            function drawBar(x, y, w, h, color, alpha = 1) { ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = '#ffffff'; ctx.globalAlpha = alpha * 0.5; ctx.stroke(); ctx.globalAlpha = 1.0; }
            window.addEventListener('resize', resize); resize(); animate();
        })();
        </script>`;

        const HTML_HEXA_RAIN = `
        <style>canvas { background-color: #1a0508; width: 100%; height: 100%; }</style>
        <canvas id="rainCanvas"></canvas>
        <script>
        (function(){
            const canvas = document.getElementById('rainCanvas');
            const ctx = canvas.getContext('2d');
            let width, height; let particles = [];
            const particleCount = 150; const colors = ['#8B0030', '#FF2A68', '#FF00FF', '#ffffff'];
            function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; initParticles(); }
            class HexParticle {
                constructor() { this.reset(true); }
                reset(initial = false) { this.x = Math.random() * width; this.y = initial ? Math.random() * height : -50; this.speed = 1 + Math.random() * 4; this.size = 5 + Math.random() * 20; this.rotation = Math.random() * Math.PI * 2; this.rotationSpeed = (Math.random() - 0.5) * 0.05; this.color = colors[Math.floor(Math.random() * colors.length)]; this.isFilled = Math.random() > 0.7; this.opacity = 0.5 + Math.random() * 0.5; }
                update() { this.y += this.speed; this.rotation += this.rotationSpeed; if (this.y > height + 50) { this.reset(false); } }
                draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation); ctx.globalAlpha = this.opacity; ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.strokeStyle = this.color; ctx.fillStyle = this.color; ctx.lineWidth = 2; drawHexagonShape(0, 0, this.size); if (this.isFilled) { ctx.fill(); } else { ctx.stroke(); ctx.beginPath(); ctx.arc(0,0, 2, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.restore(); }
            }
            function drawHexagonShape(x, y, r) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const angle = (Math.PI / 3) * i; const hx = x + r * Math.cos(angle); const hy = y + r * Math.sin(angle); if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy); } ctx.closePath(); }
            function initParticles() { particles = []; for (let i = 0; i < particleCount; i++) { particles.push(new HexParticle()); } }
            function animate() { ctx.fillStyle = 'rgba(26, 5, 8, 0.2)'; ctx.fillRect(0, 0, width, height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
            window.addEventListener('resize', resize); resize(); animate();
        })();
        </script>`;

        const HTML_ORBIT_LOGIC = `
        <style>canvas { background-color: #1a0508; width: 100%; height: 100%; cursor: crosshair; } .hint { position: absolute; bottom: 20px; width: 100%; text-align: center; color: #FF2A68; font-family: monospace; opacity: 0.7; pointer-events: none; }</style>
        <div class="hint">MOUSE: TILT & ROTATE</div><canvas id="orbitCanvas"></canvas>
        <script>
        (function(){
            const canvas = document.getElementById('orbitCanvas'); const ctx = canvas.getContext('2d');
            let width, height, centerX, centerY;
            let tiltFactor = 0.5; let rotationSpeed = 0.01; let globalAngle = 0;
            const orbitCount = 8; const planets = []; const colors = ['#8B0030', '#FF2A68', '#FF00FF', '#ffffff'];
            function initSystem() { planets.length = 0; for (let i = 0; i < orbitCount; i++) { planets.push({ radius: 60 + (i * 35), angle: Math.random() * Math.PI * 2, speed: (0.02 - (i * 0.002)) * (Math.random() > 0.5 ? 1 : -1), size: 3 + Math.random() * 5, color: colors[i % colors.length] }); }}
            function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; centerX = width / 2; centerY = height / 2; initSystem(); }
            window.addEventListener('mousemove', (e) => { const normX = e.clientX / width; const normY = e.clientY / height; tiltFactor = 0.2 + (normY * 0.8); rotationSpeed = (normX - 0.5) * 0.1; });
            function drawCenterCore(time) { const pulse = Math.sin(time * 5) * 5 + 20; ctx.shadowBlur = 30; ctx.shadowColor = '#FF00FF'; ctx.fillStyle = '#8B0030'; ctx.beginPath(); for (let i = 0; i < 6; i++) { const angle = (Math.PI / 3) * i; ctx.lineTo(centerX + pulse * Math.cos(angle), centerY + pulse * Math.sin(angle)); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#FF2A68'; ctx.lineWidth = 2; ctx.stroke(); }
            function animate() { ctx.clearRect(0, 0, width, height); const time = Date.now() * 0.001; globalAngle += rotationSpeed; drawCenterCore(time); planets.forEach(p => { p.angle += p.speed; ctx.beginPath(); ctx.ellipse(centerX, centerY, p.radius, p.radius * tiltFactor, 0, 0, Math.PI * 2); ctx.strokeStyle = '#FF2A68'; ctx.lineWidth = 1; ctx.globalAlpha = 0.2; ctx.shadowBlur = 0; ctx.stroke(); const planetX = centerX + Math.cos(p.angle + globalAngle) * p.radius; const planetY = centerY + Math.sin(p.angle + globalAngle) * (p.radius * tiltFactor); const depth = Math.sin(p.angle + globalAngle); const scale = 1 + (depth * 0.3 * (1 - tiltFactor)); ctx.globalAlpha = 1; ctx.fillStyle = p.color; ctx.shadowBlur = 15; ctx.shadowColor = p.color; ctx.beginPath(); ctx.arc(planetX, planetY, p.size * scale, 0, Math.PI * 2); ctx.fill(); }); requestAnimationFrame(animate); }
            window.addEventListener('resize', resize); resize(); animate();
        })();
        </script>`;

        const HTML_NEURAL_GRID = `
        <style>canvas { background-color: #1a0508; width: 100%; height: 100%; }</style>
        <canvas id="neuralCanvas"></canvas>
        <script>
        (function(){
            const canvas = document.getElementById('neuralCanvas'); const ctx = canvas.getContext('2d');
            let width, height; let particles = []; let ripples = [];
            const particleCount = 90; const connectionDistance = 150; const mouseDistance = 200;
            const mouse = { x: null, y: null };
            window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
            window.addEventListener('mousedown', (e) => { ripples.push({x: e.clientX, y: e.clientY, r: 0, alpha: 1}); });
            class Particle { constructor() { this.x = Math.random() * width; this.y = Math.random() * height; this.vx = (Math.random() - 0.5) * 1.5; this.vy = (Math.random() - 0.5) * 1.5; this.size = Math.random() * 3 + 1; this.color = Math.random() > 0.5 ? '#FF2A68' : '#8B0030'; } update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > width) this.vx *= -1; if (this.y < 0 || this.y > height) this.vy *= -1; ripples.forEach(r => { const dx = this.x - r.x; const dy = this.y - r.y; const distance = Math.sqrt(dx*dx + dy*dy); if (distance < r.r + 20 && distance > r.r - 20) { const force = 5; const angle = Math.atan2(dy, dx); this.vx += Math.cos(angle) * force * 0.1; this.vy += Math.sin(angle) * force * 0.1; } }); } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); } }
            function init() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; particles = []; for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); } }
            function connectParticles() { for (let a = 0; a < particles.length; a++) { for (let b = a; b < particles.length; b++) { const dx = particles[a].x - particles[b].x; const dy = particles[a].y - particles[b].y; const distance = Math.sqrt(dx * dx + dy * dy); if (distance < connectionDistance) { const opacity = 1 - (distance / connectionDistance); ctx.strokeStyle = 'rgba(139, 0, 48, '+opacity+')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y); ctx.stroke(); } } if(mouse.x != null) { const dx = particles[a].x - mouse.x; const dy = particles[a].y - mouse.y; const distance = Math.sqrt(dx*dx + dy*dy); if (distance < mouseDistance) { const opacity = 1 - (distance / mouseDistance); ctx.strokeStyle = 'rgba(255, 0, 255, '+opacity+')'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); } } } }
            function animate() { ctx.clearRect(0, 0, width, height); for (let i = ripples.length - 1; i >= 0; i--) { const r = ripples[i]; r.r += 5; r.alpha -= 0.02; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255, 42, 104, '+r.alpha+')'; ctx.lineWidth = 2; ctx.stroke(); if (r.alpha <= 0) ripples.splice(i, 1); } particles.forEach(p => { p.update(); p.draw(); }); connectParticles(); requestAnimationFrame(animate); }
            window.addEventListener('resize', init); init(); animate();
        })();
        </script>`;

        const HTML_FRACTAL_ZOOM = `
        <style>canvas { width: 100vw; height: 100vh; image-rendering: pixelated; background: #000; } .overlay { position: absolute; bottom: 20px; color: #FF2A68; font-family: monospace; background: rgba(0,0,0,0.5); padding: 5px 10px; pointer-events: none; border: 1px solid #8B0030; }</style>
        <div class="overlay">MOUSE: MUTATE JULIA SET</div><canvas id="fractalCanvas"></canvas>
        <script>
        (function(){
            const canvas = document.getElementById('fractalCanvas'); const ctx = canvas.getContext('2d');
            const w = 200; const h = 150; canvas.width = w; canvas.height = h;
            const imageData = ctx.createImageData(w, h); const data = imageData.data;
            let cRe = -0.7; let cIm = 0.27015; let maxIterations = 25;
            const palette = []; for (let i = 0; i <= maxIterations; i++) { const t = i / maxIterations; const r = Math.floor(90 * t + 50 * Math.pow(t, 4)); const g = Math.floor(20 * Math.pow(t, 2)); const b = Math.floor(60 * t + 40 * Math.pow(t, 2)); if (i === maxIterations) { palette.push([0, 0, 0]); } else { palette.push([Math.min(255, r * 4), Math.min(255, g * 8), Math.min(255, b * 6)]); } }
            window.addEventListener('mousemove', (e) => { cRe = (e.clientX / window.innerWidth) * 2 - 1; cIm = (e.clientY / window.innerHeight) * 2 - 1; });
            function drawFractal() { for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) { let zRe = 1.5 * (x - w / 2) / (0.5 * w); let zIm = (y - h / 2) / (0.5 * h); let i; for (i = 0; i < maxIterations; i++) { const zRe2 = zRe * zRe; const zIm2 = zIm * zIm; if (zRe2 + zIm2 > 4) break; zIm = 2 * zRe * zIm + cIm; zRe = zRe2 - zIm2 + cRe; } const color = palette[i]; const pixelIndex = (y * w + x) * 4; data[pixelIndex] = color[0]; data[pixelIndex + 1] = color[1]; data[pixelIndex + 2] = color[2]; data[pixelIndex + 3] = 255; } } ctx.putImageData(imageData, 0, 0); requestAnimationFrame(drawFractal); }
            drawFractal();
        })();
        </script>`;

        const HTML_GLITCH_CANVAS = `
        <style>canvas { background-color: #0f0205; width: 100%; height: 100%; cursor: crosshair; } .ui-layer { position: absolute; top: 20px; left: 20px; color: #FF2A68; font-family: monospace; pointer-events: none; text-transform: uppercase; background: rgba(0,0,0,0.7); padding: 10px; border-left: 3px solid #FF00FF; }</style>
        <div class="ui-layer"><div>// GLITCH MODE</div><div>[DRAG] NOISE</div><div>[SPACE] CLEAR</div></div><canvas id="glitchCanvas"></canvas>
        <script>
        (function(){
            const canvas = document.getElementById('glitchCanvas'); const ctx = canvas.getContext('2d', { willReadFrequently: true });
            let width, height; let isDrawing = false; let mouse = { x: 0, y: 0, lastX: 0, lastY: 0 };
            const colors = ['#8B0030', '#FF2A68', '#FF00FF', '#FFFFFF', '#000000']; const chars = "XYZ01010101HEXAGON$$%%ERROR";
            function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; ctx.fillStyle = '#0f0205'; ctx.fillRect(0, 0, width, height); }
            window.addEventListener('mousedown', (e) => { isDrawing = true; mouse.x = e.clientX; mouse.y = e.clientY; });
            window.addEventListener('mouseup', () => isDrawing = false);
            window.addEventListener('mousemove', (e) => { mouse.lastX = mouse.x; mouse.lastY = mouse.y; mouse.x = e.clientX; mouse.y = e.clientY; if (isDrawing) { drawGlitchBrush(); } });
            window.addEventListener('keydown', (e) => { if (e.code === 'Space') { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,width,height); setTimeout(() => { ctx.fillStyle = '#0f0205'; ctx.fillRect(0, 0, width, height); }, 50); } });
            function drawGlitchBrush() { const dist = Math.abs(mouse.x - mouse.lastX) + Math.abs(mouse.y - mouse.lastY); for (let i = 0; i < 5; i++) { const w = (Math.random() * 50) + 10; const h = (Math.random() * 10) + 2; const offsetX = (Math.random() - 0.5) * 60; const offsetY = (Math.random() - 0.5) * 60; ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]; ctx.globalCompositeOperation = Math.random() > 0.8 ? 'difference' : 'source-over'; ctx.fillRect(mouse.x + offsetX, mouse.y + offsetY, w, h); if (Math.random() > 0.7) { ctx.fillStyle = '#FF2A68'; ctx.font = '12px monospace'; const char = chars[Math.floor(Math.random() * chars.length)]; ctx.fillText(char, mouse.x + offsetX, mouse.y + offsetY - 10); } } ctx.globalCompositeOperation = 'source-over'; }
            function globalGlitchEffect() { if (Math.random() > 0.2) { const sliceHeight = Math.random() * 50 + 5; const sliceY = Math.random() * height; const slice = ctx.getImageData(0, sliceY, width, sliceHeight); const shift = (Math.random() - 0.5) * 20; ctx.putImageData(slice, shift, sliceY); if (Math.random() > 0.9) { ctx.fillStyle = 'rgba(255, 0, 255, 0.1)'; ctx.fillRect(0, sliceY, width, sliceHeight); } } }
            function animate() { globalGlitchEffect(); ctx.fillStyle = 'rgba(15, 2, 5, 0.005)'; ctx.fillRect(0, 0, width, height); requestAnimationFrame(animate); }
            window.addEventListener('resize', resize); resize(); animate();
        })();
        </script>`;

        const GAME_MAP = {
            'PULSE CORE': HTML_PULSE_CORE,
            'HEXA RAIN': HTML_HEXA_RAIN,
            'ORBIT LOGIC': HTML_ORBIT_LOGIC,
            'NEURAL GRID': HTML_NEURAL_GRID,
            'FRACTAL ZOOM': HTML_FRACTAL_ZOOM,
            'GLITCH CANVAS': HTML_GLITCH_CANVAS
        };

        // =========================================================================
        // 2. CONFIGURACIÓN DE AUDIO
        // =========================================================================

        const MUSIC_STARTUP_URL = "https://www.myinstants.com/media/sounds/windows-vista-beta-2006-startup.mp3";
        const CLICK_SOUND_URL = "https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3";

        const startupAudio = new Audio(MUSIC_STARTUP_URL);
        const clickAudio = new Audio(CLICK_SOUND_URL);

        function playSound(audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play error (check browser permissions):", e));
        }

        // =========================================================================
        // 3. MANEJO DE VISTAS (CONTENEDORES)
        // =========================================================================

        let mainContainer, gameContainer;

        function initContainers() {
            mainContainer = document.createElement('div');
            mainContainer.id = 'hexagon-engine-main-container';
            GM_addStyle(`
            #hexagon-engine-main-container {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                pointer-events: none; /* Permite clicks a través de áreas transparentes */
            }
            #hexagon-engine-main-container svg {
                pointer-events: auto; /* Reactiva clicks en el SVG */
            }
            .hexagon-hidden { display: none !important; }
            .hexagon-game-view {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 99998;
                background: #000;
            }
            .back-button {
                position: fixed; top: 20px; right: 20px;
                background-color: #FF2A68; color: white;
                border: 2px solid #8B0030; padding: 10px 15px;
                cursor: pointer; font-family: monospace; font-weight: bold;
                z-index: 100000; border-radius: 5px;
            }
        `);

            gameContainer = document.createElement('div');
            gameContainer.id = 'hexagon-engine-game-view';
            gameContainer.classList.add('hexagon-hidden', 'hexagon-game-view');
            document.body.appendChild(gameContainer);
            document.body.appendChild(mainContainer);
        }

        function hideAll() {
            mainContainer.classList.add('hexagon-hidden');
            mainContainer.innerHTML = '';
            gameContainer.classList.add('hexagon-hidden');
            gameContainer.innerHTML = '';
            const backBtn = document.getElementById('hexagon-back-button');
            if (backBtn) backBtn.remove();
        }

        function createBackButton(targetView) {
            let backBtn = document.getElementById('hexagon-back-button');
            if (!backBtn) {
                backBtn = document.createElement('button');
                backBtn.id = 'hexagon-back-button';
                backBtn.textContent = 'BACK // REVERSE';
                backBtn.classList.add('back-button');
                document.body.appendChild(backBtn);
            }

            backBtn.onclick = () => {
                playSound(clickAudio);
                if (targetView === 'main') {
                    showMainEngine();
                } else if (targetView === 'options') {
                    showOptions();
                }
            };
        }

        function showMainEngine() {
            hideAll();
            mainContainer.innerHTML = SVG_HEXAGON_ENGINE;
            mainContainer.classList.remove('hexagon-hidden');

            // Listener para Options
            const optionsBtn = mainContainer.querySelector('#options');
            if (optionsBtn) {
                optionsBtn.addEventListener('click', () => {
                    playSound(clickAudio);
                    showOptions();
                });
            }
        }

        function showOptions() {
            hideAll();
            mainContainer.innerHTML = SVG_OPTIONS;
            mainContainer.classList.remove('hexagon-hidden');

            // Listeners para botones de juego
            const gameButtons = mainContainer.querySelectorAll('.btn-group');
            gameButtons.forEach(btn => {
                const btnTextElement = btn.querySelector('.btn-text');
                const gameName = btnTextElement ? btnTextElement.textContent.trim() : null;

                if (gameName && GAME_MAP[gameName]) {
                    btn.addEventListener('click', () => {
                        playSound(clickAudio);
                        showGame(gameName);
                    });
                }
            });

            // Listener para volver al menú principal (el path inferior)
            const bottomDeco = mainContainer.querySelector('#back-path');
            if(bottomDeco) {
                bottomDeco.addEventListener('click', () => {
                    playSound(clickAudio);
                    showMainEngine();
                });
            }
        }

        function showGame(gameName) {
            hideAll();
            const gameContent = GAME_MAP[gameName];

            gameContainer.innerHTML = gameContent;

            // Ejecutar scripts inyectados manualmente
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = gameContent;
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                gameContainer.appendChild(newScript);
            });

            gameContainer.classList.remove('hexagon-hidden');
            createBackButton('options');
        }

        // =========================================================================
        // 4. LÓGICA DE INICIO (GIF FLOTANTE)
        // =========================================================================

        function createInitialGif() {
            const gifUrl = "https://i.ibb.co/ZDNJ6KN/hexagon2.gif";
            const gifElement = document.createElement('img');
            gifElement.src = gifUrl;
            gifElement.id = 'hexagon-engine-gif';
            gifElement.style.cssText = `
            position: fixed; width: 150px; height: 150px; cursor: pointer; z-index: 10000;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            border-radius: 50%; box-shadow: 0 0 20px #FF2A68;
            animation: float-circle 10s infinite alternate ease-in-out;
        `;
            document.body.appendChild(gifElement);

            GM_addStyle(`
            @keyframes float-circle {
                0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
                50% { transform: translate(-50%, -50%) rotate(180deg) scale(0.95); }
                100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
            }
        `);

            gifElement.addEventListener('click', () => {
                playSound(startupAudio);
                gifElement.remove();
                showMainEngine();
            });
        }

        initContainers();
        createInitialGif();

    }); // Fin del window.addEventListener('load')

})();