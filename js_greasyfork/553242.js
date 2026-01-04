// ==UserScript==
// @name         Win Casino Bonus Helper
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0
// @description  Простенький скрипт, который показывает приветствие и напоминание о бонусе на сайте Win Casino
// @author       Oleh Yakuba
// @match        *://*wincasino*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553242/Win%20Casino%20Bonus%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/553242/Win%20Casino%20Bonus%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Сообщение при входе на сайт
    window.addEventListener('load', function() {
        alert('🎰 Добро пожаловать в Win Casino! Не забудь забрать свой бонус 🎁');
    });

    // Пример автоматического выделения кнопки "Получить бонус", если она есть
    setTimeout(() => {
        const bonusButton = document.querySelector('button, a[href*="bonus"], a[href*="promo"]');
        if (bonusButton) {
            bonusButton.style.border = '3px solid gold';
            bonusButton.style.boxShadow = '0 0 15px gold';
            bonusButton.style.transition = '0.3s';
            console.log('✨ Кнопка бонуса выделена автоматически!');
        }
    }, 2000);
})();