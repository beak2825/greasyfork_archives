// ==UserScript==
// @name         FV - Checkers Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Play checkers with Boe (random easy/medium/hard)! Game works on /villager/456129
// @match        https://www.furvilla.com/villager/456129
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558640/FV%20-%20Checkers%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558640/FV%20-%20Checkers%20Mini-game.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /***********************************
     * CONF
     ***********************************/
    const PURPLE_BUCKLER = "https://www.furvilla.com/img/items/3/3316-amethystine-buckler.png";
    const WHITE_BUCKLER = "https://www.furvilla.com/img/items/2/2343-flawless-steel-buckler.png";

    const LIGHT_COLOR = "#ffffff";
    const DARK_COLOR = "#b2afbb";

    const BOARD_SIZE = 8;
    const ANIMATION_TIME = 250;

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

    let boeTextElement;
    let arrowCanvas;

    // NEW
    let difficulty = "medium"; // easy, medium, hard

    /***********************************
     * HELPER
     ***********************************/
    function createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        for (const attr in attributes) element.setAttribute(attr, attributes[attr]);
        children.forEach(child => {
            element.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
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
     * NEW: Random Difficulty
     ***********************************/
    function chooseDifficulty() {
        const choices = ["easy", "medium", "hard"];
        difficulty = choices[Math.floor(Math.random() * choices.length)];

        if (difficulty === "easy")      boeSay("I forgot how to play...");
        if (difficulty === "medium")    boeSay("I think I got this!");
        if (difficulty === "hard")      boeSay("I've been practicing!");
    }

    /***********************************
     * LAYOUT
     ***********************************/
    function createLayout() {

        const wrapper = createElement("div", {
            id: "bucklerWrapper",
            style: `
                position: relative;
                font-family: 'Trebuchet MS', sans-serif;
                margin-top: 20px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
            `
        });

        // Inject
        if (!document.getElementById("bucklerStyle")) {
            const style = document.createElement("style");
            style.id = "bucklerStyle";
            style.textContent = `

        /* ---------- GAME BOX ---------- */
        #bucklerGameContainer {
            position: relative;
            width: 480px;
            height: 480px;
            background: #ffffff;
            padding: 15px;
            border-radius: 20px;
            border: 9px solid #e17632;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #bucklerBoardWrapper {
            position: relative;
            display: inline-block;
        }

        /* ---------- BOE ---------- */
        .boe-helper {
            position: absolute;
            right: -50px;
            bottom: 80px;
            width: 150px;
            pointer-events: none;
        }

        #boeTextBubble {
            position: absolute;
            right: -65px;
            bottom: 240px;
            background: #ffffff;
            padding: 8px 12px;
            border: 2px solid #e17632;
            border-radius: 6px;
            max-width: 160px;
            font-size: 14px;
            color: #111 !important;
        }

        @keyframes boeBounce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-12px); }
            60% { transform: translateY(0); }
        }
        .boe-bounce {
            animation: boeBounce 0.6s ease;
        }

        /* ---------- BUTTON BAR ---------- */
        #bucklerButtons {
            margin-top: 12px;
            display: flex;
            gap: 6px;
            justify-content: center;
        }

        #bucklerButtons .bucklerBtn {
            padding: 6px 14px;
            font-size: 15px;
            color: #111 !important;
            background: #f0f0f0 !important;
            border: 1px solid #aaa !important;
            border-radius: 6px;
            cursor: pointer;
        }

        #bucklerButtons .bucklerBtn:hover {
            background: #e0e0e0 !important;
        }

        `;
            document.head.appendChild(style);
        }

        // Main game container
        const gameContainer = createElement("div", { id: "bucklerGameContainer" });
        containerElement = gameContainer;

        const boardWrapper = createElement("div", { id: "bucklerBoardWrapper" });

        // Arrow Canvas
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

        boardWrapper.appendChild(arrowCanvas);
        gameContainer.appendChild(boardWrapper);

        // BOE
        const boeImg = createElement("img", {
            src: BOE_IMAGE,
            class: "boe-helper"
        });

        boeTextElement = createElement("div", { id: "boeTextBubble" }, ["Welcome to Buckler Checkers!"]);

        wrapper.appendChild(gameContainer);
        wrapper.appendChild(boeImg);
        wrapper.appendChild(boeTextElement);

        // BUTTON BAR
        const buttonBar = createElement("div", { id: "bucklerButtons" });
        buttonBar.innerHTML = `
            <button class="bucklerBtn" id="bucklerRestart">Restart</button>
            <button class="bucklerBtn" id="bucklerHelp">How to Play</button>
        `;
        wrapper.appendChild(buttonBar);

        return wrapper;
    }

    /***********************************
     * Boe
     ***********************************/
    function boeSay(text) {
        if (!boeTextElement) return;
        boeTextElement.innerText = text;

        const img = document.querySelector(".boe-helper");
        if (img) {
            img.classList.remove("boe-bounce");
            void img.offsetWidth;
            img.classList.add("boe-bounce");
        }
    }

    /***********************************
     * INITIALIZATION
     ***********************************/
    function initBoard() {
        board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));

        for (let row = 0; row < 3; row++)
            for (let col = 0; col < BOARD_SIZE; col++)
                if ((row + col) % 2 === 1)
                    board[row][col] = { player: "white", king: false };

        for (let row = BOARD_SIZE - 3; row < BOARD_SIZE; row++)
            for (let col = 0; col < BOARD_SIZE; col++)
                if ((row + col) % 2 === 1)
                    board[row][col] = { player: "purple", king: false };
    }

    /***********************************
     * MOVE GENERATION
     ***********************************/
    function getDirections(piece) {
        if (piece.king) return [[1,1],[1,-1],[-1,1],[-1,-1]];
        return piece.player === "purple"
            ? [[-1,1],[-1,-1]]
            : [[1,1],[1,-1]];
    }

    function getMoves(row, col, customBoard = board) {
        const piece = customBoard[row][col];
        if (!piece) return [];

        const moves = [];
        const jumps = [];

        for (const [dr, dc] of getDirections(piece)) {
            const r1 = row + dr, c1 = col + dc;
            const r2 = row + 2*dr, c2 = col + 2*dc;

            if (isInBounds(r1,c1) && !customBoard[r1][c1])
                moves.push({ row:r1, col:c1, jump:false });

            if (
                isInBounds(r2,c2) &&
                customBoard[r1][c1] &&
                customBoard[r1][c1].player !== piece.player &&
                !customBoard[r2][c2]
            ) {
                jumps.push({ row:r2, col:c2, jump:true, mid:{row:r1,col:c1} });
            }
        }

        return jumps.length ? jumps : moves;
    }

    function hasAnyJump(player, customBoard = board) {
        for (let r=0;r<BOARD_SIZE;r++)
            for (let c=0;c<BOARD_SIZE;c++)
                if (customBoard[r][c] &&
                    customBoard[r][c].player === player &&
                    getMoves(r,c,customBoard).some(m=>m.jump))
                    return true;
        return false;
    }

    /***********************************
     * APPLY MOVE
     ***********************************/
    function applyMove(rowFrom, colFrom, move, customBoard = board) {
        const piece = customBoard[rowFrom][colFrom];
        customBoard[rowFrom][colFrom] = null;
        customBoard[move.row][move.col] = piece;

        if (move.jump) customBoard[move.mid.row][move.mid.col] = null;

        if (piece.player === "purple" && move.row === 0) piece.king = true;
        if (piece.player === "white" && move.row === BOARD_SIZE - 1) piece.king = true;

        return move.jump && getMoves(move.row, move.col, customBoard).some(m => m.jump);
    }

    /***********************************
     * SUPPORT
     ***********************************/
    function cloneBoard(b) {
        return b.map(r => r.map(c => c ? {...c} : null));
    }

    function scoreMove(row, col, move, brd) {
        const t = cloneBoard(brd);
        applyMove(row,col,move,t);

        let score = 0;
        if (move.jump) score += 20;

        const piece = t[move.row][move.col];
        if (piece.king) score += 5;

        // Avoid being jumped next turn
        for (let r=0;r<BOARD_SIZE;r++)
            for (let c=0;c<BOARD_SIZE;c++) {
                const opp = t[r][c];
                if (!opp || opp.player !== "purple") continue;

                const jumps = getMoves(r,c,t).filter(m=>m.jump);
                jumps.forEach(j=>{
                    if (j.mid.row === move.row && j.mid.col === move.col)
                        score -= 20;
                });
            }

        return score;
    }

    // HARD MODE LOOKAHEAD
    function deepPredict(row, col, move) {
        const sim = cloneBoard(board);
        applyMove(row, col, move, sim);

        let bestPunish = 0;

        // Purple counter-move simulation
        for (let r = 0; r < BOARD_SIZE; r++)
            for (let c = 0; c < BOARD_SIZE; c++) {
                const p = sim[r][c];
                if (!p || p.player !== "purple") continue;
                const possible = getMoves(r, c, sim);
                possible.forEach(m => {
                    const score = scoreMove(r, c, m, sim);
                    if (score > bestPunish) bestPunish = score;
                });
            }

        return -bestPunish;
    }

    /***********************************
     * CPU MOVE (uses difficulty)
     ***********************************/
    function cpuMove() {
        const mustJump = hasAnyJump("white");

        // Gather
        const moves = [];
        for (let r = 0; r < BOARD_SIZE; r++)
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = board[r][c];
                if (!piece || piece.player !== "white") continue;

                let available = getMoves(r, c);
                if (mustJump) available = available.filter(m => m.jump);
                available.forEach(m => moves.push({ row: r, col: c, move: m }));
            }

        if (!moves.length) return;

        let chosen;

        // --- EASY ---
        if (difficulty === "easy") {
            chosen = moves[Math.floor(Math.random() * moves.length)];

        // --- MEDIUM ---
        } else if (difficulty === "medium") {
            chosen = moves
                .map(m => ({
                    ...m,
                    score: scoreMove(m.row, m.col, m.move, board)
                }))
                .reduce((a, b) => (a.score > b.score ? a : b));

        // --- HARD ---
        } else if (difficulty === "hard") {
            chosen = moves
                .map(m => ({
                    ...m,
                    score:
                        scoreMove(m.row, m.col, m.move, board) +
                        deepPredict(m.row, m.col, m.move)
                }))
                .reduce((a, b) => (a.score > b.score ? a : b));
        }

        // Delay for realism
        setTimeout(() => {
            animateMove(chosen.row, chosen.col, chosen.move, "white", () => {
                currentPlayer = "purple";
                boeSay("Woah! Your turn!");
            });
        }, 600 + Math.random() * 400);
    }

    /***********************************
     * ANIMATION
     ***********************************/
    function animateMove(rowFrom, colFrom, move, player, callback) {
        isAnimating = true;

        const start = getSquareElement(rowFrom,colFrom);
        const end = getSquareElement(move.row,move.col);
        if (!start) return;

        const pieceImg = start.querySelector("img");
        if (!pieceImg) return;

        const rectStart = pieceImg.getBoundingClientRect();
        const rectEnd = end.getBoundingClientRect();

        const clone = pieceImg.cloneNode(true);
        clone.style.position = "fixed";
        clone.style.left = rectStart.left+"px";
        clone.style.top = rectStart.top+"px";
        clone.style.width = "48px";
        clone.style.zIndex = "999";
        clone.style.transition = `all ${ANIMATION_TIME}ms ease`;
        document.body.appendChild(clone);

        setTimeout(()=>{
            clone.style.left = rectEnd.left+"px";
            clone.style.top = rectEnd.top+"px";
        },10);

        setTimeout(()=>{
            clone.remove();

            const more = applyMove(rowFrom,colFrom,move);
            drawBoard();

            if (move.jump) {
                const phrases = ["Boom!","Nice capture!","That’s one down!","Pow! Good hit!"];
                boeSay(phrases[Math.floor(Math.random()*phrases.length)]);
            }

            if (more) {
                const next = getMoves(move.row,move.col).find(m=>m.jump);
                animateMove(move.row,move.col,next,player,callback);
                return;
            }

            isAnimating = false;

            const winner = checkWin();
            if (winner) showOverlay(winner);
            else if (callback) callback();

        }, ANIMATION_TIME+30);
    }

    /***********************************
     * DRAW BOARD
     ***********************************/
    function drawBoard() {
        if (!containerElement) return;

        const old = boardElement;
        boardElement = createElement("div", {});
        const table = createElement("table", { style:"border-collapse: collapse;" });

        for (let r=0;r<BOARD_SIZE;r++) {
            const rowEl = createElement("tr");
            for (let c=0;c<BOARD_SIZE;c++) {
                const dark = (r+c)%2===1;
                const cellEl = createElement("td", {
                    "data-row":r,
                    "data-col":c,
                    style: `
                        width: 60px;
                        height: 60px;
                        background: ${dark ? DARK_COLOR : LIGHT_COLOR};
                        border: 1px solid #888;
                        text-align: center;
                        vertical-align: middle;
                        cursor: ${dark ? "pointer" : "default"};
                        position: relative;
                    `
                });

                if (dark) cellEl.onclick = ()=>handleClick(r,c);

                const piece = board[r][c];
                if (piece) {
                    const img = createElement("img", {
                        src: piece.player==="purple"?PURPLE_BUCKLER:WHITE_BUCKLER,
                        style: `width:48px;${piece.king ? "filter:drop-shadow(0 0 4px gold);" : ""}`
                    });
                    cellEl.appendChild(img);
                }

                rowEl.appendChild(cellEl);
            }
            table.appendChild(rowEl);
        }

        boardElement.appendChild(table);

        const target = document.querySelector("#bucklerBoardWrapper");
        if (target) {
            if (old && old.parentNode) old.parentNode.removeChild(old);
            target.appendChild(boardElement);
        }
    }

    /***********************************
     * WIN CHECK
     ***********************************/
    function checkWin() {
        const purpleMoves = countMoves("purple");
        const whiteMoves = countMoves("white");

        if (purpleMoves===0) return "white";
        if (whiteMoves===0) return "purple";
        return null;
    }

    function countMoves(player) {
        let count = 0;
        for (let r=0;r<BOARD_SIZE;r++)
            for (let c=0;c<BOARD_SIZE;c++)
                if (board[r][c] &&
                    board[r][c].player===player &&
                    getMoves(r,c).length>0) count++;
        return count;
    }

    function showOverlay(winner) {
        const overlay = createElement("div", {
            style: `
                position: absolute;
                top:0; left:0;
                width:100%; height:100%;
                background: rgba(0,0,0,0.6);
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                z-index:50;
            `
        });

        overlay.appendChild(createElement("div", {
            style: "color:white;font-size:48px;font-weight:bold;margin-bottom:20px;"
        }, [winner==="purple" ? "YOU WIN!" : "YOU LOSE!"]));

        const btn = createElement("button", {
            style:"font-size:20px;padding:10px 20px;border-radius:10px;cursor:pointer;"
        }, ["Play Again"]);


        btn.onclick = ()=>{
            initBoard();
            chooseDifficulty();
            currentPlayer="purple";
            drawBoard();
            overlay.remove();
        };

        overlay.appendChild(btn);
        boardElement.appendChild(overlay);
    }

    /***********************************
     * CLICK HANDLING
     ***********************************/
    function handleClick(row, col) {
        if (isAnimating) return;
        if (currentPlayer!=="purple") return;

        const piece = board[row][col];

        if (piece && piece.player==="purple") {
            selectedPiece = {row,col};
            drawBoard();
            highlightSelected(row,col);
            return;
        }

        if (!selectedPiece) return;

        const moves = getMoves(selectedPiece.row, selectedPiece.col);
        const chosen = moves.find(m=>m.row===row && m.col===col);

        if (!chosen) return;

        const mustJump = hasAnyJump("purple");
        if (mustJump && !chosen.jump) return;

        animateMove(selectedPiece.row,selectedPiece.col,chosen,"purple",()=>{
            selectedPiece = null;
            currentPlayer = "white";
            setTimeout(cpuMove, 300);
        });
    }

    function highlightSelected(row, col) {
        drawBoard();
        const piece = board[row][col];
        if (!piece || piece.player!==currentPlayer) return;

        const moves = getMoves(row,col);

        moves.forEach(m=>{
            const sq = getSquareElement(m.row,m.col);
            if (sq) sq.style.boxShadow = m.jump ?
                "0 0 10px 3px #ff6666 inset" :
                "0 0 10px 3px #66ccff inset";
        });

        const sel = getSquareElement(row,col);
        if (sel) sel.style.outline = "3px solid red";

        drawArrows(row,col,moves);
    }

    function drawArrows(row, col, moves) {
        const ctx = arrowCanvas.getContext("2d");
        ctx.clearRect(0,0,arrowCanvas.width,arrowCanvas.height);

        const startX = col*60+30;
        const startY = row*60+30;

        moves.forEach(m=>{
            const endX = m.col*60+30;
            const endY = m.row*60+30;

            ctx.beginPath();
            ctx.moveTo(startX,startY);
            ctx.lineTo(endX,endY);
            ctx.strokeStyle = m.jump ? "#ff4444" : "#4488ff";
            ctx.lineWidth = 3;
            ctx.setLineDash([5,5]);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(endX,endY,6,0,Math.PI*2);
            ctx.fillStyle = m.jump ? "#ff4444" : "#4488ff";
            ctx.fill();
        });
    }

    /***********************************
     * START + BUTTON HOOKS
     ***********************************/
    function startGame() {
        const target = document.querySelector(".villager-data-desc .profanity-filter");
        if (!target) return;

        target.innerHTML = "";
        const layout = createLayout();
        target.appendChild(layout);

        initBoard();
        chooseDifficulty();  // NEW
        currentPlayer = "purple";
        drawBoard();

        hookButtons();
    }

    // Button logic
    function hookButtons() {
        const restartBtn = document.getElementById("bucklerRestart");
        const helpBtn = document.getElementById("bucklerHelp");

        if (!restartBtn || !helpBtn) {
            setTimeout(hookButtons,200);
            return;
        }

        restartBtn.onclick = () => {
            initBoard();
            chooseDifficulty();
            currentPlayer = "purple";
            drawBoard();
        };

        helpBtn.onclick = () => {
            boeSay("Move diagonally on the colored squares! Jump to capture. Kings can move backwards!");
        };
    }

    function waitForTarget() {
        if (document.querySelector(".villager-data-desc .profanity-filter")) startGame();
        else setTimeout(waitForTarget, 400);
    }

    waitForTarget();

})();
