// ==UserScript==
// @name         FV - Piper's Minesweeper Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Play minesweeper with Piper! Game works on /villager/456130
// @match        https://www.furvilla.com/villager/456130
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558641/FV%20-%20Piper%27s%20Minesweeper%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558641/FV%20-%20Piper%27s%20Minesweeper%20Mini-game.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /* ======================================================================
       Target 
    ====================================================================== */

    let target = null;
    document.querySelectorAll(".profanity-filter").forEach((div) => {
        if (div.textContent.includes("testGameHere")) target = div;
    });
    if (!target) return;
    target.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.id = "msWrapper";

    /* ======================================================================
       Injection
    ====================================================================== */

    wrapper.innerHTML = `
<style>
/* --------------------------------------------------
   Layout
-------------------------------------------------- */
#msWrapper {
    font-family: 'Trebuchet MS', sans-serif;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    position: relative;
}

#msContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

#msBoardContainer {
    background: #ffffff;
    border: 4px solid #ff99cc;
    border-radius: 8px;
    padding: 12px;
}

#msBoard {
    display: grid;
    gap: 2px;
    justify-content: center;
    margin-bottom: 10px;
}

/* --------------------------------------------------
   Cell
-------------------------------------------------- */
.ms-cell {
    background: #7b7b7b;
    border: 2px solid #4a4a4a;
    font-weight: bold;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}

.ms-cell.revealed {
    background: #c0c0c0;
    cursor: default;
}

/* Number colors */
.ms-cell.num1 { color: blue; }
.ms-cell.num2 { color: green; }
.ms-cell.num3 { color: red; }
.ms-cell.num4 { color: navy; }
.ms-cell.num5 { color: maroon; }
.ms-cell.num6 { color: turquoise; }
.ms-cell.num7 { color: black; }
.ms-cell.num8 { color: gray; }

/* --------------------------------------------------
   Flag
-------------------------------------------------- */
.ms-flag {
    font-size: 21px !important;
    text-shadow:
        -2px -2px 0 #fff,
         2px -2px 0 #fff,
        -2px  2px 0 #fff,
         2px  2px 0 #fff,
         0px  0px 1px rgba(255,255,255,0.5);
}

/* --------------------------------------------------
   Mascot & Chat
-------------------------------------------------- */
#msMascot {
    position: absolute;
    right: -20px;
    bottom: 80px;
    width: 110px;
}

#msChat {
    position: absolute;
    right: -40px;
    bottom: 200px;
    background: #ffffff;
    padding: 8px 12px;
    border: 2px solid #ff99cc;
    border-radius: 6px;
    max-width: 160px;
    font-size: 14px;
    color: #111 !important;
    pointer-events: none;
    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
}

/* --------------------------------------------------
   Controls
-------------------------------------------------- */
#msControls {
    margin-top: 10px;
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
}

#msControls button, #msControls select {
    color: #111 !important;
    background: #f0f0f0 !important;
    border: 1px solid #aaa;
    cursor: pointer;
    padding: 5px 8px;
    border-radius: 4px;
}

#msControls button:hover,
#msControls select:hover {
    background: #e0e0e0 !important;
}

/* --------------------------------------------------
   Stats
-------------------------------------------------- */
#msStats {
    margin-top: 6px;
    display: flex;
    gap: 12px;
    justify-content: center;
    font-family: monospace;
    font-size: 16px;
}
</style>

<div id="msContainer">
    <div id="msBoardContainer">
        <div id="msBoard"></div>
    </div>

    <div id="msControls">
        <select id="msDiff">
            <option value="easy">Easy (8×8, 10 mines)</option>
            <option value="medium">Medium (12×12, 20 mines)</option>
            <option value="expert">Expert (16×16, 40 mines)</option>
        </select>
        <button id="msStart">Start</button>
        <button id="msReset">Reset</button>
        <button id="toggleFlag">Flag Mode: OFF</button>
        <button id="msHelp">How to Play?</button>
    </div>

    <div id="msStats">
        <span>Time: <span id="msTimer">0</span></span>
        <span>Flags: <span id="msFlagCount">0</span></span>
    </div>

    <img id="msMascot" src="https://www.furvilla.com/img/villagers/0/426-4.png">
    <div id="msChat">Piper: Ready to play Minesweeper!</div>
</div>
`;

    target.appendChild(wrapper);

    /* ======================================================================
       Global
    ====================================================================== */
    let flagMode = false;
    let boardData = [];
    let timerInterval = null;
    let gameOver = false;
    const diffSelect = document.getElementById("msDiff");

    /* ======================================================================
       Helper
    ====================================================================== */
    let chatHideTimer = null;
    function showChat(msg) {
        const chat = document.getElementById("msChat");
        chat.textContent = "Piper: " + msg;
        chat.style.opacity = 1;
        clearTimeout(chatHideTimer);
        chatHideTimer = setTimeout(() => { chat.style.opacity = 0; }, 3000);
    }

    /* ======================================================================
       Timer
    ====================================================================== */
    function startTimer() {
        let time = 0;
        clearInterval(timerInterval);
        document.getElementById("msTimer").textContent = time;
        timerInterval = setInterval(() => {
            if (gameOver) return;
            time++;
            document.getElementById("msTimer").textContent = time;
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timerInterval);
        document.getElementById("msTimer").textContent = "0";
    }

    /* ======================================================================
       Difficulty
    ====================================================================== */
    function getBoardSettings(diff) {
        return {
            easy:   { rows: 8,  cols: 8,  mines: 10, cellSize: 30 },
            medium: { rows: 12, cols: 12, mines: 20, cellSize: 26 },
            expert: { rows: 16, cols: 16, mines: 40, cellSize: 20 },
        }[diff];
    }

    /* ======================================================================
       Mine Placement
    ====================================================================== */
    function placeMines(rows, cols, mines) {
        const total = rows * cols;
        const indices = Array.from({ length: total }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return new Set(indices.slice(0, mines));
    }

    /* ======================================================================
       Count Mines
    ====================================================================== */
    function countAdjacent(r, c, rows, cols, board) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) count++;
            }
        }
        return count;
    }

    /* ======================================================================
      Flag Counter
    ====================================================================== */
    function updateCounters() {
        let totalFlags = 0;
        for (let r = 0; r < boardData.length; r++) {
            for (let c = 0; c < boardData[0].length; c++) {
                if (boardData[r][c].flagged) totalFlags++;
            }
        }
        document.getElementById("msFlagCount").textContent = totalFlags;
    }

    /* ======================================================================
       Cell Logic
    ====================================================================== */
    function revealCell(r, c, el) {
        if (gameOver) return;
        const cell = boardData[r][c];
        if (cell.revealed) return;

        if (flagMode) {
            cell.flagged = !cell.flagged;
            if (cell.flagged) {
                el.textContent = "🚩";
                el.classList.add("ms-flag");
            } else {
                el.textContent = "";
                el.classList.remove("ms-flag");
            }
            updateCounters();
            return;
        }

        cell.revealed = true;
        el.classList.add("revealed");

        if (cell.mine) {
            el.textContent = "💣";
            showChat("Boom! You hit a mine! Game over!");
            gameOver = true;
            revealAllMines();
            return;
        }

        if (cell.adjacent > 0) {
            el.textContent = cell.adjacent;
            el.classList.add(`num${cell.adjacent}`);
        } else {
            const rows = boardData.length;
            const cols = boardData[0].length;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        revealCell(
                            nr, nc,
                            document.querySelector(`.ms-cell[data-row='${nr}'][data-col='${nc}']`)
                        );
                    }
                }
            }
        }
        checkWin();
    }

    function revealAllMines() {
        for (let r = 0; r < boardData.length; r++) {
            for (let c = 0; c < boardData[0].length; c++) {
                if (boardData[r][c].mine) {
                    const el = document.querySelector(`.ms-cell[data-row='${r}'][data-col='${c}']`);
                    el.textContent = "💣";
                }
            }
        }
    }

    function checkWin() {
        for (const row of boardData) {
            for (const cell of row) {
                if (!cell.mine && !cell.revealed) return;
            }
        }
        gameOver = true;
        showChat("You did it! You cleared all the mines!");
        revealAllMines();
    }

    /* ======================================================================
       Build Board
    ====================================================================== */
    function buildBoard(difficulty) {
        const { rows, cols, mines, cellSize } = getBoardSettings(difficulty);
        const board = document.getElementById("msBoard");
        board.innerHTML = "";
        board.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
        board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

        boardData = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({
                mine: false,
                flagged: false,
                revealed: false,
                adjacent: 0,
            }))
        );

        const mineSet = placeMines(rows, cols, mines);
        let index = 0;
        gameOver = false;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement("div");
                cell.className = "ms-cell";
                cell.style.width = cell.style.height = cellSize + "px";
                cell.dataset.row = r;
                cell.dataset.col = c;
                if (mineSet.has(index)) boardData[r][c].mine = true;
                index++;
                board.appendChild(cell);
                cell.addEventListener("click", () => revealCell(r, c, cell));
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                boardData[r][c].adjacent = countAdjacent(r, c, rows, cols, boardData);
            }
        }

        resetTimer();
        updateCounters();
    }

    /* ======================================================================
       Start Game
    ====================================================================== */
    function startGame() {
        buildBoard(diffSelect.value);
        startTimer();
        flagMode = false;
        document.getElementById("toggleFlag").textContent = "Flag Mode: OFF";
        showChat("Good luck!");
    }

    /* ======================================================================
       Buttons
    ====================================================================== */
    document.getElementById("msStart").onclick = startGame;
    document.getElementById("msReset").onclick = startGame;

    document.getElementById("toggleFlag").onclick = () => {
        flagMode = !flagMode;
        document.getElementById("toggleFlag").textContent =
            `Flag Mode: ${flagMode ? "ON" : "OFF"}`;
        showChat(flagMode ? "Flagging enabled!" : "Flagging disabled!");
    };

    document.getElementById("msHelp").onclick = () => {
        showChat("Click cells to reveal them. Use Flag Mode ON to mark mines. Clear all safe cells to win!");
    };

    /* ======================================================================
       Start
    ====================================================================== */
    diffSelect.value = "easy";
    startGame();

})();
