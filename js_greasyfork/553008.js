// ==UserScript==
// @name         Кураторы форума || KIROV 
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Специально для BlackRussia || KIROV
// @author       Roman_Innocence
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://ltdfoto.ru/images/2025/03/30/FOTO5ede3108d5ce4811.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/553008/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20KIROV.user.js
// @updateURL https://update.greasyfork.org/scripts/553008/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%7C%20KIROV.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // ====== Префиксы ======
  const UNACCEPT_PREFIX = 4;
  const ACCEPT_PREFIX = 8;
  const PIN_PREFIX = 2;
  const COMMAND_PREFIX = 10;
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECIAL_PREFIX = 11;
  const GA_PREFIX = 12;
  const TECH_PREFIX = 13;

  // ====== Получение данных темы ======
  async function getThreadData() {
    const username = (window.XF && XF.context && XF.context.user ? XF.context.user : null);
    const user = {
      name: username ? username.username : 'игрок',
      mention: username ? `[USER=${username.user_id}]${username.username}[/USER]` : '{{ user.mention }}'
    };
    const greeting = `Доброго времени суток, уважаемый ${user.mention}`;
    return { greeting, user };
  }

  // ====== Кнопки (все шаблоны из Tambov, без изображений) ======
  const buttons = [
    {
      title: `____________________________________________________ПРИВЕТСТВИЕ____________________________________________________`,
      dpstyle: `oswald: 3px; color: #ffff00; background: #ffffee; box-shadow: 0 0 2px rgba(0,0,0,0.14), 0 2px 2px rgba(0,0,0,0.12); border: none; border-color: #FF0000`,
      content: `[B]\${greeting}.[/B]<br><br>`
    },

    {
      title: 'DM',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>
[I][COLOR=rgb(209, 213, 216)][FONT=times new roman]Нарушитель будет наказан по следующему пункту правил:[/FONT][/COLOR][/I]<br><br>
[COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.19.[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен DM — убийство или нанесение урона без веской IC причины[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут[/FONT][/COLOR]<br><br>
[COLOR=rgb(50, 205, 50)][FONT=times new roman]Одобрено.[/FONT][/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false
    },

    {
      title: 'DB',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Нарушитель будет наказан по пункту:[/COLOR]<br><br>
[COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB — убийство машиной игрока без веской IC причины[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR]<br><br>
[COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false
    },

    {
      title: 'NRP обман',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Нарушитель будет наказан по пункту:[/COLOR]<br><br>
[COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также IC обманы с нарушением RP логики[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/COLOR]<br><br>
[COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false
    },

    {
      title: 'Flood / CAPS / Offtop',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Вам выдано наказание за нарушение правил форума (Flood / CAPS / Offtop). Пожалуйста, соблюдайте правила ресурса.[/COLOR]<br><br>
[COLOR=rgb(255, 0, 0)]Предупреждение выдано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false
    },

    {
      title: 'Жалоба не по форме',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Ваша жалоба отклонена, так как составлена не по установленной форме. Ознакомьтесь с шаблоном подачи жалоб.[/COLOR]<br><br>
[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false
    },

    {
      title: 'Недостаточно доказательств',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Недостаточно доказательств для принятия решения. Просьба приложить более полное видео или скриншоты.[/COLOR]<br><br>
[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false
    },

    {
      title: 'Закрытие темы',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Тема закрыта. Если у вас остались вопросы, обратитесь к администрации через личные сообщения.[/COLOR]<br><br>
[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false
    },

    {
      title: 'Передано старшему составу',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Ваша жалоба передана старшему составу администрации для дальнейшего рассмотрения.[/COLOR]<br><br>
[COLOR=rgb(50, 205, 50)]На рассмотрении.[/COLOR][/CENTER]`,
      prefix: PIN_PREFIX,
      status: true
    },

    {
      title: 'Передано Техническому специалисту',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Ваш вопрос был передан техническому специалисту для проверки и решения проблемы.[/COLOR]<br><br>
[COLOR=rgb(50, 205, 50)]На рассмотрении.[/COLOR][/CENTER]`,
      prefix: TECH_PREFIX,
      status: true
    },

    {
      title: 'Принято',
      content: `[CENTER][COLOR=rgb(255, 69, 0)][I]{{ user.mention }}, доброго времени суток.[/I][/COLOR]<br><br>
[COLOR=rgb(209, 213, 216)]Жалоба рассмотрена, нарушитель будет наказан по соответствующим пунктам правил.[/COLOR]<br><br>
[COLOR=rgb(50, 205, 50)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false
    }
  ];

  // ====== Интерфейс ======
  function addButton(name, id, style = '') {
    const html = `<button type="button" class="button rippleButton" id="${id}" style="${style}; margin: 3px;">${name}</button>`;
    const anchor = document.querySelector('.button--icon--reply') || document.querySelector('button[data-button="reply"]');
    if (anchor) anchor.insertAdjacentHTML('beforebegin', html);
    else document.body.insertAdjacentHTML('beforeend', html);
  }

  function buttonsMarkup(buttonsArray) {
    let markup = '<div style="max-height:400px; overflow:auto;">';
    buttonsArray.forEach((btn, idx) => {
      const style = btn.dpstyle ? `style="${btn.dpstyle}"` : '';
      markup += `<div style="margin:6px 0;"><button id="answers-${idx}" ${style} class="button">${btn.title}</button></div>`;
    });
    markup += '</div>';
    return markup;
  }

  function pasteContent(id, threadData, setPrefix = false) {
    const btn = buttons[id];
    if (!btn) return;
    const greeting = threadData.greeting || '';
    const user = threadData.user || {};
    let content = btn.content;
    content = content.replace(/\$\{greeting\}/g, greeting);
    if (user.mention) content = content.replace(/\{\{\s*user\.mention\s*\}\}/g, user.mention);
    const ta = document.querySelector('textarea[name="message"]') || document.querySelector('textarea.cke_source');
    if (ta) {
      ta.value = (ta.value ? (ta.value + '\n\n') : '') + content;
      ta.focus();
    } else {
      prompt('Скопируйте ответ:', content);
    }
    if (setPrefix && typeof editThreadData === 'function' && btn.prefix !== undefined) {
      editThreadData(btn.prefix, !!btn.status);
    }
  }

  // ====== Инициализация ======
  $(document).ready(async () => {
    if (!window.Handlebars) {
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    }

    addButton('На рассмотрение', 'pin', 'border-radius: 13px; border: 2px solid; border-color: rgba(255,165,0,0.5)');
    addButton('Одобрено', 'accepted', 'border-radius: 13px; border: 2px solid; border-color: rgba(152,251,152,0.5)');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; border: 2px solid; border-color: rgba(255,36,0,0.5)');
    addButton('Закрыто', 'close', 'border-radius: 13px; border: 2px solid; border-color: rgba(255,36,0,0.5)');
    addButton('Ответы', 'admin-otvet', 'border-radius: 13px; border: 2px solid;');

    const threadData = await getThreadData();

    $('#pin').click(() => { if (typeof editThreadData === 'function') editThreadData(PIN_PREFIX, true); });
    $('#accepted').click(() => { if (typeof editThreadData === 'function') editThreadData(ACCEPT_PREFIX, false); });
    $('#unaccept').click(() => { if (typeof editThreadData === 'function') editThreadData(UNACCEPT_PREFIX, false); });
    $('#close').click(() => { if (typeof editThreadData === 'function') editThreadData(CLOSE_PREFIX, false); });

    $('#admin-otvet').click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        $(`#answers-${id}`).click(() => pasteContent(id, threadData, !!btn.prefix));
      });
    });
  });

})();
