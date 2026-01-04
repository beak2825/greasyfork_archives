// ==UserScript==
// @name         Скрипт для КФ ROSTOV 29
// @name:ru      Script by Zhenish Orozbaev
// @description  Скрипт для кураторов сервера ROSTOV
// @author       Zhenish_Orozbaev
// @version      1.04
// @namespace    https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @supportURL   https://vk.com/zhenish_orozbaev
// @downloadURL https://update.greasyfork.org/scripts/550312/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20ROSTOV%2029.user.js
// @updateURL https://update.greasyfork.org/scripts/550312/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20ROSTOV%2029.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Константы префиксов
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const RESHENO_PREFIX = 6;
    const PINN_PREFIX = 2;
    const GA_PREFIX = 12;
    const COMMAND_PREFIX = 10;
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECY_PREFIX = 11;
    const TEXY_PREFIX = 13;
    const OTKAZBIO_PREFIX = 4;
    const ODOBRENOBIO_PREFIX = 8;
    const NARASSMOTRENIIBIO_PREFIX = 2;
    const OTKAZRP_PREFIX = 4;
    const ODOBRENORP_PREFIX = 8;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const OTKAZORG_PREFIX = 4;
    const ODOBRENOORG_PREFIX = 8;
    const NARASSMOTRENIIORG_PREFIX = 2;

    // Функция для генерации подписи
    function generateSignature() {
        const styles = [
            'color: #FF5733; font-weight: bold; font-family: Arial, sans-serif;',
            'color: #33FF57; font-style: italic; font-family: Verdana, sans-serif;',
            'color: #3357FF; text-decoration: underline; font-family: Courier, monospace;',
            'color: #F033FF; font-weight: bold; text-shadow: 1px 1px 2px black;',
            'color: #33FFF0; font-style: italic; letter-spacing: 1px;'
        ];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        return `<div style="${randomStyle}">— Zhenish Orozbaev</div>`;
    }

    // Массив кнопок с исправленными данными
    const buttons = [
        {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ 🙅 Отказанные жалобы на игроков 🙅 ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ',
            dpstyle: 'oswald: 3px; color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
        },
        // ... остальные кнопки с исправленным контентом
        // В каждой кнопке в content добавляем generateSignature() в конце
        {
            title: 'На рассмотрении',
            content: `[CENTER]${generateSignature()}[/CENTER]<br>` +
                "[CENTER][FONT=Georgia][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/FONT][/CENTER]<br>" +
                "[CENTER][FONT=georgia][I][B]Приветствую.[/B][/I][/FONT][/CENTER]<br><br>" +
                "[CENTER][FONT=georgia][I][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме.[/B][/I][/FONT][/CENTER]<br><br>" +
                "[CENTER][B][COLOR=rgb(252, 94, 3)][SIZE=5][FONT=times new roman] ☯ На рассмотрении ☯ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
            prefix: PINN_PREFIX,
            status: true,
        },
        // ... остальные кнопки
    ];

    // Основная логика скрипта
    function init() {
        const targetNode = document.querySelector('.block-body');
        if (!targetNode) return;

        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    addButtons();
                }
            });
        });
        observer.observe(targetNode, config);
        addButtons();
    }

    function addButtons() {
        const postContainer = document.querySelector('.block-body');
        if (!postContainer || postContainer.querySelector('.zhenish-buttons')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'zhenish-buttons';
        buttonContainer.style.cssText = 'margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;';

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.title;
            button.style.cssText = btn.dpstyle || 'margin: 5px; padding: 10px; border: none; border-radius: 3px; background: #007bff; color: white; cursor: pointer;';
            button.onclick = function() {
                if (btn.content) {
                    const textArea = document.querySelector('textarea');
                    if (textArea) {
                        textArea.value = btn.content.replace(/{{ greeting }}/g, getGreeting()).replace(/{{ user\.mention }}/g, getUserMention());
                    }
                }
            };
            buttonContainer.appendChild(button);
        });

        postContainer.insertBefore(buttonContainer, postContainer.firstChild);
    }

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 6) return 'Доброй ночи';
        if (hour < 12) return 'Доброе утро';
        if (hour < 18) return 'Добрый день';
        return 'Добрый вечер';
    }

    function getUserMention() {
        const authorLink = document.querySelector('.message-name a');
        return authorLink ? authorLink.textContent : 'пользователь';
    }

    // Запуск скрипта
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();