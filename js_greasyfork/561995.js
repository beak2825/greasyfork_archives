// ==UserScript==
// @name         Chess.com Fluid Mod - Xaixon
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Efecto de levitación y movimiento fluido para piezas en Chess.com con estilo Neón.
// @author       Xaixon
// @match        https://www.chess.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561995/Chesscom%20Fluid%20Mod%20-%20Xaixon.user.js
// @updateURL https://update.greasyfork.org/scripts/561995/Chesscom%20Fluid%20Mod%20-%20Xaixon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Creamos el elemento de estilo para inyectar el CSS en Chess.com
    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. ANIMACIÓN DE SALTO Y FLUIDEZ */
        .piece {
            /* Movimiento elástico que simula un salto */
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            /* Sombra suave para dar profundidad de base */
            filter: drop-shadow(0 8px 10px rgba(0,0,0,0.4)) !important;
        }

        /* 2. EFECTO DE LEVITACIÓN AL SELECCIONAR O ARRASTRAR */
        .dragging, .selected {
            /* La pieza sube (-20px) y se hace un poco más grande */
            transform: scale(1.2) translateY(-20px) !important;
            /* Brillo neón cian que indica que la pieza está 'en el aire' */
            filter: drop-shadow(0 20px 25px rgba(0, 255, 255, 0.8)) !important;
            transition: 0.2s !important;
            z-index: 1000 !important;
        }

        /* 3. RESALTE DE CASILLAS (HINTS) CON ESTILO NEÓN */
        .highlight {
            background-color: rgba(0, 255, 255, 0.3) !important;
            box-shadow: inset 0 0 15px rgba(0, 255, 255, 0.5) !important;
        }

        /* 4. ÚLTIMO MOVIMIENTO */
        .last-move {
            background-color: rgba(0, 255, 255, 0.1) !important;
            border: 1px solid rgba(0, 255, 255, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
})();