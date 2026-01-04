// ==UserScript==
// @name         FV - Sudoku Mini-game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Play a relaxing game of sudoku with Flow! Game works on /villager/455906
// @author       necroam
// @match        https://www.furvilla.com/villager/455906
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558537/FV%20-%20Sudoku%20Mini-game.user.js
// @updateURL https://update.greasyfork.org/scripts/558537/FV%20-%20Sudoku%20Mini-game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************************************
     * testGameHere
     ********************************************/
    let target = null;

    document.querySelectorAll(".profanity-filter").forEach(div => {
        if (div.textContent.includes("testGameHere")) {
            target = div;
        }
    });

    if (!target) {
        console.log("Flow Sudoku: Could not find testGameHere div.");
        return;
    }

    target.innerHTML = ""; // clear it


    /********************************************
     * CREATE WRAPPER
     ********************************************/
    const wrapper = document.createElement("div");
    wrapper.id = "flowSudokuWrapper";

    wrapper.innerHTML = `
<style>

    /* ---------- LAYOUT ---------- */
    #flowSudokuWrapper {
        position: relative;
        font-family: 'Trebuchet MS', sans-serif;
        margin-top: 20px;
    }

    #sudokuContainer {
        position: relative;
        width: 360px;
        height: 360px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #ffffff;
        padding: 15px;
        border-radius: 8px;
        border: 4px solid #1a75ff;
    }

    #sudokuGrid {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        grid-template-rows: repeat(9, 1fr);
        width: 100%;
        height: 100%;
        border: 4px solid black; /* thick outer */
    }

    .sudoku-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        border: 1px solid #aaa;
        cursor: pointer;
        user-select: none;
        background: #fdfdfd;
        font-weight: bold;
        color: #111 !important;
    }

    /* THICK 3x3 lines */
    .thick-top    { border-top:    3px solid black !important; }
    .thick-bottom { border-bottom: 3px solid black !important; }
    .thick-left   { border-left:   3px solid black !important; }
    .thick-right  { border-right:  3px solid black !important; }

    .fixed {
        background: #dceaff;
        color: #111 !important;
        font-weight: 900;
    }

    .selected {
        background: #ffe9b5 !important;
        color: #111 !important;
    }

    .note {
        color: red;
        font-size: 14px;
        font-weight: normal;
    }

    .flow-helper {
        position: absolute;
        right: -170px;
        bottom: -70px;
        width: 150px;
        pointer-events: none;
    }

    .flow-text {
        position: absolute;
        right: -180px;
        bottom: 110px;
        background: #ffffff;
        padding: 8px 12px;
        border: 2px solid #4aa1ff;
        border-radius: 6px;
        max-width: 160px;
        font-size: 14px;
        color: #111 !important;
    }

    @keyframes flowBounce {
        0% { transform: translateY(0); }
        30% { transform: translateY(-12px); }
        60% { transform: translateY(0); }
    }
    .flow-bounce {
        animation: flowBounce 0.6s ease;
    }

    /* Number bar */
    #numberBar {
        margin-top: 15px;
        display: flex;
        gap: 5px;
        justify-content: center;
    }
    #numberBar button {
        width: 30px;
        height: 30px;
        font-size: 18px;
        border-radius: 5px;
        color: #111 !important;
        background: #f0f0f0 !important;
        border: 1px solid #aaa !important;
        cursor: pointer;
    }
    #numberBar button:hover {
        background: #e0e0e0 !important;
    }

    /* Buttons */
    #sudokuButtons {
        margin-top: 10px;
        display: flex;
        gap: 6px;
        justify-content: center;
    }
    #sudokuButtons button {
        padding: 5px 10px;
        color: #111 !important;
        background: #f0f0f0 !important;
        border: 1px solid #aaa !important;
        cursor: pointer;
    }
    #sudokuButtons button:hover {
        background: #e0e0e0 !important;
    }

</style>

        <div id="sudokuContainer">
            <div id="sudokuGrid"></div>

            <img class="flow-helper"
                src="https://www.furvilla.com/img/villagers/0/692-4.png">

            <div class="flow-text" id="flowText">
                Flow: Ready when you are!
            </div>
        </div>

        <div id="numberBar"></div>

        <div id="sudokuButtons">
            <button id="checkSudoku">Check</button>
            <button id="resetSudoku">Reset</button>
            <button id="newPuzzle">New Puzzle</button>
            <button id="toggleMark">Mark Mode: OFF</button>
            <button id="flowHelp">How to Play?</button>
        </div>
    `;

    target.appendChild(wrapper);



    /********************************************
     * FLOW
     ********************************************/
    const flowText = document.getElementById("flowText");
    const flowImg = document.querySelector(".flow-helper");

    function flowSay(msg) {
        flowText.innerText = msg;
        flowImg.classList.remove("flow-bounce");
        void flowImg.offsetWidth;
        flowImg.classList.add("flow-bounce");
    }



    /********************************************
     * GENERATOR
     ********************************************/
    function emptyGrid() {
        return Array.from({ length: 9 }, () => Array(9).fill(0));
    }

   function isValid(board, r, c, num) {
    for (let i = 0; i < 9; i++) {
        if (board[r][i] === num) {
            return false;
        }
        if (board[i][c] === num) {
            return false;
        }
    }

    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;

    for (let rr = br; rr < br + 3; rr++) {
        for (let cc = bc; cc < bc + 3; cc++) {
            if (board[rr][cc] === num) {
                return false;
            }
        }
    }

    return true;
}


    function solveBoard(board) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) {
                    const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                    for (let num of nums) {
                        if (isValid(board, r, c, num)) {
                            board[r][c] = num;
                            if (solveBoard(board)) return true;
                            board[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function countSolutions(board) {
        let solutions = 0;
        function backtrack() {
            if (solutions > 1) return;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (board[r][c] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(board, r, c, num)) {
                                board[r][c] = num;
                                backtrack();
                                board[r][c] = 0;
                            }
                        }
                        return;
                    }
                }
            }
            solutions++;
        }
        backtrack();
        return solutions;
    }

    function makePuzzle(solved, removals = 55) {
        const puzzle = solved.map(r => [...r]);
        let attempts = removals;
        while (attempts > 0) {
            const r = Math.floor(Math.random() * 9);
            const c = Math.floor(Math.random() * 9);
            if (puzzle[r][c] === 0) continue;

            const backup = puzzle[r][c];
            puzzle[r][c] = 0;

            const copy = puzzle.map(r => [...r]);
            if (countSolutions(copy) !== 1) {
                puzzle[r][c] = backup;
                attempts--;
            }
        }
        return puzzle;
    }

    function generateSudokuPuzzle() {
        const solved = emptyGrid();
        solveBoard(solved);
        return makePuzzle(solved, 55);
    }



    /********************************************
     * GRID
     ********************************************/
    const gridEl = document.getElementById("sudokuGrid");
    let puzzle;
    let selectedCell = null;
    let markMode = false;

    function buildGrid() {
        gridEl.innerHTML = "";
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement("div");
                cell.className = "sudoku-cell";
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (r % 3 === 0) cell.classList.add("thick-top");
                if (c % 3 === 0) cell.classList.add("thick-left");
                if (r === 8) cell.classList.add("thick-bottom");
                if (c === 8) cell.classList.add("thick-right");

                let val = puzzle[r][c];
                if (val !== 0) {
                    cell.textContent = val;
                    cell.dataset.fixed = "1";
                    cell.classList.add("fixed");
                }

                cell.onclick = () => {
                    if (selectedCell) selectedCell.classList.remove("selected");
                    selectedCell = cell;
                    cell.classList.add("selected");
                };

                gridEl.appendChild(cell);
            }
        }
    }



    /********************************************
     * START
     ********************************************/
    function startNewPuzzle() {
        puzzle = generateSudokuPuzzle();
        buildGrid();
        selectedCell = null;
        flowSay("Flow: A fresh puzzle! Let’s go!");
    }

    startNewPuzzle();



    /********************************************
     * NUM BAR
     ********************************************/
    const bar = document.getElementById("numberBar");
    for (let i = 1; i <= 9; i++) {
        const b = document.createElement("button");
        b.textContent = i;
        b.onclick = () => placeNumber(i);
        bar.appendChild(b);
    }



    /********************************************
     * CHECKER
     ********************************************/
    function checkInstantMistake(cell) {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        const val = parseInt(cell.textContent);
        if (!val) return false;

        for (let x = 0; x < 9; x++) {
            if (x === c) continue;
            const cc = document.querySelector(`.sudoku-cell[data-row="${r}"][data-col="${x}"]`);
            if (parseInt(cc.textContent) === val) {
                flowSay("Flow: Oops! Duplicate in the row!");
                return true;
            }
        }

        for (let y = 0; y < 9; y++) {
            if (y === r) continue;
            const cc = document.querySelector(`.sudoku-cell[data-row="${y}"][data-col="${c}"]`);
            if (parseInt(cc.textContent) === val) {
                flowSay("Flow: That number is already in the column!");
                return true;
            }
        }

        const br = Math.floor(r / 3) * 3;
        const bc = Math.floor(c / 3) * 3;
        for (let rr = br; rr < br + 3; rr++)
            for (let cc = bc; cc < bc + 3; cc++) {
                if (rr === r && cc === c) continue;
                const el = document.querySelector(`.sudoku-cell[data-row="${rr}"][data-col="${cc}"]`);
                if (parseInt(el.textContent) === val) {
                    flowSay("Flow: Check that 3×3 box again!");
                    return true;
                }
            }

        flowSay("Flow: Looks good!");
        return false;
    }



    /********************************************
     * PLACE NUM
     ********************************************/
    function placeNumber(num) {
        if (!selectedCell || selectedCell.dataset.fixed) return;

        if (markMode) {
            selectedCell.innerHTML = `<span class="note">${num}</span>`;
            flowSay("Flow: Added a note!");
            return;
        }

        selectedCell.textContent = num;
        checkInstantMistake(selectedCell);
    }



    /********************************************
     * KEYBOARD INPUT
     ********************************************/
    document.addEventListener("keydown", e => {
        if (!selectedCell || selectedCell.dataset.fixed) return;

        const key = e.key;

        if (["Backspace", "Delete", "0"].includes(key)) {
            selectedCell.textContent = "";
            flowSay("Flow: Cleared!");
            return;
        }

        if (/^[1-9]$/.test(key)) {
            if (e.shiftKey || markMode) {
                selectedCell.innerHTML = `<span class="note">${key}</span>`;
                flowSay("Flow: Added a note!");
            } else {
                selectedCell.textContent = key;
                checkInstantMistake(selectedCell);
            }
        }
    });



    /********************************************
     * BUTTONS
     ********************************************/
    document.getElementById("toggleMark").onclick = function() {
        markMode = !markMode;
        this.textContent = "Mark Mode: " + (markMode ? "ON" : "OFF");
        flowSay(markMode ? "Flow: Note mode enabled!" : "Flow: Note mode off.");
    };

    document.getElementById("resetSudoku").onclick = () => {
        buildGrid();
        selectedCell = null;
        flowSay("Flow: Board reset!");
    };

    document.getElementById("newPuzzle").onclick = () => {
        flowSay("Flow: Generating a brand new puzzle!");
        setTimeout(() => startNewPuzzle(), 350);
    };

    document.getElementById("checkSudoku").onclick = () => {
        flowSay("Flow: Checking…");

        const grid = [];
        for (let r = 0; r < 9; r++) {
            grid[r] = [];
            for (let c = 0; c < 9; c++) {
                const cell = document.querySelector(`.sudoku-cell[data-row="${r}"][data-col="${c}"]`);
                grid[r][c] = parseInt(cell.textContent) || 0;
            }
        }

        if (grid.flat().includes(0)) {
            flowSay("Flow: Not done yet! Keep going!");
            return;
        }

        for (let i = 0; i < 9; i++) {
            const row = new Set(), col = new Set();
            for (let j = 0; j < 9; j++) {
                if (row.has(grid[i][j]) || col.has(grid[j][i])) {
                    flowSay("Flow: Something’s wrong… try again!");
                    return;
                }
                row.add(grid[i][j]);
                col.add(grid[j][i]);
            }
        }

        flowSay("Flow: YOU DID IT!");
    };

    document.getElementById("flowHelp").onclick = () => {
        flowSay("Flow: Fill each row, column, and box with 1–9 without repeats!");
    };

})();
