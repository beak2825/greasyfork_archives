// ==UserScript==
// @name         Chess.com Bot/Cheat (Improved)
// @namespace    YourNamespaceHere
// @version      2.0.0
// @description  Chess.com Bot/Cheat that analyzes the best move, now with improved performance, features, and stability.
// @author       YourName
// @license      Chess.com Bot/Cheat © 2025, All Rights Reserved
// @match        https://www.chess.com/play/*
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/puzzles/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @resource     stockfish.js https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js
// @require      https://greasyfork.org/scripts/445697/code/index.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557340/Chesscom%20BotCheat%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557340/Chesscom%20BotCheat%20%28Improved%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Load and instantiate Stockfish
    const stockfish = new Worker(
        GM_getResourceText("stockfish.js") || "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/9.0.0/stockfish.js"
    );

    let autoMoveEnabled = false;
    let autoRunDepth = 15; // Default analysis depth
    let fenCache = ""; // Avoid redundant processing

    // Create a minimal UI for interacting with the bot
    function createUI() {
        const uiContainer = document.createElement("div");
        uiContainer.id = "chess-bot-ui";
        uiContainer.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: #ffffff;
            border: 1px solid black;
            padding: 10px;
            border-radius: 8px;
            font-family: sans-serif;
        `;

        uiContainer.innerHTML = `
            <h4>Chess Bot UI</h4>
            <label>
                <input type="checkbox" id="toggle-auto-move"> Enable Auto Move
            </label><br>
            <label>
                Analysis Depth: <input type="number" id="analysis-depth" value="${autoRunDepth}" min="1" max="25" style="width: 50px;">
            </label><br><br>
            <button id="analyze-button">Analyze Current Position</button><br>
            <p>Best Move: <span id="best-move">(none)</span></p>
        `;

        document.body.appendChild(uiContainer);

        // Add event listeners
        document.getElementById("toggle-auto-move").addEventListener("change", (e) => {
            autoMoveEnabled = e.target.checked;
        });
        document.getElementById("analysis-depth").addEventListener("change", (e) => {
            autoRunDepth = parseInt(e.target.value) || 15;
        });
        document.getElementById("analyze-button").addEventListener("click", analyzePosition);
    }

    // Fetch the current FEN (board position) from the Chess.com board
    function getFEN() {
        const fenElement = document.querySelector("chess-board");
        return fenElement ? fenElement.getAttribute("data-fen") : null;
    }

    // Highlight the best move on the board
    function highlightMove(from, to) {
        clearHighlights();
        document
            .querySelector(`[data-square='${from}']`)
            ?.classList.add("highlight-from");
        document
            .querySelector(`[data-square='${to}']`)
            ?.classList.add("highlight-to");

        // Styling for highlights
        const style = `
            .highlight-from {
                background-color: rgba(0, 255, 0, 0.5);
            }
            .highlight-to {
                background-color: rgba(255, 0, 0, 0.5);
            }
        `;
        const styleElement = document.createElement("style");
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    }

    // Clear move highlights
    function clearHighlights() {
        document.querySelectorAll(".highlight-from, .highlight-to").forEach((el) => {
            el.classList.remove("highlight-from", "highlight-to");
        });
    }

    // Perform move using DOM manipulation
    function performMove(from, to) {
        const fromSquare = document.querySelector(`[data-square='${from}']`);
        const toSquare = document.querySelector(`[data-square='${to}']`);

        if (fromSquare && toSquare) {
            // Simulate click events to move the piece
            fromSquare.click();
            toSquare.click();
        }
    }

    // Run Stockfish to determine the best move
    function analyzePosition() {
        const fen = getFEN();
        if (!fen) {
            alert("Game position cannot be detected. Please ensure you're on a live game.");
            return;
        }

        if (fen === fenCache) {
            console.log("FEN unchanged. Analysis skipped.");
            return;
        }

        fenCache = fen;

        // Send position to Stockfish
        console.log(`Analyzing position: ${fen}`);
        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage(`go depth ${autoRunDepth}`);
    }

    // Listen to Stockfish's response
    stockfish.onmessage = function (event) {
        const data = event.data;

        if (data.startsWith("bestmove")) {
            const move = data.split(" ")[1];
            if (!move || move.length !== 4) return; // Skip invalid moves
            const from = move.slice(0, 2);
            const to = move.slice(2, 4);

            // Update the UI
            document.getElementById("best-move").innerText = `${from}-${to}`;
            highlightMove(from, to);

            // Perform the move if auto-move is enabled
            if (autoMoveEnabled) performMove(from, to);
        }
    };

    // Monitor changes on the board and analyze automatically
    const observer = new MutationObserver(() => {
        // Trigger auto-analysis if auto-move is enabled
        if (autoMoveEnabled) analyzePosition();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize the script
    function initialize() {
        createUI();
        console.log("Chess Bot initialized!");
    }

    // Wait for the page to load fully before initializing
    if (document.readyState === "complete") {
        initialize();
    } else {
        window.addEventListener("load", initialize);
    }
})();