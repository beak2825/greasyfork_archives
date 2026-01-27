// ==UserScript==
// @name         Cheat Tacadinha
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  Cheat Tacadinha - Linha infinita
// @author       Sr.Caveira
// @match        *://tacadinha.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564052/Cheat%20Tacadinha.user.js
// @updateURL https://update.greasyfork.org/scripts/564052/Cheat%20Tacadinha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.__SINUCACHEAT_PRO_MAX__) return;
    window.__SINUCACHEAT_PRO_MAX__ = true;

    let config = {
        lineColor: "rgba(255, 255, 255, 0.3)",
        aimColor: "#0000ff",
        pointSize: 8,
        lineWidth: 1,
        dashSize: 5
    };

    let points = [
        { x: 0.25, y: 0.15, color: "lime" }, 
        { x: 0.50, y: 0.12, color: "lime" },
        { x: 0.75, y: 0.15, color: "lime" }, 
        { x: 0.25, y: 0.85, color: "red" },
        { x: 0.50, y: 0.88, color: "red" }, 
        { x: 0.75, y: 0.85, color: "red" },
        { x: 0.50, y: 0.50, color: config.aimColor, isAim: true }
    ];

    // Variável global para rastrear o mouse continuamente
    let lastMousePos = { x: 0.5, y: 0.5 };

    function saveAll() {
        GM_setValue("cheat_config", JSON.stringify(config));
        GM_setValue("cheat_points_pct", JSON.stringify(points));
    }

    function loadAll() {
        const savedCfg = GM_getValue("cheat_config");
        if (savedCfg) {
            config = JSON.parse(savedCfg);
            setTimeout(() => {
                if(document.getElementById("cfgLineColor")) {
                    document.getElementById("cfgLineColor").value = config.lineColor.substring(0, 7);
                    document.getElementById("cfgAimColor").value = config.aimColor;
                    document.getElementById("cfgPointSize").value = config.pointSize;
                    document.getElementById("cfgLineWidth").value = config.lineWidth;
                    document.getElementById("cfgDash").value = config.dashSize;
                }
            }, 100);
        }
        const savedPts = GM_getValue("cheat_points_pct");
        if (savedPts) points = JSON.parse(savedPts);
    }

    const menu = document.createElement("div");
    Object.assign(menu.style, {
        position: "fixed", top: "20px", right: "-300px", width: "250px",
        backgroundColor: "rgba(0, 0, 0, 0.95)", color: "white", padding: "15px",
        borderRadius: "10px", zIndex: "1000000", fontFamily: 'Segoe UI, Arial',
        transition: "right 0.3s ease", boxShadow: "0 0 15px #0f0", border: "1px solid #0f0"
    });
    
    menu.innerHTML = `
        <h3 style="margin:0 0 15px 0; color:#0f0; text-align:center;">MENU TACADINHA v1.4.3</h3>
        <label>Linhas:</label><input type="color" id="cfgLineColor" style="float:right"><br><br>
        <label>Mira:</label><input type="color" id="cfgAimColor" style="float:right"><br><br>
        <label>Tamanho Ponto:</label><input type="range" id="cfgPointSize" min="2" max="20" style="width:100%"><br>
        <label>Espessura Linha:</label><input type="range" id="cfgLineWidth" min="1" max="8" style="width:100%"><br>
        <label>Tracejado:</label><input type="range" id="cfgDash" min="0" max="20" style="width:100%">
        <div style="font-size:11px; color:#777; margin-top:15px; border-top:1px solid #333; padding-top:5px;">
            <b>N:</b> Esconder | <b>M:</b> Menu | <b>C:</b> Mira no Mouse
        </div>
    `;
    document.body.appendChild(menu);

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
        zIndex: "999999", pointerEvents: "none"
    });
    document.body.appendChild(overlay);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    overlay.appendChild(canvas);

    let draggedPoint = null;

    window.addEventListener("mousedown", e => {
        const target = points.find(p => {
            const dx = (p.x * window.innerWidth) - e.clientX;
            const dy = (p.y * window.innerHeight) - e.clientY;
            return Math.hypot(dx, dy) < 20;
        });
        if (target) {
            draggedPoint = target;
            overlay.style.pointerEvents = "auto";
            e.preventDefault();
        }
    }, true);

    window.addEventListener("mouseup", () => {
        if (draggedPoint) saveAll();
        draggedPoint = null;
        overlay.style.pointerEvents = "none";
    });

    // Rastreia a posição do mouse para o comando 'C'
    window.addEventListener("mousemove", e => {
        lastMousePos.x = e.clientX / window.innerWidth;
        lastMousePos.y = e.clientY / window.innerHeight;

        if (draggedPoint) {
            draggedPoint.x = lastMousePos.x;
            draggedPoint.y = lastMousePos.y;
            draw();
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const aim = points.find(p => p.isAim);
        const aimX = aim.x * canvas.width;
        const aimY = aim.y * canvas.height;

        ctx.setLineDash([config.dashSize, config.dashSize]);
        ctx.lineWidth = config.lineWidth;
        points.forEach(p => {
            if (p === aim) return;
            ctx.beginPath();
            ctx.moveTo(aimX, aimY);
            ctx.lineTo(p.x * canvas.width, p.y * canvas.height);
            ctx.strokeStyle = config.lineColor;
            ctx.stroke();
        });

        ctx.setLineDash([]);
        points.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, p.isAim ? config.pointSize + 3 : config.pointSize, 0, Math.PI * 2);
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

    menu.addEventListener("input", (e) => {
        if(e.target.id === "cfgLineColor") config.lineColor = e.target.value + "4D";
        if(e.target.id === "cfgAimColor") {
            config.aimColor = e.target.value;
            points.find(p => p.isAim).color = e.target.value;
        }
        if(e.target.id === "cfgPointSize") config.pointSize = parseInt(e.target.value);
        if(e.target.id === "cfgLineWidth") config.lineWidth = parseInt(e.target.value);
        if(e.target.id === "cfgDash") config.dashSize = parseInt(e.target.value);
        draw();
        saveAll();
    });

    /* =====================
       ATALHOS (C adicionado)
    ====================== */
    let menuOpen = false;
    document.addEventListener("keydown", e => {
        const key = e.key.toLowerCase();
        
        if (key === "n") {
            const isHidden = overlay.style.display === "none";
            overlay.style.display = isHidden ? "block" : "none";
            if (!isHidden) { menuOpen = false; menu.style.right = "-300px"; }
        }

        if (key === "m") {
            if (overlay.style.display !== "none") {
                menuOpen = !menuOpen;
                menu.style.right = menuOpen ? "20px" : "-300px";
            }
        }

        // NOVO: Tecla 'C' para mover a mira (Bola Azul/Vermelha) para o mouse
        if (key === "c") {
            const aim = points.find(p => p.isAim);
            if (aim) {
                aim.x = lastMousePos.x;
                aim.y = lastMousePos.y;
                draw();
                saveAll();
            }
        }
    });

    loadAll();
    window.addEventListener("resize", resize);
    resize();

    console.log("%c🎱 v1.4.3 | N: Visão | M: Menu | C: Teleport Mira", "color:#0f0; font-weight:bold;");
})();