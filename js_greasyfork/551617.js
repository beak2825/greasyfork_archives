// ==UserScript==
// @name        Drawaria Graveyard Script (Halloween)
// @namespace   http://tampermonkey.net/
// @version     3.0
// @description A large, dynamic Halloween scene (The Eerie Graveyard) drawn in the lower-right canvas quadrant, changing between day and night based on local time.
// @author      YouTubeDrawaria
// @match       https://drawaria.online/*
// @match       https://*.drawaria.online/*
// @grant       none
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/551617/Drawaria%20Graveyard%20Script%20%28Halloween%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551617/Drawaria%20Graveyard%20Script%20%28Halloween%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GRIMORIO CONSTANTS & HALLOWEEN PALETTE ---
    const C_STONE_RED = '#900000';    // Blood Red for stone toggle
    const C_STONE_GREEN = '#4F7942';  // Slime Green for stone toggle

    const themes = {
        day: {
            BG: '#C0C0C0',      // Misty Gray
            LINES: '#5D4037',   // Dark Earth/Brown
            GHOST: '#E0E0E0',   // Faint White
            TREE: '#5D4037',
        },
        night: {
            BG: '#1A1A1A',      // Deep Black
            LINES: '#B0C4DE',   // Bone White
            GHOST: '#B0C4DE',
            TREE: '#B0C4DE',
        }
    };

    // --- LETTER PATHS (clean & unified) --- (KEPT FOR TEXT RENDERING)
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
        o: [[10, 0], [20, 0], [30, 10], [30, 30], [20, 40], [10, 40], [0, 30], [0, 10], [10, 0]],
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

    // --- DRAWARIA ADAPTERS (UNCHANGED) ---
    let drawariaSocket = null, drawariaCanvas = null, drawariaCtx = null;
    function waitUntilReady() { /* ... unchanged ... */
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

    function drawLineServerLocal(x1, y1, x2, y2, color = '#222', thickness = 3) { /* ... unchanged ... */
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

    function drawFilledRect(x, y, w, h, color) {
        // Fills the area efficiently using drawLineServerLocal (as mandated by original script structure)
        for (let i = 0; i < h; i += 4) drawLineServerLocal(x, y + i, x + w, y + i, color, 4);
    }

    // --- SCENE STATE & UTILITIES ---
    let isGraveyardActive = false;
    let currentTombstoneColor = C_STONE_GREEN; // Default interactive color

    function getGraveyardState() {
        // 6 PM (18) to 6 AM (6) is night
        const hour = new Date().getHours();
        return (hour >= 18 || hour < 6) ? 'night' : 'day';
    }

    function getSceneRect(W, H) {
        // Lower-right quadrant (x=W/2, y=H/2 to x=W, y=H)
        return {
            x: W / 2, y: H / 2,
            w: W / 2, h: H / 2
        };
    }

    // --- MAIN RENDER ---
    function drawGraveyardScene() {
        if (!drawariaCanvas || !isGraveyardActive) return;

        const W = drawariaCanvas.width, H = drawariaCanvas.height;
        const rect = getSceneRect(W, H);
        const { x: sx, y: sy, w: sw, h: sh } = rect;
        const state = getGraveyardState();
        const theme = themes[state];

        // 1. Clear BG
        drawFilledRect(sx, sy, sw, sh, theme.BG);

        // 2. Dead Trees (Using lines for branch structure)
        const branchThickness = 6;
        const drawTree = (baseX, baseY) => {
            drawLineServerLocal(baseX, baseY, baseX, baseY - sh * 0.25, theme.TREE, branchThickness); // Trunk (thick line for base)
            // Branches (thinner lines)
            drawLineServerLocal(baseX, baseY - sh * 0.2, baseX - sw * 0.05, baseY - sh * 0.35, theme.TREE, branchThickness / 2);
            drawLineServerLocal(baseX, baseY - sh * 0.2, baseX + sw * 0.04, baseY - sh * 0.37, theme.TREE, branchThickness / 2);
            drawLineServerLocal(baseX, baseY - sh * 0.1, baseX - sw * 0.08, baseY - sh * 0.15, theme.TREE, branchThickness / 3);
        };
        drawTree(sx + sw * 0.15, sy + sh * 0.9); // Left Tree
        drawTree(sx + sw * 0.85, sy + sh * 0.9); // Right Tree

        // 3. Central Tombstone with "R.I.P."
        const tsW = sw * 0.2, tsH = sh * 0.35;
        const tsX = sx + sw * 0.5 - tsW / 2, tsY = sy + sh * 0.9 - tsH;
        const tsLineColor = theme.LINES;

        // Tombstone shape (simple rectangle for efficiency, with thick lines for presence)
        drawLineServerLocal(tsX, tsY, tsX + tsW, tsY, tsLineColor, 4); // Top
        drawLineServerLocal(tsX + tsW, tsY, tsX + tsW, tsY + tsH, tsLineColor, 4); // Right
        drawLineServerLocal(tsX, tsY + tsH, tsX + tsW, tsY + tsH, tsLineColor, 4); // Bottom
        drawLineServerLocal(tsX, tsY, tsX, tsY + tsH, tsLineColor, 4); // Left

        // Tombstone Text ("R.I.P.") - uses the interactive color
        drawText("R. I. P.", tsX + 8, tsY + tsH / 2, currentTombstoneColor, 3, 20);

        // 4. Ghosts (Simple 'o' letter path for a loop shape)
        const drawGhost = (gx, gy) => {
             drawLetter(letterPaths.o, gx, gy, 12, theme.GHOST, 2);
             drawLineServerLocal(gx+6, gy+12, gx+6, gy+18, theme.GHOST, 2); // 'legs'
             drawLineServerLocal(gx+18, gy+12, gx+18, gy+18, theme.GHOST, 2);
        };
        drawGhost(sx + sw * 0.3, sy + sh * 0.4);
        drawGhost(sx + sw * 0.7, sy + sh * 0.6);
        drawGhost(sx + sw * 0.55, sy + sh * 0.75);
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
        if (!isGraveyardActive || !drawariaCanvas) return;

        const { x: cx, y: cy } = getMouseCanvasCoords(e);
        const W = drawariaCanvas.width, H = drawariaCanvas.height;
        const rect = getSceneRect(W, H);

        // Check if click is within the Graveyard bounds
        if (cx >= rect.x && cx <= rect.x + rect.w && cy >= rect.y && cy <= rect.y + rect.h) {
            // Toggle the central tombstone color
            currentTombstoneColor = (currentTombstoneColor === C_STONE_GREEN) ? C_STONE_RED : C_STONE_GREEN;
            drawGraveyardScene(); // Redraw the scene to show the new color
        }
    }

    // --- MAIN BOOT ---
    waitUntilReady().then(() => {
        // --- CONTROL MENU (Simplified for Scene Toggling) ---
        const menu = document.createElement('div');
        menu.id = 'drawaria-graveyard-menu';
        menu.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            width: 200px;
            background: linear-gradient(135deg, #444 0%, #222 100%);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
            color: #fff;
            font-family: Arial, sans-serif;
            z-index: 10000;
            padding: 15px;
            cursor: move;
        `;
        menu.innerHTML = `
            <h4 style="margin: 0 0 10px; font-weight: bold; text-align: center; color: #FF8C00;">Graveyard Scene (Halloween)</h4>
            <button id="toggle-scene" style="
                padding: 8px;
                border: none;
                border-radius: 8px;
                background-color: #900000;
                color: white;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
                transition: background-color 0.3s;
            ">Activate Graveyard</button>
        `;
        document.body.appendChild(menu);

        // Make the menu draggable (Logic kept from previous version)
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

        // Toggle Button Logic
        const toggleButton = document.getElementById('toggle-scene');
        toggleButton.addEventListener('click', () => {
            isGraveyardActive = !isGraveyardActive;
            if (isGraveyardActive) {
                toggleButton.textContent = 'Deactivate Graveyard';
                toggleButton.style.backgroundColor = '#4F7942';
                drawGraveyardScene();
            } else {
                toggleButton.textContent = 'Activate Graveyard';
                toggleButton.style.backgroundColor = '#900000';
                // Clear the scene area on turn off (draw a white box)
                const W = drawariaCanvas.width, H = drawariaCanvas.height;
                const rect = getSceneRect(W, H);
                drawFilledRect(rect.x, rect.y, rect.w, rect.h, '#FFFFFF');
            }
        });

        // --- DYNAMIC LOOP ---
        // Real-time clock update loop every 3 seconds
        setInterval(drawGraveyardScene, 3000);
        drawariaCanvas.addEventListener('click', onCanvasClick);
    });

})();