// ==UserScript==
// @name           Delete Roulette
// @author         Neleus
// @namespace      Neleus
// @description    Удаляет Рулетку с Главного меню
// @version        0.2
// @include        https://www.heroeswm.ru/*
// @include        https://mirror.heroeswm.ru/*
// @include        https://lordswm.com/*
// @include        https://my.lordswm.com/*
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554619/Delete%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/554619/Delete%20Roulette.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeRoulette() {
        const desktopRoulette = document.querySelector('.mm_item.mm_item_blue a[href="roulette.php"]');
        if (desktopRoulette) desktopRoulette.closest('.mm_item')?.remove();
        const mobileRoulette = document.getElementById('link_roulette');
        if (mobileRoulette) mobileRoulette.remove();
    }
    removeRoulette();
    new MutationObserver(removeRoulette).observe(document.body, { childList: true, subtree: true });
})();
