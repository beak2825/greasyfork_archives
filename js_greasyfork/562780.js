// ==UserScript==
// @name        Chat Comands - Dado E Moeda
// @namespace   Violentmonkey Scripts
// @match       https://bonk.io/*
// @grant       none
// @version     1.0
// @author      -
// @description use /roll [número de lados] para rolar um dado, e /coin para girar uma moeda
// @downloadURL https://update.greasyfork.org/scripts/562780/Chat%20Comands%20-%20Dado%20E%20Moeda.user.js
// @updateURL https://update.greasyfork.org/scripts/562780/Chat%20Comands%20-%20Dado%20E%20Moeda.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Função que processa os comandos no texto
    function processChatCommands(inputElement) {
        let text = inputElement.value;

        // Comando /roll [x]
        if (text.startsWith('/roll')) {
            const match = text.match(/\/roll\s*\[?(\d+)\]?/);
            if (match) {
                const limite = parseInt(match[1]);
                const resultado = Math.floor(Math.random() * limite) + 1;
                inputElement.value = `[DADO 1-${limite}]: ${resultado}`;
            }
        }
        // Comando /coin
        else if (text.startsWith('/coin')) {
            const sorteio = Math.random() < 0.5 ? "CARA" : "COROA";
            inputElement.value = `[MOEDA]: ${sorteio}`;
        }
    }

    // Escuta as teclas no chat para interceptar o Enter
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // O chat do Bonk.io usa o ID 'newbonkgame_chat_input' ou 'ingamechatinput'
            const chatInput = document.activeElement;

            if (chatInput && (chatInput.id.includes('chat') || chatInput.type === 'text')) {
                processChatCommands(chatInput);
            }
        }
    }, true); // 'true' garante que pegamos o evento antes do jogo processar

    console.log("Comandos de Chat (Fix): Digite /roll [x] ou /coin e aperte Enter.");
})();