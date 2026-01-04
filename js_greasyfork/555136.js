// ==UserScript==
// @name         ASStars — Счётчик камней до гаранта S (v8, автообновление)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Показывает, сколько камней нужно до гаранта S и обновляет счётчик при изменении числа
// @match        https://animestars.org/cards/pack/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555136/ASStars%20%E2%80%94%20%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D0%BA%D0%B0%D0%BC%D0%BD%D0%B5%D0%B9%20%D0%B4%D0%BE%20%D0%B3%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D0%B0%20S%20%28v8%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555136/ASStars%20%E2%80%94%20%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D0%BA%D0%B0%D0%BC%D0%BD%D0%B5%D0%B9%20%D0%B4%D0%BE%20%D0%B3%D0%B0%D1%80%D0%B0%D0%BD%D1%82%D0%B0%20S%20%28v8%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Основная функция расчёта и отображения
    function updateCounter() {
        const span = document.querySelector('.lootbox__counter__s');
        if (!span) return;

        const packsLeft = parseInt(span.textContent.trim());
        if (isNaN(packsLeft)) return;

        const li = span.closest('li');
        if (!li) return;

        const stonesNeeded = Math.round((packsLeft / 20) * 1600);

        // Проверяем, есть ли уже блок под li
        let counter = li.nextElementSibling;
        if (!counter || !counter.classList.contains('stone-counter')) {
            counter = document.createElement('div');
            counter.className = 'stone-counter';
            counter.style.marginTop = '5px';
            counter.style.fontSize = '15px';
            counter.style.color = '#00ffff';
            counter.style.fontWeight = 'bold';
            li.insertAdjacentElement('afterend', counter);
        }

        counter.textContent = `💎 До гаранта S: ≈ ${stonesNeeded.toLocaleString('ru-RU')} камней`;
    }

    // Следим за изменением числа внутри .lootbox__counter__s
    function observeCounter() {
        const span = document.querySelector('.lootbox__counter__s');
        if (!span) return;

        // Обновляем сразу
        updateCounter();

        // Следим за изменениями текста в span
        const counterObserver = new MutationObserver(() => {
            updateCounter();
        });

        counterObserver.observe(span, { childList: true, characterData: true, subtree: true });
    }

    // Следим, чтобы span появился (если страница грузится AJAX-ом)
    const mainObserver = new MutationObserver(() => {
        const span = document.querySelector('.lootbox__counter__s');
        if (span) {
            observeCounter();
            mainObserver.disconnect();
        }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true });

    // Попытка сразу (если всё уже загружено)
    observeCounter();
})();
