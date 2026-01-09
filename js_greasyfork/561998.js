// ==UserScript==
// @name         Chess Cinematic Captures - Xaixon
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Movimiento fluido, inclinación 3D y muerte estilo Minecraft (rojo + caída lateral).
// @author       Xaixon
// @match        https://www.chess.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561998/Chess%20Cinematic%20Captures%20-%20Xaixon.user.js
// @updateURL https://update.greasyfork.org/scripts/561998/Chess%20Cinematic%20Captures%20-%20Xaixon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. MOVIMIENTO BASE Y FLUIDEZ */
        .piece {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s !important;
        }

        /* 2. LEVITACIÓN AL ARRASTRAR (Dedo centrado) */
        .dragging {
            transform-origin: center center !important;
            transform: scale(1.3) translateY(-70px) !important;
            filter: drop-shadow(0 40px 20px rgba(0,0,0,0.4)) !important;
            z-index: 10000 !important;
            transition: transform 0.1s linear !important;
        }

        /* 3. ANIMACIÓN DE MUERTE (ESTILO MINECRAFT) */
        @keyframes minecraftDeath {
            0% { transform: rotate(0deg); filter: brightness(1) sepia(0); }
            20% { filter: brightness(0.5) sepia(1) saturate(10) hue-rotate(-50deg); } /* Se pone roja */
            100% { transform: rotate(90deg) translateY(50px); opacity: 0; filter: brightness(0.5) sepia(1) saturate(10) hue-rotate(-50deg); } /* Cae de lado */
        }

        /* Clase que aplicamos cuando la pieza es capturada */
        .piece.captured {
            animation: minecraftDeath 0.6s ease-in forwards !important;
            pointer-events: none !important;
        }

        /* 4. TEMBLOR DE AMENAZA */
        @keyframes shake {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(1px, -1px); }
            75% { transform: translate(-1px, 1px); }
        }
        .piece.under-attack { animation: shake 0.2s infinite; }

        /* 5. PREMOVE ROJO NEÓN */
        .highlight.premove {
            background-color: rgba(255, 0, 0, 0.4) !important;
            box-shadow: inset 0 0 20px rgba(255, 0, 0, 0.6) !important;
        }
    `;
    document.head.appendChild(style);

    // Lógica para detectar capturas y aplicar la animación de muerte
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('piece')) {
                    // Clonamos la pieza para mostrar la animación de muerte antes de que desaparezca del DOM
                    const ghost = node.cloneNode(true);
                    ghost.classList.add('captured');
                    node.parentNode.appendChild(ghost);
                    setTimeout(() => ghost.remove(), 700);
                }
            });
        });
    });

    // Esperar a que el tablero cargue para empezar a observar
    const startObserver = () => {
        const board = document.querySelector('chess-board') || document.querySelector('.board');
        if (board) {
            observer.observe(board, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 1000);
        }
    };
    startObserver();

    // Lógica de inclinación por dirección (Dedo)
    let lastX = 0;
    document.addEventListener('touchmove', (e) => {
        const piece = document.querySelector('.dragging');
        if (piece) {
            let currentX = e.touches[0].clientX;
            let tilt = (currentX > lastX) ? 15 : -15;
            piece.style.transform = `scale(1.3) translateY(-70px) rotate(${tilt}deg)`;
            lastX = currentX;
        }
    }, { passive: true });

})();