// ==UserScript==
// @name         Aggressive Chess Bot — UI Reformulado
// @namespace    yan.chessbot.ui
// @version      1.1
// @description  UI do bot agressivo + integração confiável com Chess.com
// @match        https://www.chess.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557157/Aggressive%20Chess%20Bot%20%E2%80%94%20UI%20Reformulado.user.js
// @updateURL https://update.greasyfork.org/scripts/557157/Aggressive%20Chess%20Bot%20%E2%80%94%20UI%20Reformulado.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- Espera Engine ----------
    function waitForEngine() {
        return new Promise(resolve => {
            const check = () => {
                if (window.AggressiveChessBot) resolve();
                else setTimeout(check, 200);
            };
            check();
        });
    }

    // ---------- Espera Tabuleiro ----------
    function waitForBoard() {
        return new Promise(resolve => {
            const check = () => {
                const board = document.querySelector("chess-board");
                if (board) resolve(board);
                else setTimeout(check, 200);
            };
            check();
        });
    }

    // ---------- Captura FEN ----------
    function getFEN(board) {
        // Tenta usar API interna do chess-board
        try {
            return board.game.fen();
        } catch {
            // fallback para visual
            const fenContainer = document.querySelector('.fen');
            if (fenContainer) return fenContainer.innerText.trim();
        }
        return null;
    }

    // ---------- UI ----------
    function createUI(board) {
        const panel = document.createElement('div');
        panel.id = 'aggressive-bot-ui';
        panel.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(15,15,20,0.9);
            border: 2px solid #38bdf8;
            padding: 10px 12px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            border-radius: 8px;
            z-index: 999999;
        `;

        const btn = document.createElement('button');
        btn.innerText = "🔮 Melhor lance";
        btn.style = `
            padding: 6px 10px;
            background: #38bdf8;
            border: none;
            border-radius: 6px;
            color: black;
            font-weight: bold;
            cursor: pointer;
        `;

        btn.addEventListener('click', () => runSuggestion(board));

        panel.appendChild(btn);
        document.body.appendChild(panel);
    }

    // ---------- Desenha seta ----------
    function drawArrow(board, from, to) {
        removeArrows();
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("aggressive-arrow");
        svg.style.position = "absolute";
        svg.style.top = 0;
        svg.style.left = 0;
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = 999998;

        board.appendChild(svg);

        const sqSize = board.getBoundingClientRect().width / 8;

        const [fr, fc] = from;
        const [tr, tc] = to;

        const x1 = (fc + 0.5) * sqSize;
        const y1 = (7 - fr + 0.5) * sqSize;
        const x2 = (tc + 0.5) * sqSize;
        const y2 = (7 - tr + 0.5) * sqSize;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#38bdf8");
        line.setAttribute("stroke-width", "12");
        line.setAttribute("stroke-linecap", "round");

        svg.appendChild(line);
    }

    function removeArrows() {
        document.querySelectorAll(".aggressive-arrow").forEach(a => a.remove());
    }

    // ---------- Sugestão de lance ----------
    function runSuggestion(board) {
        const fen = getFEN(board);
        if (!fen) {
            alert("Não consegui capturar o FEN 😢");
            return;
        }

        const best = window.AggressiveChessBot.findBestMove(fen, 2);
        if (!best) {
            alert("Sem movimentos encontrados.");
            return;
        }

        drawArrow(board, best.from, best.to);
    }

    // ---------- Inicialização ----------
    async function init() {
        await waitForEngine();
        const board = await waitForBoard();
        createUI(board);
        console.log("Aggressive Bot UI carregado!");
    }

    init();

})();

function createUI(board) {
    const panel = document.createElement('div');
    panel.id = 'aggressive-bot-ui';
    panel.style = `
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15,15,20,0.9);
        border: 2px solid #38bdf8;
        padding: 10px 12px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 16px;
        border-radius: 8px;
        z-index: 999999;
        touch-action: manipulation;
    `;

    const btn = document.createElement('button');
    btn.innerText = "🔮 Melhor lance";
    btn.style = `
        padding: 8px 12px;
        background: #38bdf8;
        border: none;
        border-radius: 6px;
        color: black;
        font-weight: bold;
        cursor: pointer;
        font-size: 16px;
    `;

    // Tocar e segurar para mostrar seta
    btn.addEventListener('touchstart', () => runSuggestion(board));
    btn.addEventListener('click', () => runSuggestion(board));

    panel.appendChild(btn);
    document.body.appendChild(panel);
}