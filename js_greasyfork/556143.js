// ==UserScript==
// @name         Fanatic Anime Store - Remove Out of Stock
// @namespace    https://github.com/xCymylx/
// @version      1.1
// @description  Remove out-of-stock product cards and their parent containers to eliminate blank spaces
// @author       Cymyl
// @match        *://www.fanaticanimestore.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556143/Fanatic%20Anime%20Store%20-%20Remove%20Out%20of%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/556143/Fanatic%20Anime%20Store%20-%20Remove%20Out%20of%20Stock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeOutOfStockCards(root = document) {
        const cards = root.querySelectorAll('article.card');
        cards.forEach(card => {
            const btn = card.querySelector('.card-btn');
            if (btn && btn.textContent.toLowerCase().includes('out of stock')) {
                const parent = card.parentElement;
                const toRemove =
                    parent && parent.children.length === 1 ? parent : card;
                console.log('Removing out-of-stock item:', card.dataset.name || card.querySelector('.card-title')?.innerText);
                toRemove.remove();
            }
        });
    }

    const observerReady = setInterval(() => {
        if (document.querySelector('article.card')) {
            clearInterval(observerReady);
            removeOutOfStockCards();
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.matches('article.card')) {
                                removeOutOfStockCards(node.parentNode);
                            } else if (node.querySelectorAll) {
                                removeOutOfStockCards(node);
                            }
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }, 500);
})();
