// ==UserScript==
// @name         Drawaria Banana Split Menu 🍌🌿
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Menú temático de banana que activa efectos de jungla únicos al presionar sus botones.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555518/Drawaria%20Banana%20Split%20Menu%20%F0%9F%8D%8C%F0%9F%8C%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/555518/Drawaria%20Banana%20Split%20Menu%20%F0%9F%8D%8C%F0%9F%8C%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_ID = 'banana-menu-container';
    const OVERLAY_ID = 'jungle-overlay';
    const EFFECT_DURATION = 4000; // Duración base para los efectos

    // 1. Contenido del SVG
    const menuSVG = `
        <svg id="banana-split-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 778.026 633.733" style="filter: url(&quot;#outline-filter-0&quot;) url(&quot;#outline-filter-1&quot;) url(&quot;#drop-shadow-filter-0&quot;);" xmlns:bx="https://boxy-svg.com">
          <g>
            <text style="fill: rgb(246, 214, 51); font-family: Akronim; font-size: 60.8px; text-transform: capitalize; white-space: pre;" x="207.314" y="53.006">banana split menu<animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 4;0 0" begin="0s" dur="2.69s" fill="freeze" keyTimes="0; 0.501128; 1" repeatCount="indefinite"/></text>

            <g id="btn1">
              <path style="stroke: rgb(0, 0, 0); fill: rgb(246, 214, 51); cursor: pointer;" transform="matrix(0.87699699, 0, 0, 0.96108454, -356.13431541, -145.82919621)" d="M 460.906 245.951 A 162.222 162.222 0 1 1 460.906 569.605 A 209.929 209.929 0 0 0 460.906 245.951 Z" bx:shape="crescent 472.222 407.778 162.222 188 0.7 1@fac5ced6"/>
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(105, 90, 16);" cx="59.952" cy="395.168" rx="16.566" ry="8.77"/>
              <ellipse style="stroke: rgb(0, 0, 0); fill: rgb(105, 90, 16);" cx="58.491" cy="92.607" rx="15.104" ry="9.257"/>
            </g>

            <g transform="matrix(1, 0, 0, 1, 1, 1)" id="btn2">
              <path style="stroke: rgb(0, 0, 0); stroke-width: 0.919; fill: rgb(246, 214, 51); cursor: pointer;" transform="matrix(0.87699693, 0, 0, 0.96108502, -164.97624556, 40.9309167)" d="M 460.906 245.951 A 162.222 162.222 0 1 1 460.906 569.605 A 209.929 209.929 0 0 0 460.906 245.951 Z" bx:shape="crescent 472.222 407.778 162.222 188 0.7 1@fac5ced6"/>
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(105, 90, 16);" cx="251.111" cy="581.928" rx="16.566" ry="8.77"/>
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(105, 90, 16);" cx="249.65" cy="279.367" rx="15.104" ry="9.257"/>
            </g>

            <g id="btn3">
              <path style="stroke: rgb(0, 0, 0); stroke-width: 0.845; fill: rgb(246, 214, 51); cursor: pointer;" transform="matrix(0.87699693, 0, 0, 0.96108502, 12.74881199, -138.55259998)" d="M 460.906 245.951 A 162.222 162.222 0 1 1 460.906 569.605 A 209.929 209.929 0 0 0 460.906 245.951 Z" bx:shape="crescent 472.222 407.778 162.222 188 0.7 1@fac5ced6"/>
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(105, 90, 16);" cx="428.836" cy="402.444" rx="16.566" ry="8.77"/>
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(105, 90, 16);" cx="427.375" cy="99.883" rx="15.104" ry="9.257"/>
            </g>

            <g id="btn4">
              <path style="stroke: rgb(0, 0, 0); stroke-width: 0.777; fill: rgb(246, 214, 51); cursor: pointer;" transform="matrix(0.87699693, 0, 0, 0.96108502, 195.75334582, 32.13321754)" d="M 460.906 245.951 A 162.222 162.222 0 1 1 460.906 569.605 A 209.929 209.929 0 0 0 460.906 245.951 Z" bx:shape="crescent 472.222 407.778 162.222 188 0.7 1@fac5ced6"/>
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(105, 90, 16);" cx="611.841" cy="573.129" rx="16.566" ry="8.77"/>
              <ellipse style="stroke: rgb(0, 0, 0); stroke-width: 1; fill: rgb(105, 90, 16);" cx="610.38" cy="270.568" rx="15.104" ry="9.257"/>
            </g>
            <animateMotion path="M 0 0 L 0.341 -12.415 L 0.05 1.077" calcMode="linear" begin="0s" dur="3.48s" fill="freeze" keyTimes="0; 0.501128; 1" keyPoints="0; 0.501128; 1"/>
          </g>
          <defs>
            <style bx:fonts="Akronim">@import url(https://fonts.googleapis.com/css2?family=Akronim%3Aital%2Cwght%400%2C400&amp;display=swap);</style>
            <filter id="outline-filter-0" bx:preset="outline 1 4 #030400" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#030400" result="flood"/>
              <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
              <feMerge>
                <feMergeNode in="outline"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="outline-filter-1" bx:preset="outline 1 4 #bada55" color-interpolation-filters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
              <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="4"/>
              <feFlood flood-color="#bada55" result="flood"/>
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
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 4;0 0" begin="0s" dur="2.69s" fill="freeze" keyTimes="0; 0.501128; 1" repeatCount="indefinite"/>
          <animateTransform type="translate" additive="sum" attributeName="transform" values="0 0;0 4;0 0" begin="0s" dur="2.69s" fill="freeze" keyTimes="0; 0.501128; 1" repeatCount="indefinite"/>
        </svg>
    `;

    // 2. CSS Styles (Incluyendo keyframes para los efectos de jungla)
    GM_addStyle(`
        /* MENÚ PRINCIPAL (GRANDE) */
        #${MENU_ID} {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 750px; /* Tamaño grande para ver bien el SVG */
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
            transition: opacity 0.8s ease-in-out;
            background: transparent;
        }
        .effect-active {
            opacity: 1 !important;
        }

        /* --------------------------------- */
        /* EFECTO 1: Lianas y Vides (Vine Overlay) */
        /* --------------------------------- */
        .jungle-vine {
            position: absolute;
            background-color: transparent;
            border-left: 5px solid #4CAF50; /* Verde Jungla */
            border-right: 5px solid transparent;
            height: 100vh;
            width: 10px;
            transform-origin: top;
            transform: rotate(var(--angle)) scaleY(var(--scale, 1)) translateX(var(--offset, 0));
            animation: sway 5s ease-in-out infinite alternate;
        }
        @keyframes sway {
            from { transform: rotate(var(--angle)) translateX(var(--offset, 0)); }
            to { transform: rotate(var(--angle)) translateX(calc(var(--offset, 0) + 10px)); }
        }

        /* --------------------------------- */
        /* EFECTO 2: Lluvia Tropical (Rain/Mist) */
        /* --------------------------------- */
        @keyframes mist-pulse {
            0%, 100% { background-color: rgba(0, 50, 0, 0.1); }
            50% { background-color: rgba(0, 50, 0, 0.2); }
        }
        @keyframes rain-fall {
            0% { background-position: 0 0; }
            100% { background-position: 200px 1000px; } /* Movimiento de lluvia */
        }
        .tropical-rain {
            background-image: repeating-linear-gradient(45deg, rgba(0, 200, 255, 0.3), rgba(0, 200, 255, 0.3) 1px, transparent 1px, transparent 15px);
            background-size: 200px 200px;
            animation: rain-fall 0.8s linear infinite, mist-pulse 4s ease-in-out infinite;
            backdrop-filter: blur(1px) brightness(0.9);
            -webkit-backdrop-filter: blur(1px) brightness(0.9);
        }

        /* --------------------------------- */
        /* EFECTO 3: Ojos Brillantes de la Jungla (Glowing Eyes) */
        /* --------------------------------- */
        @keyframes eye-blink {
            0%, 50%, 100% { opacity: 1; }
            55%, 95% { opacity: 0; }
        }
        .jungle-eye {
            position: absolute;
            width: 15px; height: 15px;
            border-radius: 50%;
            background-color: limegreen;
            box-shadow: 0 0 15px limegreen;
            animation: eye-blink 3s infinite step-end;
        }
        .jungle-darkness {
            background-color: rgba(0, 0, 0, 0.7); /* Oscuridad para el contraste */
        }

        /* --------------------------------- */
        /* EFECTO 4: Fiebre de la Jungla (Distorsión) */
        /* --------------------------------- */
        @keyframes jungle-fever-color {
            0% { filter: hue-rotate(0deg) saturate(1) contrast(1); }
            10% { filter: hue-rotate(15deg) saturate(2) contrast(1.5); }
            90% { filter: hue-rotate(-15deg) saturate(2) contrast(1.5); }
            100% { filter: hue-rotate(0deg) saturate(1) contrast(1); }
        }
        .jungle-fever {
            animation: jungle-fever-color 0.15s infinite alternate;
            transform: perspective(1000px) rotateX(2deg) rotateY(-2deg); /* Distorsión de pantalla */
            transition: transform 0.5s;
        }
    `);

    // 3. Funciones de Efectos

    /** Obtiene el overlay de efectos y lo limpia. */
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

    /**
     * EFECTO 1: Lianas y Vides
     */
    function effectVines() {
        const overlay = getOverlay();
        overlay.classList.add('effect-active');

        for (let i = 0; i < 20; i++) {
            const vine = document.createElement('div');
            vine.className = 'jungle-vine';
            vine.style.left = `${Math.random() * 100}vw`;
            vine.style.setProperty('--angle', `${-10 + Math.random() * 20}deg`);
            vine.style.setProperty('--offset', `${-5 + Math.random() * 10}px`);
            overlay.appendChild(vine);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active');
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 2: Lluvia Tropical
     */
    function effectTropicalRain() {
        const overlay = getOverlay();
        overlay.classList.add('tropical-rain', 'effect-active');

        setTimeout(() => {
            overlay.classList.remove('effect-active', 'tropical-rain');
            overlay.style.backdropFilter = 'none';
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 3: Ojos Brillantes de la Jungla
     */
    function effectGlowingEyes() {
        const overlay = getOverlay();
        overlay.classList.add('jungle-darkness', 'effect-active');

        for (let i = 0; i < 25; i++) {
            const eye = document.createElement('div');
            eye.className = 'jungle-eye';
            eye.style.left = `${Math.random() * 80 + 10}vw`; // En el centro
            eye.style.top = `${Math.random() * 80 + 10}vh`;
            eye.style.animationDelay = `${-Math.random() * 3}s`;
            overlay.appendChild(eye);
        }

        setTimeout(() => {
            overlay.classList.remove('effect-active', 'jungle-darkness');
        }, EFFECT_DURATION);
    }

    /**
     * EFECTO 4: Fiebre de la Jungla
     * Aplica distorsión y colores al body.
     */
    function effectJungleFever() {
        const body = document.body;
        body.classList.add('jungle-fever');

        setTimeout(() => {
            body.classList.remove('jungle-fever');
            body.style.transform = ''; // Eliminar la distorsión
            body.style.filter = '';
        }, EFFECT_DURATION);
    }


    // 4. Lógica de Manejo de Clic y Dragging

    function handleButtonClick(event) {
        event.preventDefault();

        const buttonId = event.currentTarget.id;
        const effectMap = {
            'btn1': effectVines,
            'btn2': effectTropicalRain,
            'btn3': effectGlowingEyes,
            'btn4': effectJungleFever
        };

        if (effectMap[buttonId]) {
            // 1. Feedback visual
            const buttonGroup = event.currentTarget;
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
            // Solo permitir el drag si no se hace clic en un botón
            if (e.target.closest(`#btn1, #btn2, #btn3, #btn4`)) return;

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
        ['btn1', 'btn2', 'btn3', 'btn4'].forEach(id => {
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