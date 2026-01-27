// ==UserScript==
// @name         Cheat Tacadinha
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Cheat de Linha para o site Tacadinha.com
// @author       Sr.Caveira
// @match        *://tacadinha.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564186/Cheat%20Tacadinha.user.js
// @updateURL https://update.greasyfork.org/scripts/564186/Cheat%20Tacadinha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.__SINUCACHEAT_PRO__) return;
    window.__SINUCACHEAT_PRO__ = true;

    // --- CONFIGURAÇÕES INICIAIS (Editáveis via Menu) ---
    let config = {
        lineColor: "rgba(255, 255, 255, 0.3)",
        aimColor: "#0000ff",
        pointSize: 8,
        aimSize: 11,
        dashSize: 5,
        lineWidth: 1
    };

    /* =====================
       CRIAÇÃO DO MENU (F3)
    ====================== */
    const menu = document.createElement("div");
    Object.assign(menu.style, {
        position: "fixed", top: "20px", right: "-300px", width: "250px",
        backgroundColor: "rgba(0, 0, 0, 0.9)", color: "white", padding: "15px",
        borderRadius: "10px", zIndex: "1000000", fontFamily: "sans-serif",
        transition: "right 0.3s ease", boxShadow: "0 0 15px rgba(0,255,0,0.5)",
        border: "1px solid #0f0"
    });
    
    menu.innerHTML = `
        <h3 style="margin-top:0; color:#0f0">Configurações 🎱</h3>
        <label>Cor das Linhas:</label><br>
        <input type="color" id="cfgLineColor" value="#ffffff"><br><br>
        <label>Cor da Mira:</label><br>
        <input type="color" id="cfgAimColor" value="#0000ff"><br><br>
        <label>Tamanho dos Pontos:</label>
        <input type="range" id="cfgPointSize" min="2" max="20" value="8"><br>
        <label>Espessura da Linha:</label>
        <input type="range" id="cfgLineWidth" min="1" max="10" value="1"><br>
        <label>Tracejado (Dash):</label>
        <input type="range" id="cfgDash" min="0" max="20" value="5">
        <p style="font-size:10px; color:#aaa; margin-top:10px;">F2: Esconder Mira | F3: Menu</p>
    `;
    document.body.appendChild(menu);

    // Eventos do Menu
    menu.addEventListener("input", (e) => {
        if(e.target.id === "cfgLineColor") config.lineColor = e.target.value + "4D"; // 4D = Transparência
        if(e.target.id === "cfgAimColor") {
            config.aimColor = e.target.value;
            points.find(p => p.isAim).color = e.target.value;
        }
        if(e.target.id === "cfgPointSize") config.pointSize = parseInt(e.target.value);
        if(e.target.id === "cfgLineWidth") config.lineWidth = parseInt(e.target.value);
        if(e.target.id === "cfgDash") config.dashSize = parseInt(e.target.value);
        draw();
    });

    /* =====================
       LÓGICA DO CANVAS (ESTÁVEL)
    ====================== */
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
        zIndex: "999999", pointerEvents: "none", display: "block"
    });
    document.body.appendChild(overlay);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    overlay.appendChild(canvas);

    let points = [
        { x: 272, y: 64, color: "lime" }, { x: 630, y: 55, color: "lime" },
        { x: 1023, y: 86, color: "lime" }, { x: 208, y: 451, color: "cyan" },
        { x: 619, y: 561, color: "cyan" }, { x: 1017, y: 504, color: "cyan" },
        { x: 626, y: 288, color: config.aimColor, isAim: true }
    ];

    let draggedPoint = null;

    window.addEventListener("mousedown", e => {
        const target = points.find(p => Math.hypot(p.x - e.clientX, p.y - e.clientY) < 20);
        if (target) {
            draggedPoint = target;
            overlay.style.pointerEvents = "auto";
            e.preventDefault();
        }
    }, true);

    window.addEventListener("mouseup", () => {
        draggedPoint = null;
        overlay.style.pointerEvents = "none";
    });

    window.addEventListener("mousemove", e => {
        if (draggedPoint) {
            draggedPoint.x = e.clientX;
            draggedPoint.y = e.clientY;
            draw();
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const aim = points.find(p => p.isAim);

        // Desenha Linhas
        ctx.setLineDash([config.dashSize, config.dashSize]);
        ctx.lineWidth = config.lineWidth;
        points.forEach(p => {
            if (p === aim) return;
            ctx.beginPath();
            ctx.moveTo(aim.x, aim.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = config.lineColor;
            ctx.stroke();
        });

        // Desenha Pontos
        ctx.setLineDash([]);
        points.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.isAim ? config.pointSize + 3 : config.pointSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        draw();
    }
    window.addEventListener("resize", resize);
    resize();

    /* =====================
       TECLAS DE ATALHO
    ====================== */
    let menuOpen = false;
    document.addEventListener("keydown", e => {
        if (e.key === "n") {
            overlay.style.display = overlay.style.display === "none" ? "block" : "none";
        }
        if (e.key === "m") {
            menuOpen = !menuOpen;
            menu.style.right = menuOpen ? "20px" : "-300px";
            e.preventDefault();
        }
    });

    console.log("%c🎱 Menu F3 Habilitado!", "color:#0f0; font-weight:bold;");
})();