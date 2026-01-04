// ==UserScript==
// @name         Reddit - Auto Unlock 18+
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Desbloqueia conteúdo +18
// @author       0x001
// @match        https://*.reddit.com/*
// @match        https://www.reddit.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557536/Reddit%20-%20Auto%20Unlock%2018%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/557536/Reddit%20-%20Auto%20Unlock%2018%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORDS = ['visualizar', 'view', 'nsfw', '18+', 'click'];

    function pierceShadowAndUnlock() {
        // 1. Encontra todos os containers "borrados" específicos do Reddit Novo
        const blurredContainers = document.querySelectorAll('shreddit-blurred-container');

        blurredContainers.forEach(container => {
            // Verifica se já desbloqueamos esse para não ficar processando à toa
            if (container.getAttribute('data-shadow-unlocked')) return;

            // 2. ACESSA O SHADOW DOM (A parte crítica)
            const shadow = container.shadowRoot;

            if (shadow) {
                // --- ESTRATÉGIA 1: Clicar no botão dentro da sombra ---
                // Baseado no seu HTML: <div class="overlay"><button ...>
                const button = shadow.querySelector('button');

                if (button) {
                    const text = button.textContent.toLowerCase();
                    // Se o botão tiver textos suspeitos
                    if (KEYWORDS.some(key => text.includes(key))) {
                        console.log('🔓 Botão encontrado no Shadow DOM. Clicando...');
                        button.click();
                        container.setAttribute('data-shadow-unlocked', 'true');
                    }
                }

                // --- ESTRATÉGIA 2: Força Bruta Visual (Caso o clique falhe) ---
                // Baseado no seu HTML: <span class="inner blurred" style="filter:blur(40px);">
                const blurredSpan = shadow.querySelector('.blurred');
                if (blurredSpan) {
                    blurredSpan.style.filter = 'none !important';
                    blurredSpan.style.opacity = '1';
                    blurredSpan.classList.remove('blurred');
                }

                // Baseado no seu HTML: <div class="overlay">
                const overlay = shadow.querySelector('.overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }

                // Baseado no seu HTML: <div class="bg-scrim"> (fundo preto)
                const scrim = shadow.querySelector('.bg-scrim');
                if (scrim) {
                    scrim.style.display = 'none';
                }
            }
        });
    }

    // Executa a cada 500ms para garantir que pegue o conteúdo assim que você rola a página
    setInterval(pierceShadowAndUnlock, 500);

})();