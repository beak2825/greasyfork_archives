// ==UserScript==
// @name         Mines Game Solver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detects mines and highlights the safe tile
// @author       You
// @match        https://www.fakestake.fun/mines
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562297/Mines%20Game%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/562297/Mines%20Game%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let solverActive = false;
    let originalMathFloor = Math.floor;
    let minesFound = new Set();

    // Draggable functionality
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('#drag-header');

        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Create the UI
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'mines-solver-panel';
        panel.innerHTML = `
            <div id="solver-panel-content" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 999999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                min-width: 280px;
                backdrop-filter: blur(10px);
            ">
                <div id="drag-header" style="
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    user-select: none;
                    padding: 5px;
                    margin: -5px -5px 15px -5px;
                    border-radius: 8px;
                    transition: background 0.2s;
                ">
                    <span style="font-size: 24px;">💎</span>
                    <span>Mines Solver</span>
                    <span style="margin-left: auto; font-size: 12px; opacity: 0.7;">⋮⋮</span>
                </div>

                <button id="solver-btn" style="
                    width: 100%;
                    padding: 12px 24px;
                    background: white;
                    color: #667eea;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                ">
                    Activate Solver
                </button>

                <div id="solver-status" style="
                    margin-top: 15px;
                    padding: 12px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    text-align: center;
                    min-height: 20px;
                ">
                    Ready to scan...
                </div>

                <div id="mines-list" style="
                    margin-top: 15px;
                    padding: 12px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: white;
                    font-size: 13px;
                    max-height: 200px;
                    overflow-y: auto;
                    display: none;
                "></div>
            </div>
        `;
        document.body.appendChild(panel);

        // Make the panel draggable
        const panelContent = document.getElementById('solver-panel-content');
        makeDraggable(panelContent);

        // Add hover effect to drag header
        const header = document.getElementById('drag-header');
        header.addEventListener('mouseenter', () => {
            header.style.background = 'rgba(255,255,255,0.1)';
        });
        header.addEventListener('mouseleave', () => {
            header.style.background = 'transparent';
        });

        // Add hover effect
        const btn = document.getElementById('solver-btn');
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        // Button click handler
        btn.addEventListener('click', toggleSolver);
    }

    function updateStatus(message, color = 'white') {
        const status = document.getElementById('solver-status');
        if (status) {
            status.innerHTML = message;
            status.style.color = color;
        }
    }

    function updateMinesList() {
        const minesList = document.getElementById('mines-list');
        if (minesList && minesFound.size > 0) {
            minesList.style.display = 'block';
            minesList.innerHTML = `<strong>Mines Detected (${minesFound.size}/24):</strong><br>` +
                Array.from(minesFound).sort((a,b) => a-b).join(', ');
        }
    }

    function activateSolver() {
        console.clear();
        console.log("%c[SYSTEM] Aggressive Solver Initialized", "color: #00ffcc; font-weight: bold;");

        updateStatus('🔍 Solver Active - Scanning...', '#00ff88');

        // Label all tiles with numbers
        const tiles = document.querySelectorAll('button, [class*="tile"], [class*="cell"]');
        tiles.forEach((tile, i) => {
            tile.style.position = "relative";
            let label = document.createElement('span');
            label.innerText = i;
            label.className = 'solver-label';
            label.style = "position:absolute; top:2px; left:2px; color:yellow; font-size:11px; font-weight:bold; z-index:999; pointer-events:none; text-shadow: 1px 1px 2px black;";
            tile.appendChild(label);
        });

        // Hook Math.floor
        Math.floor = function(val) {
            const result = originalMathFloor(val);
            if (val >= 0 && val < 25 && !Number.isInteger(val)) {
                if (!minesFound.has(result)) {
                    minesFound.add(result);
                    console.log(`%c[DETECTED] Mine at: ${result}`, "color: #ff4444;");

                    updateMinesList();

                    // Highlight mines red
                    const allTiles = document.querySelectorAll('button, [class*="tile"], [class*="cell"]');
                    if (allTiles[result]) {
                        allTiles[result].style.backgroundColor = "rgba(255, 0, 0, 0.4)";
                        allTiles[result].style.border = "2px solid red";
                    }

                    // Check for safe spot when all 24 mines found
                    if (minesFound.size === 24) {
                        let all = Array.from({length: 25}, (_, i) => i);
                        let safe = all.find(i => !minesFound.has(i));
                        console.log(`%c[!!!] DIAMOND LOCATED AT INDEX: ${safe}`, "background: green; color: white; font-size: 20px; padding: 10px;");

                        updateStatus(`💎 SAFE TILE FOUND: ${safe}`, '#00ff00');

                        if (allTiles[safe]) {
                            allTiles[safe].style.backgroundColor = "rgba(0, 255, 0, 0.8)";
                            allTiles[safe].style.border = "4px solid lime";
                            allTiles[safe].style.boxShadow = "0 0 20px lime";
                        }
                    } else {
                        updateStatus(`🔍 Found ${minesFound.size}/24 mines...`, '#ffaa00');
                    }
                }
            }
            return result;
        };

        console.log("READY: Set to 24 mines and click Bet. The safe tile will turn bright GREEN.");
    }

    function deactivateSolver() {
        // Restore original Math.floor
        Math.floor = originalMathFloor;

        // Remove labels
        document.querySelectorAll('.solver-label').forEach(label => label.remove());

        // Reset tile styles
        const tiles = document.querySelectorAll('button, [class*="tile"], [class*="cell"]');
        tiles.forEach(tile => {
            tile.style.backgroundColor = '';
            tile.style.border = '';
            tile.style.boxShadow = '';
        });

        minesFound.clear();
        updateStatus('Solver deactivated', '#ff6666');
        document.getElementById('mines-list').style.display = 'none';

        console.log("%c[SYSTEM] Solver Deactivated", "color: #ff6666; font-weight: bold;");
    }

    function toggleSolver() {
        const btn = document.getElementById('solver-btn');
        solverActive = !solverActive;

        if (solverActive) {
            btn.textContent = 'Deactivate Solver';
            btn.style.background = '#ff4444';
            btn.style.color = 'white';
            activateSolver();
        } else {
            btn.textContent = 'Activate Solver';
            btn.style.background = 'white';
            btn.style.color = '#667eea';
            deactivateSolver();
        }
    }

    // Initialize UI when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();