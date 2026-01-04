// ==UserScript==
// @name         Mario Maker 2 Auto Goal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the goal for no damage challenge
// @author       bananenkeks
// @match        https://angrystar6k.github.io/The-Mario-Maker-2-Tree/*
// @match        https://galaxy.click/play/318*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553970/Mario%20Maker%202%20Auto%20Goal.user.js
// @updateURL https://update.greasyfork.org/scripts/553970/Mario%20Maker%202%20Auto%20Goal.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // Text-Mapping pro GoalCode
    const goalText = {
        1: 'Flag',
        2: 'Square',
        3: 'Pole',
        4: 'Axe'
    };

    // CSS für Hervorhebung
    const css = document.createElement('style');
    css.textContent = `
      .tm-highlight-button {
        box-shadow: 0 0 10px 4px rgba(45,187,164,0.8) !important;
        transform: scale(1.1) !important;
        transition: transform 0.2s, box-shadow 0.2s;
        z-index: 100000 !important;
      }
    `;
    document.head.appendChild(css);

    // iFrame-Fix
    let gameWindow = unsafeWindow;
    if (location.hostname !== 'angrystar6k.github.io') {
        const iframe = document.querySelector('iframe');
        if (iframe?.contentWindow) gameWindow = iframe.contentWindow;
    }

    function clear() {
        document.querySelectorAll('.tm-highlight-button').forEach(el => {
            el.classList.remove('tm-highlight-button');
        });
    }

    function highlight() {
        clear();
        let player;
        try { player = gameWindow.player; } catch { return; }
        if (!player?.easy) return;

        const theme = Number(player.easy.random_theme||0);
        const style = Number(player.easy.random_style||0);
        if (theme<1||theme>10||style<1||style>5) return;

        // Tabelle aus vorherigem Skript
        const table = [
          [1,2,3,1,1],[1,2,3,1,1],[1,2,3,1,1],
          [1,2,3,1,1],[1,2,3,1,1],[1,2,3,1,1],
          [1,2,3,1,1],[1,2,3,1,1],[1,2,3,1,1],
          [4,4,4,4,1]
        ];
        const code = table[theme-1][style-1];
        const text = goalText[code];

        // Suche Buttons nach Text
        const btns = Array.from(document.querySelectorAll('button'));
        for(const b of btns){
            if (b.textContent.trim().includes(text)) {
                b.classList.add('tm-highlight-button');
                break;
            }
        }
    }

    setInterval(highlight, 300);
})();
