// ==UserScript==
// @name         larinov718391
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Приветствие по времени + ник + кнопка вставки текста
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558867/larinov718391.user.js
// @updateURL https://update.greasyfork.org/scripts/558867/larinov718391.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ждём загрузку страницы
    window.addEventListener('load', () => {

        // ищем поле ответа
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        // получаем ник аккаунта
        const nameFA =
            document.querySelector('.p-navgroup-linkText')?.innerText || 'Участник';

        // определяем время
        const hour = new Date().getHours();
        let greeting = 'Здравствуйте';

        if (hour >= 5 && hour < 12) greeting = 'Доброе утро';
        else if (hour >= 12 && hour < 17) greeting = 'Добрый день';
        else if (hour >= 17 && hour < 23) greeting = 'Добрый вечер';
        else greeting = 'Доброй ночи';

        // текст для вставки
        const text = `${greeting}, ${nameFA}\n\nНа рассмотрение ожидайте.`;

        // создаём кнопку
        const button = document.createElement('button');
        button.innerText = '📋 Вставить шаблон';
        button.type = 'button';
        button.style.margin = '5px';
        button.style.padding = '5px 10px';

        // действие кнопки
        button.onclick = () => {
            textarea.value = text;
            textarea.focus();
        };

        // вставляем кнопку над полем
        textarea.parentElement.prepend(button);
    });
})();
