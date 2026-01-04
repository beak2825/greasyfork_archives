// ==UserScript==
// @name         Minesweeper Online Auto Solver
// @namespace    http://tampermonkey.net/
// @version      2025-12-21
// @description  Instant chain-solving
// @Author       Crowzedtsu
// @license      MIT
// @match        https://minesweeper.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minesweeper.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559699/Minesweeper%20Online%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/559699/Minesweeper%20Online%20Auto%20Solver.meta.js
// ==/UserScript==

'use strict';

let lastRun = 0;
let solverActive = false;
let lastOpenedCount = 0;

function loop(ts) {
    if (ts - lastRun > 60) {
        lastRun = ts;
        mainLoop();
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function mainLoop() {
    const cells = [...document.querySelectorAll('#AreaBlock .cell')];
    if (!cells.length) return;

    detectMultiplayerReset(cells);
    runSolver(cells);
}


function detectMultiplayerReset(cells) {
    const opened = cells.filter(c => c.classList.contains('hdd_opened')).length;

    if (solverActive && opened < lastOpenedCount) {
        console.warn('[MS SOLVER] Multiplayer reset detected');
        cells.forEach(clearAllMarks);
        solverActive = false;
    }

    lastOpenedCount = opened;
}


function runSolver(cells) {
    solverActive = true;

    const map = new Map();
    cells.forEach(c => {
        clearIfOpened(c);
        clearIfFlagged(c);
        map.set(`${c.dataset.x},${c.dataset.y}`, c);
    });

    let actions = 0;

    cells.forEach(cell => {
        const num = getNumber(cell);
        if (num === null) return;

        const neighbors = getNeighbors(+cell.dataset.x, +cell.dataset.y, map);

        let flagged = 0;
        let closed = [];

        neighbors.forEach(n => {
            if (isFlagged(n)) flagged++;
            else if (isClosedUnflagged(n)) closed.push(n);
        });

        // SAFE RULE
        if (flagged === num) {
            closed.forEach(n => markSafe(n) && actions++);
        }

        // BOMB RULE
        if (num - flagged === closed.length && closed.length) {
            closed.forEach(n => markBomb(n) && actions++);
        }
    });

    if (actions === 0) {
        applyProbabilityHints(cells, map);
    }
}


// REAL FLAG or SOLVER BOMB = flagged
function isFlagged(cell) {
    return cell.classList.contains('hdd_flag') ||
           cell.dataset.drawn === 'bomb';
}

function isClosedUnflagged(cell) {
    return cell.classList.contains('hdd_closed') &&
           !isFlagged(cell);
}


function getNumber(cell) {
    for (const c of cell.classList) {
        if (c.startsWith('hdd_type')) {
            return +c.replace('hdd_type', '');
        }
    }
    return null;
}

function getNeighbors(x, y, map) {
    const res = [];
    for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
            if (!dx && !dy) continue;
            const n = map.get(`${x + dx},${y + dy}`);
            if (n) res.push(n);
        }
    return res;
}


function applyProbabilityHints(cells, map) {
    const risk = new Map();

    cells.forEach(cell => {
        const num = getNumber(cell);
        if (num === null) return;

        const neighbors = getNeighbors(+cell.dataset.x, +cell.dataset.y, map);
        let flagged = 0;
        let closed = [];

        neighbors.forEach(n => {
            if (isFlagged(n)) flagged++;
            else if (isClosedUnflagged(n)) closed.push(n);
        });

        const bombsLeft = num - flagged;
        if (bombsLeft <= 0 || !closed.length) return;

        const p = bombsLeft / closed.length;
        closed.forEach(c => {
            if (!risk.has(c)) risk.set(c, []);
            risk.get(c).push(p);
        });
    });

    if (!risk.size) return;

    let min = Infinity;
    risk.forEach(v => {
        const avg = v.reduce((a,b)=>a+b) / v.length;
        min = Math.min(min, avg);
    });

    risk.forEach((v, c) => {
        const avg = v.reduce((a,b)=>a+b) / v.length;
        if (avg === min) markProbable(c, avg);
    });
}

function markSafe(cell) {
    if (cell.classList.contains('hdd_opened') || isFlagged(cell)) return false;
    if (cell.dataset.drawn === 'prob') clearAllMarks(cell);
    if (cell.dataset.drawn) return false;

    cell.dataset.drawn = 'safe';
    cell.style.boxShadow = 'inset 0 0 0 3px #00ff66, inset 0 0 10px #00ff66';
    return true;
}

function markBomb(cell) {
    if (cell.classList.contains('hdd_opened')) return false;
    if (cell.dataset.drawn === 'prob') clearAllMarks(cell);
    if (cell.dataset.drawn) return false;

    cell.dataset.drawn = 'bomb';
    cell.style.boxShadow = 'inset 0 0 0 3px #ff3333, inset 0 0 10px #ff3333';
    return true;
}

function markProbable(cell, risk) {
    if (cell.classList.contains('hdd_opened') || isFlagged(cell)) return;
    if (cell.dataset.drawn && cell.dataset.drawn !== 'prob') return;

    cell.dataset.drawn = 'prob';
    cell.style.boxShadow = 'inset 0 0 0 3px gold, inset 0 0 10px gold';
    cell.title = `Bomb chance ≈ ${(risk * 100).toFixed(1)}%`;
}


function clearIfOpened(cell) {
    if (cell.classList.contains('hdd_opened')) clearAllMarks(cell);
}

function clearIfFlagged(cell) {
    if (cell.classList.contains('hdd_flag')) clearAllMarks(cell);
}

function clearAllMarks(cell) {
    delete cell.dataset.drawn;
    cell.style.boxShadow = '';
    cell.title = '';
}
