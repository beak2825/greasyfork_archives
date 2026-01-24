// ==UserScript==
// @name         Shell Shockers Ice Theme ❄️
// @namespace    violentmonkey.shellshockers.ice
// @version      1.1
// @description  Full ice theme with snow, glow, and custom crosshair
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563787/Shell%20Shockers%20Ice%20Theme%20%E2%9D%84%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/563787/Shell%20Shockers%20Ice%20Theme%20%E2%9D%84%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =====================
       ICE THEME CSS
    ====================== */
    const css = `
    body {
        background: linear-gradient(135deg, #081a2b, #1e4b7a) !important;
        overflow: hidden;
    }

    * {
        color: #e3f7ff !important;
        text-shadow: 0 0 5px rgba(120,200,255,0.35);
    }

    .hud, .menu-panel, .popup, .dialog {
        background: rgba(10, 30, 50, 0.88) !important;
        border: 1px solid rgba(150, 220, 255, 0.45) !important;
        box-shadow: 0 0 20px rgba(120, 210, 255, 0.3);
    }

    button {
        background: linear-gradient(145deg, #38bdf8, #0b5fa5) !important;
        border: 1px solid #9be7ff !important;
        box-shadow: 0 0 10px rgba(120,220,255,0.6);
    }

    button:hover {
        background: linear-gradient(145deg, #6fd3ff, #2a7fc9) !important;
    }

    .health-bar, .ammo-bar {
        background: linear-gradient(90deg, #9be7ff, #3aaeff) !important;
        box-shadow: 0 0 10px #7fdcff;
    }

    /* ===== ICE CROSSHAIR ===== */
    #ice-crosshair {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 26px;
        height: 26px;
        margin-left: -13px;
        margin-top: -13px;
        border: 2px solid #c7f4ff;
        border-radius: 50%;
        box-shadow:
            0 0 8px #9be7ff,
            0 0 18px #5bcfff;
        pointer-events: none;
        z-index: 9999;
    }

    #ice-crosshair::before,
    #ice-crosshair::after {
        content: '';
        position: absolute;
        background: #c7f4ff;
        box-shadow: 0 0 8px #7fdcff;
    }

    #ice-crosshair::before {
        width: 2px;
        height: 26px;
        left: 12px;
        top: 0;
    }

    #ice-crosshair::after {
        height: 2px;
        width: 26px;
        top: 12px;
        left: 0;
    }

    /* ===== SNOW CANVAS ===== */
    #snow {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
    }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);


    /* =====================
       SNOW EFFECT
    ====================== */
    const canvas = document.createElement("canvas");
    canvas.id = "snow";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    const flakes = Array.from({ length: 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.8,
        d: Math.random() + 0.6
    }));

    function drawSnow() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgba(210,245,255,0.85)";
        ctx.beginPath();
        flakes.forEach(f => {
            ctx.moveTo(f.x, f.y);
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        });
        ctx.fill();

        flakes.forEach(f => {
            f.y += f.d;
            if (f.y > h) {
                f.y = -5;
                f.x = Math.random() * w;
            }
        });
    }

    setInterval(drawSnow, 33); // ~30 FPS (FPS-safe)

})();
