// ==UserScript==
// @name         Chess.com Complete Move Guide
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Shows what piece to move and where to move it on Chess.com
// @author       ChessHack
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @icon         https://www.chess.com/bundles/web/favicons/apple-touch-icon.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563087/Chesscom%20Complete%20Move%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/563087/Chesscom%20Complete%20Move%20Guide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[ChessHack] Starting Complete Move Guide...');

    let hackRunning = false;
    let globalDepth = 18;
    let engine = null;
    let checkInterval = null;
    let currentFen = '';
    let currentBestMove = '';

    function getFenString() {
        const chessboard = document.querySelector("wc-chess-board, chess-board");
        if (!chessboard) return null;

        let fen_string = "";

        for (let rank = 8; rank >= 1; rank--) {
            for (let file = 1; file <= 8; file++) {
                const square = `${file}${rank}`;

                if (file === 1 && rank !== 8) {
                    fen_string += "/";
                }

                const pieceElement = document.querySelector(`.piece.square-${square}`);
                let pieceCode = null;

                if (pieceElement) {
                    for (const className of pieceElement.classList) {
                        if (className.length === 2 && (className.startsWith('w') || className.startsWith('b'))) {
                            pieceCode = className;
                            break;
                        }
                    }
                }

                if (!pieceCode) {
                    const lastChar = fen_string.slice(-1);
                    if (!isNaN(lastChar) && lastChar !== '') {
                        fen_string = fen_string.slice(0, -1) + (parseInt(lastChar) + 1);
                    } else {
                        fen_string += "1";
                    }
                } else {
                    const color = pieceCode[0];
                    const piece = pieceCode[1];

                    if (color === 'b') {
                        fen_string += piece;
                    } else {
                        fen_string += piece.toUpperCase();
                    }
                }
            }
        }

        const isBlack = chessboard.classList.contains("flipped");
        const turn = isBlack ? 'b' : 'w';

        return `${fen_string} ${turn} KQkq - 0 1`;
    }

    function showCompleteMove(move) {
        if (!move || move.length < 4) return;

        clearAllHighlights();

        const fromSquare = move.substring(0, 2);
        const toSquare = move.substring(2, 4);

        console.log(`[ChessHack] Showing move: ${fromSquare} → ${toSquare}`);

        showFromSquare(fromSquare);
        showToSquare(toSquare);
        updateButtonText(fromSquare, toSquare);
    }

    function showFromSquare(square) {
        const fromHighlight = document.createElement("div");
        fromHighlight.className = `chesshack-from square-${square}`;
        fromHighlight.style.cssText = `
            position: absolute;
            background: rgba(255, 204, 0, 0.85);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            pointer-events: none;
            z-index: 10001;
            border: 2px solid #ff9900;
            transform: translate(-50%, -50%);
        `;

        positionHighlight(fromHighlight, square);
        document.body.appendChild(fromHighlight);

        const arrow = document.createElement("div");
        arrow.className = `chesshack-arrow-from square-${square}`;
        arrow.style.cssText = `
            position: absolute;
            color: #ff9900;
            font-size: 22px;
            font-weight: bold;
            pointer-events: none;
            z-index: 10002;
            transform: translate(-50%, -50%);
            font-family: 'Courier New', monospace;
        `;
        arrow.textContent = '↑';

        positionArrow(arrow, square);
        document.body.appendChild(arrow);
    }

    function showToSquare(square) {
        const toHighlight = document.createElement("div");
        toHighlight.className = `chesshack-to square-${square}`;
        toHighlight.style.cssText = `
            position: absolute;
            background: rgba(0, 150, 0, 0.9);
            border-radius: 50%;
            width: 44px;
            height: 44px;
            pointer-events: none;
            z-index: 10000;
            border: 2px solid #00cc00;
            transform: translate(-50%, -50%);
        `;

        positionHighlight(toHighlight, square);
        document.body.appendChild(toHighlight);

        const checkmark = document.createElement("div");
        checkmark.className = `chesshack-checkmark square-${square}`;
        checkmark.style.cssText = `
            position: absolute;
            color: white;
            font-size: 18px;
            font-weight: bold;
            pointer-events: none;
            z-index: 10003;
            transform: translate(-50%, -50%);
            font-family: Arial, sans-serif;
        `;
        checkmark.textContent = '✓';

        positionArrow(checkmark, square);
        document.body.appendChild(checkmark);
    }

    function positionHighlight(element, square) {
        try {
            const chessboard = document.querySelector("wc-chess-board, chess-board");
            if (!chessboard) return;

            const fileMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
            const fileChar = square[0];
            const rank = parseInt(square[1]) - 1;
            const file = fileMap[fileChar] || 0;

            const boardRect = chessboard.getBoundingClientRect();
            const squareSize = boardRect.width / 8;
            const isFlipped = chessboard.classList.contains("flipped");

            let left, top;

            if (isFlipped) {
                left = boardRect.left + (7 - file) * squareSize + squareSize / 2;
                top = boardRect.top + rank * squareSize + squareSize / 2;
            } else {
                left = boardRect.left + file * squareSize + squareSize / 2;
                top = boardRect.top + (7 - rank) * squareSize + squareSize / 2;
            }

            element.style.left = `${left}px`;
            element.style.top = `${top}px`;

        } catch (error) {
            console.error('[ChessHack] Error positioning highlight:', error);
        }
    }

    function positionArrow(element, square) {
        try {
            const chessboard = document.querySelector("wc-chess-board, chess-board");
            if (!chessboard) return;

            const fileMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
            const fileChar = square[0];
            const rank = parseInt(square[1]) - 1;
            const file = fileMap[fileChar] || 0;

            const boardRect = chessboard.getBoundingClientRect();
            const squareSize = boardRect.width / 8;
            const isFlipped = chessboard.classList.contains("flipped");

            let left, top;

            if (isFlipped) {
                left = boardRect.left + (7 - file) * squareSize + squareSize / 2;
                top = boardRect.top + rank * squareSize + squareSize / 2 - 25;
            } else {
                left = boardRect.left + file * squareSize + squareSize / 2;
                top = boardRect.top + (7 - rank) * squareSize + squareSize / 2 - 25;
            }

            element.style.left = `${left}px`;
            element.style.top = `${top}px`;

        } catch (error) {
            console.error('[ChessHack] Error positioning arrow:', error);
        }
    }

    function clearAllHighlights() {
        document.querySelectorAll('.chesshack-from, .chesshack-to, .chesshack-arrow-from, .chesshack-checkmark').forEach(el => el.remove());
    }

    function updateButtonText(fromSquare, toSquare) {
        const button = document.getElementById("chesshack-button");
        if (button) {
            const fromDisplay = fromSquare.toUpperCase();
            const toDisplay = toSquare.toUpperCase();
            button.querySelector('.move-text').textContent = `${fromDisplay} → ${toDisplay}`;
        }
    }

    function startEngine() {
        if (engine) {
            engine.terminate();
            engine = null;
        }

        try {
            engine = new Worker("/bundles/app/js/vendor/jschessengine/stockfish.asm.1abfa10c.js");

            engine.onmessage = function(event) {
                if (event.data.startsWith('bestmove')) {
                    const bestMove = event.data.split(' ')[1];
                    if (bestMove && bestMove !== '(none)') {
                        currentBestMove = bestMove;
                        console.log(`[ChessHack] Best move: ${bestMove}`);
                        showCompleteMove(bestMove);

                        const button = document.getElementById("chesshack-button");
                        if (button) {
                            button.querySelector('.status-text').textContent = 'SHOWING MOVE';
                        }
                    }
                }
            };

            const fen = getFenString();
            if (fen) {
                currentFen = fen;
                engine.postMessage(`position fen ${fen}`);
                engine.postMessage(`go depth ${globalDepth}`);

                const button = document.getElementById("chesshack-button");
                if (button) {
                    button.querySelector('.status-text').textContent = 'ANALYZING';
                    button.querySelector('.move-text').textContent = 'THINKING...';
                }
            }

            if (checkInterval) {
                clearInterval(checkInterval);
            }

            checkInterval = setInterval(() => {
                if (!hackRunning || !engine) return;

                const newFen = getFenString();
                if (newFen && newFen !== currentFen) {
                    currentFen = newFen;
                    engine.postMessage(`position fen ${currentFen}`);
                    engine.postMessage(`go depth ${globalDepth}`);

                    const button = document.getElementById("chesshack-button");
                    if (button) {
                        button.querySelector('.status-text').textContent = 'ANALYZING';
                        button.querySelector('.move-text').textContent = 'THINKING...';
                    }
                }
            }, 1000);

            console.log('[ChessHack] Engine started');
            return true;

        } catch (error) {
            console.error('[ChessHack] Engine error:', error);
            return false;
        }
    }

    function stopEngine() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }

        if (engine) {
            engine.terminate();
            engine = null;
        }

        clearAllHighlights();
        currentBestMove = '';
        currentFen = '';

        console.log('[ChessHack] Engine stopped');
    }

    function createUI() {
        const existingContainer = document.getElementById("chesshack-container");
        if (existingContainer) existingContainer.remove();

        if (!document.querySelector('#chesshack-styles')) {
            const styles = document.createElement('style');
            styles.id = 'chesshack-styles';
            styles.textContent = `
                #chesshack-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 99999;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    min-width: 220px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                #chesshack-button {
                    background: transparent;
                    border: none;
                    color: #333;
                    padding: 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    width: 100%;
                    text-align: center;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                #chesshack-button:hover {
                    background: #f5f5f5;
                }

                #chesshack-button.running {
                    background: #f0f9ff;
                }

                .status-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: center;
                }

                .status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #999;
                }

                #chesshack-button.running .status-dot {
                    background: #007bff;
                }

                .status-text {
                    font-weight: 600;
                    color: #666;
                    font-size: 13px;
                }

                #chesshack-button.running .status-text {
                    color: #007bff;
                }

                .move-text {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    border: 1px solid #e9ecef;
                    min-width: 120px;
                    font-family: 'Courier New', monospace;
                }

                .legend {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 8px;
                    font-size: 11px;
                    color: #666;
                    width: 100%;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .legend-from {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ffcc00;
                    border: 1px solid #ff9900;
                }

                .legend-to {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #009600;
                    border: 1px solid #00cc00;
                }

                #chesshack-depth-container {
                    margin-top: 15px;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }

                #chesshack-depth-label {
                    color: #555;
                    font-size: 12px;
                    margin-bottom: 8px;
                    text-align: center;
                    font-weight: 500;
                }

                #chesshack-depth {
                    width: 100%;
                    height: 6px;
                    -webkit-appearance: none;
                    background: #e9ecef;
                    border-radius: 3px;
                    outline: none;
                }

                #chesshack-depth::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #007bff;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                }

                .depth-value {
                    color: #555;
                    font-size: 12px;
                    text-align: center;
                    margin-top: 8px;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(styles);
        }

        const container = document.createElement('div');
        container.id = 'chesshack-container';

        const button = document.createElement('button');
        button.id = 'chesshack-button';
        button.innerHTML = `
            <div class="status-container">
                <div class="status-dot"></div>
                <div class="status-text">OFF</div>
            </div>
            <div class="move-text">CLICK TO START</div>
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-from"></div>
                    <span>FROM</span>
                </div>
                <div class="legend-item">
                    <div class="legend-to"></div>
                    <span>TO</span>
                </div>
            </div>
        `;

        button.addEventListener('click', function() {
            if (hackRunning) {
                hackRunning = false;
                stopEngine();
                button.classList.remove('running');
                button.querySelector('.status-text').textContent = 'OFF';
                button.querySelector('.move-text').textContent = 'CLICK TO START';
            } else {
                hackRunning = true;
                button.classList.add('running');
                button.querySelector('.status-text').textContent = 'ANALYZING';
                button.querySelector('.move-text').textContent = 'THINKING...';

                if (!startEngine()) {
                    hackRunning = false;
                    button.classList.remove('running');
                    button.querySelector('.status-text').textContent = 'ERROR';
                    button.querySelector('.move-text').textContent = 'TRY AGAIN';
                }
            }
        });

        container.appendChild(button);

        const depthContainer = document.createElement('div');
        depthContainer.id = 'chesshack-depth-container';

        const depthLabel = document.createElement('div');
        depthLabel.id = 'chesshack-depth-label';
        depthLabel.textContent = 'ANALYSIS STRENGTH';
        depthContainer.appendChild(depthLabel);

        const depthSlider = document.createElement('input');
        depthSlider.id = 'chesshack-depth';
        depthSlider.type = 'range';
        depthSlider.min = '1';
        depthSlider.max = '25';
        depthSlider.value = globalDepth;

        const depthValue = document.createElement('div');
        depthValue.className = 'depth-value';
        depthValue.textContent = `Depth: ${globalDepth}`;

        depthSlider.addEventListener('input', function() {
            globalDepth = parseInt(this.value);
            depthValue.textContent = `Depth: ${globalDepth}`;

            if (hackRunning) {
                stopEngine();
                setTimeout(() => {
                    hackRunning = true;
                    startEngine();
                }, 100);
            }
        });

        depthContainer.appendChild(depthSlider);
        depthContainer.appendChild(depthValue);
        container.appendChild(depthContainer);

        document.body.appendChild(container);

        console.log('[ChessHack] UI created');
    }

    function initialize() {
        console.log('[ChessHack] Initializing...');

        const checkForBoard = setInterval(() => {
            const chessboard = document.querySelector("wc-chess-board, chess-board");
            if (chessboard) {
                clearInterval(checkForBoard);
                console.log('[ChessHack] Chessboard found');
                createUI();
            }
        }, 500);

        const observer = new MutationObserver(() => {
            const chessboard = document.querySelector("wc-chess-board, chess-board");
            const container = document.getElementById("chesshack-container");
            if (chessboard && !container) {
                console.log('[ChessHack] New chessboard detected');
                createUI();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();