// ==UserScript==
// @name         Drawaria Canvas Clicker Menu + Server Render
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simula clicks en el canvas y renderiza también los comandos de dibujo del servidor en drawaria.online
// @author       YouTubeDrawaria + Modificado
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/549864/Drawaria%20Canvas%20Clicker%20Menu%20%2B%20Server%20Render.user.js
// @updateURL https://update.greasyfork.org/scripts/549864/Drawaria%20Canvas%20Clicker%20Menu%20%2B%20Server%20Render.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const canvas = document.querySelector('#canvas.canvas-drawer') || document.getElementById('canvas');
    if (!canvas) {
        console.warn('Canvas not found.');
        return;
    }
    const ctx = canvas.getContext('2d');

    // === Socket handling ===
    let socket;
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (...args) {
        if (!socket) {
            socket = this;
            console.log('WebSocket hooked.');

            // intercept incoming messages to render server drawings
            socket.addEventListener('message', (event) => {
                handleIncomingMessage(event.data);
            });
        }
        return originalSend.apply(this, args);
    };

    // === Variables ===
    let positions = [
        { x: 100, y: 100 },
        { x: 200, y: 150 },
        { x: 300, y: 200 },
    ];
    let repeatInterval = 1000; // milliseconds
    let repeat = false;
    let clickIntervalId = null;
    let selectingPositions = false;
    let simulateRightClickFlag = false; // toggle between left/right click mode

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // === Send draw command to server ===
    function sendDrawCommand(x1, y1, x2, y2, color, thickness) {
        if (!socket) return;

        const normX1 = (x1 / canvas.width).toFixed(4);
        const normY1 = (y1 / canvas.height).toFixed(4);
        const normX2 = (x2 / canvas.width).toFixed(4);
        const normY2 = (y2 / canvas.height).toFixed(4);

        const command = `42["drawcmd",0,[${normX1},${normY1},${normX2},${normY2},false,${-thickness},"${color}",0,0,{}]]`;
        socket.send(command);
    }

    // === Handle server draw commands ===
    function handleIncomingMessage(data) {
        if (typeof data !== 'string') return;
        if (!data.startsWith('42')) return;

        try {
            const parsed = JSON.parse(data.slice(2));
            if (parsed[0] === 'drawcmd') {
                const cmd = parsed[2];
                // formato: [x1,y1,x2,y2,false,-thickness,"#color",0,0,{}]
                const [nx1, ny1, nx2, ny2, , thicknessNeg, color] = cmd;
                const thickness = -thicknessNeg;

                const x1 = nx1 * canvas.width;
                const y1 = ny1 * canvas.height;
                const x2 = nx2 * canvas.width;
                const y2 = ny2 * canvas.height;

                ctx.strokeStyle = color;
                ctx.lineWidth = thickness;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        } catch (err) {
            console.error('Error parsing incoming message:', err);
        }
    }

    // === Local draw + server send ===
    function localAndServerDraw(x, y, color, thickness) {
        if (!ctx) return;
        const radius = thickness;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        sendDrawCommand(x, y, x + 0.1, y + 0.1, color, thickness);
    }

    function simulateMouseEvent(target, type, clientX, clientY, button = 0) {
        const evt = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            clientX: clientX,
            clientY: clientY,
            view: window,
            button: button,
        });
        target.dispatchEvent(evt);
    }

    function simulateLeftClickAt(x, y) {
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + x;
        const cy = rect.top + y;

        simulateMouseEvent(canvas, 'mousedown', cx, cy, 0);
        simulateMouseEvent(canvas, 'mouseup', cx, cy, 0);
        simulateMouseEvent(canvas, 'click', cx, cy, 0);

        localAndServerDraw(x, y, '#000000', 4);

        console.log(`Left-clicked at (${x}, ${y})`);
    }

    function simulateRightClickAt(x, y) {
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + x;
        const cy = rect.top + y;

        simulateMouseEvent(canvas, 'mousedown', cx, cy, 2);
        simulateMouseEvent(canvas, 'mouseup', cx, cy, 2);
        simulateMouseEvent(canvas, 'contextmenu', cx, cy, 2);

        localAndServerDraw(x, y, '#ff0000', 4);

        console.log(`Right-clicked at (${x}, ${y})`);
    }

    function clickAllPositions() {
        if (!canvas) {
            console.warn("Canvas not found!");
            return;
        }
        positions.forEach(pos => {
            if (simulateRightClickFlag) {
                simulateRightClickAt(pos.x, pos.y);
            } else {
                simulateLeftClickAt(pos.x, pos.y);
            }
        });
    }

    function startClicking() {
        if (repeat) {
            stopClicking();
            clickAllPositions();
            clickIntervalId = setInterval(clickAllPositions, repeatInterval);
            console.log("Started repeating clicks every", repeatInterval, "ms");
        } else {
            clickAllPositions();
            console.log("Clicked once");
        }
    }

    function stopClicking() {
        if (clickIntervalId) {
            clearInterval(clickIntervalId);
            clickIntervalId = null;
            console.log("Stopped clicking");
        }
    }

    function restartClicking() {
        stopClicking();
        startClicking();
    }

    function toggleRepeat() {
        repeat = !repeat;
        alert("Repeat is now " + (repeat ? "ON" : "OFF"));
        if (repeat && clickIntervalId) {
            restartClicking();
        }
    }

    function setRepeatInterval() {
        const input = prompt("Enter repeat interval in milliseconds:", repeatInterval);
        if (input !== null) {
            const v = parseInt(input);
            if (!isNaN(v) && v > 0) {
                repeatInterval = v;
                alert("Repeat interval set to " + repeatInterval + " ms");
                if (repeat && clickIntervalId) {
                    restartClicking();
                }
            } else {
                alert("Invalid number");
            }
        }
    }

    function enablePositionSelection() {
        selectingPositions = true;
        alert("Click on the canvas to select positions. Press ESC to stop.");
        positions = [];
        if (!canvas) return;
        const onClick = (e) => {
            if (!selectingPositions) return;
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            positions.push({ x, y });
            alert(`Position added: (${x}, ${y})`);
            console.log("Current positions:", positions);
        };
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                selectingPositions = false;
                alert("Position selection ended.");
                canvas.removeEventListener('click', onClick);
                window.removeEventListener('keydown', onKeyDown);
            }
        };
        canvas.addEventListener('click', onClick);
        window.addEventListener('keydown', onKeyDown);
    }

    function toggleClickType() {
        simulateRightClickFlag = !simulateRightClickFlag;
        alert("Click type set to " + (simulateRightClickFlag ? "Right click" : "Left click"));
    }

    // === UI Menu ===
    function createUI() {
        const menu = document.createElement("div");
        menu.innerHTML = `
            <div id="canvasClickerMenu" style="
                position: fixed;
                top: 50px;
                left: 50px;
                background: #f8f8f8;
                border: 1px solid #ccc;
                padding: 10px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                width: 240px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                cursor: move;
            ">
                <strong>🎯 Canvas Clicker</strong><br><br>
                <button id="startClicking">Start</button>
                <button id="stopClicking">Stop</button><br><br>
                <button id="restartClicking">Restart</button><br><br>
                <button id="toggleRepeat">Repeat</button><br><br>
                <button id="setInterval">Config Repeat MS</button><br><br>
                <button id="selectPositions">Select Positions</button><br><br>
                <button id="toggleClickType">Toggle Left/Right Click</button>
            </div>
        `;
        document.body.appendChild(menu);

        const el = document.getElementById("canvasClickerMenu");
        let isDragging = false;
        let offsetX, offsetY;
        el.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            e.preventDefault();
        });
        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                el.style.left = `${e.clientX - offsetX}px`;
                el.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.getElementById("startClicking").addEventListener("click", startClicking);
        document.getElementById("stopClicking").addEventListener("click", stopClicking);
        document.getElementById("restartClicking").addEventListener("click", restartClicking);
        document.getElementById("toggleRepeat").addEventListener("click", toggleRepeat);
        document.getElementById("setInterval").addEventListener("click", setRepeatInterval);
        document.getElementById("selectPositions").addEventListener("click", enablePositionSelection);
        document.getElementById("toggleClickType").addEventListener("click", toggleClickType);
    }

    window.addEventListener('load', () => {
        setTimeout(createUI, 1500); // delay so UI elements load
    });

})();
