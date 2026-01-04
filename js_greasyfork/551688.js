// ==UserScript==
// @name         Drawaria Haunted Decoration (Halloween)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforms your mouse of Drawaria into a color you pick very simple but fun.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/551688/Drawaria%20Haunted%20Decoration%20%28Halloween%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551688/Drawaria%20Haunted%20Decoration%20%28Halloween%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- SHARED SYSTEM COMPONENTS (REUSED & OPTIMIZED) ---------- */
    let drawariaSocket = null;
    let drawariaCanvas = null;

    // Optimized command queue and batch processor
    const commandQueue = [];
    let batchProcessor = null;
    const BATCH_SIZE = 8;
    const BATCH_INTERVAL = 60; // 60ms for a command batch (approx 13 batches/sec)

    // Intercepts WebSocket to capture the game socket
    const originalWebSocketSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(...args) {
        if (!drawariaSocket && this.url && this.url.includes('drawaria')) {
            drawariaSocket = this;
            console.log('🔗 Drawaria WebSocket captured for Decoration Manager.');
            startBatchProcessor();
        }
        return originalWebSocketSend.apply(this, args);
    };

    function startBatchProcessor() {
        if (batchProcessor) return;
        batchProcessor = setInterval(() => {
            if (!drawariaSocket || drawariaSocket.readyState !== WebSocket.OPEN || commandQueue.length === 0) {
                return;
            }
            const batch = commandQueue.splice(0, BATCH_SIZE);
            batch.forEach(cmd => {
                try {
                    drawariaSocket.send(cmd);
                } catch (e) {
                    console.warn('⚠️ Fallo al enviar el comando:', e);
                }
            });
        }, BATCH_INTERVAL);
    }

    /**
     * Function to enqueue a draw command, simulating a filled circle/blob.
     * Uses a very short line with a large negative thickness for a filled shape.
     * @param {number} x - Center X coordinate
     * @param {number} y - Center Y coordinate
     * @param {string} color - Color (e.g. '#FF8C00')
     * @param {number} size - Effective size (radius-like value)
     */
    function enqueueDrawCommand(x, y, color, size) {
        if (!drawariaCanvas || !drawariaSocket) return;

        const normX = (x / drawariaCanvas.width).toFixed(4);
        const normY = (y / drawariaCanvas.height).toFixed(4);
        // Draw a tiny line (x,y to x+1, y+1) with large negative thickness
        const cmd = `42["drawcmd",0,[${normX},${normY},${(x + 1) / drawariaCanvas.width},${(y + 1) / drawariaCanvas.height},false,${-Math.abs(size)},"${color}",0,0,{}]]`;
        commandQueue.push(cmd);
    }

    /**
     * Clears the entire canvas by drawing a single large dark background shape.
     */
    function clearCanvasWithBackground(color = '#110a1a') {
        if (!drawariaCanvas) return;
        const w = drawariaCanvas.width;
        const h = drawariaCanvas.height;
        // Draw a line from top-left to bottom-right with a huge negative thickness
        enqueueDrawCommand(0, 0, color, Math.max(w, h));
    }


    /* ---------- HALLOWEEN DECORATION MANAGER LOGIC ---------- */

    const ASSET_DEFINITIONS = {
        'Ghost': { color: '#F0F0F0', size: 25, canAnimate: true },
        'Pumpkin': { color: '#FF8C00', size: 30, canAnimate: false },
        'Bat': { color: '#333333', size: 15, canAnimate: false }
    };

    let placedDecorations = []; // Stores: { id, type, x, y, color, size, bobOffset }
    let currentPlacementType = null;
    let placeholderElement = null;
    let isAnimating = false;
    let animationInterval = null;
    let bobPhase = 0; // Tracks the bobbing cycle (0, 1, 2, 1, 0...)

    class DecorationManager {
        constructor() {
            this.init();
        }

        init() {
            const checkCanvas = () => {
                const gameCanvas = document.getElementById('canvas');
                if (gameCanvas) {
                    drawariaCanvas = gameCanvas;
                    this.createSpookyPanel();
                    this.setupCanvasListeners();
                    console.log('👻 Halloween Decoration Manager Ready.');
                } else {
                    setTimeout(checkCanvas, 100);
                }
            };
            checkCanvas();
        }

        createSpookyPanel() {
            const existingPanel = document.getElementById('halloween-manager-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.id = 'halloween-manager-panel';
            panel.style.cssText = `
                position: fixed !important;
                top: 50px !important;
                left: 20px !important;
                width: 300px !important;
                z-index: 2147483647 !important;
                background: linear-gradient(135deg, #2c003e, #0f001a) !important;
                border: 2px solid #ff8c00 !important;
                border-radius: 15px !important;
                color: #f0f0f0 !important;
                font-family: 'Creepster', 'Segoe UI', Arial, sans-serif !important;
                box-shadow: 0 0 25px rgba(255, 140, 0, 0.5) !important;
                padding: 15px !important;
                text-align: center !important;
            `;

            panel.innerHTML = `
                <div id="panel-header" style="
                    cursor: grab;
                    color: #9c27b0;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px dashed #404040;
                ">
                    <h2 style="margin: 0; font-size: 24px;">💀 Haunted Decoration</h2>
                </div>

                <!-- Decoration Palette -->
                <div style="margin-bottom: 15px; border: 1px solid #4a0050; padding: 10px; border-radius: 8px;">
                    <h4 style="color: #ff8c00; margin-top: 0;">Mouse Decoration</h4>
                    <div id="palette-buttons" style="display: flex; justify-content: space-around;">
                        <button data-asset="Ghost" style="background: #9c27b0; color: white;">👻 Ghost</button>
                        <button data-asset="Pumpkin" style="background: #ff8c00; color: black;">🎃 Pumpkin</button>
                        <button data-asset="Bat" style="background: #333333; color: white;">🦇 Bat</button>
                    </div>
                </div>

                <!-- Action Menu -->
                <div style="margin-bottom: 15px;">
                    <button id="clear-all-btn" style="background: #cc0000; color: white; width: 48%;">🧹 Clear All</button>
                    <button id="animation-toggle-btn" style="background: #27ae60; color: white; width: 48%;">Start Spooky Animation</button>
                </div>

                <!-- Status Log -->
                <div style="border: 1px solid #4a0050; padding: 10px; border-radius: 8px; text-align: left; font-size: 12px; height: 60px; overflow-y: auto;">
                    <h4 style="color: #9c27b0; margin-top: 0; margin-bottom: 5px;">Status Log</h4>
                    <div id="status-log">Manager initialized.</div>
                </div>
            `;
            document.body.appendChild(panel);
            this.styleButtons(panel);
            this.setupPanelEventListeners(panel);
            this.makePanelDraggable(panel);
        }

        styleButtons(panel) {
             panel.querySelectorAll('button').forEach(btn => {
                btn.style.cssText += `
                    padding: 8px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                `;
                btn.onmouseover = () => btn.style.filter = 'brightness(1.2)';
                btn.onmouseout = () => btn.style.filter = 'brightness(1.0)';
            });
        }

        setupPanelEventListeners(panel) {
            // Palette listeners
            panel.querySelector('#palette-buttons').addEventListener('click', (e) => {
                const assetType = e.target.dataset.asset;
                if (assetType) this.selectDecoration(assetType);
            });

            // Action Menu listeners
            panel.querySelector('#clear-all-btn').addEventListener('click', () => this.clearAllDecorations());
            panel.querySelector('#animation-toggle-btn').addEventListener('click', () => this.toggleSpookyAnimation());
        }

        setupCanvasListeners() {
            if (drawariaCanvas) {
                drawariaCanvas.addEventListener('click', (e) => this.placeDecoration(e));
                document.addEventListener('mousemove', (e) => this.movePlaceholder(e));
            }
        }

        selectDecoration(type) {
            currentPlacementType = type;
            this.logStatus(`Selected: ${type}. Click canvas to place.`);
            this.createPlaceholder(ASSET_DEFINITIONS[type]);
            // Deselect all buttons visually, highlight current
            document.querySelectorAll('#palette-buttons button').forEach(btn =>
                btn.style.border = (btn.dataset.asset === type) ? '2px solid #f0f0f0' : 'none'
            );
        }

        createPlaceholder(asset) {
            if (!placeholderElement) {
                placeholderElement = document.createElement('div');
                placeholderElement.id = 'decor-placeholder';
                placeholderElement.style.cssText = `
                    position: absolute;
                    width: ${asset.size * 2}px;
                    height: ${asset.size * 2}px;
                    border-radius: 50%;
                    background: ${asset.color};
                    opacity: 0.5;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    z-index: 9999;
                `;
                document.body.appendChild(placeholderElement);
            }
            placeholderElement.style.background = asset.color;
            placeholderElement.style.width = `${asset.size * 2}px`;
            placeholderElement.style.height = `${asset.size * 2}px`;
            placeholderElement.style.display = 'block';
        }

        movePlaceholder(e) {
            if (currentPlacementType && placeholderElement) {
                placeholderElement.style.left = `${e.clientX}px`;
                placeholderElement.style.top = `${e.clientY}px`;
            }
        }

        placeDecoration(e) {
            if (!currentPlacementType) return;

            // Calculate coordinates relative to canvas
            const rect = drawariaCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
                this.logStatus("Placement failed: Outside canvas.");
                return;
            }

            const asset = ASSET_DEFINITIONS[currentPlacementType];

            const newDecoration = {
                id: Date.now() + Math.random(),
                type: currentPlacementType,
                x: x,
                y: y,
                color: asset.color,
                size: asset.size,
                bobOffset: 0
            };

            placedDecorations.push(newDecoration);
            this.redrawAllDecorations();

            this.logStatus(`Placed ${currentPlacementType} at (${Math.floor(x)}, ${Math.floor(y)}). Total: ${placedDecorations.length}`);

            // Reset placement state
            currentPlacementType = null;
            if (placeholderElement) placeholderElement.style.display = 'none';
            document.querySelectorAll('#palette-buttons button').forEach(btn => btn.style.border = 'none');
        }

        redrawAllDecorations() {
            // Optional: Draw a dark background first for a clean look
            clearCanvasWithBackground();

            // Draw all current decorations
            placedDecorations.forEach(decor => {
                const yPos = decor.y + decor.bobOffset;
                enqueueDrawCommand(decor.x, yPos, decor.color, decor.size);
            });
        }

        clearAllDecorations() {
            placedDecorations = [];
            this.toggleSpookyAnimation(false); // Stop animation just in case
            clearCanvasWithBackground();
            this.logStatus("🧹 All decorations cleared.");
        }

        toggleSpookyAnimation(forceState) {
            isAnimating = (typeof forceState === 'boolean') ? forceState : !isAnimating;
            const btn = document.getElementById('animation-toggle-btn');

            if (isAnimating) {
                btn.textContent = '⏸️ Stop Spooky Animation';
                btn.style.background = '#ffc107';
                this.logStatus("✨ Spooky Animation Started (Ghosts bobbing).");
                this.startAnimationLoop();
            } else {
                btn.textContent = 'Start Spooky Animation';
                btn.style.background = '#27ae60';
                clearInterval(animationInterval);
                animationInterval = null;
                // Reset bobOffset and redraw to original positions
                placedDecorations.filter(d => d.type === 'Ghost').forEach(d => d.bobOffset = 0);
                this.redrawAllDecorations();
                this.logStatus("Spooky Animation Stopped.");
            }
        }

        startAnimationLoop() {
            if (animationInterval) clearInterval(animationInterval);

            animationInterval = setInterval(() => {
                if (!isAnimating || placedDecorations.length === 0) return;

                // 1. Update Bob Phase (0 -> +5 -> 0 -> -5 -> 0 cycle)
                const bobValues = [0, 5, 0, -5];
                bobPhase = (bobPhase + 1) % 4;
                const newOffset = bobValues[bobPhase];

                let animated = false;

                // 2. Update Bob Offset for Ghosts
                placedDecorations.filter(d => d.type === 'Ghost' && ASSET_DEFINITIONS[d.type].canAnimate).forEach(decor => {
                    decor.bobOffset = newOffset;
                    animated = true;
                });

                // 3. Redraw the scene (only if something moved)
                if (animated) {
                    this.redrawAllDecorations();
                    // Log animation update only on key bob phases
                    if (bobPhase === 0) this.logStatus(`Animation: Bob cycle complete.`, true);
                }

            }, 500); // Low frequency 500ms interval
        }

        logStatus(message, isTransient = false) {
            const logEl = document.getElementById('status-log');
            if (logEl) {
                const now = new Date().toLocaleTimeString();
                logEl.innerHTML = `[${now}] ${message}` + (isTransient ? '' : '<br>') + logEl.innerHTML;
                // Keep max 10 lines
                const lines = logEl.innerHTML.split('<br>').slice(0, 10).join('<br>');
                logEl.innerHTML = lines;
            }
        }

        makePanelDraggable(panel) {
            let isDragging = false;
            let xOffset = 0;
            let yOffset = 0;
            let currentX, currentY, initialX, initialY;

            const dragStart = (e) => {
                e.preventDefault();
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                panel.style.cursor = 'grabbing';
            };

            const dragEnd = () => {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                panel.style.cursor = 'grab';
            };

            const drag = (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;

                    xOffset = currentX;
                    yOffset = currentY;

                    // Update style using transform for smooth dragging
                    panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                }
            };

            const header = panel.querySelector('#panel-header');
            if (header) {
                header.addEventListener("mousedown", dragStart);
                document.addEventListener("mouseup", dragEnd);
                document.addEventListener("mousemove", drag);
            }
        }
    }

    // Initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new DecorationManager());
    } else {
        new DecorationManager();
    }

})();