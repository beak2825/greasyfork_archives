// ==UserScript==
// @name         Chess.com Stockfish UI + Auto-Move
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhance Chess.com with Stockfish analysis and optional auto-move functionality with a UI to control it.
// @author       YourName
// @match        *://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557287/Chesscom%20Stockfish%20UI%20%2B%20Auto-Move.user.js
// @updateURL https://update.greasyfork.org/scripts/557287/Chesscom%20Stockfish%20UI%20%2B%20Auto-Move.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // URL for Stockfish WASM (WebAssembly) binary
    const stockfishURL = "https://cdn.jsdelivr.net/gh/nmrugg/stockfish.wasm/stockfish.wasm";

    // Create Stockfish Worker
    let stockfish = new Worker(stockfishURL);
    let isAutoMoveEnabled = false;
    let lastAnalyzedPosition = "";

    // Add a basic user interface (UI)
    const uiContainer = document.createElement("div");
    uiContainer.id = "stockfish-ui";
    uiContainer.style.position = "fixed";
    uiContainer.style.bottom = "20px";
    uiContainer.style.right = "20px";
    uiContainer.style.backgroundColor = "white";
    uiContainer.style.border = "1px solid black";
    uiContainer.style.borderRadius = "8px";
    uiContainer.style.padding = "10px";
    uiContainer.style.zIndex = "9999";
    uiContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    uiContainer.innerHTML = `
        <h4>Stockfish UI</h4>
        <button id="analyze-btn">Analyze Position</button><br><br>
        <label>
            <input type="checkbox" id="auto-move-toggle">
            Enable Auto-Move
        </label>
        <p id="best-move-display" style="margin-top: 10px;">Best Move: (pending)</p>
    `;
    document.body.appendChild(uiContainer);

    // Get UI elements
    const analyzeButton = document.getElementById("analyze-btn");
    const autoMoveToggle = document.getElementById("auto-move-toggle");
    const bestMoveDisplay = document.getElementById("best-move-display");

    // Setup Stockfish interaction
    stockfish.onmessage = function (event) {
        const message = event.data;

        if (message.startsWith("bestmove")) {
            const move = message.split(" ")[1];
            console.log("Best move:", move);

            // Display the best move in the UI
            bestMoveDisplay.textContent = `Best Move: ${move}`;

            // If auto-move is enabled, execute the move
            if (isAutoMoveEnabled) {
                automove(move);
            }
        }
    };

    // Analyze the current board position
    function analyzePosition() {
        const fen = getFEN();
        if (!fen) {
            alert("Could not detect the board state (FEN). Ensure you're on an active game!");
            return;
        }

        if (fen === lastAnalyzedPosition) {
            console.log("Position has not changed, skipping analysis.");
            return;
        }

        lastAnalyzedPosition = fen;
        console.log(`Analyzing FEN: ${fen}`);

        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage("go depth 20");
    }

    // Fetch the current FEN (board position) from Chess.com
    function getFEN() {
        // Locate the FEN element from the HTML structure
        const fenContainer = document.querySelector('chess-board');
        const fen = fenContainer ? fenContainer.getAttribute('data-fen') : null;
        return fen;
    }

    // Simulate the move on the chessboard in Chess.com
    function automove(move) {
        console.log(`Attempting to auto-move: ${move}`);
        const fromSquare = move.slice(0, 2); // e.g., "e2"
        const toSquare = move.slice(2, 4); // e.g., "e4"

        const fromElement = document.querySelector(`[data-square='${fromSquare}']`);
        const toElement = document.querySelector(`[data-square='${toSquare}']`);

        if (fromElement && toElement) {
            console.log("Executing move:", fromSquare, toSquare);
            fromElement.click(); // Select the piece
            toElement.click(); // Move it to the target square
        } else {
            console.error("Could not find squares for auto-move.");
        }
    }

    // Event listeners for the UI
    analyzeButton.addEventListener("click", () => {
        analyzePosition();
    });

    autoMoveToggle.addEventListener("change", (event) => {
        isAutoMoveEnabled = event.target.checked;
        console.log("Auto-Move Enabled:", isAutoMoveEnabled);
    });

    console.log("Stockfish Auto-Move UI script loaded!");
})();