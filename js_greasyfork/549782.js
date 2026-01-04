// ==UserScript==
// @name         Memory Pair AutoSolver
// @namespace    https://remanga.org/
// @version      1.1
// @description  Автоматически решает игру "Найди пару" на remanga.org (Shift+T для запуска, выводит время работы)
// @match        https://remanga.org/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/549782/Memory%20Pair%20AutoSolver.user.js
// @updateURL https://update.greasyfork.org/scripts/549782/Memory%20Pair%20AutoSolver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let openedCards = {};
    let solving = false;
    let interval;
    let startTime;

    function solveGame() {
        let cards = document.querySelectorAll("button img[alt='card']");

        // проверяем, есть ли ещё закрытые карты
        let closedCards = Array.from(cards).filter(img => img.getAttribute("src").includes("random-card.webp"));
        if (closedCards.length === 0) {
            clearInterval(interval);
            solving = false;
            let endTime = performance.now();
            console.warn("Игра решена за " + ((endTime - startTime) / 1000).toFixed(2) + " секунд");
            return;
        }

        cards.forEach((img, idx) => {
            let card = img.closest("button");
            let src = img.getAttribute("src");

            if (src.includes("random-card.webp")) {
                card.click();

                setTimeout(() => {
                    let newSrc = img.getAttribute("src");

                    if (!newSrc.includes("random-card.webp")) {
                        if (openedCards[newSrc] !== undefined) {
                            let pairIdx = openedCards[newSrc];
                            let pairCard = cards[pairIdx].closest("button");

                            pairCard.click();
                            card.click();
                        } else {
                            openedCards[newSrc] = idx;
                        }
                    }
                }, 0);
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.code === 'KeyT') {
            if (!solving) {
                solving = true;
                openedCards = {};
                startTime = performance.now(); // начало отсчёта
                interval = setInterval(solveGame, 0);
                console.warn("AutoSolver запущен");
            }
        }
    });
})();
