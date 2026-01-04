// ==UserScript==
// @name         YouTube Red Matrix Background
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cambia el fondo de YouTube a un estilo Matrix rojo animado sobre negro
// @author       Juan
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554162/YouTube%20Red%20Matrix%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/554162/YouTube%20Red%20Matrix%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crea el canvas para el efecto Matrix
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.backgroundColor = 'black';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const letters = '01あアカサタナハマヤラワガザダバパABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ff0000'; // rojo intenso
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);

    // Oscurece el fondo de YouTube para que se vea el efecto
    const darkenYouTube = () => {
        const main = document.querySelector('ytd-app');
        if (main) {
            main.style.background = 'transparent';
        }
    };

    const interval = setInterval(() => {
        darkenYouTube();
        if (document.readyState === 'complete') {
            clearInterval(interval);
        }
    }, 1000);
})();
