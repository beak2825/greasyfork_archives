// ==UserScript==
// @name         ⭐ Drawaria Starlight Operation Menu ⭐
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Menú arrastrable con efectos visuales de estrellas, inicio con PS1 Sound y sonidos de hadas en el menú.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555314/%E2%AD%90%20Drawaria%20Starlight%20Operation%20Menu%20%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/555314/%E2%AD%90%20Drawaria%20Starlight%20Operation%20Menu%20%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EFFECT_DURATION = 4000; // Duración base para todos los efectos (4 segundos)
    const PS1_SOUND_URL = 'https://www.myinstants.com/media/sounds/ps1-startup-sound.mp3';
    const FAIRY_SOUND_URL = 'https://www.myinstants.com/media/sounds/magic-fairy.mp3';
    const BUTTON_IDS = ['star-rain', 'astral-space', 'supernova', 'constellation'];
    const MENU_ID = 'star-menu-container';

    // 1. Contenido del SVG (Sin modificar)
    const menuSVG = `
        <svg id="star-operation-menu-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 705.692 637.591" xmlns:bx="https://boxy-svg.com">
          <path d="M 339.594 200.138 L 366.541 272.194 L 434.867 300.613 L 366.541 329.032 L 339.594 401.088 L 312.647 329.032 L 244.321 300.613 L 312.647 272.194 Z" bx:shape="star 339.594 300.613 95.273 100.475 0.4 4 1@4f9f4d94" style="stroke: rgb(0, 0, 0); fill: oklab(1 0 0); transform-box: fill-box; transform-origin: 50% 50%; filter: url(&quot;#drop-shadow-filter-2&quot;);">
            <animate attributeName="opacity" values="0;0;1;1" dur="4.39s" fill="freeze" keyTimes="0; 0.745428; 0.810243; 1" begin="-0.39s"/>
            <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;0.4 0.4" begin="4.75s" dur="2s" fill="freeze" keyTimes="0; 1"/>
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="4.75s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
            <animate attributeName="visibility" values="visible;hidden;visible" begin="5.78s" dur="4s" fill="freeze" calcMode="discrete" keyTimes="0; 0.25; 0.795848"/>
            <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;2 2" begin="8.91s" dur="2s" fill="freeze" keyTimes="0; 1"/>
            <animate attributeName="display" values="inline;none" begin="12.19s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.40741"/>
          </path>
          <path d="M 775.08 236.757 L 790.383 277.385 L 829.185 293.408 L 790.383 309.431 L 775.08 350.059 L 759.777 309.431 L 720.975 293.408 L 759.777 277.385 Z" bx:shape="star 775.08 293.408 54.105 56.651 0.4 4 1@35fd04ea" style="stroke: rgb(0, 0, 0); fill: oklab(1 0 0); stroke-width: 1; transform-origin: 775.08px 293.408px; filter: url(&quot;#drop-shadow-filter-2&quot;);">
            <animate attributeName="opacity" values="1;1;0.12;0" dur="4.26s" fill="freeze" keyTimes="0; 0.745428; 0.810243; 1" begin="-0.26s"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;-420 0" begin="-0.39s" dur="3.3s" fill="freeze" keyTimes="0; 1"/>
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="-0.33s" dur="3.48s" fill="freeze" keyTimes="0; 1"/>
          </path>
          <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; filter: url(&quot;#drop-shadow-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" x="154.598" y="308.691">YouTubeDrawaria Presents<animate attributeName="display" values="none;inline;none" dur="9.29s" fill="freeze" calcMode="discrete" keyTimes="0; 0.75518; 1" begin="-0.48s"/><animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.2 1.2" begin="6.7s" dur="2.13s" fill="freeze" keyTimes="0; 1"/></text>
          <defs>
            <style bx:fonts="ADLaM Display">@import url(https://fonts.googleapis.com/css2?family=ADLaM+Display%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
            <filter id="drop-shadow-filter-0" bx:preset="drop-shadow 1 10 10 0 0.09 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="0.18"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="warp-filter-0" bx:preset="warp 1 28 0.55" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feComponentTransfer>
                <feFuncR type="table" tableValues="1 0.5"/>
              </feComponentTransfer>
              <feMerge result="a">
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
              <feTurbulence type="fractalNoise" baseFrequency="0.05500000000000001" numOctaves="1" result="warp"/>
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="28" in="a" in2="warp"/>
            </filter>
            <filter id="drop-shadow-filter-1" bx:preset="drop-shadow 1 10 10 0 0.16 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="0"/>
              <feOffset dx="10" dy="10"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl-2" type="linear" slope="0.32"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="drop-shadow-filter-2" bx:preset="drop-shadow 1 0 0 10 0.35 rgba(0,0,0,0.3)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
              <feOffset dx="0" dy="0"/>
              <feComponentTransfer result="offsetblur">
                <feFuncA id="spread-ctrl" type="linear" slope="0.7"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.3)"/>
              <feComposite in2="offsetblur" operator="in"/>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <ellipse style="stroke: rgb(0, 0, 0); fill: oklab(1 0 0); filter: url(&quot;#warp-filter-0&quot;); transform-box: fill-box; transform-origin: 50% 50%;" cx="331.549" cy="303.091" rx="90.303" ry="94.951">
            <animate attributeName="display" values="none;inline" begin="-0.3s" dur="13s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/>
            <animateTransform type="scale" additive="sum" attributeName="transform" values="1 1;1.3 1.3" begin="12.46s" dur="3.02s" fill="freeze" keyTimes="0; 1"/>
            <animateTransform type="rotate" additive="sum" attributeName="transform" values="0;180" begin="12.46s" dur="2s" fill="freeze" keyTimes="0; 1" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0;1" begin="12.2s" dur="1.11s" fill="freeze" keyTimes="0; 0.46077; 1" repeatCount="indefinite"/>
            <animate attributeName="display" values="none;none" begin="15s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5"/>
          </ellipse>
          <g>
            <g transform="matrix(1, 0, 0, 1, 18.92565, 2.703631)" style="filter: url(&quot;#drop-shadow-filter-1&quot;);" id="menu">
              <path d="M 330.538 161.808 L 363.851 264.411 L 465.293 266.624 L 384.44 332.249 L 413.821 436.22 L 330.538 374.175 L 247.255 436.22 L 276.636 332.249 L 195.783 266.624 L 297.225 264.411 Z" bx:shape="star 330.538 313.499 141.69 151.691 0.4 5 1@a158cdeb" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255);"/>
              <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; filter: url(&quot;#filter-1&quot;); stroke-width: 1; transform-origin: 333.426px 311.012px;" x="155.489" y="322.681">Starlight Operation Menu<animate attributeName="display" values="none;none;none" begin="-0.48s" dur="9.29s" fill="freeze" calcMode="discrete" keyTimes="0; 0.02959; 1"/><animate attributeName="display" values="none;inline" begin="14.17s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5"/></text>
            </g>
            <g style="transform-origin: 353.827px 329.341px;">
              <g id="star-rain">
                <path d="M 143.705 432.592 L 165.528 501.431 L 231.98 502.915 L 179.015 546.945 L 198.262 616.701 L 143.705 575.074 L 89.148 616.701 L 108.395 546.945 L 55.43 502.915 L 121.882 501.431 Z" bx:shape="star 143.705 534.365 92.818 101.773 0.4 5 1@7130fd9f" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1;"/>
                <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; stroke-width: 1; transform-origin: 204.883px 569.416px;" x="26.946" y="581.085" transform="matrix(0.764433, 0, 0, 0.812515, 28.640719, -45.02707)">Star Rain<animate attributeName="display" values="none;none;none" begin="-0.48s" dur="9.29s" fill="freeze" calcMode="discrete" keyTimes="0; 0.75518; 1"/><animate attributeName="display" values="none;inline" begin="12.72s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5"/></text>
                <animate attributeName="opacity" values="1;0.38;1" dur="0.96s" fill="freeze" keyTimes="0; 0.487905; 1" begin="click"/>
              </g>
              <g transform="matrix(1, 0, 0, 1, 410.418801, 3.0822)" id="astral-space">
                <path d="M 143.705 432.592 L 165.528 501.431 L 231.98 502.915 L 179.015 546.945 L 198.262 616.701 L 143.705 575.074 L 89.148 616.701 L 108.395 546.945 L 55.43 502.915 L 121.882 501.431 Z" bx:shape="star 143.705 534.365 92.818 101.773 0.4 5 1@7130fd9f" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1;"/>
                <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; stroke-width: 1; transform-origin: 204.883px 569.416px;" x="26.946" y="581.085" transform="matrix(0.764433, 0, 0, 0.812515, 11.656934, -37.03476)">Astral Space<animate attributeName="display" values="none;none" begin="-0.15s" dur="2.15s" fill="freeze" calcMode="discrete" keyTimes="0; 1"/><animate attributeName="display" values="none;inline" begin="12.02s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5"/></text>
                <animate attributeName="opacity" values="1;0.33;1" begin="click" dur="0.94s" fill="freeze" keyTimes="0; 0.460128; 1"/>
              </g>
              <g transform="matrix(1, 0, 0, 1, 6.553394, -393.693673)" id="supernova">
                <path d="M 143.705 432.592 L 165.528 501.431 L 231.98 502.915 L 179.015 546.945 L 198.262 616.701 L 143.705 575.074 L 89.148 616.701 L 108.395 546.945 L 55.43 502.915 L 121.882 501.431 Z" bx:shape="star 143.705 534.365 92.818 101.773 0.4 5 1@7130fd9f" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1;"/>
                <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; stroke-width: 1; transform-origin: 204.883px 569.416px;" x="26.946" y="581.085" transform="matrix(0.764433, 0, 0, 0.812515, 21.647414, -43.028993)">Supernova<animate attributeName="display" values="none;none;none" begin="-0.48s" dur="9.29s" fill="freeze" calcMode="discrete" keyTimes="0; 0.75518; 1"/><animate attributeName="display" values="none;inline" begin="11.89s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5"/></text>
                <animate attributeName="opacity" values="1;0.36;1" begin="click" dur="1.02s" fill="freeze" keyTimes="0; 0.534202; 1"/>
              </g>
              <g transform="matrix(1, 0, 0, 1, 420.244638, -392.445412)" id="constellation">
                <path d="M 143.705 432.592 L 165.528 501.431 L 231.98 502.915 L 179.015 546.945 L 198.262 616.701 L 143.705 575.074 L 89.148 616.701 L 108.395 546.945 L 55.43 502.915 L 121.882 501.431 Z" bx:shape="star 143.705 534.365 92.818 101.773 0.4 5 1@7130fd9f" style="stroke: rgb(0, 0, 0); fill: rgb(255, 255, 255); stroke-width: 1;"/>
                <text style="fill: rgb(51, 51, 51); font-family: &quot;ADLaM Display&quot;; font-size: 28px; white-space: pre; stroke-width: 1; transform-origin: 204.883px 569.416px;" x="26.946" y="581.085" transform="matrix(0.764433, 0, 0, 0.812515, 9.658841, -38.03378)">Constellation<animate attributeName="display" values="none;none;none" begin="-0.48s" dur="9.29s" fill="freeze" calcMode="discrete" keyTimes="0; 0.75518; 1"/><animate attributeName="display" values="none;inline" begin="11.78s" dur="2s" fill="freeze" calcMode="discrete" keyTimes="0; 0.5"/></text>
                <animate attributeName="opacity" values="1;0.33;1" begin="click" dur="0.96s" fill="freeze" keyTimes="0; 0.561979; 1"/>
              </g>
            </g>
            <animate attributeName="display" values="none;inline" dur="15.22s" fill="freeze" calcMode="discrete" keyTimes="0; 1" begin="-0.22s"/>
            <animate attributeName="opacity" values="0;0.429717;1" begin="14.83s" dur="2s" fill="freeze" keyTimes="0; 0.429717; 1"/>
            <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 5;0 0" begin="0s" dur="4.87s" fill="freeze" repeatCount="indefinite" keyTimes="0; 0.486227; 1"/>
          </g>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo el botón de inicio y keyframes)
    GM_addStyle(`
        /* BOTÓN DE INICIO */
        #start-button-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 100000; /* Lo más alto para ocultar todo */
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 1s ease-out;
        }
        #start-button {
            width: 250px;
            height: 250px;
            background: linear-gradient(135deg, #001f3f, #0074d9);
            border: 15px solid #ff4136;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 32px;
            font-weight: bold;
            font-family: Arial, sans-serif;
            cursor: pointer;
            box-shadow: 0 0 20px #0074d9, inset 0 0 10px #ff4136;
            animation: pulse-border 1.5s infinite alternate;
            user-select: none;
        }
        #start-button:active {
            transform: scale(0.95);
        }
        @keyframes pulse-border {
            from { border-color: #ff4136; }
            to { border-color: #ff851b; }
        }

        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 0px;
            left: 350px;
            width: 700px; /* **MENU MÁS GRANDE** */
            height: auto;
            z-index: 10001; /* Debajo del overlay de inicio, sobre los efectos */
            cursor: grab;
            display: none; /* Inicialmente oculto */
        }
        #${MENU_ID}:active {
            cursor: grabbing;
        }

        /* Contenedor de efectos (overlay transparente para albergar las partículas) */
        #effect-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }
        .effect-active {
            opacity: 1 !important;
        }

        /* --- EFECTOS (Star Rain, Astral Space, Supernova, Constellation) --- */
        /* (Se mantienen los estilos de los efectos anteriores para asegurar funcionalidad) */

        @keyframes star-fall {
            0% { transform: translateY(-100vh) scale(0.5); opacity: 1; }
            100% { transform: translateY(100vh) scale(1.5); opacity: 0; }
        }
        .star-particle {
            position: absolute;
            width: 5px; height: 5px;
            background: radial-gradient(white, rgba(255, 255, 255, 0.5));
            border-radius: 50%;
            animation: star-fall 4s linear infinite;
        }

        @keyframes astral-shift {
            0% { backdrop-filter: hue-rotate(0deg) blur(0); background: rgba(0, 0, 30, 0); }
            50% { backdrop-filter: hue-rotate(180deg) blur(5px); background: rgba(20, 0, 50, 0.4); }
            100% { backdrop-filter: hue-rotate(360deg) blur(0); background: rgba(0, 0, 30, 0); }
        }
        .astral-effect {
            animation: astral-shift 4s ease-in-out forwards;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }

        @keyframes supernova-flash {
            0% { opacity: 0; } 5% { opacity: 1; background: radial-gradient(circle at center, yellow 0%, red 20%, transparent 80%); }
            10% { opacity: 0.5; } 15% { opacity: 1; } 100% { opacity: 0; }
        }
        @keyframes screen-shake {
            0%, 100% { transform: translate(0, 0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 0); }
            20%, 40%, 60%, 80% { transform: translate(5px, 0); }
        }
        .supernova-flash { animation: supernova-flash 2s ease-out forwards; background: black; }
        .supernova-shake { animation: screen-shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

        .constellation-star {
            position: absolute; width: 8px; height: 8px; background-color: white;
            border-radius: 50%; box-shadow: 0 0 5px white; opacity: 0; transition: opacity 0.5s;
        }
        .constellation-line {
            position: absolute; height: 2px; background-color: cyan; transform-origin: 0 50%;
            transition: width 1s ease-out, opacity 0.5s; opacity: 0;
        }
    `);


    // 3. Funciones de Efectos y Sonido

    function playSound(url) {
        try {
            const audio = new Audio(url);
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio playback failed (user interaction needed?):", e));
        } catch (error) {
            console.error("Error al reproducir el sonido:", error);
        }
    }

    // Funciones de Efecto (sin cambios en la lógica interna)
    function getOverlay() { /* ... (mismo código) ... */
        let overlay = document.getElementById('effect-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'effect-overlay';
            document.body.appendChild(overlay);
        }
        return overlay;
    }
    function effectStarRain() { /* ... (mismo código) ... */
        const overlay = getOverlay();
        overlay.classList.add('effect-active');
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.style.left = `${Math.random() * 100}vw`;
            star.style.animationDelay = `${-Math.random() * 4}s`;
            overlay.appendChild(star);
        }
        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }
    function effectAstralSpace() { /* ... (mismo código) ... */
        const overlay = getOverlay();
        overlay.classList.add('astral-effect', 'effect-active');
        setTimeout(() => {
            overlay.classList.remove('astral-effect', 'effect-active');
        }, EFFECT_DURATION);
    }
    function effectSupernova() { /* ... (mismo código) ... */
        const overlay = getOverlay();
        const mainContainer = document.body;
        overlay.classList.add('supernova-flash', 'effect-active');
        mainContainer.classList.add('supernova-shake');
        setTimeout(() => {
            overlay.classList.remove('supernova-flash', 'effect-active');
            mainContainer.classList.remove('supernova-shake');
        }, EFFECT_DURATION);
    }
    function effectConstellation() { /* ... (mismo código, simplificado) ... */
        const overlay = getOverlay();
        overlay.classList.add('effect-active');
        const starsData = [];
        const STAR_COUNT = 5;
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.className = 'constellation-star';
            star.style.left = `${20 + Math.random() * 60}vw`;
            star.style.top = `${20 + Math.random() * 60}vh`;
            overlay.appendChild(star);
            starsData.push({ element: star, x: parseFloat(star.style.left), y: parseFloat(star.style.top) });
            setTimeout(() => star.style.opacity = 1, i * 100);
        }
        setTimeout(() => {
            for (let i = 0; i < STAR_COUNT - 1; i++) {
                const s1 = starsData[i];
                const s2 = starsData[i+1];
                const dx = s2.x - s1.x;
                const dy = s2.y - s1.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const line = document.createElement('div');
                line.className = 'constellation-line';
                line.style.left = s1.x + 'vw';
                line.style.top = s1.y + 'vh';
                line.style.transform = `rotate(${angle}deg)`;
                line.style.width = '0px';
                overlay.appendChild(line);
                setTimeout(() => {
                    line.style.opacity = 1;
                    line.style.width = distance + 'vw';
                }, 100);
            }
        }, 800);
        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Activación y Menú

    function handleMenuButtonClick(event) {
        event.preventDefault();

        // 1. Sonido de hada
        playSound(FAIRY_SOUND_URL);

        // 2. Ejecutar el efecto visual
        const effectId = event.currentTarget.id;
        const effectMap = {
            'star-rain': effectStarRain,
            'astral-space': effectAstralSpace,
            'supernova': effectSupernova,
            'constellation': effectConstellation
        };

        if (effectMap[effectId]) {
            // Ocultar el menú temporalmente
            const menuContainer = document.getElementById(MENU_ID);
            if(menuContainer) menuContainer.style.opacity = '0.3';

            effectMap[effectId]();

            // Mostrar el menú de nuevo
            setTimeout(() => {
                 if(menuContainer) menuContainer.style.opacity = '1';
            }, EFFECT_DURATION);
        }
    }

    function handleStartButtonClick() {
        // 1. Reproducir el sonido PS1
        playSound(PS1_SOUND_URL);

        // 2. Ocultar el botón de inicio con fade out
        const startOverlay = document.getElementById('start-button-overlay');
        startOverlay.style.opacity = 0;

        // 3. Mostrar el menú SVG
        const menuContainer = document.getElementById(MENU_ID);
        menuContainer.style.display = 'block';

        // 4. Iniciar la animación del SVG (forzando el comienzo de la animación para que se vea toda)
        const svgElement = document.getElementById('star-operation-menu-svg');
        // Para reiniciar las animaciones SVG desde el principio:
        svgElement.setCurrentTime(0);

        // 5. Eliminar el overlay después de la transición
        setTimeout(() => startOverlay.remove(), 1000);
    }

    /**
     * Hace un elemento HTML arrastrable.
     */
    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // No iniciar el drag si se hace clic en un elemento interactivo (los botones)
            if (e.target.closest('g[id]') || e.target.closest('path') || e.target.closest('text')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 5. Inicialización
    window.addEventListener('load', () => {
        // 5.1. Crear el contenedor del menú (inicialmente oculto)
        const menuContainer = document.createElement('div');
        menuContainer.id = MENU_ID;
        menuContainer.innerHTML = menuSVG;
        document.body.appendChild(menuContainer);

        // 5.2. Crear el Overlay del Botón de Inicio
        const startOverlay = document.createElement('div');
        startOverlay.id = 'start-button-overlay';
        startOverlay.innerHTML = '<div id="start-button">START MENU</div>';
        document.body.appendChild(startOverlay);

        // 5.3. Asignar eventos
        const svgElement = document.getElementById('star-operation-menu-svg');
        if (!svgElement) return;

        // Evento del botón de inicio
        document.getElementById('start-button').addEventListener('click', handleStartButtonClick);

        // Eventos de los botones del menú (dentro del SVG)
        BUTTON_IDS.forEach(id => {
            const button = svgElement.querySelector(`#${id}`);
            if (button) {
                button.style.cursor = 'pointer';
                button.addEventListener('click', handleMenuButtonClick);
            }
        });

        // 5.4. Hacer el menú arrastrable
        dragElement(menuContainer);
    });

})();