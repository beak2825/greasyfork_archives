// ==UserScript==
// @name         Автонажатие D при прокрутке до конца
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Нажимает клавишу D когда страница прокручена до конца
// @author       You
// @match        https://novelbin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550253/%D0%90%D0%B2%D1%82%D0%BE%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%20D%20%D0%BF%D1%80%D0%B8%20%D0%BF%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B5%20%D0%B4%D0%BE%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550253/%D0%90%D0%B2%D1%82%D0%BE%D0%BD%D0%B0%D0%B6%D0%B0%D1%82%D0%B8%D0%B5%20D%20%D0%BF%D1%80%D0%B8%20%D0%BF%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B5%20%D0%B4%D0%BE%20%D0%BA%D0%BE%D0%BD%D1%86%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAtBottom = false;
    let scrollTimeout;

    function isScrolledToBottom() {
        // Проверяем, прокручена ли страница до конца
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Добавляем небольшой буфер (5 пикселей) для точности
        return scrollTop + windowHeight >= documentHeight - 5;
    }

    function simulateKeyPress() {
        // Создаем событие нажатия клавиши D
        const keyEvent = new KeyboardEvent('keydown', {
            key: 'D',
            code: 'KeyD',
            keyCode: 68,
            which: 68,
            bubbles: true,
            cancelable: true
        });

        // Отправляем событие на активный элемент или на документ
        const target = document.activeElement || document;
        target.dispatchEvent(keyEvent);

        console.log('Нажата клавиша D - достигнут конец страницы');
    }

    function handleScroll() {
        // Очищаем предыдущий таймаут
        clearTimeout(scrollTimeout);

        // Устанавливаем таймаут для предотвращения частых проверок
        scrollTimeout = setTimeout(() => {
            const atBottom = isScrolledToBottom();

            // Если мы только что достигли конца страницы
            if (atBottom && !isAtBottom) {
                isAtBottom = true;
                simulateKeyPress();
            } else if (!atBottom) {
                isAtBottom = false;
            }
        }, 100); // Задержка 100мс для оптимизации производительности
    }

    // Добавляем обработчик события прокрутки
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Проверяем начальное состояние страницы
    setTimeout(() => {
        if (isScrolledToBottom()) {
            isAtBottom = true;
            simulateKeyPress();
        }
    }, 1000);

    console.log('Скрипт автонажатия D активирован');
})();