// ==UserScript==
// @name         BloxDrop Omni-Solver V7
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Detección por contenido de texto y envío forzado. Versión día 57.
// @author       Xaixon & Gemini
// @match        *://bloxdrop.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562018/BloxDrop%20Omni-Solver%20V7.user.js
// @updateURL https://update.greasyfork.org/scripts/562018/BloxDrop%20Omni-Solver%20V7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. HUD HACKER
    const hud = document.createElement('div');
    hud.style = "position:fixed; left:10px; top:25%; width:150px; background:rgba(0,0,0,0.9); color:#0f0; border:1px solid #0f0; padding:10px; font-family:monospace; z-index:999999; font-size:11px; border-radius:5px;";
    hud.innerHTML = `<div style="border-bottom:1px solid #0f0; margin-bottom:5px">X-OS v7.0</div><div id="st">BUSCANDO...</div><div id="rs" style="color:white; font-size:14px; margin-top:5px"></div>`;
    document.body.appendChild(hud);

    const log = (s, r = "") => {
        document.getElementById('st').innerText = s;
        document.getElementById('rs').innerText = r;
    };

    // 2. FUNCIÓN DE ENVÍO (Más simple para evitar bloqueos)
    const forceSend = (text) => {
        const input = document.querySelector('input[placeholder*="mensaje"]') || document.querySelector('input');
        const btn = document.querySelector('button[type="submit"]') || document.querySelector('.chat-input-container button') || document.querySelector('form button');

        if (input && input.value !== text) {
            input.focus();
            input.value = text;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            setTimeout(() => {
                if (btn) btn.click();
            }, 100);
        }
    };

    // 3. MONITOR UNIVERSAL
    setInterval(() => {
        // En lugar de buscar una clase, buscamos CUALQUIER div que tenga el texto de los juegos
        const allDivs = document.getElementsByTagName('div');
        let found = false;

        for (let div of allDivs) {
            const txt = div.innerText;
            
            // Si el div contiene palabras clave de los retos
            if (txt.includes("SAY IT") || txt.includes("BACKWARDS") || txt.includes("TYPE")) {
                found = true;
                let answer = null;

                // DEDUCCIÓN SEGÚN EL TEXTO
                if (txt.includes("BACKWARDS")) {
                    // Buscamos la palabra: suele estar sola en una línea o después de un salto
                    const parts = txt.split('\n');
                    const word = parts[parts.length - 1].trim(); 
                    if (word.length > 0 && word.length < 15) {
                        answer = word.split('').reverse().join('');
                    }
                } else {
                    // Si es "Say it" o "Type it", buscamos lo que está entre comillas
                    const quote = txt.match(/"([^"]+)"/);
                    if (quote) answer = quote[1];
                }

                if (answer) {
                    log("RETO ENCONTRADO", answer);
                    forceSend(answer);
                    break; 
                }
            }
        }

        if (!found) log("ESCANEANDO...");

    }, 500);

})();