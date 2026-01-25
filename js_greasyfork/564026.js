// ==UserScript==
// @name         VK Copy Selected Messages
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Копирует выделенные галочкой сообщения в ВК через Ctrl+C
// @author       You
// @match        https://vk.com/*
// @match        https://vk.ru/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564026/VK%20Copy%20Selected%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/564026/VK%20Copy%20Selected%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Слушаем нажатие клавиш в фазе "захвата" (true в конце), чтобы опередить скрипты ВК
    window.addEventListener('keydown', function(e) {
        // Проверяем нажатие Ctrl+C (или Cmd+C на Mac)
        if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC') {

            // 1. Ищем все отмеченные галочками чекбоксы в истории сообщений
            // В твоем коде они лежат в .ConvoHistory__navigationSelectTogglerContainer > input
            const checkedInputs = document.querySelectorAll('.ConvoHistory__navigationSelectTogglerContainer input[type="checkbox"]:checked');

            if (checkedInputs.length === 0) {
                return; // Ничего не выделено галочками — работает стандартное копирование
            }

            // Если выделены сообщения, блокируем стандартное поведение ВК, чтобы он не мешал
            e.preventDefault();
            e.stopImmediatePropagation();

            let bufferText = [];

            // 2. Проходимся по каждому выделенному чекбоксу и ищем текст сообщения рядом с ним
            checkedInputs.forEach(input => {
                // Ищем родительский блок сообщения (тег <article>)
                const article = input.closest('article');
                if (!article) return;

                // Ищем текст внутри этого блока
                const textNode = article.querySelector('.MessageText');
                const authorNode = article.querySelector('.PeerTitle__title'); // Имя автора
                const replyNode = article.querySelector('.Reply__content'); // Если это ответ

                let part = "";

                // Добавляем имя автора, если оно есть в этом блоке (иногда оно скрыто в группировке)
                if (authorNode) {
                    part += `[${authorNode.innerText}]:\n`;
                }

                // Если это ответ на сообщение
                if (replyNode) {
                     part += `> ${replyNode.innerText.replace(/\n/g, ' ')}\n`;
                }

                // Сам текст сообщения
                if (textNode) {
                    // Берем innerText, чтобы сохранить переносы строк, но убираем лишнее
                    part += textNode.innerText.trim();
                } else {
                    part += "[Вложение/Картинка]";
                }

                if (part) {
                    bufferText.push(part);
                }
            });

            // 3. Копируем в буфер обмена
            if (bufferText.length > 0) {
                const finalString = bufferText.join('\n\n');

                // Используем GM_setClipboard, так как он надежнее в юзерскриптах при перехвате событий
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(finalString);
                } else {
                    // Фоллбек для обычного JS (может блокироваться браузером, если фокус потерян)
                    navigator.clipboard.writeText(finalString);
                }

                showNotification(`Скопировано сообщений: ${bufferText.length}`);
            }
        }
    }, true); // <--- true включает capture phase

    // Визуальное уведомление
    function showNotification(text) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '100px';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.background = 'rgba(0, 0, 0, 0.8)';
        div.style.color = '#fff';
        div.style.padding = '10px 20px';
        div.style.borderRadius = '8px';
        div.style.zIndex = '999999';
        div.style.fontFamily = 'sans-serif';
        div.style.pointerEvents = 'none';
        div.innerText = text;
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.transition = 'opacity 0.5s';
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 1500);
    }

})();