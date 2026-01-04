// ==UserScript==
// @name         Кураторы форума | CHEREPOVETS - RP Биографии
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Панель кнопок для RP биографий: Одобрено, На доработку, 10 отказов + Не по форме. BB-код с приветствием и пожеланием на сервере 89 Cherepovets.
// @author       Persona_Capone (обновлено)
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548809/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20CHEREPOVETS%20-%20RP%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/548809/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20CHEREPOVETS%20-%20RP%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttons = [
        { title: 'Одобрено', type: 'accept', reason: '', color: '#00cc44' },
        { title: 'На доработку', type: 'revision', reason: 'Нужно исправить орфографию, добавить фото или недостающую информацию.', color: '#ff9900' },
        { title: 'Не по форме', type: 'deny', reason: 'Неверная структура RP биографии. Используйте форму: Имя и фамилия персонажа, Пол, Возраст, Национальность, Образование, Описание внешности, Характер, Детство, Настоящее, Итог.', color: '#ff3300' },
        { title: 'Отказ — Заголовок', type: 'deny', reason: 'Заголовок RP биографии должен быть: Биография | Nick_Name.', color: '#ff3300' },
        { title: 'Отказ — Сверхспособности', type: 'deny', reason: 'Биография содержит нереалистичные элементы (сверхспособности, нереальные достижения).', color: '#ff3300' },
        { title: 'Отказ — Существующий человек', type: 'deny', reason: 'Запрещено составлять биографии существующих людей (например, Бред Питт, Аль Капоне).', color: '#ff3300' },
        { title: 'Отказ — Плагиат', type: 'deny', reason: 'Обнаружено копирование чужой RP биографии.', color: '#ff3300' },
        { title: 'Отказ — Грамматика/Орфография', type: 'deny', reason: 'Биография содержит грамматические или орфографические ошибки.', color: '#ff3300' },
        { title: 'Отказ — Шрифт/Размер', type: 'deny', reason: 'Использован неправильный шрифт или размер текста (должен быть Times New Roman или Verdana, минимум 15).', color: '#ff3300' },
        { title: 'Отказ — Нет фото/материалов', type: 'deny', reason: 'В биографии отсутствуют фото или материалы, относящиеся к персонажу.', color: '#ff3300' },
        { title: 'Отказ — Пропаганда нарушений', type: 'deny', reason: 'Биография содержит элементы, позволяющие нарушать правила сервера.', color: '#ff3300' },
        { title: 'Отказ — Неверный объём', type: 'deny', reason: 'Минимальный объём RP биографии — 200 слов, максимальный — 600.', color: '#ff3300' },
        { title: 'Отказ — Логические противоречия', type: 'deny', reason: 'В биографии обнаружены логические противоречия (например, возраст персонажа не соответствует достижениям).', color: '#ff3300' }
    ];

    function getThreadData() {
        const usernameEl = document.querySelector('a.username');
        const authorID = usernameEl ? usernameEl.getAttribute('data-user-id') || 0 : 0;
        const authorName = usernameEl ? usernameEl.textContent.trim() : 'Игрок';
        const hours = new Date().getHours();
        const greeting = (hours > 4 && hours <= 11) ? 'Доброе утро' : (hours <= 15 ? 'Добрый день' : (hours <= 21 ? 'Добрый вечер' : 'Доброй ночи'));
        return { user: { id: authorID, name: authorName, mention: '[USER=' + authorID + ']' + authorName + '[/USER]' }, greeting };
    }

    function insertBBCode(template) {
        const editor = document.querySelector('div.fr-element.fr-view');
        if (editor) {
            editor.innerHTML = template;
        } else {
            prompt('Скопируйте BB-код и вставьте в ответ на форуме:', template);
        }
    }

    function createButtonPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;left:50%;top:10%;transform:translateX(-50%);background:#222;padding:12px;border-radius:8px;z-index:99999;color:#fff;max-height:80vh;overflow:auto;';

        buttons.forEach((b, i) => {
            const btn = document.createElement('button');
            btn.textContent = b.title;
            btn.style.cssText = `background:${b.color};color:#fff;border:none;padding:6px 10px;margin:4px;border-radius:4px;cursor:pointer;`;
            btn.addEventListener('click', () => {
                const data = getThreadData();
                const bb = `[B][COLOR=${b.color}]${b.title}[/COLOR][/B]\n${b.reason ? b.reason + '\n' : ''}${data.greeting}, ${data.user.mention}!\n\nПриятной игры на сервере Black Russia, 89 Cherepovets.`;
                insertBBCode(bb);
            });
            panel.appendChild(btn);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Закрыть';
        closeBtn.style.cssText = 'background:#555;color:#fff;border:none;padding:6px 10px;margin:4px;border-radius:4px;cursor:pointer;';
        closeBtn.addEventListener('click', () => panel.remove());
        panel.appendChild(closeBtn);

        document.body.appendChild(panel);
    }

    function addMainButton() {
        const replyBtn = document.querySelector('.button--icon--reply');
        if (!replyBtn) return;
        const btn = document.createElement('button');
        btn.textContent = 'RP Ответы';
        btn.style.cssText = 'border-radius:0;border-color:teal;border-style:dashed solid;margin-right:7px;margin-bottom:10px;background:teal;color:#fff;padding:6px 10px;cursor:pointer;';
        replyBtn.parentNode.insertBefore(btn, replyBtn);
        btn.addEventListener('click', createButtonPanel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addMainButton);
    } else {
        addMainButton();
    }
})();