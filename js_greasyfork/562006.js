// ==UserScript==
// @name         BloxDrop Omni-Solver Hacker
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Hacker Sidebar con deducción universal de retos para BloxDrop.
// @author       Xaixon & Gemini
// @match        *://bloxdrop.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562006/BloxDrop%20Omni-Solver%20Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/562006/BloxDrop%20Omni-Solver%20Hacker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. INTERFAZ HACKER AVANZADA (Lateral Izquierda)
    const hackerBar = document.createElement('div');
    hackerBar.id = 'hacker-v5';
    hackerBar.innerHTML = `
        <div style="color:#0f0; font-weight:bold; border-bottom:1px solid #0f0; padding-bottom:4px; margin-bottom:8px; text-align:center;">DÍA 57: OVERRIDE</div>
        <div style="font-size:10px; color:#888;">ESTADO:</div>
        <div id="h-status" style="color:#fff; margin-bottom:8px;">ESPERANDO...</div>
        <div style="font-size:10px; color:#888;">DEDUCCIÓN:</div>
        <div id="h-result" style="color:#0f0; font-size:16px; font-weight:bold; background:rgba(0,255,0,0.1); padding:4px; border-radius:3px;">---</div>
        <div style="margin-top:10px; font-size:9px; color:#050; border-top:1px solid #050; padding-top:4px;">SYSTEM_BY_XAIXON</div>
    `;
    Object.assign(hackerBar.style, {
        position: 'fixed', left: '15px', top: '150px', width: '150px',
        backgroundColor: 'rgba(5, 5, 5, 0.95)', border: '1px solid #0f0',
        color: '#0f0', padding: '12px', fontFamily: 'monospace',
        zIndex: '1000000', borderRadius: '4px', boxShadow: '0 0 15px rgba(0,255,0,0.3)'
    });
    document.body.appendChild(hackerBar);

    const updateHacker = (status, result = "---") => {
        document.getElementById('h-status').innerText = status;
        document.getElementById('h-result').innerText = result;
    };

    // 2. MOTOR DE DEDUCCIÓN UNIVERSAL
    const solveChallenge = (text) => {
        const cleanText = text.toLowerCase().trim();
        
        // --- CASO 1: SAY IT BACKWARDS (Darlo vuelta) ---
        if (cleanText.includes("backwards") || cleanText.includes("reves")) {
            // Extraer la palabra: buscamos la que está en el recuadro pequeño (ej: "wy")
            const lines = text.split('\n');
            const target = lines[lines.length - 1].trim(); // Generalmente es la última línea
            return target.split('').reverse().join('');
        }

        // --- CASO 2: MATEMÁTICAS (Cálculo directo) ---
        const mathMatch = text.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
        if (mathMatch) {
            try { return eval(mathMatch[0]).toString(); } catch(e) { return null; }
        }

        // --- CASO 3: SAY IT / TYPE IT (Copiar) ---
        // Si no es ninguna de las anteriores, pero hay una palabra aislada o entre comillas
        const quoted = text.match(/"([^"]+)"/);
        if (quoted) return quoted[1];

        // Si es una palabra corta al final (como en muchos retos de BloxDrop)
        const words = text.split(/\s+/);
        const lastWord = words[words.length - 1];
        if (lastWord.length > 0 && lastWord.length < 15) return lastWord;

        return null;
    };

    // 3. INYECTOR AUTOMÁTICO EN EL CHAT
    const injectToChat = (answer) => {
        const input = document.querySelector('input[placeholder*="mensaje"]');
        const sendBtn = document.querySelector('button[type="submit"]') || 
                        document.querySelector('.chat-input-container button');

        if (input && input.value !== answer) {
            input.value = answer;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Enviamos con un pequeño retraso para asegurar que la web procese el texto
            setTimeout(() => {
                if (sendBtn) sendBtn.click();
            }, 100);
        }
    };

    // 4. BUCLE DE MONITOREO (Enfocado en el elemento de la captura)
    const monitor = () => {
        // Buscamos el contenedor del reto (el morado de tu foto)
        // Usamos selectores basados en la estructura visual de BloxDrop
        const challengeElement = document.querySelector('[class*="Challenge_container"]') || 
                                document.querySelector('.flex.flex-col.items-center.justify-center.p-4');

        if (challengeElement) {
            const rawText = challengeElement.innerText;
            const answer = solveChallenge(rawText);

            if (answer) {
                updateHacker("RETO DETECTADO", answer);
                injectToChat(answer);
            }
        } else {
            updateHacker("ESPERANDO...");
        }
    };

    // Ejecución rápida cada 300ms
    setInterval(monitor, 300);

})();