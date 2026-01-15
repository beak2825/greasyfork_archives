// ==UserScript==
// @name Инструменты Куратора Форума | 343 Enhanced
// @version 1.1.0
// @description Расширенный набор инструментов для кураторов форума 234.
// @author AColleague
// @match https://forum.blackrussia.online/threads/*
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/1560293
// @downloadURL https://update.greasyfork.org/scripts/562650/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20343%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/562650/%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20343%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Константы для определения префиксов тем.  Важно! Адаптируйте под текущие значения.
    const UNACCEPT_PREFIX = 4; // Отклонено
    const ACCEPT_PREFIX = 8; // Принято
    const RESOLVED_PREFIX = 6; // Решено
    const IMPORTANT_PREFIX = 2; // Важно/Закреплено

    // Объект с шаблонами ответов.  Используем plain text для простоты. Можно расширить до HTML.
    const replies = {
        nonRpCheat: `Здравствуйте, {{ user.mention }}!\nНарушение пункта 2.05 регламента. PermBan.`,
        insultRelatives: `Здравствуйте, {{ user.mention }}!\nНарушение пункта 3.04 регламента. Mute/Ban.`
    };

    // Функция для добавления кнопок быстрого ответа.  Требует адаптации под структуру форума.
    function addQuickReplyButtons() {
        // Получаем элемент для вставки кнопок (пример: панель управления темой).  Адаптировать!
        const targetElement = document.querySelector('.thread_controls'); // Замените на актуальный селектор

        if (!targetElement) {
            console.warn('Не найден элемент для вставки кнопок.');
            return;
        }

        // Создаем кнопки и добавляем обработчики событий.
        const buttonNonRp = createButton('NonRP Обман', () => insertReply(replies.nonRpCheat, ACCEPT_PREFIX));
        const buttonInsult = createButton('Оск. Родных', () => insertReply(replies.insultRelatives, ACCEPT_PREFIX));

        targetElement.appendChild(buttonNonRp);
        targetElement.appendChild(buttonInsult);
    }

    // Функция для создания кнопки.
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    // Функция для вставки ответа и установки префикса.
    function insertReply(replyText, prefix) {
        // Здесь должна быть логика вставки текста в редактор ответа. Адаптировать!
        console.log(`Вставка ответа: ${replyText}\nУстановка префикса: ${prefix}`); // Пример

        // Дополнительно: логика установки префикса темы (если необходима).
    }

    // Запускаем добавление кнопок после загрузки страницы.
    window.addEventListener('load', addQuickReplyButtons);
})();
