// ==UserScript==
// @name         ФСБ | Скрипт для СС (9)
// @namespace    https://forum.blackrussia.online/
// @version      1.0
// @description  Специально для 9 ранга ФСБ
// @author       Тимофей.К
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562958/%D0%A4%D0%A1%D0%91%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D0%A1%20%289%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562958/%D0%A4%D0%A1%D0%91%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D0%A1%20%289%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BORDER = "[CENTER][COLOR=rgb(255, 215, 0)]一一一一一一一一一一一一一[/COLOR] [FONT=georgia][COLOR=rgb(255, 255, 255)]✪[/COLOR][/FONT] [COLOR=rgb(255, 215, 0)]一一一一一一一一一一一一一[/COLOR][/CENTER]";
    const BANNER = "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ncDgj0qt/2022-12-09-02-14-18.jpg[/img][/url][/CENTER]";

    const buttons = [
        { title: 'Одобрено (СС)', content: `[CENTER]${BANNER}\n${BORDER}\n[FONT=georgia][SIZE=4]Здравствуйте!\n\nВаша заявка/жалоба была внимательно изучена и получила статус:\n[COLOR=rgb(0, 255, 0)][B]ОДОБРЕНО[/B][/COLOR].\n\n[COLOR=rgb(209, 213, 216)]С уважением, Подполковник ФСБ [B]{user}[/B].[/COLOR][/SIZE][/FONT]\n${BORDER}[/CENTER]` },
        { title: 'Отказано (СС)', content: `[CENTER]${BANNER}\n${BORDER}\n[FONT=georgia][SIZE=4]Здравствуйте!\n\nК сожалению, ваше обращение получает статус:\n[COLOR=rgb(255, 0, 0)][B]ОТКАЗАНО[/B][/COLOR].\n\n[COLOR=rgb(209, 213, 216)]Причина: Несоблюдение формы или нехватка данных.[/COLOR]\n\nС уважением, СС ФСБ.[/SIZE][/FONT]\n${BORDER}[/CENTER]` },
        { title: 'Передано Лидеру', content: `[CENTER]${BANNER}\n${BORDER}\n[FONT=georgia][SIZE=4]Приветствую, уважаемый [B]{user}[/B].\n\nВаша тема [COLOR=rgb(30, 144, 255)][B]ПЕРЕДАНА ЛИДЕРУ[/B][/COLOR] (Полковнику ФСБ) для окончательного решения.\n\nПожалуйста, ожидайте ответа в этой теме.\n\nС уважением, Подполковник ФСБ.[/SIZE][/FONT]\n${BORDER}[/CENTER]` },
        { title: 'Проверка док-в', content: `[CENTER]${BANNER}\n${BORDER}\n[FONT=georgia][SIZE=4]На рассмотрении...\n\nЗапрашиваю доказательства и объяснительную у сотрудника.\n\nОжидайте ответа.[/SIZE][/FONT]\n${BORDER}[/CENTER]` }
    ];

    addButtonMenu(buttons);

    function addButtonMenu(btns) {
        const container = document.querySelector('.buttonGroup--filler') || document.body;
        const menu = document.createElement('div');
        menu.style = "display: flex; flex-wrap: wrap; gap: 5px; margin: 10px; padding: 10px; background: #0a0a0a; border-radius: 10px; border: 1px solid #1e90ff;";
        
        btns.forEach(btn => {
            const b = document.createElement('button');
            b.innerText = btn.title;
            b.style = "padding: 8px 15px; border-radius: 5px; border: none; background: #222; color: #1e90ff; cursor: pointer; font-weight: bold;";
            b.onclick = () => {
                const author = document.querySelector('.message-name').innerText.trim();
                const text = btn.content.replace(/{user}/g, author);
                const editor = document.querySelector('.fr-element');
                if (editor) editor.innerHTML = text;
            };
            menu.appendChild(b);
        });
        container.prepend(menu);
    }
})();