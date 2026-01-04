// ==UserScript==
// @name         Кураторы форума | CHEREPOVETS - RP Биографии
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Кнопки-ответы для кураторов: RP биографии (Одобрено/На рассмотрении/На доработку/Отказы по правилам)
// @author       Persona_Capone (обновлено)
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548806/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20CHEREPOVETS%20-%20RP%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/548806/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20CHEREPOVETS%20-%20RP%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Префиксы
    const ACCEPT_PREFIX = 8;   // Одобрено
    const REVIEW_PREFIX = 9;   // На рассмотрении
    const REVISION_PREFIX = 7; // На доработку
    const DENY_PREFIX = 6;     // Отказ

    const BANNER = 'https://i.postimg.cc/QC0bfZff/5091-DADF-C098-41-B5-B63-A-48-D035-EEC282.png';
    const DIVIMG = 'https://i.postimg.cc/fTh4W2B3/RLwzo.png';

    // Шаблоны кнопок
    const buttons = [

        // Одобрено
        {
            title: 'Одобрено',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#00FF00]Одобрено[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT='Times New Roman', Verdana][SIZE=5][COLOR=#00FF00]ОДОБРЕНО[/COLOR]<br><br>` +
                `[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS[/COLOR].[/RIGHT][/SIZE][/FONT][/CENTER]`,
            prefix: ACCEPT_PREFIX
        },

        // На рассмотрение
        {
            title: 'На рассмотрение',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `<br>[B][COLOR=#FFFF00][SIZE=4]Ваша RP биография принята на рассмотрение.[/SIZE][/COLOR][/B]` +
                `<br><br>[FONT=arial][SIZE=4]Ожидайте ответа от администрации в течение 72 часов. Просьба не создавать дубликатов.[/SIZE][/FONT][/CENTER]`,
            prefix: REVIEW_PREFIX
        },

        // На доработку
        {
            title: 'На доработку',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FFA500]На доработку[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FFA500]НА ДОРАБОТКУ[/COLOR]<br><br>` +
                `Причина: (перечислите замечания: орфография, не хватает информации, нет фото и пр.).<br>` +
                `На исправление даётся 24 часа. Если правки не внесёте — тема будет отказана.[/FONT][/CENTER]`,
            prefix: REVISION_PREFIX
        },

        // Отказы (по 10 пунктам правил)
        {
            title: 'Отказано — Заголовок',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Неверный заголовок.<br>` +
                `Примечание: Заголовок RP биографии должен быть: [B]Биография | Nick_Name[/B].<br>` +
                `Возможные ошибки:<br>` +
                `• Использован NonRP никнейм.<br>` +
                `• В заголовке нет слова «Биография».<br>` +
                `• Ник написан не по правилам (с подчёркиванием или на латинице).[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Сверхспособности',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Биография нереалистична — персонаж обладает сверхспособностями.<br>` +
                `Примечание: Персонаж не может обладать суперспособностями или событиями, противоречащими логике сервера.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Существующий человек',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Запрещено составлять биографию существующих людей.<br>` +
                `Примечание: Примеры: Бред Питт, Аль Капоне и т.д.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Плагиат',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Обнаружено копирование чужой RP биографии.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Грамматика/Орфография',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Биография содержит грамматические или орфографические ошибки.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Шрифт/Размер',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Использован неправильный шрифт или размер текста.<br>` +
                `Примечание: Допустимы Times New Roman или Verdana, минимальный размер — 15.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Нет фото/материалов',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: В биографии отсутствуют фотографии или материалы, относящиеся к персонажу.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Пропаганда нарушений',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: В биографии описаны факторы, позволяющие нарушать правила сервера.<br>` +
                `Пример: персонаж психически больной и убивает всех, кого видит.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Неверный объём',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: Текст не соответствует требованиям по объёму.<br>` +
                `Минимум 200 слов, максимум 600 слов.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        },
        {
            title: 'Отказано — Логические противоречия',
            content:
                `[B][CENTER][IMG]${BANNER}[/IMG]` +
                `[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br>` +
                `[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]` +
                `[IMG]${DIVIMG}[/IMG]<br><br>` +
                `[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br>` +
                `Причина: В биографии обнаружены логические противоречия.<br>` +
                `Пример: указали 16 лет, но персонаж уже окончил университет и открывает свой бизнес.[/FONT][/CENTER]`,
            prefix: DENY_PREFIX
        }
    ];

    // Получаем данные темы
    function getThreadData() {
        const usernameEl = document.querySelector('a.username');
        let authorID = 0, authorName = 'Игрок';
        if (usernameEl) {
            authorID = usernameEl.getAttribute('data-user-id') || 0;
            authorName = usernameEl.textContent.trim() || authorName;
        }
        const hours = new Date().getHours();
        const greeting = (hours > 4 && hours <= 11) ? 'Доброе утро' : (hours <= 15 ? 'Добрый день' : (hours <= 21 ? 'Добрый вечер' : 'Доброй ночи'));
        return { user: { id: authorID, name: authorName, mention: `[USER=${authorID}]${authorName}[/USER]` }, greeting };
    }

    // Вставка контента
    function pasteContent(template) {
        const data = getThreadData();
        let bbcode = template.content.replace(/{{ greeting }}/g, data.greeting).replace(/{{ user\.mention }}/g, data.user.mention);
        const editor = document.querySelector('div.fr-element.fr-view');
        if (editor) editor.innerHTML = bbcode;
        else prompt('Скопируйте BB-код и вставьте в ответ на форуме:', bbcode);
    }

    // Кнопки интерфейса
    function addButton(name, id) {
        const replyBtn = document.querySelector('.button--icon--reply');
        if (!replyBtn) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'button--primary button rippleButton';
        btn.id = id;
        btn.style.cssText = 'border-radius:0;border-color:teal;border-style:dashed solid;margin-right:7px;margin-bottom:10px;background:teal;';
        btn.textContent = name;
        replyBtn.parentNode.insertBefore(btn, replyBtn);
    }

    function buttonsMarkup(arr) {
        return arr.map((b, i) => `<button id="answers-${i}" class="button--primary button rippleButton" style="border-radius:0;margin-right:10px;margin-bottom:10px">${b.title}</button>`).join('');
    }

    function init() {
        addButton('Ответы', 'selectAnswer');
        const btn = document.getElementById('selectAnswer');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const panel = document.createElement('div');
            panel.style.cssText = 'position:fixed;left:50%;top:10%;transform:translateX(-50%);background:#222;padding:12px;border-radius:8px;z-index:99999;color:#fff;max-height:70vh;overflow:auto;';
            panel.innerHTML = `<div>${buttonsMarkup(buttons)}</div><div style="text-align:right;margin-top:8px;"><button id="closeAnswers" class="button--primary button">Закрыть</button></div>`;
            document.body.appendChild(panel);
            document.getElementById('closeAnswers').onclick = () => panel.remove();
            buttons.forEach((b, i) => {
                document.getElementById(`answers-${i}`).onclick = () => {
                    pasteContent(b);
                    panel.remove();
                };
            });
        });
    }

    init();

})();