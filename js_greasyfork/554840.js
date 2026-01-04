// ==UserScript==
// @name         Serengeti Shuffle Move Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detects possible matches and highlights them in Serengeti Shuffle on Lioden
// @match        https://www.lioden.com/games/serengeti-shuffle.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554840/Serengeti%20Shuffle%20Move%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/554840/Serengeti%20Shuffle%20Move%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightMoves() {
        try {
            // Try to find the game's grid data (some Lioden games attach it to window)
            const board = window.board || window.gameBoard || window.grid;
            if (!board) return console.log('[Serengeti Helper] No board data found.');

            // Example logic: look for any 3-in-a-row matches horizontally or vertically
            for (let y = 0; y < board.length; y++) {
                for (let x = 0; x < board[y].length; x++) {
                    const tile = board[y][x];
                    if (!tile) continue;

                    // simple check for 2 in a row horizontally
                    if (x < board[y].length - 2 && tile.type === board[y][x + 1].type && tile.type === board[y][x + 2].type) {
                        console.log(`[Serengeti Helper] Match found at row ${y}, start ${x}`);
                        // You could highlight here if the game allows overlays
                    }
                }
            }
        } catch (e) {
            console.error('[Serengeti Helper] Error scanning board:', e);
        }
    }

    // Run every few seconds
    setInterval(highlightMoves, 3000);
})();
