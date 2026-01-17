// ==UserScript==
// @name         Mult Fan: Sort Seasons
// @name:ua      Mult Fan: Сортування Сезонів
// @name:ru      Mult Fan: Сортировка Сезонов
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  On mult-fan.tv, seasons are sorted in reverse order (last to first). This script changes the order to the more convenient format: from first to last.
// @description:ua На сайті mult-fan.tv сезони відсортовані у зворотному порядку (від останнього до першого). Цей скрипт змінює порядок на більш зручний - від першого до останнього.
// @description:ru На сайте mult-fan.tv сезоны отсортированы в обратном порядке (от последнего к первому). Этот скрипт изменяет порядок на более удобный - от первого к последнему.
// @license      MIT
// @author       boggur
// @match        https://*.mult-fan.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mult-fan.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563050/Mult%20Fan%3A%20Sort%20Seasons.user.js
// @updateURL https://update.greasyfork.org/scripts/563050/Mult%20Fan%3A%20Sort%20Seasons.meta.js
// ==/UserScript==

// 2025-07-22

(function() {
    'use strict';

    const seasonsContainer = document.getElementById('otherSeasons');
    if (!seasonsContainer) return;

    const seasons = Array.from(seasonsContainer.children);

    seasons.sort((a, b) => {
        const numA = Number(a.textContent.trim(), 10);
        const numB = Number(b.textContent.trim(), 10);
        return numA - numB;
    });

    seasonsContainer.innerHTML = '';
    seasons.forEach(el => seasonsContainer.appendChild(el));
})();