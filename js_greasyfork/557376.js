// ==UserScript==
// @name         Miniblox.io - Christmas script
// @namespace    MysticWolf
// @version      1.0
// @description  Christmas script
// @match        https://miniblox.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557376/Minibloxio%20-%20Christmas%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/557376/Minibloxio%20-%20Christmas%20script.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Crear canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999999";

    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Crear copos
    const flakes = [];
    const amount = 200;

    for (let i = 0; i < amount; i++) {
        flakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            drift: Math.random() * 0.6 - 0.3
        });
    }

    function snow() {

        // Si entra al servidor (canvas del juego) → parar nieve
        if (document.querySelector("canvas[style*='touch-action']")) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(snow);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let f of flakes) {
            f.y += f.speed;
            f.x += f.drift;

            if (f.y > canvas.height) {
                f.y = -5;
                f.x = Math.random() * canvas.width;
            }

            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(snow);
    }

    snow();

})();
