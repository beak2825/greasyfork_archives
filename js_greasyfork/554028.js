// ==UserScript==
// @name         Fondo Matrix Rojo para Drawaria
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Muestra un fondo estilo Matrix rojo animado en Drawaria
// @author       Juan
// @match        https://drawaria.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554028/Fondo%20Matrix%20Rojo%20para%20Drawaria.user.js
// @updateURL https://update.greasyfork.org/scripts/554028/Fondo%20Matrix%20Rojo%20para%20Drawaria.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear el canvas para el fondo Matrix
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixBackground';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1'; // Asegura que esté detrás de todo
    canvas.style.pointerEvents = 'none';
    canvas.style.backgroundColor = 'black';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ff0000'; // Rojo Matrix
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    // Ajustar tamaño al cambiar ventana
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
})();
