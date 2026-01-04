// ==UserScript==
// @name         В ОДОБРЕННЫЕ
// @namespace    https://forum.blackrussia.online/
// @version      1.2.6
// @description  by David_Goggins 
// @author       David_Goggins  
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/*
// @match        https://forum.blackrussia.online/forums*
// @include      https://forum.blackrussia.online/forums
// @grant        none
// @license      MIT            
// @collaborator Kuk
// @icon         https://avatars.mds.yandex.net/i?id=e7371f38fb4d7fe174b4362d628c7f74-4988204-images-thumbs&n=13
// @copyright    2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/553517/%D0%92%20%D0%9E%D0%94%D0%9E%D0%91%D0%A0%D0%95%D0%9D%D0%9D%D0%AB%D0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553517/%D0%92%20%D0%9E%D0%94%D0%9E%D0%91%D0%A0%D0%95%D0%9D%D0%9D%D0%AB%D0%95.meta.js
// ==/UserScript==

// ==UserScript==
// @name 🟢 АВТО-ПЕРЕМЕЩЕНИЕ: РП БИОГРАФИИ (Одобренные)
// @namespace https://forum.blackrussia.online/
// @version 1.0
// @description Добавляет отдельную кнопку с зеленым фоном для перемещения темы в Одобренные биографии (ID 790).
// @author Gemini (На основе рабочего примера)
// @match https://forum.blackrussia.online/threads/*
// @grant none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНСТАНТЫ ДЛЯ ПЕРЕМЕЩЕНИЯ ---
    const NODE_TARGET = 790; // Одобренные биографии
    const PREFIX_ID = 8; // Префикс 'Одобрено' (для прохождения проверки)
    const MOVE_BUTTON_ID = 'move_to_approved_standalone';

    // --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ---
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

    // === ФУНКЦИЯ ПЕРЕМЕЩЕНИЯ (ТОЧНО КАК В РАБОЧЕМ ПРИМЕРЕ) ===
    function moveThread(targetNodeId, prefixId) {
        if (typeof XF === 'undefined' || !XF.config || !XF.config.csrf) {
            alert('Ошибка: Не найдены переменные XenForo. Невозможно выполнить запрос.');
            return;
        }

        const threadUrl = document.URL.split('?')[0].replace(/\/$/, '');
        const moveUrl = `${threadUrl}/move`;
        const threadTitle = $('.p-title-value')[0].lastChild.textContent.trim();

        // Параметры для POST-запроса на перемещение
        const data = {
            prefix_id: prefixId,
            title: threadTitle,
            target_node_id: targetNodeId,
            redirect_type: 'none',
            notify_watchers: 1,
            starter_alert: 1,
            starter_alert_reason: "",
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
            _xfRequest: 1
        };

        // Отправка запроса + Перезагрузка
        fetch(moveUrl, {
            method: 'POST',
            body: getFormData(data),
        }).then(() => {
            console.log('Тема перемещена. Перезагрузка для редиректа.');
            location.reload();
        }).catch(error => {
            console.error('Ошибка перемещения:', error);
            alert('Ошибка перемещения темы. Проверьте консоль.');
        });
    }

    // === ФУНКЦИЯ ДОБАВЛЕНИЯ КНОПКИ (ЗЕЛЕНЫЙ ДИЗАЙН) ===
    function addButton(name, id) {
        // Ищем контейнер формы быстрого ответа
        const $replyForm = $('.js-quickReply');

        // Ищем кнопку "ОТВЕТИТЬ" по классу или тексту
        const $target = $replyForm.find('.button.button--primary, button:contains("ОТВЕТИТЬ")').first();

        const buttonMarkup =
            `<button type="button" class="button rippleButton" id="${id}" style="
                /* 🟢 ЗЕЛЕНЫЙ ФОН */
                background: #28a745;
                background-image: none !important;
                margin-right: 10px;
                border: 1px solid #1e7e34;
                border-radius: 10px;
                color: white !important;
                font-weight: bold;
                padding: 8px 15px;
            ">
                <span class="button-text">${name}</span>
            </button>`;

        // 1. Вставляем перед кнопкой "ОТВЕТИТЬ"
        if ($target.length) {
            $target.before(buttonMarkup);
        } else {
             // 2. Если не нашли форму, вставляем под названием темы
             $('.p-title').after(buttonMarkup);
        }
    }

    // === ЗАПУСК ===
    $(document).ready(() => {
        if (typeof XF === 'undefined' || typeof jQuery === 'undefined') {
             return;
        }

        addButton('В одобренные', MOVE_BUTTON_ID);

        $(document).on('click', `#${MOVE_BUTTON_ID}`, () => {
            // Вызываем функцию перемещения
            moveThread(NODE_TARGET, PREFIX_ID);
        });
    });

})();