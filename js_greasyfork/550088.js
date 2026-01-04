// ==UserScript==
// @name        Drawaria Shop & Trading
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description A shop for drawaria interactive, Ultra Optimized, Start OFF.
// @author      YouTubeDrawaria
// @match       https://drawaria.online/*
// @match       https://*.drawaria.online/*
// @grant       none
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/550088/Drawaria%20Shop%20%20Trading.user.js
// @updateURL https://update.greasyfork.org/scripts/550088/Drawaria%20Shop%20%20Trading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- LETTER & NUMBER PATHS --- (Mantenidos por el dibujo de texto)
    const letterPaths = {
        a: [[10, 40], [20, 0], [30, 40], [25, 20], [15, 20]], b: [[0, 0], [0, 40], [15, 40], [20, 35], [20, 25], [15, 20], [0, 20], [15, 20], [20, 15], [20, 5], [15, 0], [0, 0]],
        c: [[20, 0], [0, 0], [0, 40], [20, 40]], d: [[0, 0], [0, 40], [15, 40], [30, 20], [15, 0], [0, 0]], e: [[30, 0], [0, 0], [0, 20], [20, 20], [0, 20], [0, 40], [30, 40]],
        f: [[0, 0], [0, 40], [20, 40], null, [0, 20], [15, 20]], g: [[30, 10], [20, 0], [10, 0], [0, 10], [0, 30], [10, 40], [20, 40], [30, 30], [20, 20]],
        i: [[10, 0], [10, 40]], j: [[20, 0], [20, 40], [10, 40], [0, 30]], l: [[0, 0], [0, 40], [20, 40]], m: [[0, 40], [0, 0], [10, 20], [20, 0], [20, 40]],
        n: [[0, 40], [0, 0], [20, 40], [20, 0]], o: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
        p: [[0, 40], [0, 0], [10, 0], [20, 10], [10, 20], [0, 20]], r: [[0, 40], [0, 0], [20, 0], [20, 20], [0, 20], [20, 40]],
        s: [[20, 0], [10, 0], [0, 10], [20, 20], [30, 30], [20, 40], [10, 40], [0, 30]], t: [[10, 0], [10, 40], null, [1, 0], [20, 0]],
        u: [[0, 0], [0, 30], [10, 40], [20, 40], [30, 30], [30, 0]], v: [[0, 0], [15, 40], [30, 0]], z: [[7.5, 35], [9, 36]],
        '$': [[10, 0], [20, 0], [30, 10], [20, 20], [10, 30], [0, 40], [10, 40], [20, 40], null, [15, 0], [15, 40]],
        ' ': [[0, 0]],
    };
    const numberPaths = {
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

    // Funciones de dibujo (Mismas para optimización visual)
    function drawLetter(path, startX, startY, fontSize, color, thickness) {
        const scale = fontSize / 40;
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i] === null || path[i + 1] === null) continue;
            const [x1, y1] = path[i], [x2, y2] = path[i + 1];
            drawLineServerLocal(startX + x1 * scale, startY + y1 * scale, startX + x2 * scale, startY + y2 * scale, color, thickness);
        }
    }
    function drawText(str, x, y, color, thickness = 2, fontSize = 18) {
        let cx = x;
        for (let i = 0; i < str.length; i++) {
            const char = str[i].toLowerCase();
            const path = letterPaths[char] || numberPaths[char];
            if (path) {
                drawLetter(path, cx, y, fontSize, color, thickness);
            }
            cx += fontSize * 0.6;
        }
    }

    // --- DRAWARIA ADAPTERS (Mantenidos) ---
    let drawariaSocket = null, drawariaCanvas = null, drawariaCtx = null;
    function waitUntilReady() {
        return new Promise(resolve => {
            const check = () => {
                drawariaCanvas = drawariaCanvas || document.getElementById('canvas');
                if (drawariaCanvas) { drawariaCtx = drawariaCtx || drawariaCanvas.getContext('2d'); }
                if (!drawariaSocket && window.WebSocket && window.WebSocket.prototype) {
                    const origSend = WebSocket.prototype.send;
                    WebSocket.prototype.send = function(...args) {
                        if (this.url && this.url.includes('drawaria')) {
                            drawariaSocket = this;
                            WebSocket.prototype.send = origSend;
                            resolve();
                        }
                        return origSend.apply(this, args);
                    };
                }
                if (drawariaCanvas && drawariaCtx && drawariaSocket) { resolve(); }
                else { setTimeout(check, 250); }
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
        drawariaCtx.moveTo(x1, y1); drawariaCtx.lineTo(x2, y2); drawariaCtx.stroke();
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
    function drawLine(x1, y1, x2, y2, color, thickness) {
        drawLineServerLocal(x1, y1, x2, y2, color, thickness);
    }

    // --- GAME STATE & DATA ---
    let SHOP_STATE = 'shop';
    // ESTE es el cambio clave para iniciar apagado.
    let isShopActive = false;
    const products = [
        { id: "apple", name: "a p p l e", icon: "a", price: 5, color: "#df3535" },
        { id: "ball", name: "b a l l", icon: "b", price: 7, color: "#2277f3" },
        { id: "coin", name: "c o i n", icon: "c", price: 3, color: "#ddbe37" },
        { id: "lamp", name: "l a m p", icon: "l", price: 11, color: "#eedd66" }
    ];
    let userCoins = 20;
    let userInventory = [];
    let lastButtons = [];

    // --- DRAW UI FUNCTIONS ---
    function renderShop() {
        if (!drawariaCanvas || !isShopActive) return;
        const screenW = drawariaCanvas.width, screenH = drawariaCanvas.height;
        const groundY = screenH - 120;
        const shopX = screenW / 2 + 100, shopY = groundY - 140;
        const stallX = screenW / 2 - 250, stallY = groundY - 60;
        lastButtons = [];

        // 1. Dibujar el suelo
        drawLine(0, groundY, screenW, groundY, '#222', 2);

        // 2. Dibujar la tienda (casa)
        drawFilledRect(shopX, shopY, 150, 140, '#EAE5DB');
        drawLine(shopX - 10, shopY + 10, shopX + 160, shopY + 10, '#222', 3);
        const awningStripeWidth = 10;
        for (let i = 0; i <= 150 / awningStripeWidth; i++) {
            drawLine(shopX - 10 + (i * awningStripeWidth), shopY + 10, shopX - 10 + (i * awningStripeWidth) + awningStripeWidth, shopY + 20, '#555', 3);
        }
        drawRectServerLocal(shopX + 90, shopY + 80, 40, 60, '#222', 3);
        drawRectServerLocal(shopX + 20, shopY + 50, 50, 50, '#222', 3);
        drawLine(shopX + 45, shopY + 50, shopX + 45, shopY + 100, '#222', 1);
        drawLine(shopX + 20, shopY + 75, shopX + 70, shopY + 75, '#222', 1);

        // 3. Dibujar el mostrador de productos (si estamos en modo 'shop')
        if (SHOP_STATE === 'shop') {
            drawFilledRect(stallX, stallY, 200, 40, '#8B4513');
            drawLine(stallX, stallY + 40, stallX, stallY + 120, '#222', 4);
            drawLine(stallX + 200, stallY + 40, stallX + 200, stallY + 120, '#222', 4);
            drawFilledRect(stallX + 5, stallY - 70, 190, 70, '#FF4500');
            drawRectServerLocal(stallX + 5, stallY - 70, 190, 70, '#FF4500', 1);
            drawText("p r o d u c t o s", stallX + 15, stallY - 50, '#FFF', 2, 18);

            const itemSpacing = (180 - (products.length * 30)) / (products.length + 1);
            for (let i = 0; i < products.length; i++) {
                const prod = products[i];
                const itemX = stallX + 10 + itemSpacing + (i * (30 + itemSpacing));
                const itemY = stallY + 5;
                drawFilledRect(itemX, itemY, 30, 30, prod.color);
                drawRectServerLocal(itemX, itemY, 30, 30, '#222', 2);
                drawText(prod.icon, itemX + 8, itemY + 8, '#333', 2, 18);
                drawText(`$${prod.price}`, itemX + 2, itemY + 40, '#000', 2, 12);
                const buyBtnX = itemX - 5, buyBtnY = stallY + 50, buyBtnW = 40, buyBtnH = 16;
                drawFilledRect(buyBtnX, buyBtnY, buyBtnW, buyBtnH, "#79c842");
                drawRectServerLocal(buyBtnX, buyBtnY, buyBtnW, buyBtnH, "#444", 2);
                drawText("b u y", buyBtnX + 2, buyBtnY + 2, "#fff", 1.5, 12);
                lastButtons.push({ x: buyBtnX, y: buyBtnY, w: buyBtnW, h: buyBtnH, prod, type: 'buy' });
            }
        }

        // 4. Dibujar el inventario (si estamos en modo 'inventory')
        if (SHOP_STATE === 'inventory') {
            const invX = stallX, invY = stallY - 180, invW = 200, invH = 180;
            drawFilledRect(invX, invY, invW, invH, '#F6F6FB');
            drawRectServerLocal(invX, invY, invW, invH, '#222', 3);
            drawText("i n v e n t o r y", invX + 20, invY + 10, '#262', 2, 18);

            if (userInventory.length === 0) {
                drawText("v a c i o", invX + 60, invY + 80, '#933', 2, 14);
            } else {
                for (let i = 0; i < userInventory.length; i++) {
                    const item = userInventory[i];
                    const itemX = invX + 10;
                    const itemY = invY + 40 + (i * 30);
                    drawFilledRect(itemX, itemY, 180, 25, '#fff');
                    drawRectServerLocal(itemX, itemY, 180, 25, '#bbb', 1);
                    drawFilledRect(itemX + 5, itemY + 3, 20, 20, item.color);
                    drawRectServerLocal(itemX + 5, itemY + 3, 20, 20, '#888', 1);
                    drawText(item.name, itemX + 30, itemY + 7, '#222', 1.5, 12);
                }
            }
        }

        // 5. Dibujar las monedas (Siempre visible para referencia)
        drawText("c o i n s :", stallX, groundY + 20, "#963", 2, 19);
        drawText("" + userCoins, stallX + 100, groundY + 20, "#282", 3, 20);
    }

    // --- UTILITY FUNCTIONS ---
    function getMouseCanvasCoords(e) {
        const rect = drawariaCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (drawariaCanvas.width / rect.width),
            y: (e.clientY - rect.top) * (drawariaCanvas.height / rect.height)
        };
    }

    // --- EVENT HANDLERS ---
    function onCanvasClick(e) {
        if (!isShopActive || SHOP_STATE !== 'shop') return;
        const { x: cx, y: cy } = getMouseCanvasCoords(e);

        for (const btn of lastButtons) {
            if (btn.type === 'buy' && cx >= btn.x && cx <= btn.x + btn.w && cy >= btn.y && cy <= btn.y + btn.h) {
                if (userCoins >= btn.prod.price) {
                    userCoins -= btn.prod.price;
                    userInventory.push({ ...btn.prod });
                    renderShop();
                    return;
                }
            }
        }
    }

    // --- CONTROL MENU ---
    function createControlMenu() {
        const menu = document.createElement('div');
        menu.id = 'drawaria-shop-menu';
        menu.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            width: 200px;
            background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            color: #fff;
            font-family: Arial, sans-serif;
            z-index: 10000;
            padding: 15px;
            cursor: move;
        `;
        // El texto inicial del botón refleja el estado inicial (OFF)
        menu.innerHTML = `
            <h4 style="margin: 0 0 10px; font-weight: bold; text-align: center;">Shop Control</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="toggle-shop" style="
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    background-color: #e2a04a; /* Color de apagado */
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">Turn On</button>
                <div style="display: flex; gap: 8px;">
                    <button id="show-shop" style="flex: 1; padding: 8px; border: none; border-radius: 8px; background-color: #e2a04a; color: white; font-size: 14px; cursor: pointer;">Shop</button>
                    <button id="show-inventory" style="flex: 1; padding: 8px; border: none; border-radius: 8px; background-color: #64b5f6; color: white; font-size: 14px; cursor: pointer;">Inventory</button>
                </div>
                <button id="reset-shop" style="
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    background-color: #8c73d9;
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                ">Reset Data</button>
            </div>
        `;
        document.body.appendChild(menu);

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

        const toggleButton = document.getElementById('toggle-shop');
        const shopButton = document.getElementById('show-shop');
        const invButton = document.getElementById('show-inventory');
        const resetButton = document.getElementById('reset-shop');

        toggleButton.addEventListener('click', () => {
            isShopActive = !isShopActive;
            if (isShopActive) {
                toggleButton.textContent = 'Turn Off';
                toggleButton.style.backgroundColor = '#4a90e2';
                renderShop(); // Fuerza un renderizado al encender
            } else {
                toggleButton.textContent = 'Turn On';
                toggleButton.style.backgroundColor = '#e2a04a';
                // Borra el área de la tienda al apagar
                drawLineServerLocal(0, 0, 0, 0, '#fff', 9999);
            }
        });

        shopButton.addEventListener('click', () => {
            SHOP_STATE = 'shop';
            if (isShopActive) renderShop();
        });

        invButton.addEventListener('click', () => {
            SHOP_STATE = 'inventory';
            if (isShopActive) renderShop();
        });

        resetButton.addEventListener('click', () => {
            userCoins = 20;
            userInventory = [];
            SHOP_STATE = 'shop';
            if (isShopActive) renderShop();
        });
    }

    // --- MAIN BOOTSTRAP ---
    waitUntilReady().then(() => {
        createControlMenu();
        const renderLoop = () => {
            // El bucle SOLO llama a renderShop si isShopActive es true.
            if (isShopActive) {
                renderShop();
            }
        };

        // Frecuencia del bucle reducida a 3000ms (3 segundos) para optimización.
        setInterval(renderLoop, 3000);
        document.getElementById('canvas').addEventListener('click', onCanvasClick);
    });

})();