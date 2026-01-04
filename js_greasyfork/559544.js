// ==UserScript==
// @name         Stake Mines – Chess Coordinates
// @namespace    https://stake.us/
// @version      1.1
// @description  Adds A1–E5 chess-style coordinates to Stake Mines tiles
// @match        https://stake.us/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559544/Stake%20Mines%20%E2%80%93%20Chess%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/559544/Stake%20Mines%20%E2%80%93%20Chess%20Coordinates.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LETTERS = ['A', 'B', 'C', 'D', 'E'];
    const GRID_SIZE = 5;

    function isMinesPage() {
        return location.pathname === '/casino/games/mines';
    }

    function addCoordinates() {
        if (!isMinesPage()) return;

        const tiles = document.querySelectorAll(
            'button.tile[data-testid^="game-tile-"]'
        );

        if (tiles.length !== GRID_SIZE * GRID_SIZE) return;

        tiles.forEach((tile, index) => {
            // Prevent duplicates
            if (tile.querySelector('.chess-coord')) return;

            const row = Math.floor(index / GRID_SIZE);
            const col = index % GRID_SIZE;
            const coord = `${LETTERS[col]}${row + 1}`;

            const label = document.createElement('div');
            label.className = 'chess-coord';
            label.textContent = coord;

            Object.assign(label.style, {
                position: 'absolute',
                top: '4px',
                left: '6px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffffff',
                textShadow: '0 0 3px #000',
                pointerEvents: 'none',
                zIndex: '10'
            });

            tile.style.position = 'relative';
            tile.appendChild(label);
        });
    }

    // Observe DOM changes because Stake is a SPA (Svelte)
    const observer = new MutationObserver(() => {
        requestAnimationFrame(addCoordinates);
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Fallback initial run
    requestAnimationFrame(addCoordinates);
})();
