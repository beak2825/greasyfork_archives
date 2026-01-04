// ==UserScript==
// @name         Chess.com Stockfish Auto-Move
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically analyze and auto-move on Chess.com using Stockfish
// @author       YourName
// @match        *://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557286/Chesscom%20Stockfish%20Auto-Move.user.js
// @updateURL https://update.greasyfork.org/scripts/557286/Chesscom%20Stockfish%20Auto-Move.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // URL to the Stockfish WebAssembly version
    const stockfishURL = "https://cdn.jsdelivr.net/gh/nmrugg/stockfish.wasm/stockfish.wasm";

    // Inject Stockfish.js
    let stockfish = new Worker(stockfishURL);

    // Function to analyze position with Stockfish
    stockfish.onmessage = function(event) {
        console.log("Stockfish:", event.data);

        if (event.data.startsWith("bestmove")) {
            const move = event.data.split(" ")[1];
            console.log(`Best move determined: ${move}`);
            automove(move);
        }
    };

    // Fetch the current board position (FEN) on Chess.com
    function getFEN() {
        const fenElement = document.querySelector('chess-board');
        if (fenElement) {
            const board = fenElement.getAttribute('data-fen');
            return board;
        }
        return null;
    }

    // Analyze the current position with Stockfish
    function analyzePosition(fen) {
        console.log(`Sending FEN to Stockfish: ${fen}`);
        stockfish.postMessage("position fen " + fen);
        stockfish.postMessage("go depth 20"); // You can adjust depth for faster/slower analysis
    }

    // Execute the move automatically (DOM manipulation)
    function automove(move) {
        console.log(move);
        // TODO: Implement move execution (Chess.com restricts auto-moves – add this manually or simulate a click based on your FEN)
    }

    // Hook to analyze changes on the board
    const observer = new MutationObserver(() => {
        const currentFEN = getFEN();
        if (currentFEN) {
            analyzePosition(currentFEN);
        }
    });

    // Watch the Chess.com board for changes
    observer.observe(document.body, { childList: true, subtree: true });

})();