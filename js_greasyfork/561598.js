// ==UserScript==
// @name         Mostrar GM no Chess.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona símbolo de GM no seu perfil e lista de online no Chess.com (visível apenas pra você)
// @author       Yan
// @match        https://www.chess.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561598/Mostrar%20GM%20no%20Chesscom.user.js
// @updateURL https://update.greasyfork.org/scripts/561598/Mostrar%20GM%20no%20Chesscom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= Configuração =================
    const seuNome = "fragmentofear"; // Coloque exatamente seu username do chess.com
    const simboloGM = "♔ GM"; // Símbolo que você quer mostrar
    // =================================================

    function adicionarGM() {
        // Perfil
        const perfilNome = document.querySelector("h1.user-tagline-username, .user-tagline-username");
        if (perfilNome && perfilNome.textContent.trim() === seuNome && !perfilNome.dataset.gmAdicionado) {
            perfilNome.textContent += ` ${simboloGM}`;
            perfilNome.dataset.gmAdicionado = "true";
        }

        // Lista de online / chat
        const onlineUsers = document.querySelectorAll(".online-users .username, .user-username");
        onlineUsers.forEach(u => {
            if (u.textContent.trim() === seuNome && !u.dataset.gmAdicionado) {
                u.textContent += ` ${simboloGM}`;
                u.dataset.gmAdicionado = "true";
            }
        });
    }

    // Observador de mudanças na página para atualizar GM quando a lista online muda
    const observer = new MutationObserver(adicionarGM);
    observer.observe(document.body, { childList: true, subtree: true });

    // Rodar inicialmente
    adicionarGM();
})();