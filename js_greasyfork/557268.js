// ==UserScript==
// @name         AS CC
// @namespace    https://animestars.org/cards/
// @version      1.1
// @description  Автоматически кликает на появившуюся карту и закрывает модальное окно после получения карты
// @author Sandr
// @match        https://animestars.org/aniserials/video/*
// @match        https://asstars.tv/aniserials/video/*
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557268/AS%20CC.user.js
// @updateURL https://update.greasyfork.org/scripts/557268/AS%20CC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Селектор для конкретного модального окна с карточкой:
    const CARD_DIALOG_CONTAINER_SELECTOR = '.ui-dialog[aria-describedby="card-modal"]';

    // Селектор для зимнего ивентового предмета:
    const SNOW_GIFT_SELECTOR = '#snow-stone-gift'; // Используем ID, как в вашем HTML

    // --- Функции клика ---

    function clickCardNotification(cardNode) {
        if (cardNode.classList.contains('card-notification')) {
            cardNode.click();
            console.log('UserScript: Кликнули на уведомление о карте.');
        }
    }

    function clickSnowGift(snowGiftNode) {
        if (snowGiftNode.id === 'snow-stone-gift') {
            snowGiftNode.click();
            console.log('UserScript: Кликнули на ивентовый предмет (Снежинка).');
        }
    }

    function closeModal() {
        const cardDialog = document.querySelector(CARD_DIALOG_CONTAINER_SELECTOR);

        if (cardDialog) {
            const closeBtn = cardDialog.querySelector('.ui-dialog-titlebar-close');

            if (closeBtn) {
                closeBtn.click();
                console.log('UserScript: Целевое модальное окно с картой закрыто.');
                return;
            }
        }
        console.log('UserScript: Целевое модальное окно или кнопка закрытия не найдены.');
    }

    // --- Mutation Observer для отслеживания новых элементов ---

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Если это элемент

                    // 1. Автоклик на появившуюся карту
                    if (node.classList.contains('card-notification')) {
                        clickCardNotification(node);
                        // Запускаем таймер на закрытие модалки
                        console.log('UserScript: Уведомление кликнуто. Запуск таймера на закрытие модалки.');
                        setTimeout(closeModal, 3000);
                    }

                    // 2. Автоклик на ивентовый предмет
                    if (node.id === 'snow-stone-gift') {
                        clickSnowGift(node);
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- Обработка существующих элементов при загрузке ---

    // Обработка существующей карты
    const existingCard = document.querySelector('.card-notification');
    if (existingCard) {
        clickCardNotification(existingCard);
        setTimeout(closeModal, 3000);
    }

    // Обработка существующего ивентового предмета
    const existingSnowGift = document.querySelector(SNOW_GIFT_SELECTOR);
    if (existingSnowGift) {
        clickSnowGift(existingSnowGift);
    }
})();