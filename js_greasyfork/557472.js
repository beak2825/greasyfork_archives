// ==UserScript==
// @name         Botões Shift e A na Tela
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona botões na tela para simular pressionamento das teclas Shift e A no celular
// @author       Yan
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557472/Bot%C3%B5es%20Shift%20e%20A%20na%20Tela.user.js
// @updateURL https://update.greasyfork.org/scripts/557472/Bot%C3%B5es%20Shift%20e%20A%20na%20Tela.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======= Criar estilo dos botões =======
    const style = document.createElement("style");
    style.innerHTML = `
        .virtual-key {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            width: 60px;
            height: 60px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            margin-top: 10px;
            user-select: none;
        }
        #btnA { bottom: 20px; }
        #btnShift { bottom: 90px; }
    `;
    document.body.appendChild(style);

    // ======= Criar botão A =======
    const btnA = document.createElement("div");
    btnA.id = "btnA";
    btnA.className = "virtual-key";
    btnA.innerText = "A";
    document.body.appendChild(btnA);

    // ======= Criar botão SHIFT =======
    const btnShift = document.createElement("div");
    btnShift.id = "btnShift";
    btnShift.className = "virtual-key";
    btnShift.innerText = "Shift";
    document.body.appendChild(btnShift);

    // ======= Função para enviar teclas =======
    function triggerKey(key, isShift=false) {
        const eventOptions = {
            key: key,
            code: key === "A" ? "KeyA" : "ShiftLeft",
            keyCode: key === "A" ? 65 : 16,
            which: key === "A" ? 65 : 16,
            bubbles: true,
            cancelable: true
        };

        if(isShift) eventOptions.shiftKey = true;

        document.dispatchEvent(new KeyboardEvent("keydown", eventOptions));
        document.dispatchEvent(new KeyboardEvent("keyup", eventOptions));
    }

    // ======= Ações dos botões =======
    btnA.addEventListener("touchstart", () => {
        triggerKey("A");
    });

    btnShift.addEventListener("touchstart", () => {
        triggerKey("Shift");
    });

})();