// ==UserScript==
// @name         Drawaria Sun and Moon Cute Menu ☀️🌙
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú Draggable con 3 efectos de Día (Sol) y 3 de Noche (Luna).
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555549/Drawaria%20Sun%20and%20Moon%20Cute%20Menu%20%E2%98%80%EF%B8%8F%F0%9F%8C%99.user.js
// @updateURL https://update.greasyfork.org/scripts/555549/Drawaria%20Sun%20and%20Moon%20Cute%20Menu%20%E2%98%80%EF%B8%8F%F0%9F%8C%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'sun-moon-menu-container';
    const OVERLAY_ID = 'day-night-overlay';
    const EFFECT_DURATION = 3500; // Duración base para los efectos

    // 1. Contenido del SVG (Se asignan IDs a los grupos principales de Sol y Luna)
    const menuSVG = `
        <svg id="sun-moon-svg" viewBox="-19.79 -1.237 519.79 497.526" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" xmlns:bx="https://boxy-svg.com">
          <defs>
            <filter id="outline-filter-0" bx:preset="outline 1 1 #010100" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
              <feFlood flood-color="#010100" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="inner-shadow-filter-0" bx:preset="inner-shadow 1 0 0 7 0.5 rgba(0,0,0,0.7)" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feOffset dx="0" dy="0"/>
              <feGaussianBlur stdDeviation="7"/>
              <feComposite operator="out" in="SourceGraphic"/>
              <feComponentTransfer result="choke">
                <feFuncA type="linear" slope="1"/>
              </feComponentTransfer>
              <feFlood flood-color="rgba(0,0,0,0.7)" result="color"/>
              <feComposite operator="in" in="color" in2="choke" result="shadow"/>
              <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
            <filter id="outline-filter-1" bx:preset="outline 1 1 #f9f9f9" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
              <feFlood flood-color="#f9f9f9" result="flood"/>
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
          <g style="filter: url(&quot;#drop-shadow-filter-0&quot;);">
            <g id="sun-group">
              <g id="sun-target">
                <path style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(245, 239, 168);" transform="matrix(0.980325, 0, 0, 0.953372, -450.027262, -119.901621)" d="M 618.333 207.778 L 618.333 207.778 L 658.547 272.36 A 105.083 105.083 0 0 1 658.547 272.36 L 732.649 255.129 L 732.649 255.129 L 715.418 329.231 A 105.083 105.083 0 0 1 715.418 329.231 L 780 369.444 L 780 369.444 L 715.418 409.658 A 105.083 105.083 0 0 1 715.418 409.658 L 732.649 483.76 L 732.649 483.76 L 658.547 466.529 A 105.083 105.083 0 0 1 658.547 466.529 L 618.333 531.111 L 618.333 531.111 L 578.12 466.529 A 105.083 105.083 0 0 1 578.12 466.529 L 504.018 483.76 L 504.018 483.76 L 521.249 409.658 A 105.083 105.083 0 0 1 521.249 409.658 L 456.667 369.444 L 456.667 369.444 L 521.249 329.231 A 105.083 105.083 0 0 1 521.249 329.231 L 504.018 255.129 L 504.018 255.129 L 578.12 272.36 A 105.083 105.083 0 0 1 578.12 272.36 Z M 618.333 320.944 A 48.5 48.5 0 0 0 618.333 417.944 A 48.5 48.5 0 0 0 618.333 320.944" bx:shape="cog 618.333 369.444 48.5 105.083 161.667 1 8 1@0d462519"/>
                <ellipse style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(245, 239, 168); cursor: pointer;" cx="156.908" cy="232.879" rx="101.017" ry="98.413"/>
                <g transform="matrix(1, 0, 0, 1, 324.920295, -52.070436)" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#outline-filter-1&quot;);">
                  <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(5, 5, 5);" cx="-204.46" cy="261.559" rx="32.284" ry="47.905"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="-195.09" cy="239.169" rx="12.497" ry="15.1"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);" cx="-213.84" cy="287.594" rx="10.414" ry="13.538"/>
                  <path d="M -182.599 -347.993 Q -166.977 -375.07 -151.356 -347.993 L -151.356 -347.993 Q -135.735 -320.917 -166.978 -320.917 L -166.978 -320.917 Q -198.22 -320.917 -182.599 -347.993 Z" bx:shape="triangle -198.22 -375.07 62.485 54.153 0.5 0.5 1@137c1fe8" style="stroke: rgb(0, 0, 0); fill: rgb(5, 5, 5);" transform="matrix(1, 0, 0, -1, 0, 0)"/>
                  <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(5, 5, 5);" cx="-127.39" cy="263.642" rx="32.284" ry="47.905"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-118.02" cy="241.252" rx="12.497" ry="15.1"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-136.77" cy="289.677" rx="10.414" ry="13.538"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-187.07" cy="277.907" rx="3.855" ry="5.011"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-109.92" cy="281.644" rx="3.855" ry="5.011"/>
                </g>
              </g>
            </g>
            <g id="moon-group">
              <g id="moon-target">
                <path style="stroke: rgb(0, 0, 0); filter: url(&quot;#outline-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#outline-filter-1&quot;); fill: rgb(134, 223, 246); cursor: pointer;" transform="matrix(1.01815116, 0, 0, 0.90758163, -559.24207728, -91.42134288)" d="M 884.213 249.188 A 122.778 122.778 0 1 1 884.213 494.145 A 158.884 158.884 0 0 0 884.213 249.188 Z" bx:shape="crescent 892.778 371.667 122.778 188 0.7 1@2e9c59aa"/>
                <g transform="matrix(0.513886, 0, 0, 0.513886, 604.866895, 102.761172)" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#outline-filter-1&quot;);">
                  <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(1, 1, 1);" cx="-327.93" cy="349.037" rx="12.497" ry="18.745"/>
                  <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(5, 5, 5); stroke-width: 1;" cx="-362.3" cy="265.725" rx="32.284" ry="47.905"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-352.93" cy="243.335" rx="12.497" ry="15.1"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-371.68" cy="291.76" rx="10.414" ry="13.538"/>
                  <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(5, 5, 5);" cx="-285.23" cy="267.808" rx="32.284" ry="47.905"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-275.86" cy="245.418" rx="12.497" ry="15.1"/>
                  <ellipse style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0); stroke-width: 1;" cx="-294.61" cy="293.843" rx="10.414" ry="13.538"/>
                </g>
              </g>
            </g>
            <text style="fill: rgb(249, 251, 221); font-family: &quot;Comic Sans MS&quot;; font-size: 36.5px; text-transform: capitalize; white-space: pre; filter: url(&quot;#outline-filter-0&quot;) url(&quot;#inner-shadow-filter-0&quot;) url(&quot;#outline-filter-1&quot;);" x="28.594" y="55.222">sun and moon cute menu</text>
          </g>
        </svg>
    `;

    // 2. CSS Styles (Keyframes para los 6 efectos)
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 500px; /* Tamaño grande para ver bien el SVG */
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
        /* EFECTOS DE DÍA (SUN) */
        /* --------------------------------- */
        
        /* 1. SUN: Sunny Bloom (Destello de Lente) */
        @keyframes sun-bloom {
            0% { box-shadow: 0 0 0px rgba(255, 255, 0, 0); }
            50% { box-shadow: 0 0 150px 80px rgba(255, 255, 0, 0.8), 0 0 50px 30px rgba(255, 150, 0, 0.5); }
            100% { box-shadow: 0 0 0px rgba(255, 255, 0, 0); }
        }
        .sunny-bloom {
            background: radial-gradient(circle, rgba(255, 255, 0, 0.3) 0%, transparent 50%);
            animation: sun-bloom 3.5s ease-out forwards;
        }

        /* 2. SUN: Golden Hour (Filtro Amarillo-Cálido) */
        .golden-hour {
            filter: sepia(0.5) hue-rotate(-20deg) brightness(1.2) contrast(1.2);
            -webkit-filter: sepia(0.5) hue-rotate(-20deg) brightness(1.2) contrast(1.2);
            transition: filter ${EFFECT_DURATION}ms ease-in-out;
        }

        /* 3. SUN: Sky Beam (Rayo de Luz Vertical) */
        @keyframes beam-travel {
            0% { transform: scaleY(0); }
            100% { transform: scaleY(1); }
        }
        .sky-beam {
            background: linear-gradient(rgba(255, 255, 0, 0.2), rgba(255, 255, 255, 0.4), rgba(255, 255, 0, 0.2));
            width: 50px;
            height: 100%;
            position: absolute;
            left: 50%;
            transform-origin: top;
            animation: beam-travel 1s ease-out forwards;
        }
        
        /* --------------------------------- */
        /* EFECTOS DE NOCHE (MOON) */
        /* --------------------------------- */

        /* 4. MOON: Stardust (Lluvia de Partículas de Polvo Estelar) */
        @keyframes stardust-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .stardust-particle {
            position: absolute;
            width: 3px; height: 3px;
            border-radius: 50%;
            background: radial-gradient(circle, #ddd 0%, transparent 70%);
            box-shadow: 0 0 5px #fff;
            animation: stardust-fall 5s linear infinite;
        }
        .stardust-effect {
            background-color: rgba(0, 0, 30, 0.5); /* Fondo azul oscuro */
            opacity: 1 !important;
        }

        /* 5. MOON: Lunar Glow (Filtro Azul-Frío) */
        .lunar-glow {
            filter: saturate(1.5) contrast(1.5) hue-rotate(200deg) brightness(0.8);
            -webkit-filter: saturate(1.5) contrast(1.5) hue-rotate(200deg) brightness(0.8);
            transition: filter ${EFFECT_DURATION}ms ease-in-out;
        }

        /* 6. MOON: Celestial Fog (Niebla de Ensueño) */
        @keyframes fog-moon-move {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }
        .celestial-fog {
            opacity: 1 !important;
            backdrop-filter: blur(5px) grayscale(0.5);
            background: radial-gradient(circle, rgba(150, 150, 255, 0.3) 0%, rgba(100, 100, 200, 0.1) 50%, rgba(10, 10, 50, 0) 70%) no-repeat;
            background-size: 200% 200%;
            animation: fog-moon-move 40s linear infinite alternate;
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
        overlay.innerHTML = '';
        overlay.className = '';
        return overlay;
    }

    /** Limpia los filtros del body después de un efecto. */
    function clearBodyFilters(duration) {
        const body = document.body;
        body.style.filter = '';
        body.style.webkitFilter = '';
        // Eliminar las clases para que la transición suave se complete
        body.classList.remove('golden-hour', 'lunar-glow');
    }

    // --- SUN EFFECTS ---

    /** 1. SUN: Sunny Bloom (Destello de Lente) */
    function effectSunnyBloom() {
        const overlay = getOverlay();
        overlay.classList.add('sunny-bloom', 'effect-active');
        setTimeout(() => {
            overlay.classList.remove('sunny-bloom', 'effect-active');
        }, EFFECT_DURATION);
    }

    /** 2. SUN: Golden Hour (Filtro Amarillo-Cálido) */
    function effectGoldenHour() {
        const body = document.body;
        body.classList.add('golden-hour');
        setTimeout(() => clearBodyFilters(EFFECT_DURATION), EFFECT_DURATION);
    }

    /** 3. SUN: Sky Beam (Rayo de Luz Vertical) */
    function effectSkyBeam() {
        const overlay = getOverlay();
        overlay.classList.add('effect-active');
        const beam = document.createElement('div');
        beam.className = 'sky-beam';
        // Posición aleatoria
        beam.style.left = `${10 + Math.random() * 80}vw`;
        overlay.appendChild(beam);
        
        setTimeout(() => {
            overlay.classList.remove('effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }

    // --- MOON EFFECTS ---

    /** 4. MOON: Stardust (Lluvia de Partículas de Polvo Estelar) */
    function effectStardust() {
        const overlay = getOverlay();
        overlay.classList.add('stardust-effect', 'effect-active');

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'stardust-particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDelay = `${-Math.random() * 5}s`;
            overlay.appendChild(particle);
        }
        
        setTimeout(() => {
            overlay.classList.remove('stardust-effect', 'effect-active');
            setTimeout(() => overlay.innerHTML = '', 600);
        }, EFFECT_DURATION);
    }

    /** 5. MOON: Lunar Glow (Filtro Azul-Frío) */
    function effectLunarGlow() {
        const body = document.body;
        body.classList.add('lunar-glow');
        setTimeout(() => clearBodyFilters(EFFECT_DURATION), EFFECT_DURATION);
    }

    /** 6. MOON: Celestial Fog (Niebla de Ensueño) */
    function effectCelestialFog() {
        const overlay = getOverlay();
        overlay.classList.add('celestial-fog', 'effect-active');
        setTimeout(() => {
            overlay.classList.remove('celestial-fog', 'effect-active');
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Activación y Dragging

    const sunEffects = [effectSunnyBloom, effectGoldenHour, effectSkyBeam];
    const moonEffects = [effectStardust, effectLunarGlow, effectCelestialFog];

    let sunClickCount = 0;
    let moonClickCount = 0;

    function handleIconClick(event, type) {
        event.preventDefault();
        
        let effect;
        if (type === 'sun') {
            effect = sunEffects[sunClickCount % sunEffects.length];
            sunClickCount++;
        } else if (type === 'moon') {
            effect = moonEffects[moonClickCount % moonEffects.length];
            moonClickCount++;
        } else {
            return;
        }

        // 1. Ocultar el menú temporalmente
        const menuContainer = document.getElementById(MENU_ID);
        if(menuContainer) menuContainer.style.opacity = '0.3';
        
        // 2. Ejecutar el efecto
        effect();
        
        // 3. Mostrar el menú de nuevo
        setTimeout(() => {
             if(menuContainer) menuContainer.style.opacity = '1';
        }, EFFECT_DURATION);
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
            // Solo permitir el clic/drag si el clic es dentro del SVG
            if (!e.target.closest('#sun-moon-svg')) return;

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
                // Si no hubo arrastre, se considera un clic en un ícono
                const sunTarget = e.target.closest('#sun-target');
                const moonTarget = e.target.closest('#moon-target');
                
                if (sunTarget) {
                    handleIconClick({ currentTarget: sunTarget, preventDefault: () => {} }, 'sun');
                } else if (moonTarget) {
                    handleIconClick({ currentTarget: moonTarget, preventDefault: () => {} }, 'moon');
                }
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

        // 5.2. Crear el overlay
        getOverlay();

        // 5.3. Hacer el menú arrastrable (que también maneja los clics en los íconos)
        dragElement(menuContainer);
    });

})();