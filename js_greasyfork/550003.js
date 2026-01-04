// ==UserScript==
// @name        Drawaria Canvas Phone
// @namespace   http://tampermonkey.net/
// @version     2.3
// @description A cellphone on the canvas: EVERYTHING universally visible, text and icons only with lines. Now with a draggable control menu.
// @author      YouTubeDrawaria
// @match       https://drawaria.online/*
// @grant       none
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/550003/Drawaria%20Canvas%20Phone.user.js
// @updateURL https://update.greasyfork.org/scripts/550003/Drawaria%20Canvas%20Phone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- LETTER PATHS (clean & unified) ---
    const letterPaths = {
        a: [[10, 40], [20, 0], [30, 40], [25, 20], [15, 20]],
        b: [[0, 0], [0, 40], [15, 40], [20, 35], [20, 25], [15, 20], [0, 20], [15, 20], [20, 15], [20, 5], [15, 0], [0, 0]],
        c: [[20, 0], [0, 0], [0, 40], [20, 40]],
        d: [[0, 0], [0, 40], [15, 40], [30, 20], [15, 0], [0, 0]],
        e: [[30, 0], [0, 0], [0, 20], [20, 20], [0, 20], [0, 40], [30, 40]],
        f: [[0, 0], [0, 40], [20, 40], null, [0, 20], [15, 20]],
        g: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20]],
        i: [[10, 0], [10, 40]],
        j: [[20, 0], [20, 40], [10, 40], [0, 30]],
        l: [[0, 0], [0, 40], [20, 40]],
        m: [[0, 40], [0, 0], [10, 20], [20, 0], [20, 40]],
        n: [[0, 40], [0, 0], [20, 40], [20, 0]],
        o: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        p: [[0, 40], [0, 0], [10, 0], [20, 10], [10, 20], [0, 20]],
        r: [[0, 40], [0, 0], [20, 0], [20, 20], [0, 20], [20, 40]],
        s: [[20, 0], [10, 0], [0, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        t: [[10, 0], [10, 40], null, [1, 0], [20, 0]],
        u: [[0, 0], [0, 30], [10, 40], [20, 40], [30, 30], [30, 0]],
        v: [[0, 0], [15, 40], [30, 0]],
        z: [[7.5, 35], [9, 36]],
        ' ': [[0, 0]], // Path vacío para el espacio
        // números:
        0: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        1: [[15, 0], [15, 40], null, [15, 0], [10, 10], null, [10, 40], [20, 40]],
        2: [[0, 10], [10, 0], [20, 0], [30, 10], [0, 40], [30, 40]],
        3: [[0, 10], [10, 0], [20, 0], [30, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        4: [[20, 0], [20, 40], null, [0, 20], [25, 20], null, [0, 20], [20, 0]],
        5: [[30, 0], [0, 0], [0, 20], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]],
        6: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20], [10, 20], [0, 20], [0, 10]],
        7: [[0, 0], [30, 0], [15, 40]],
        8: [[15, 0], [25, 10], [15, 20], [5, 10], [15, 0], null, [15, 20], [25, 30], [15, 40], [5, 30], [15, 20]],
        9: [[5, 35], [15, 40], [25, 30], [30, 10], [20, 0], [10, 0], [0, 10], [5, 20], [15, 20], [25, 20], [27.5, 20]],
    };

    function drawLetter(path, startX, startY, fontSize, color, thickness) {
        const scale = fontSize / 40;
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i] === null || path[i + 1] === null) continue;
            const [x1, y1] = path[i], [x2, y2] = path[i + 1];
            drawLineServerLocal(
                startX + x1 * scale, startY + y1 * scale,
                startX + x2 * scale, startY + y2 * scale,
                color, thickness
            );
        }
    }

    function drawText(str, x, y, color, thickness = 2, fontSize = 18) {
        let cx = x;
        for (const char of str) {
            const path = letterPaths[char.toLowerCase()];
            if (path) {
                drawLetter(path, cx, y, fontSize, color, thickness);
            }
            cx += fontSize * 0.6;
        }
    }

    // --- DRAWARIA ADAPTERS ---
    let drawariaSocket = null, drawariaCanvas = null, drawariaCtx = null;
    function waitUntilReady() {
        return new Promise(resolve => {
            const check = () => {
                drawariaCanvas = drawariaCanvas || document.getElementById('canvas');
                if (drawariaCanvas) {
                    drawariaCtx = drawariaCtx || drawariaCanvas.getContext('2d');
                }
                if (!drawariaSocket && window.WebSocket && window.WebSocket.prototype) {
                    const origSend = WebSocket.prototype.send;
                    WebSocket.prototype.send = function(...args) {
                        if (this.url && this.url.includes('drawaria')) {
                            drawariaSocket = this;
                            WebSocket.prototype.send = origSend; // Restore original send
                            resolve();
                        }
                        return origSend.apply(this, args);
                    };
                }
                if (drawariaCanvas && drawariaCtx && drawariaSocket) {
                    resolve();
                } else {
                    setTimeout(check, 250);
                }
            };
            check();
        });
    }

    function drawLineServerLocal(x1, y1, x2, y2, color = '#222', thickness = 3) {
        if (!drawariaSocket || !drawariaCanvas) return;
        const nx1 = (x1 / drawariaCanvas.width).toFixed(4), ny1 = (y1 / drawariaCanvas.height).toFixed(4),
            nx2 = (x2 / drawariaCanvas.width).toFixed(4), ny2 = (y2 / drawariaCanvas.height).toFixed(4);
        const cmd = `42["drawcmd",0,[${nx1},${ny1},${nx2},${ny2},false,${-Math.abs(thickness)},"${color}",0,0,{}]]`;
        drawariaSocket.send(cmd);
        drawariaCtx.save();
        drawariaCtx.strokeStyle = color;
        drawariaCtx.lineWidth = thickness;
        drawariaCtx.lineCap = 'round';
        drawariaCtx.beginPath();
        drawariaCtx.moveTo(x1, y1);
        drawariaCtx.lineTo(x2, y2);
        drawariaCtx.stroke();
        drawariaCtx.restore();
    }

    function drawFilledRect(x, y, w, h, color = '#eee') {
        for (let i = 0; i < h; i += 4) drawLineServerLocal(x, y + i, x + w, y + i, color, 4);
    }

    function drawRectServerLocal(x, y, w, h, color = '#222', thickness = 3) {
        drawLineServerLocal(x, y, x + w, y, color, thickness);
        drawLineServerLocal(x + w, y, x + w, y + h, color, thickness);
        drawLineServerLocal(x + w, y + h, x, y + h, color, thickness);
        drawLineServerLocal(x, y + h, x, y, color, thickness);
    }

    // --- PHONE UI ---
    const phoneW = 220, phoneH = 420;
    function getPhoneRect() {
        if (!drawariaCanvas) return { x: 40, y: 40, w: phoneW, h: phoneH };
        const x = drawariaCanvas.width - phoneW - 32,
            y = drawariaCanvas.height - phoneH - 32;
        return { x, y, w: phoneW, h: phoneH };
    }

    let phoneState = 'home', lastButtons = [], lastCalcInput = "", isPhoneActive = false;

    function drawAppButton(x, y, w, h, action, bgColor, borderColor, icon, iconColor, text, textColor) {
        drawFilledRect(x, y, w, h, bgColor);
        drawRectServerLocal(x, y, w, h, borderColor, 2);
        drawText(icon, x + (w * 0.28), y + 6, iconColor, 3, 23);
        drawText(text, x + 2, y + 30, textColor, 2, 10);
        lastButtons.push({ x, y, w, h, action });
    }

    // --- MAIN RENDER ---
    function renderPhone() {
        if (!drawariaCanvas || !isPhoneActive) return;

        const { x, y, w, h } = getPhoneRect();

        // Fondo y marco del teléfono
        drawFilledRect(x, y, w, h, '#F9F9F9');
        drawRectServerLocal(x, y, w, h, '#222', 8);
        drawFilledRect(x + w / 2 - 30, y + 8, 60, 12, '#AAA'); // notch
        drawFilledRect(x + w / 2 - 20, y + h - 22, 40, 8, '#CCC'); // home btn

        // Renderizado basado en el estado
        switch (phoneState) {
            case 'home':
                drawText("a n d r o i d", x + 28, y + 31, '#17A', 3, 17);
                lastButtons = [];
                drawAppButton(x + 22, y + 79, 45, 45, 'open_football', '#FAFAFF', '#222', 'f', '#173', 't e a m', '#222');
                drawAppButton(x + 89, y + 79, 45, 45, 'open_notes', '#FFFDE9', '#222', 'n', '#962', 'n o t e', '#222');
                drawAppButton(x + 156, y + 79, 45, 45, 'open_calc', '#EAEEFF', '#222', 'c', '#246', 'c a r s', '#222');
                drawAppButton(x + 58, y + 151, 45, 45, 'open_clock', '#F6FFEA', '#222', 'r', '#184', 'r e a d', '#222');
                drawAppButton(x + 125, y + 151, 45, 45, 'open_gallery', '#FAEEFF', '#222', 'g', '#71a', 'g a m e', '#222');
                break;
            case 'football':
                drawText("f u t b o l", x + 50, y + 36, '#173', 3, 18);
                drawText("b o l a", x + 66, y + 100, '#222', 2, 18);
                // "mini balón" con líneas y círculo
                for (let r = 0; r <= 24; r += 3) {
                    const angle = r;
                    drawLineServerLocal(x + w / 2, y + 160, x + w / 2 + Math.cos(angle) * 19, y + 160 + Math.sin(angle) * 19, '#173', 3);
                }
                drawFilledRect(x + w / 2 - 4, y + 160 - 4, 9, 9, '#EEE');
                break;
            case 'notes':
                drawText("n o t a s", x + 71, y + 36, '#962', 3, 18);
                drawFilledRect(x + 36, y + 80, w - 72, 130, '#fffbe0');
                drawRectServerLocal(x + 36, y + 80, w - 72, 130, '#555', 2);
                drawText("t o m a   n o t a !", x + 62, y + 170, "#333", 2, 15);
                break;
            case 'calc':
                drawText("c a l c", x + 68, y + 36, '#246', 3, 18);
                drawFilledRect(x + 31, y + 80, w - 62, 38, '#f4f7fd');
                drawRectServerLocal(x + 31, y + 80, w - 62, 38, '#222', 2);
                drawText(lastCalcInput || "3 + 2 * 6", x + 45, y + 93, '#246', 2, 18);
                // Pad 1-9,+,-
                const bw = 33, bh = 22, pad = 7, cols = 3;
                const numpad = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '+', '-'];
                lastButtons = [];
                for (let i = 0; i < numpad.length; i++) {
                    const bx = x + 38 + ((i % cols) * (bw + pad)), by = y + 132 + (Math.floor(i / cols) * (bh + pad));
                    drawFilledRect(bx, by, bw, bh, '#eef2f4');
                    drawRectServerLocal(bx, by, bw, bh, '#222', 2);
                    drawText(numpad[i], bx + 12, by + 3, '#246', 14, 14);
                    lastButtons.push({ x: bx, y: by, w: bw, h: bh, action: 'calcpress', val: numpad[i] });
                }
                // Igual y CE
                const eqx = x + 38, eqy = y + 132 + (4 * (bh + pad));
                drawFilledRect(eqx, eqy, bw + pad, bh, '#86b089');
                drawText('=', eqx + 19, eqy + 3, '#fff', 2, 17);
                lastButtons.push({ x: eqx, y: eqy, w: bw + pad, h: bh, action: 'equals' });
                const cex = eqx + (bw + pad) * 2, cey = eqy;
                drawFilledRect(cex, cey, bw + pad, bh, '#df3434');
                drawText('c e', cex + 11, cey + 3, '#fff', 2, 17);
                lastButtons.push({ x: cex, y: cey, w: bw + pad, h: bh, action: 'ce' });
                break;
            case 'clock':
                drawText("r e l o j", x + 64, y + 36, '#184', 3, 18);
                const cx = x + w / 2, cy = y + 155, radius = 44;
                for (let i = 0; i < 60; i++) {
                    if (i % 5 === 0) {
                        const angle = Math.PI * 2 * i / 60 - Math.PI / 2;
                        drawLineServerLocal(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius,
                            cx + Math.cos(angle) * (radius - 7), cy + Math.sin(angle) * (radius - 7), '#262', 3);
                    }
                }
                const date = new Date();
                const h = date.getHours() % 12, m = date.getMinutes(), s = date.getSeconds();
                const ah = Math.PI * 2 * (h + m / 60) / 12 - Math.PI / 2;
                const am = Math.PI * 2 * m / 60 - Math.PI / 2;
                const as = Math.PI * 2 * s / 60 - Math.PI / 2;
                drawLineServerLocal(cx, cy, cx + Math.cos(ah) * 22, cy + Math.sin(ah) * 22, '#222', 7);
                drawLineServerLocal(cx, cy, cx + Math.cos(am) * 32, cy + Math.sin(am) * 32, '#262', 5);
                drawLineServerLocal(cx, cy, cx + Math.cos(as) * 38, cy + Math.sin(as) * 38, '#b81f26', 2);
                break;
            case 'gallery':
                drawText("g a l e r", x + 74, y + 36, '#71a', 3, 18);
                const galleryImgs = [{ bg: '#ffe', border: '#e5c' }, { bg: '#ddf', border: '#8cf' }, { bg: '#f8f', border: '#db5' }];
                for (let g = 0; g < galleryImgs.length; g++) {
                    const gx = x + 40 + (g * 39), gy = y + 75;
                    drawFilledRect(gx, gy, 32, 39, galleryImgs[g].bg);
                    drawRectServerLocal(gx, gy, 32, 39, galleryImgs[g].border, 2);
                    drawText("g", gx + 13, gy + 9, "#222", 2, 17);
                }
                drawText("O b r a s !", x + 75, y + 140, "#71a", 2, 16);
                break;
        }

        // Botón 'volver' común a todas las apps
        if (phoneState !== 'home') {
            const btnColor = (phoneState === 'football') ? '#272' : (phoneState === 'notes' ? '#962' : (phoneState === 'calc' ? '#246' : (phoneState === 'clock' ? '#184' : '#71a')));
            lastButtons.push({ x: x + 38, y: y + h - 56, w: w - 76, h: 32, action: 'home' });
            drawFilledRect(x + 38, y + h - 56, w - 76, 32, '#DDD');
            drawRectServerLocal(x + 38, y + h - 56, w - 76, 32, '#222', 2);
            drawText("v o l v e r", x + 61, y + h - 50, btnColor, 2, 17);
        }
    }

    // --- HANDLE CLICK ---
    function getMouseCanvasCoords(e) {
        const rect = drawariaCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (drawariaCanvas.width / rect.width),
            y: (e.clientY - rect.top) * (drawariaCanvas.height / rect.height)
        };
    }

    function onCanvasClick(e) {
        if (!isPhoneActive) return;

        const { x: cx, y: cy } = getMouseCanvasCoords(e);
        for (const btn of lastButtons) {
            if (cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                switch (btn.action) {
                    case 'open_football': phoneState = 'football'; break;
                    case 'open_notes': phoneState = 'notes'; break;
                    case 'open_calc': phoneState = 'calc'; break;
                    case 'open_clock': phoneState = 'clock'; break;
                    case 'open_gallery': phoneState = 'gallery'; break;
                    case 'home': phoneState = 'home'; break;
                    case 'calcpress':
                        lastCalcInput += btn.val;
                        break;
                    case 'equals':
                        try {
                            lastCalcInput = String(eval(lastCalcInput.replace(/--/g, '+')));
                        } catch {
                            lastCalcInput = "ERR";
                        }
                        break;
                    case 'ce':
                        lastCalcInput = "";
                        break;
                }
                renderPhone();
                return;
            }
        }
    }

    // --- MAIN BOOT ---
    waitUntilReady().then(() => {
        // Inicializar el menú de control
        createControlMenu();

        // Renderizar el teléfono y el menú
        const renderLoop = () => {
            renderPhone();
            // El menú se mantiene en el DOM, no necesita renderizarse en el canvas
        };

        setInterval(renderLoop, 2800);
        drawariaCanvas.addEventListener('click', onCanvasClick);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'h' && isPhoneActive) {
                phoneState = 'home';
                renderPhone();
            }
        });
    });

    // --- CONTROL MENU ---
    function createControlMenu() {
        // Crear el elemento del menú
        const menu = document.createElement('div');
        menu.id = 'drawaria-phone-menu';
        menu.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            width: 200px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            color: #fff;
            font-family: Arial, sans-serif;
            z-index: 10000;
            padding: 15px;
            cursor: move;
        `;
        menu.innerHTML = `
            <h4 style="margin: 0 0 10px; font-weight: bold; text-align: center;">Phone Control</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="toggle-phone" style="
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    background-color: #e2a04a;
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">Turn On</button>
                <button id="reset-phone" style="
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    background-color: #8c73d9;
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">Reset Home</button>
            </div>
        `;
        document.body.appendChild(menu);

        // Hacer el menú arrastrable
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        const header = menu.querySelector('h4');

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - menu.offsetLeft;
            offset.y = e.clientY - menu.offsetTop;
            menu.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                menu.style.left = `${e.clientX - offset.x}px`;
                menu.style.top = `${e.clientY - offset.y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            menu.style.cursor = 'move';
        });

        // Lógica de los botones
        const toggleButton = document.getElementById('toggle-phone');
        const resetButton = document.getElementById('reset-phone');

        toggleButton.addEventListener('click', () => {
            isPhoneActive = !isPhoneActive;
            if (isPhoneActive) {
                toggleButton.textContent = 'Turn Off';
                toggleButton.style.backgroundColor = '#4a90e2';
                renderPhone();
            } else {
                toggleButton.textContent = 'Turn On';
                toggleButton.style.backgroundColor = '#e2a04a';
                // Borrar el teléfono del canvas al apagarlo
                drawLineServerLocal(0, 0, 0, 0, '#fff', 9999);
            }
        });

        resetButton.addEventListener('click', () => {
            phoneState = 'home';
            if (isPhoneActive) {
                renderPhone();
            }
        });
    }

})();