// ==UserScript==
// @name         Wildberries Instant Center Scroll
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Мгновенная прокрутка к центру следующей карточки по пробелу
// @author       McDuck
// @match        https://www.wildberries.ru/*
// @match        https://wildberries.ru/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549627/Wildberries%20Instant%20Center%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/549627/Wildberries%20Instant%20Center%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCardElements() {
        const selectors = [
            '.product-card__wrapper',
            '.card__wrapper',
            '.j-card-item',
            '.product-card',
            '.card',
            '.catalog-product',
            '[data-nm-id]',
            '.product-card__inner'
        ];

        let allCards = [];
        selectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            allCards = allCards.concat(Array.from(cards));
        });

        // Фильтруем и сортируем карточки по вертикальной позиции
        return [...new Set(allCards)]
            .filter(card => card.offsetParent !== null)
            .sort((a, b) => {
                const rectA = a.getBoundingClientRect();
                const rectB = b.getBoundingClientRect();
                return (rectA.top + window.scrollY) - (rectB.top + window.scrollY);
            });
    }

    function findNextCard() {
        const cards = getCardElements();
        if (cards.length === 0) return null;

        const viewportHeight = window.innerHeight;
        const currentScroll = window.scrollY;
        const viewportCenter = viewportHeight / 2;

        // Ищем первую карточку, центр которой ниже центра экрана
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + (rect.height / 2);

            // Если центр карточки ниже центра экрана
            if (cardCenter > viewportCenter + 10) {
                const cardAbsoluteTop = rect.top + currentScroll;
                const targetScroll = cardAbsoluteTop - viewportCenter + (rect.height / 2);
                return targetScroll;
            }
        }

        // Если не нашли, берем последнюю карточку
        const lastCard = cards[cards.length - 1];
        const lastRect = lastCard.getBoundingClientRect();
        const lastCardTop = lastRect.top + currentScroll;
        return lastCardTop - viewportCenter + (lastRect.height / 2);
    }

    function handleSpacebar(e) {
        if ((e.code === 'Space' || e.keyCode === 32) &&
            !document.activeElement.tagName.match(/^(INPUT|TEXTAREA)$/i) &&
            !document.activeElement.isContentEditable) {

            e.preventDefault();
            e.stopPropagation();

            const targetScroll = findNextCard();

            if (targetScroll !== null) {
                window.scrollTo({
                    top: targetScroll,
                    behavior: 'smooth'
                });
            }

            return false;
        }
    }

    document.addEventListener('keydown', handleSpacebar, true);
    console.log('Wildberries Instant Center Scroll activated');
})();