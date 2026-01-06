// ==UserScript==
// @name         Bonk.io - removedor do limite de fps + extra fps
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Remove limite de FPS e melhora o fps, melhora o fps removendo anuncios e o replay no lobby
// @author       Gemini
// @match        *://bonk.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561570/Bonkio%20-%20removedor%20do%20limite%20de%20fps%20%2B%20extra%20fps.user.js
// @updateURL https://update.greasyfork.org/scripts/561570/Bonkio%20-%20removedor%20do%20limite%20de%20fps%20%2B%20extra%20fps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 1. DESBLOQUEIO DE FPS (Ação Única)
     * Substituímos o requestAnimationFrame nativo por um agendador de
     * micro-tarefas. Isso remove o limite de 60Hz e reduz o input lag.
     */
    const fastRAF = (callback) => setTimeout(() => callback(performance.now()), 0);
    window.requestAnimationFrame = fastRAF;

    /**
     * 2. OTIMIZAÇÃO VISUAL PASSIVA (CSS puro)
     * O navegador processa isso via GPU, sem usar a thread principal do JS.
     */
    const style = document.createElement('style');
    style.innerHTML = `
        /* Remove o vídeo de fundo (maior ganho de performance) */
        #bgreplay { display: none !important; }

        /* Remove anúncios e poluição visual externa */
        #adboxverticalCurse, #adboxverticalleft, #bonkioheader,
        .ad-unit, #footer, #descriptioncontainer {
            display: none !important;
        }

        /* Otimiza a renderização do Body: evita repinturas caras de layout */
        body {
            background: #2e2644 !important;
            background-image: none !important;
            image-rendering: pixelated; /* Otimiza o desenho de texturas se suportado */
        }

        /* Garante que o jogo e o lobby não percam o foco de clique */
        #pagecontainer, #newbonkgamecontainer, #maingameframe {
            contain: layout style; /* Isolamento de layout para maior velocidade */
        }
    `;
    document.head.appendChild(style);

    /**
     * 3. LIMPEZA DE MEMÓRIA
     * Forçamos a parada de vídeos que podem estar rodando "invisíveis"
     */
    window.addEventListener('load', () => {
        const video = document.getElementsByTagName('video');
        for (let v of video) v.pause();
    }, { once: true });

})();