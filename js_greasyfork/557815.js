// ==UserScript==
// @name         FV - Buckler Checkers Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      16.0
// @description  Play a friendly game of checkers against Boe!
// @match        https://www.furvilla.com/villager/456025
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557815/FV%20-%20Buckler%20Checkers%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/557815/FV%20-%20Buckler%20Checkers%20Mini-game.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /***********************************
     * CONF
     ***********************************/
    const PURPLE_BUCKLER = "https://www.furvilla.com/img/items/3/3316-amethystine-buckler.png";
    const WHITE_BUCKLER = "https://www.furvilla.com/img/items/2/2343-flawless-steel-buckler.png";

    const LIGHT_COLOR = "#ffffff";
    const DARK_COLOR = "#e8d4ff";

    const BOARD_SIZE = 8;
    const ANIMATION_TIME = 250; // ms

    const BOE_IMAGE = "https://www.furvilla.com/img/villagers/0/285-4.png";

    /***********************************
     * GAME STATE
     ***********************************/
    let board = [];
    let containerElement;
    let boardElement;
    let selectedPiece = null;
    let currentPlayer = null;
    let isAnimating = false;

    let boeElement, boeTextElement;
    let arrowCanvas;

    let movePreviewsEnabled = true;

    /***********************************
     * HELPER FUNC
     ***********************************/
    function createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        for (const attr in attributes) {
            element.setAttribute(attr, attributes[attr]);
        }

        children.forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    function isInBounds(row, col) {
        return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
    }

    function getSquareElement(row, col) {
        return document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    }

    /***********************************
     * BOE
     ***********************************/
    function createLayout() {
        // Container
        containerElement = createElement("div", {
            style: `
                position: relative;
                width: 560px;
                margin: 0 auto;
                padding: 15px 0;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
            `
        });

        // Highlighting moves
        arrowCanvas = createElement("canvas", {
            width: BOARD_SIZE * 60,
            height: BOARD_SIZE * 60,
            style: `
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 5;
            `
        });
        containerElement.appendChild(arrowCanvas);

        // Boe
        boeElement = createElement("div", {
            style: `
                margin-left: 20px;
                position: relative;
                width: 140px;
                text-align: center;
                font-family: sans-serif;
            `
        });

        const boeImg = createElement("img", {
            src: BOE_IMAGE,
            style: `
                width: 100px;
                transition: transform 0.2s ease;
                display: block;
                margin: 0 auto;
            `
        });

        boeTextElement = createElement("div", {
            style: `
                margin-top: 6px;
                background: white;
                border: 2px solid #ccc;
                border-radius: 10px;
                padding: 6px 8px;
                font-size: 12px;
                line-height: 14px;
                color: #333;
                min-height: 28px;
            `
        }, ["Welcome to Buckler Checkers!"]);

        boeElement.appendChild(boeImg);
        boeElement.appendChild(boeTextElement);
        containerElement.appendChild(boeElement);

        return containerElement;
    }

    function boeSay(text) {
        if (!boeTextElement) return;

        boeTextElement.innerText = text;

        const img = boeElement.querySelector("img");
        if (img) {
            img.style.transform = "translateY(-5px)";
            setTimeout(() => {
                img.style.transform = "";
            }, 300);
        }
    }

    /***********************************
     * BOARD INITIALIZATION
     ***********************************/
    function initBoard() {
        board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

        // Place white pieces (top)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { player: "white", king: false };
                }
            }
        }

        // Place purple pieces (bottom)
        for (let row = BOARD_SIZE - 3; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { player: "purple", king: false };
                }
            }
        }
    }

    /***********************************
     * MOVE GENERATION
     ***********************************/
    function getDirections(piece) {
        if (piece.king) {
            return [
                [1, 1], [1, -1],
                [-1, 1], [-1, -1]
            ];
        }
        return piece.player === "purple"
            ? [[-1, 1], [-1, -1]]
            : [[1, 1], [1, -1]];
    }

    function getMoves(row, col, customBoard = board) {
        const piece = customBoard[row][col];
        if (!piece) return [];

        const moves = [];
        const jumps = [];

        for (const [dr, dc] of getDirections(piece)) {
            const r1 = row + dr;
            const c1 = col + dc;
            const r2 = row + 2 * dr;
            const c2 = col + 2 * dc;

            // Normal move
            if (isInBounds(r1, c1) && !customBoard[r1][c1]) {
                moves.push({ row: r1, col: c1, jump: false });
            }

            // Jump/capture
            if (
                isInBounds(r2, c2) &&
                customBoard[r1][c1] &&
                customBoard[r1][c1].player !== piece.player &&
                !customBoard[r2][c2]
            ) {
                jumps.push({ row: r2, col: c2, jump: true, mid: { row: r1, col: c1 } });
            }
        }

        return jumps.length ? jumps : moves;
    }

    function hasAnyJump(player, customBoard = board) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const p = customBoard[r][c];
                if (p && p.player === player && getMoves(r, c, customBoard).some(m => m.jump)) {
                    return true;
                }
            }
        }
        return false;
    }

    /***********************************
     * MOVE RUN
     ***********************************/
    function applyMove(rowFrom, colFrom, move, customBoard = board) {
        const piece = customBoard[rowFrom][colFrom];
        customBoard[rowFrom][colFrom] = null;
        customBoard[move.row][move.col] = piece;

        if (move.jump) {
            customBoard[move.mid.row][move.mid.col] = null;
        }

        // Kinging
        if (piece.player === "purple" && move.row === 0) piece.king = true;
        if (piece.player === "white" && move.row === BOARD_SIZE - 1) piece.king = true;

        // Return if more jumps available for same piece
        return move.jump && getMoves(move.row, move.col, customBoard).some(m => m.jump);
    }

    /***********************************
     * CPU BRAIN
     ***********************************/
    function cloneBoard(brd) {
        return brd.map(row => row.map(cell => (cell ? { ...cell } : null)));
    }

    function scoreMove(row, col, move, brd) {
        const tempBoard = cloneBoard(brd);
        applyMove(row, col, move, tempBoard);

        let score = 0;
        if (move.jump) score += 20;

        const piece = tempBoard[move.row][move.col];
        if (piece.king) score += 5;

        // Penalize if piece can be captured next turn
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const opp = tempBoard[r][c];
                if (!opp || opp.player !== "purple") continue;

                const oppJumps = getMoves(r, c, tempBoard).filter(m => m.jump);
                oppJumps.forEach(j => {
                    if (j.mid.row === move.row && j.mid.col === move.col) score -= 20;
                });
            }
        }

        // Assume player captures optimally / capture move
        let worstResponse = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const opp = tempBoard[r][c];
                if (!opp || opp.player !== "purple") continue;

                const oppJumps = getMoves(r, c, tempBoard).filter(m => m.jump);
                worstResponse += oppJumps.length * 15;
            }
        }

        return score - worstResponse;
    }

    function cpuMove() {
        boeSay("Nice one! Let me think...");

        const moves = [];
        const mustJump = hasAnyJump("white");

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const p = board[r][c];
                if (!p || p.player !== "white") continue;

                let availableMoves = getMoves(r, c);
                if (mustJump) availableMoves = availableMoves.filter(m => m.jump);

                availableMoves.forEach(m => {
                    moves.push({ row: r, col: c, move: m, score: scoreMove(r, c, m, board) });
                });
            }
        }

        if (moves.length === 0) return;

        const maxScore = Math.max(...moves.map(m => m.score));
        const bestMoves = moves.filter(m => m.score === maxScore);

        const choice = bestMoves[Math.floor(Math.random() * bestMoves.length)];

        setTimeout(() => {
            animateMove(choice.row, choice.col, choice.move, "white", () => {
                currentPlayer = "purple";
                boeSay("Woah! Your turn!");
            });
        }, 600 + Math.random() * 400);
    }

    /***********************************
     * ANIM AND UI
     ***********************************/
    function animateMove(rowFrom, colFrom, move, player, callback) {
        isAnimating = true;

        const startSquare = getSquareElement(rowFrom, colFrom);
        const endSquare = getSquareElement(move.row, move.col);

        if (!startSquare) return;

        const pieceImg = startSquare.querySelector("img");
        if (!pieceImg) return;

        const rectStart = pieceImg.getBoundingClientRect();
        const rectEnd = endSquare.getBoundingClientRect();

        const clone = pieceImg.cloneNode(true);
        clone.style.position = "fixed";
        clone.style.left = rectStart.left + "px";
        clone.style.top = rectStart.top + "px";
        clone.style.width = "48px";
        clone.style.zIndex = "999";
        clone.style.transition = `all ${ANIMATION_TIME}ms ease`;

        document.body.appendChild(clone);

        // Start anim
        setTimeout(() => {
            clone.style.left = rectEnd.left + "px";
            clone.style.top = rectEnd.top + "px";
        }, 10);

        setTimeout(() => {
            clone.remove();

            const moreJumps = applyMove(rowFrom, colFrom, move);
            drawBoard();

            if (move.jump) {
                const phrases = ["Boom! Gotcha!", "Nice capture!", "That’s one down!", "Pow! Good hit!"];
                boeSay(phrases[Math.floor(Math.random() * phrases.length)]);
            }

            if (moreJumps) {
                const nextMove = getMoves(move.row, move.col).find(m => m.jump);
                animateMove(move.row, move.col, nextMove, player, callback);
                return;
            }

            isAnimating = false;

            const winner = checkWin();
            if (winner) showOverlay(winner);
            else if (callback) callback();

        }, ANIMATION_TIME + 30);
    }

    /***********************************
     * DRAW BOARD
     ***********************************/
    function drawBoard() {
        if (!containerElement) containerElement = createLayout();

        if (boardElement && boardElement.parentNode === containerElement) {
            containerElement.removeChild(boardElement);
        }

        boardElement = createElement("div", { style: "position: relative; display: inline-block;" });

        const table = createElement("table", { style: "border-collapse: collapse;" });

        for (let r = 0; r < BOARD_SIZE; r++) {
            const rowEl = createElement("tr");

            for (let c = 0; c < BOARD_SIZE; c++) {
                const darkSquare = (r + c) % 2 === 1;

                const cellEl = createElement("td", {
                    "data-row": r,
                    "data-col": c,
                    style: `
                        width: 60px;
                        height: 60px;
                        background: ${darkSquare ? DARK_COLOR : LIGHT_COLOR};
                        border: 1px solid #888;
                        text-align: center;
                        vertical-align: middle;
                        cursor: ${darkSquare ? "pointer" : "default"};
                        position: relative;
                    `
                });

                if (darkSquare) cellEl.onclick = () => handleClick(r, c);

                const piece = board[r][c];
                if (piece) {
                    const img = createElement("img", {
                        src: piece.player === "purple" ? PURPLE_BUCKLER : WHITE_BUCKLER,
                        style: `width:48px;${piece.king ? "filter:drop-shadow(0 0 4px gold);" : ""}`
                    });
                    cellEl.appendChild(img);
                }

                rowEl.appendChild(cellEl);
            }

            table.appendChild(rowEl);
        }

        boardElement.appendChild(table);
        containerElement.appendChild(boardElement);
    }

    /***********************************
     * GAME LOGIC
     ***********************************/
    function checkWin() {
        const purpleMoves = countMoves("purple");
        const whiteMoves = countMoves("white");

        if (purpleMoves === 0) return "white";
        if (whiteMoves === 0) return "purple";

        return null;
    }

    function countMoves(player) {
        let count = 0;

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = board[r][c];
                if (piece && piece.player === player && getMoves(r, c).length > 0) {
                    count++;
                }
            }
        }

        return count;
    }

    function showOverlay(winner) {
        const overlay = createElement("div", {
            style: `
                position: absolute;
                top:0; left:0;
                width:100%; height:100%;
                background: rgba(0,0,0,0.6);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 50;
            `
        });

        overlay.appendChild(createElement("div", {
            style: "color:white;font-size:48px;font-weight:bold;margin-bottom:20px;"
        }, [winner === "purple" ? "YOU WIN!" : "YOU LOSE!"]));

        const btn = createElement("button", {
            style: "font-size:20px;padding:10px 20px;border-radius:10px;cursor:pointer;"
        }, ["Play Again"]);

        btn.onclick = () => {
            initBoard();
            currentPlayer = "purple";
            drawBoard();
            boeSay("Your turn!");
            overlay.remove();
        };

        overlay.appendChild(btn);
        boardElement.appendChild(overlay);
    }

    /***********************************
     * CLICK
     ***********************************/
    function handleClick(row, col) {
        if (isAnimating) return;
        if (currentPlayer !== "purple") return;

        const piece = board[row][col];

        if (piece && piece.player === "purple") {
            selectedPiece = { row, col };
            drawBoard();
            highlightSelected(row, col);
            return;
        }

        if (!selectedPiece) return;

        const moves = getMoves(selectedPiece.row, selectedPiece.col);
        const chosenMove = moves.find(m => m.row === row && m.col === col);

        if (!chosenMove) return;

        const mustJump = hasAnyJump("purple");
        if (mustJump && !moves.some(m => m.jump)) return;
        if (mustJump && !chosenMove.jump) return;

        animateMove(selectedPiece.row, selectedPiece.col, chosenMove, "purple", () => {
            selectedPiece = null;
            currentPlayer = "white";
            setTimeout(cpuMove, 300);
        });
    }

    function highlightSelected(row, col) {
        drawBoard();
        const piece = board[row][col];
        if (!piece || piece.player !== currentPlayer) return;

        const moves = getMoves(row, col);

        moves.forEach(m => {
            const sq = getSquareElement(m.row, m.col);
            if (!sq) return;

            if (m.jump) sq.style.boxShadow = "0 0 10px 3px #ff6666 inset";
            else sq.style.boxShadow = "0 0 10px 3px #66ccff inset";
        });

        const sel = getSquareElement(row, col);
        if (sel) sel.style.outline = "3px solid red";

        drawArrows(row, col, moves);
    }

    function drawArrows(row, col, moves) {
        const ctx = arrowCanvas.getContext("2d");
        ctx.clearRect(0, 0, arrowCanvas.width, arrowCanvas.height);

        const startX = col * 60 + 30;
        const startY = row * 60 + 30;

        moves.forEach(m => {
            const endX = m.col * 60 + 30;
            const endY = m.row * 60 + 30;

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = m.jump ? "#ff4444" : "#4488ff";
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(endX, endY, 6, 0, Math.PI * 2);
            ctx.fillStyle = m.jump ? "#ff4444" : "#4488ff";
            ctx.fill();
        });
    }

    /***********************************
     * START
     ***********************************/
    function startGame() {
        const target = document.querySelector(".villager-data-desc .profanity-filter");
        if (!target) return;

        target.innerHTML = "";
        containerElement = createLayout();
        target.appendChild(containerElement);

        initBoard();
        currentPlayer = "purple";
        drawBoard();

        boeSay("Your turn! Make a move.");
    }

    function waitForTarget() {
        if (document.querySelector(".villager-data-desc .profanity-filter")) {
            startGame();
        } else {
            setTimeout(waitForTarget, 400);
        }
    }

    waitForTarget();

})();