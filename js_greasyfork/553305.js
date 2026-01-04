// ==UserScript==
// @name         2048 Ultimate Cheat Suite
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Complete cheat suite for 2048 with auto-solver (corner/greedy/Monte Carlo), speed control, heatmap, and inspector. NOW WORKS with play2048.co!
// @author       GameModder
// @match        https://play2048.co/*
// @match        https://*.play2048.co/*
// @grant        none
// @license      CC-BY-NC-4.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553305/2048%20Ultimate%20Cheat%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/553305/2048%20Ultimate%20Cheat%20Suite.meta.js
// ==/UserScript==

/*
    This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
    To view a copy of this license, visit https://creativecommons.org/licenses/by-nc/4.0/

    You are free to share and adapt this code, but:
    - You must give appropriate credit.
    - You may not use this work for commercial purposes.
*/

(function() {
    'use strict';

    // Wait for page to load, then check for iframe or direct game
    let checkInterval = setInterval(() => {
        if (document.readyState === 'complete') {
            clearInterval(checkInterval);
            setTimeout(findGame, 500);
        }
    }, 100);

    function findGame() {
        // Debug: Log what we're finding
        console.log('2048 Cheat: Looking for game... document.readyState =', document.readyState);

        // Check for various possible container selectors
        let gameContainer = document.querySelector('.game-container') ||
                           document.querySelector('[class*="game"]') ||
                           document.querySelector('.container');

        if (gameContainer) {
            console.log('2048 Cheat: Game container found in main window!', gameContainer.className);
            // For play2048.co, use DOM-based approach since game manager isn't exposed
            initCheat(null, window, document);
            return;
        }

        // Also check for tiles directly (might indicate game is loaded)
        let tiles = document.querySelector('[class*="tile-position"]');
        if (tiles) {
            console.log('2048 Cheat: Found tiles, game is loaded!');
            initCheat(null, window, document);
            return;
        }

        // If not found, search in iframes
        console.log('2048 Cheat: Searching for game in iframes...');
        let iframes = document.querySelectorAll('iframe');
        console.log('2048 Cheat: Found ' + iframes.length + ' iframes');

        for (let iframe of iframes) {
            try {
                let iframeWindow = iframe.contentWindow;
                let iframeDoc = iframe.contentDocument || iframeWindow.document;

                // Check if iframe has game container
                let hasGameContainer = iframeDoc.querySelector('.game-container') ||
                                      iframeDoc.querySelector('[class*="game"]');

                if (hasGameContainer) {
                    console.log('2048 Cheat: Game found in iframe!', iframe, hasGameContainer.className);
                    initCheat(null, iframeWindow, iframeDoc);
                    return;
                }
            } catch (e) {
                // Cross-origin iframe, skip it
                console.log('2048 Cheat: Skipping cross-origin iframe');
                continue;
            }
        }

        // Retry after a delay if game not found yet
        let attempts = (findGame.attempts || 0) + 1;
        findGame.attempts = attempts;

        if (attempts < 10) {
            console.log('2048 Cheat: Game not found, retrying... (attempt ' + attempts + '/10)');
            setTimeout(findGame, 1000);
        } else {
            console.log('2048 Cheat: Failed to find game after 10 attempts');
            console.log('2048 Cheat: Debug - All elements with "game" in class:', document.querySelectorAll('[class*="game"]'));
            console.log('2048 Cheat: Debug - All divs:', document.querySelectorAll('div'));
        }
    }

    function initCheat(originalGameManager, gameWindow, gameDocument) {
        // Check if we have a game manager or need to use DOM-based approach
        let useDOMMode = !originalGameManager;

        if (useDOMMode) {
            console.log('2048 Cheat: Using DOM-based control mode');
        } else {
            console.log('2048 Cheat: Using game manager mode');
        }

        console.log('2048 Cheat: Initializing with game manager', originalGameManager);
        let moveHistory = [];
        let currentHistoryIndex = -1;
        let autoSolverInterval = null;
        let currentStrategy = 'corner';
        let gameSpeed = 1;
        let originalAddRandomTile = null;
        let forcedTileValue = null; // 2, 4, or null for random
        let forcedTilePosition = null; // {x, y} or null for random
        let scoreMultiplier = 1;
        let lockedTile = null;

        // DOM-based control functions for play2048.co
        function simulateKeyPress(keyCode) {
            let key, code;
            switch(keyCode) {
                case 0: key = 'ArrowLeft'; code = 'ArrowLeft'; break;   // Left
                case 1: key = 'ArrowDown'; code = 'ArrowDown'; break;   // Down
                case 2: key = 'ArrowRight'; code = 'ArrowRight'; break; // Right
                case 3: key = 'ArrowUp'; code = 'ArrowUp'; break;       // Up
            }

            let event = new KeyboardEvent('keydown', {
                key: key,
                code: code,
                keyCode: keyCode === 0 ? 37 : keyCode === 1 ? 40 : keyCode === 2 ? 39 : 38,
                which: keyCode === 0 ? 37 : keyCode === 1 ? 40 : keyCode === 2 ? 39 : 38,
                bubbles: true,
                cancelable: true
            });
            gameDocument.dispatchEvent(event);
        }

        function readBoardFromDOM() {
            let board = Array(4).fill(0).map(() => Array(4).fill(0));

            for (let row = 1; row <= 4; row++) {
                for (let col = 1; col <= 4; col++) {
                    let className = 'tile-position-' + col + '-' + row;
                    let tiles = gameDocument.getElementsByClassName(className);

                    if (tiles.length > 0) {
                        let tile = tiles[tiles.length - 1];
                        let valueElement = tile.querySelector('.tile-inner');
                        if (valueElement) {
                            let value = parseInt(valueElement.textContent);
                            if (!isNaN(value)) {
                                board[row - 1][col - 1] = value;
                            }
                        }
                    }
                }
            }
            return board;
        }

        function isGameOver() {
            return gameDocument.querySelector('.game-over') !== null;
        }

        function isGameWon() {
            return gameDocument.querySelector('.game-won') !== null;
        }

        function getCurrentScore() {
            let scoreContainer = gameDocument.querySelector('.score-container');
            if (scoreContainer) {
                let scoreText = scoreContainer.textContent.trim();
                let match = scoreText.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            }
            return 0;
        }

        // Intercept game manager methods
        function interceptGameManager() {
            if (!originalGameManager) return;

            // Store original methods
            originalAddRandomTile = originalGameManager.addRandomTile.bind(originalGameManager);

            // Override addRandomTile for spawner control
            originalGameManager.addRandomTile = function() {
                if (forcedTileValue || forcedTilePosition) {
                    let availableCells = originalGameManager.grid.availableCells();
                    if (availableCells.length > 0) {
                        let position = forcedTilePosition && availableCells.some(c => c.x === forcedTilePosition.x && c.y === forcedTilePosition.y)
                            ? forcedTilePosition
                            : availableCells[Math.floor(Math.random() * availableCells.length)];

                        let value = forcedTileValue || (Math.random() < 0.9 ? 2 : 4);
                        let TileConstructor = gameWindow.Tile || Tile;
                        let tile = new TileConstructor(position, value);
                        originalGameManager.grid.insertTile(tile);
                    }
                } else {
                    originalAddRandomTile();
                }
            };

            // Override move to record history
            let originalMove = originalGameManager.move.bind(originalGameManager);
            originalGameManager.move = function(direction) {
                // Save state before move
                if (currentHistoryIndex === moveHistory.length - 1) {
                    moveHistory.push(captureGameState());
                    currentHistoryIndex++;
                }

                originalMove(direction);

                // Apply score multiplier
                if (scoreMultiplier !== 1) {
                    originalGameManager.score = Math.floor(originalGameManager.score * scoreMultiplier);
                    originalGameManager.actuator.updateScore(originalGameManager.score);
                }
            };
        }

        // Capture current game state
        function captureGameState() {
            return {
                grid: serializeGrid(originalGameManager.grid),
                score: originalGameManager.score,
                over: originalGameManager.over,
                won: originalGameManager.won
            };
        }

        // Serialize grid to JSON
        function serializeGrid(grid) {
            let cells = [];
            grid.cells.forEach(column => {
                let columnData = [];
                column.forEach(cell => {
                    columnData.push(cell ? { position: cell.position, value: cell.value } : null);
                });
                cells.push(columnData);
            });
            return { size: grid.size, cells: cells };
        }

        // Restore game state
        function restoreGameState(state) {
            originalGameManager.grid.cells = [];
            for (let x = 0; x < state.grid.size; x++) {
                let column = [];
                for (let y = 0; y < state.grid.size; y++) {
                    let cellData = state.grid.cells[x][y];
                    let TileConstructor = gameWindow.Tile || (typeof Tile !== 'undefined' ? Tile : null);
                    column.push(cellData && TileConstructor ? new TileConstructor(cellData.position, cellData.value) : null);
                }
                originalGameManager.grid.cells.push(column);
            }
            originalGameManager.score = state.score;
            originalGameManager.over = state.over;
            originalGameManager.won = state.won;
            originalGameManager.actuate();
        }

        // Helper: Check if move is possible (DOM mode)
        function canMoveDOM(board, direction) {
            // Simplified check - just see if there are any matching adjacent tiles or empty spaces
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (board[y][x] === 0) return true; // Has empty space
                }
            }

            // Check for matching adjacent tiles
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 3; x++) {
                    if (board[y][x] !== 0 && board[y][x] === board[y][x+1]) return true;
                }
            }
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 3; y++) {
                    if (board[y][x] !== 0 && board[y][x] === board[y+1][x]) return true;
                }
            }

            return false;
        }

        // Auto-solver strategies
        const Strategies = {
            // Greedy: Choose move with best immediate score gain
            greedy: function() {
                if (useDOMMode) {
                    // In DOM mode, use corner strategy as fallback
                    return Strategies.corner();
                }

                let bestMove = null;
                let bestScore = -1;

                [0, 1, 2, 3].forEach(direction => {
                    let clonedManager = cloneGameManager();
                    let initialScore = clonedManager.score;
                    clonedManager.move(direction);
                    let scoreGain = clonedManager.score - initialScore;

                    if (scoreGain > bestScore) {
                        bestScore = scoreGain;
                        bestMove = direction;
                    }
                });

                return bestMove !== null ? bestMove : 0;
            },

            // Corner strategy: Keep highest tile in corner
            corner: function() {
                // Prefer moves that keep tiles in bottom-right corner
                // Priority: Down > Right > Left > Up
                let movePreference = [1, 2, 0, 3]; // down, right, left, up

                if (useDOMMode) {
                    // Simple heuristic: try moves in order
                    for (let direction of movePreference) {
                        return direction; // Just try in order
                    }
                    return 0;
                } else {
                    for (let direction of movePreference) {
                        if (canMove(direction)) {
                            return direction;
                        }
                    }
                    return 0; // Fallback
                }
            },

            // Monte Carlo: Simulate random games and pick best average outcome
            monteCarlo: function() {
                if (useDOMMode) {
                    // In DOM mode, use corner strategy as fallback
                    return Strategies.corner();
                }

                let simulations = 50; // Number of simulations per move
                let scores = [[], [], [], []];

                [0, 1, 2, 3].forEach(direction => {
                    if (!canMove(direction)) return;

                    for (let i = 0; i < simulations; i++) {
                        let clonedManager = cloneGameManager();
                        clonedManager.move(direction);

                        // Random playout
                        let moves = 0;
                        while (!clonedManager.over && moves < 10) {
                            let randomDir = Math.floor(Math.random() * 4);
                            if (canMoveOnGrid(clonedManager.grid, randomDir)) {
                                clonedManager.move(randomDir);
                                moves++;
                            }
                        }

                        scores[direction].push(clonedManager.score);
                    }
                });

                // Find direction with best average score
                let bestMove = 0;
                let bestAvg = -1;
                scores.forEach((dirScores, dir) => {
                    if (dirScores.length > 0) {
                        let avg = dirScores.reduce((a, b) => a + b, 0) / dirScores.length;
                        if (avg > bestAvg) {
                            bestAvg = avg;
                            bestMove = dir;
                        }
                    }
                });

                return bestMove;
            }
        };

        // Helper: Check if move is possible
        function canMove(direction) {
            if (useDOMMode) {
                return canMoveDOM(getBoardArray(), direction);
            }
            return canMoveOnGrid(originalGameManager.grid, direction);
        }

        function canMoveOnGrid(grid, direction) {
            let vector = originalGameManager.getVector(direction);
            let moved = false;

            grid.eachCell((x, y, tile) => {
                if (tile) {
                    let positions = originalGameManager.findFarthestPosition({ x, y }, vector);
                    let next = grid.cellContent(positions.next);

                    if (next && next.value === tile.value) {
                        moved = true;
                    } else if (positions.farthest.x !== x || positions.farthest.y !== y) {
                        moved = true;
                    }
                }
            });

            return moved;
        }

        // Clone game manager for simulation
        function cloneGameManager() {
            let clone = Object.create(Object.getPrototypeOf(originalGameManager));
            clone.size = originalGameManager.size;
            clone.startTiles = originalGameManager.startTiles;
            clone.score = originalGameManager.score;
            clone.over = originalGameManager.over;
            clone.won = originalGameManager.won;
            clone.keepPlaying = originalGameManager.keepPlaying;

            // Clone grid
            clone.grid = { size: originalGameManager.grid.size, cells: [] };
            originalGameManager.grid.cells.forEach((column, x) => {
                clone.grid.cells[x] = [];
                column.forEach((cell, y) => {
                    clone.grid.cells[x][y] = cell ? { position: cell.position, value: cell.value } : null;
                });
            });

            // Copy methods
            clone.getVector = originalGameManager.getVector.bind(clone);
            clone.findFarthestPosition = originalGameManager.findFarthestPosition.bind(clone);
            clone.movesAvailable = originalGameManager.movesAvailable.bind(clone);
            clone.move = function(direction) {
                let vector = this.getVector(direction);
                let traversals = originalGameManager.buildTraversals.call(this, vector);
                let moved = false;

                traversals.x.forEach(x => {
                    traversals.y.forEach(y => {
                        let tile = this.grid.cells[x][y];
                        if (tile) {
                            let positions = this.findFarthestPosition({ x, y }, vector);
                            let next = this.grid.cells[positions.next.x] ? this.grid.cells[positions.next.x][positions.next.y] : null;

                            if (next && next.value === tile.value) {
                                this.grid.cells[positions.next.x][positions.next.y] = { position: positions.next, value: tile.value * 2 };
                                this.grid.cells[x][y] = null;
                                this.score += tile.value * 2;
                                moved = true;
                            } else if (positions.farthest.x !== x || positions.farthest.y !== y) {
                                this.grid.cells[positions.farthest.x][positions.farthest.y] = tile;
                                this.grid.cells[x][y] = null;
                                moved = true;
                            }
                        }
                    });
                });

                return moved;
            };

            return clone;
        }

        // Auto-solver loop
        function runAutoSolver() {
            if (useDOMMode) {
                if (!isGameOver()) {
                    let move = Strategies[currentStrategy]();
                    simulateKeyPress(move);
                }
            } else {
                if (!originalGameManager.over) {
                    let move = Strategies[currentStrategy]();
                    originalGameManager.inputManager.emit('move', move);
                }
            }
        }

        // Board editor: Set grid to specific layout
        function setBoard(layout) {
            if (useDOMMode) {
                showNotification('Board editor not available in DOM mode');
                return;
            }
            originalGameManager.grid.cells = [];
            for (let x = 0; x < 4; x++) {
                let column = [];
                for (let y = 0; y < 4; y++) {
                    let value = layout[y][x];
                    let TileConstructor = gameWindow.Tile || (typeof Tile !== 'undefined' ? Tile : null);
                    column.push(value && TileConstructor ? new TileConstructor({ x, y }, value) : null);
                }
                originalGameManager.grid.cells.push(column);
            }
            originalGameManager.actuate();
            showNotification('Board updated!');
        }

        // Get current board as 2D array
        function getBoardArray() {
            if (useDOMMode) {
                return readBoardFromDOM();
            }

            let board = [];
            for (let y = 0; y < 4; y++) {
                board[y] = [];
                for (let x = 0; x < 4; x++) {
                    let tile = originalGameManager.grid.cells[x][y];
                    board[y][x] = tile ? tile.value : 0;
                }
            }
            return board;
        }

        // Calculate heatmap (which tiles are blocking merges)
        function calculateHeatmap() {
            let heatmap = Array(4).fill(0).map(() => Array(4).fill(0));
            let board = getBoardArray();

            // Check horizontal adjacency
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 3; x++) {
                    if (board[y][x] !== 0 && board[y][x+1] !== 0 && board[y][x] !== board[y][x+1]) {
                        heatmap[y][x]++;
                        heatmap[y][x+1]++;
                    }
                }
            }

            // Check vertical adjacency
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 3; y++) {
                    if (board[y][x] !== 0 && board[y+1][x] !== 0 && board[y][x] !== board[y+1][x]) {
                        heatmap[y][x]++;
                        heatmap[y+1][x]++;
                    }
                }
            }

            return heatmap;
        }

        // Show notification
        function showNotification(message) {
            let notif = document.createElement('div');
            notif.className = 'cheat-notification';
            notif.textContent = message;
            document.body.appendChild(notif);

            setTimeout(() => notif.classList.add('show'), 10);
            setTimeout(() => {
                notif.classList.remove('show');
                setTimeout(() => notif.remove(), 300);
            }, 2000);
        }

        // Create GUI - always in main document, not iframe
        function createGUI() {
            let gui = document.createElement('div');
            gui.id = 'cheat-gui';
            gui.innerHTML = `
                <div class="cheat-header">
                    <span>🎮 2048 Ultimate Cheat</span>
                    <button id="cheat-minimize">−</button>
                </div>
                <div class="cheat-content">
                    <!-- Auto-Solver Section -->
                    <div class="cheat-section">
                        <div class="cheat-section-header" data-section="autosolver">
                            <span>▼ 🤖 Auto-Solver</span>
                        </div>
                        <div class="cheat-section-content" id="section-autosolver">
                            <div class="cheat-row">
                                <label>Strategy:</label>
                                <select id="strategy-select">
                                    <option value="corner" selected>Corner Strategy</option>
                                    <option value="greedy">Greedy (Best Score)</option>
                                    <option value="monteCarlo">Monte Carlo</option>
                                </select>
                            </div>
                            <div class="cheat-row">
                                <label>Speed (moves/sec):</label>
                                <input type="range" id="solver-speed" min="1" max="10" value="2">
                                <span id="speed-value">2</span>
                            </div>
                            <button id="start-solver" class="cheat-btn">▶ Start Auto-Solver</button>
                            <button id="stop-solver" class="cheat-btn" style="display:none;">⏸ Stop Auto-Solver</button>
                            <button id="step-once" class="cheat-btn">⏭ Step Once</button>
                        </div>
                    </div>

                    <!-- Tile Spawner Control Section -->
                    <div class="cheat-section">
                        <div class="cheat-section-header" data-section="spawner">
                            <span>▶ 🎲 Tile Spawner Control</span>
                        </div>
                        <div class="cheat-section-content" id="section-spawner" style="display:none;">
                            <div class="cheat-row">
                                <label>Force next tile value:</label>
                                <select id="force-tile-value">
                                    <option value="random">Random (90% 2, 10% 4)</option>
                                    <option value="2">Always 2</option>
                                    <option value="4">Always 4</option>
                                </select>
                            </div>
                            <div class="cheat-row">
                                <label>Force position:</label>
                                <button id="pick-position" class="cheat-btn">📍 Click Grid to Pick</button>
                                <span id="position-display">Random</span>
                            </div>
                            <button id="clear-force" class="cheat-btn">🔄 Reset to Random</button>
                        </div>
                    </div>

                    <!-- Board Editor Section -->
                    <div class="cheat-section">
                        <div class="cheat-section-header" data-section="editor">
                            <span>▶ 🏗 Board Editor</span>
                        </div>
                        <div class="cheat-section-content" id="section-editor" style="display:none;">
                            <div class="board-editor" id="board-editor"></div>
                            <div class="cheat-row">
                                <button id="apply-board" class="cheat-btn">✅ Apply to Game</button>
                                <button id="clear-board" class="cheat-btn">🗑 Clear Board</button>
                            </div>
                            <div class="cheat-row">
                                <button id="load-current" class="cheat-btn">📥 Load Current</button>
                                <button id="preset-corner" class="cheat-btn">🎯 Corner Setup</button>
                            </div>
                        </div>
                    </div>

                    <!-- History & Replay Section -->
                    <div class="cheat-section">
                        <div class="cheat-section-header" data-section="history">
                            <span>▶ ⏮ Undo / Replay</span>
                        </div>
                        <div class="cheat-section-content" id="section-history" style="display:none;">
                            <div class="cheat-row">
                                <button id="undo-move" class="cheat-btn">⬅ Undo</button>
                                <button id="redo-move" class="cheat-btn">➡ Redo</button>
                            </div>
                            <div class="cheat-row">
                                <span id="history-info">History: 0 moves</span>
                            </div>
                            <button id="clear-history" class="cheat-btn">🗑 Clear History</button>
                        </div>
                    </div>

                    <!-- State Inspector Section -->
                    <div class="cheat-section">
                        <div class="cheat-section-header" data-section="inspector">
                            <span>▶ 🔍 State Inspector</span>
                        </div>
                        <div class="cheat-section-content" id="section-inspector" style="display:none;">
                            <button id="show-heatmap" class="cheat-btn">🔥 Show Heatmap</button>
                            <button id="hide-heatmap" class="cheat-btn" style="display:none;">❌ Hide Heatmap</button>
                            <div id="heatmap-display"></div>
                            <div class="cheat-row">
                                <label>Empty Cells:</label>
                                <span id="empty-cells">0</span>
                            </div>
                            <div class="cheat-row">
                                <label>Highest Tile:</label>
                                <span id="highest-tile">0</span>
                            </div>
                            <div class="cheat-row">
                                <label>Mergeable Pairs:</label>
                                <span id="mergeable-pairs">0</span>
                            </div>
                        </div>
                    </div>

                    <!-- Experimental Section -->
                    <div class="cheat-section">
                        <div class="cheat-section-header" data-section="experimental">
                            <span>▶ ⚗ Experimental</span>
                        </div>
                        <div class="cheat-section-content" id="section-experimental" style="display:none;">
                            <div class="cheat-row">
                                <label>Score Multiplier:</label>
                                <input type="number" id="score-multiplier" min="1" max="10" value="1" step="0.5">
                            </div>
                            <div class="cheat-row">
                                <label>Set Score:</label>
                                <input type="number" id="set-score" min="0" step="100" value="0">
                                <button id="apply-score" class="cheat-btn">Set</button>
                            </div>
                            <button id="lock-highest" class="cheat-btn">🔒 Lock Highest Tile</button>
                            <button id="unlock-highest" class="cheat-btn" style="display:none;">🔓 Unlock Highest</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(gui);

            // Add styles
            let style = document.createElement('style');
            style.textContent = `
                #cheat-gui {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 320px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
                    z-index: 999999;
                    color: white;
                }
                .cheat-header {
                    padding: 15px;
                    font-weight: bold;
                    font-size: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    border-bottom: 2px solid rgba(255,255,255,0.2);
                }
                #cheat-minimize {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 18px;
                }
                #cheat-minimize:hover {
                    background: rgba(255,255,255,0.3);
                }
                .cheat-content {
                    max-height: 600px;
                    overflow-y: auto;
                }
                .cheat-section {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .cheat-section-header {
                    padding: 12px 15px;
                    cursor: pointer;
                    user-select: none;
                    transition: background 0.2s;
                }
                .cheat-section-header:hover {
                    background: rgba(255,255,255,0.1);
                }
                .cheat-section-content {
                    padding: 10px 15px;
                    background: rgba(0,0,0,0.1);
                }
                .cheat-row {
                    margin: 10px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cheat-row label {
                    flex: 1;
                    font-size: 13px;
                }
                .cheat-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                    width: 100%;
                    margin: 5px 0;
                }
                .cheat-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-1px);
                }
                .cheat-btn:active {
                    transform: translateY(0);
                }
                input[type="range"] {
                    flex: 1;
                }
                input, select {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 13px;
                }
                select option {
                    background: #667eea;
                    color: white;
                }
                .board-editor {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 5px;
                    margin: 10px 0;
                }
                .board-cell {
                    aspect-ratio: 1;
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                }
                .board-cell:hover {
                    background: rgba(255,255,255,0.3);
                }
                .cheat-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 8px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    z-index: 1000000;
                    font-family: 'Clear Sans', Arial, sans-serif;
                }
                .cheat-notification.show {
                    transform: translateX(0);
                }
                #heatmap-display {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2px;
                    margin: 10px 0;
                }
                .heatmap-cell {
                    aspect-ratio: 1;
                    border-radius: 3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);

            // Make draggable
            makeDraggable(gui);

            // Set up event listeners
            setupEventListeners();
        }

        // Make element draggable
        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            let header = element.querySelector('.cheat-header');

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

        // Set up all event listeners
        function setupEventListeners() {
            // Collapsible sections
            document.querySelectorAll('.cheat-section-header').forEach(header => {
                header.addEventListener('click', function() {
                    let section = this.getAttribute('data-section');
                    let content = document.getElementById('section-' + section);
                    let arrow = this.querySelector('span');

                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        arrow.textContent = arrow.textContent.replace('▶', '▼');
                    } else {
                        content.style.display = 'none';
                        arrow.textContent = arrow.textContent.replace('▼', '▶');
                    }
                });
            });

            // Minimize button
            document.getElementById('cheat-minimize').addEventListener('click', function() {
                let content = document.querySelector('.cheat-content');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    this.textContent = '−';
                } else {
                    content.style.display = 'none';
                    this.textContent = '+';
                }
            });

            // Auto-solver controls
            document.getElementById('strategy-select').addEventListener('change', function() {
                currentStrategy = this.value;
                showNotification('Strategy: ' + this.options[this.selectedIndex].text);
            });

            document.getElementById('solver-speed').addEventListener('input', function() {
                gameSpeed = parseInt(this.value);
                document.getElementById('speed-value').textContent = gameSpeed;

                if (autoSolverInterval) {
                    clearInterval(autoSolverInterval);
                    autoSolverInterval = setInterval(runAutoSolver, 1000 / gameSpeed);
                }
            });

            document.getElementById('start-solver').addEventListener('click', function() {
                if (!autoSolverInterval) {
                    autoSolverInterval = setInterval(runAutoSolver, 1000 / gameSpeed);
                    this.style.display = 'none';
                    document.getElementById('stop-solver').style.display = 'block';
                    showNotification('Auto-solver started with ' + currentStrategy + ' strategy');
                }
            });

            document.getElementById('stop-solver').addEventListener('click', function() {
                if (autoSolverInterval) {
                    clearInterval(autoSolverInterval);
                    autoSolverInterval = null;
                    this.style.display = 'none';
                    document.getElementById('start-solver').style.display = 'block';
                    showNotification('Auto-solver stopped');
                }
            });

            document.getElementById('step-once').addEventListener('click', function() {
                runAutoSolver();
                showNotification('Executed one move');
            });

            // Tile spawner controls
            document.getElementById('force-tile-value').addEventListener('change', function() {
                forcedTileValue = this.value === 'random' ? null : parseInt(this.value);
                showNotification('Next tiles: ' + (forcedTileValue || 'Random'));
            });

            document.getElementById('pick-position').addEventListener('click', function() {
                showNotification('Click on any tile to set spawn position');
                let tiles = document.querySelectorAll('.tile-container .tile, .grid-container .grid-cell');

                let clickHandler = function(e) {
                    // Calculate grid position from click
                    let rect = document.querySelector('.grid-container').getBoundingClientRect();
                    let x = Math.floor((e.clientX - rect.left) / (rect.width / 4));
                    let y = Math.floor((e.clientY - rect.top) / (rect.height / 4));

                    if (x >= 0 && x < 4 && y >= 0 && y < 4) {
                        forcedTilePosition = { x, y };
                        document.getElementById('position-display').textContent = `(${x}, ${y})`;
                        showNotification(`Position set to (${x}, ${y})`);
                    }

                    tiles.forEach(t => t.removeEventListener('click', clickHandler));
                };

                tiles.forEach(t => t.addEventListener('click', clickHandler));
            });

            document.getElementById('clear-force').addEventListener('click', function() {
                forcedTileValue = null;
                forcedTilePosition = null;
                document.getElementById('force-tile-value').value = 'random';
                document.getElementById('position-display').textContent = 'Random';
                showNotification('Reset to random spawning');
            });

            // Board editor
            createBoardEditor();

            document.getElementById('apply-board').addEventListener('click', function() {
                let board = getBoardFromEditor();
                setBoard(board);
            });

            document.getElementById('clear-board').addEventListener('click', function() {
                let board = Array(4).fill(0).map(() => Array(4).fill(0));
                updateBoardEditor(board);
            });

            document.getElementById('load-current').addEventListener('click', function() {
                let board = getBoardArray();
                updateBoardEditor(board);
                showNotification('Loaded current board');
            });

            document.getElementById('preset-corner').addEventListener('click', function() {
                let board = [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 2],
                    [128, 64, 32, 16]
                ];
                updateBoardEditor(board);
                showNotification('Loaded corner strategy preset');
            });

            // History controls
            document.getElementById('undo-move').addEventListener('click', function() {
                if (currentHistoryIndex > 0) {
                    currentHistoryIndex--;
                    restoreGameState(moveHistory[currentHistoryIndex]);
                    updateHistoryInfo();
                    showNotification('Undo move');
                }
            });

            document.getElementById('redo-move').addEventListener('click', function() {
                if (currentHistoryIndex < moveHistory.length - 1) {
                    currentHistoryIndex++;
                    restoreGameState(moveHistory[currentHistoryIndex]);
                    updateHistoryInfo();
                    showNotification('Redo move');
                }
            });

            document.getElementById('clear-history').addEventListener('click', function() {
                moveHistory = [captureGameState()];
                currentHistoryIndex = 0;
                updateHistoryInfo();
                showNotification('History cleared');
            });

            // Inspector controls
            let heatmapInterval = null;
            document.getElementById('show-heatmap').addEventListener('click', function() {
                this.style.display = 'none';
                document.getElementById('hide-heatmap').style.display = 'block';

                heatmapInterval = setInterval(updateInspector, 500);
                updateInspector();
            });

            document.getElementById('hide-heatmap').addEventListener('click', function() {
                this.style.display = 'none';
                document.getElementById('show-heatmap').style.display = 'block';

                if (heatmapInterval) {
                    clearInterval(heatmapInterval);
                    heatmapInterval = null;
                }
                document.getElementById('heatmap-display').innerHTML = '';
            });

            // Experimental controls
            document.getElementById('score-multiplier').addEventListener('change', function() {
                scoreMultiplier = parseFloat(this.value);
                showNotification('Score multiplier: ' + scoreMultiplier + 'x');
            });

            document.getElementById('apply-score').addEventListener('click', function() {
                let score = parseInt(document.getElementById('set-score').value);
                originalGameManager.score = score;
                originalGameManager.actuator.updateScore(score);
                showNotification('Score set to ' + score);
            });

            document.getElementById('lock-highest').addEventListener('click', function() {
                // Find highest tile
                let maxValue = 0;
                let maxPos = null;
                originalGameManager.grid.eachCell((x, y, tile) => {
                    if (tile && tile.value > maxValue) {
                        maxValue = tile.value;
                        maxPos = { x, y };
                    }
                });

                if (maxPos) {
                    lockedTile = maxPos;
                    this.style.display = 'none';
                    document.getElementById('unlock-highest').style.display = 'block';
                    showNotification('Locked tile ' + maxValue + ' at (' + maxPos.x + ', ' + maxPos.y + ')');
                }
            });

            document.getElementById('unlock-highest').addEventListener('click', function() {
                lockedTile = null;
                this.style.display = 'none';
                document.getElementById('lock-highest').style.display = 'block';
                showNotification('Tile unlocked');
            });
        }

        // Create board editor grid
        function createBoardEditor() {
            let editor = document.getElementById('board-editor');
            let editorData = Array(4).fill(0).map(() => Array(4).fill(0));

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    let cell = document.createElement('div');
                    cell.className = 'board-cell';
                    cell.dataset.x = x;
                    cell.dataset.y = y;
                    cell.textContent = '';

                    cell.addEventListener('click', function() {
                        let currentValue = editorData[y][x];
                        let values = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
                        let nextIndex = (values.indexOf(currentValue) + 1) % values.length;
                        editorData[y][x] = values[nextIndex];
                        this.textContent = editorData[y][x] || '';
                        this.style.background = getTileColor(editorData[y][x]);
                    });

                    editor.appendChild(cell);
                }
            }

            window.editorData = editorData;
        }

        function updateBoardEditor(board) {
            window.editorData = board;
            let cells = document.querySelectorAll('.board-cell');
            let index = 0;
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    cells[index].textContent = board[y][x] || '';
                    cells[index].style.background = getTileColor(board[y][x]);
                    index++;
                }
            }
        }

        function getBoardFromEditor() {
            return window.editorData;
        }

        function getTileColor(value) {
            let colors = {
                0: 'rgba(255,255,255,0.2)',
                2: '#eee4da',
                4: '#ede0c8',
                8: '#f2b179',
                16: '#f59563',
                32: '#f67c5f',
                64: '#f65e3b',
                128: '#edcf72',
                256: '#edcc61',
                512: '#edc850',
                1024: '#edc53f',
                2048: '#edc22e',
                4096: '#3c3a32',
                8192: '#3c3a32'
            };
            return colors[value] || '#3c3a32';
        }

        function updateHistoryInfo() {
            document.getElementById('history-info').textContent =
                `History: ${currentHistoryIndex}/${moveHistory.length - 1} moves`;
        }

        function updateInspector() {
            // Calculate stats
            let emptyCells = 0;
            let highestTile = 0;
            let mergeablePairs = 0;
            let board = getBoardArray();

            // Count empty cells and find highest tile
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (board[y][x] === 0) emptyCells++;
                    if (board[y][x] > highestTile) highestTile = board[y][x];
                }
            }

            // Count mergeable pairs
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 3; x++) {
                    if (board[y][x] !== 0 && board[y][x] === board[y][x+1]) mergeablePairs++;
                }
            }
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 3; y++) {
                    if (board[y][x] !== 0 && board[y][x] === board[y+1][x]) mergeablePairs++;
                }
            }

            document.getElementById('empty-cells').textContent = emptyCells;
            document.getElementById('highest-tile').textContent = highestTile;
            document.getElementById('mergeable-pairs').textContent = mergeablePairs;

            // Display heatmap
            let heatmap = calculateHeatmap();
            let heatmapDisplay = document.getElementById('heatmap-display');
            heatmapDisplay.innerHTML = '';

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    let cell = document.createElement('div');
                    cell.className = 'heatmap-cell';
                    cell.textContent = board[y][x] || '';

                    let heat = heatmap[y][x];
                    let alpha = Math.min(heat / 4, 1);
                    cell.style.background = `rgba(255, 0, 0, ${alpha * 0.5})`;

                    heatmapDisplay.appendChild(cell);
                }
            }
        }

        // Initialize
        if (!useDOMMode) {
            interceptGameManager();
            moveHistory.push(captureGameState());
        }
        createGUI();

        console.log('🎮 2048 Ultimate Cheat Suite loaded!');
        console.log('Mode: ' + (useDOMMode ? 'DOM-based (play2048.co)' : 'Game Manager'));
        console.log('Features: Auto-solver' + (useDOMMode ? '' : ', Tile control, Board editor, Undo/Redo') + ', Inspector, and more!');
        showNotification('2048 Cheat Suite Loaded! 🎮');
    }
})();
