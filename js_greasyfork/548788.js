// ==UserScript==
// @name         Модератор форума | BR x 89 by E.Sailauov
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Кнопки-ответы для кураторов: RP биографии (Одобрено/На рассмотрении/На доработку/Отказы по пунктам правил)
// @author       Erasyl_Sailauov (обновлено)
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548788/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20BR%20x%2089%20by%20ESailauov.user.js
// @updateURL https://update.greasyfork.org/scripts/548788/%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20BR%20x%2089%20by%20ESailauov.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -- Настройки префиксов (при необходимости поменяй на свои ID префиксов)
  const ACCEPT_PREFIX = 8;   // одобрено
  const REVIEW_PREFIX = 9;   // на рассмотрении
  const REVISION_PREFIX = 7; // на доработку
  const DENY_PREFIX = 6;     // отказ
  // баннеры
  const BANNER = 'https://i.postimg.cc/QC0bfZff/5091-DADF-C098-41-B5-B63-A-48-D035-EEC282.png';
  const DIVIMG = 'https://i.postimg.cc/fTh4W2B3/RLwzo.png';

  // Список кнопок/шаблонов для RP биографии
  const buttons = [

    // Одобрено
    {
      title: 'Одобрено',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#00FF00]Одобрено[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT='Times New Roman', Verdana][SIZE=5][COLOR=#00FF00]ОДОБРЕНО[/COLOR]<br><br>" +
        "[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS[/COLOR].[/RIGHT][/SIZE][/FONT][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false
    },

    // На рассмотрение
    {
      title: 'На рассмотрение',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "<br>[B][COLOR=#FFFF00][SIZE=4]Ваша RP биография принята на рассмотрение.[/SIZE][/COLOR][/B]" +
        "<br><br>[FONT=arial][SIZE=4]Ожидайте ответа от администрации в течение 72 часов. Просьба не создавать дубликатов.[/SIZE][/FONT][/CENTER]",
      prefix: REVIEW_PREFIX,
      status: false
    },

    // На доработку (общий)
    {
      title: 'На доработку',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FFA500]На доработку[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FFA500]НА ДОРАБОТКУ[/COLOR]<br><br]" +
        "Причина: (перечислите замечания: орфография, не хватает информации, нет фото и пр.).<br>" +
        "На исправление даётся 24 часа. Если правки не внесёте — тема будет отказана.[/FONT][/CENTER]",
      prefix: REVISION_PREFIX,
      status: false
    },

    // Отказы — по каждому пункту правил RP Биографии:

    // 1.1 Не по форме (заголовок)
    {
      title: 'Отказано | Не по форме (заголовок)',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Заголовок темы составлен не по форме.<br>" +
        "Примечание: Заголовок RP биографии должен быть: [B]Биография | Nick_Name[/B].[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.2 Нереалистично (сверхспособности)
    {
      title: 'Отказано | Нереалистично (сверхспособности)',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Биография нереалистична.<br>" +
        "Примечание: Биография должна быть составлена реалистично — персонаж не может обладать сверхспособностями или событиями, противоречащими логике сервера.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.3 Существующий человек
    {
      title: 'Отказано | Существующий человек',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Запрещено составлять биографии реальных людей.<br>" +
        "Примечание: Примеры: биография Бреда Питта, Аль Капоне и т.д.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.4 Плагиат
    {
      title: 'Отказано | Плагиат',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Обнаружено копирование чужой RP биографии.<br>" +
        "Примечание: Полное и частичное копирование запрещено.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.5 Грамматические/орфографические ошибки
    {
      title: 'Отказано | Грамматика / Орфография',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Биография содержит орфографические или грамматические ошибки.<br>" +
        "Примечание: Биография должна быть читабельной и не содержать ошибок.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.6 Неправильный шрифт/размер
    {
      title: 'Отказано | Шрифт / Размер',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Использован неправильный шрифт или размер текста.<br>" +
        "Примечание: Допустимы Times New Roman или Verdana; минимальный размер — 15.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.7 Нет фото / материалов
    {
      title: 'Отказано | Нет фото / материалов',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: В биографии отсутствуют фотографии или иные материалы.<br>" +
        "Примечание: В биографии должны присутствовать изображения или материалы, относящиеся к персонажу.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.8 Пропаганда нарушений (элементы, позволяющие нарушать правила)
    {
      title: 'Отказано | Пропаганда нарушений',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Биография содержит элементы, оправдывающие или поощряющие нарушения правил сервера.<br>" +
        "Примечание: Запрещено описывать, что персонаж стал психически неуравновешенным и убивает всех подряд и т.п.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.9 Неверный объём
    {
      title: 'Отказано | Неверный объём',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: Текст не соответствует требованиям по объёму.<br>" +
        "Примечание: Минимум 200 слов, максимум 600 слов.[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    },

    // 1.10 Логические противоречия
    {
      title: 'Отказано | Логические противоречия',
      content:
        "[B][CENTER][IMG]" + BANNER + "[/IMG]" +
        "[SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br>" +
        "[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано[/COLOR].[/SIZE][/FONT][/B]" +
        "[IMG]" + DIVIMG + "[/IMG]<br><br>" +
        "[CENTER][FONT=arial][SIZE=4][COLOR=#FF0000]ОТКАЗАНО[/COLOR]<br><br]" +
        "Причина: В тексте обнаружены логические противоречия.<br>" +
        "Примечание: Указывайте возраст и достижения, соответствующие логике (напр., нельзя в 16 лет закончить университет и открыть прибыльный бизнес).[/FONT][/CENTER]",
      prefix: DENY_PREFIX,
      status: false
    }

  ]; // end buttons

  // Загружаем Handlebars (если ещё не загружен)
  (function loadHandlebars() {
    if (typeof Handlebars === 'undefined') {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js';
      document.head.appendChild(s);
    }
  })();

  // Вспомогательные функции — вставка кнопки, отрисовка списка, вставка контента
  function addButton(name, id) {
    var replyBtn = document.querySelector('.button--icon--reply');
    if (!replyBtn) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button--primary button rippleButton';
    btn.id = id;
    btn.style.cssText = 'border-radius:0;border-color:teal;border-style:dashed solid;margin-right:7px;margin-bottom:10px;background:teal;';
    btn.textContent = name;
    replyBtn.parentNode.insertBefore(btn, replyBtn);
  }

  function buttonsMarkup(arr) {
    return arr.map(function (b, i) {
      return '<button id="answers-' + i + '" class="button--primary button rippleButton" style="border-radius:0; margin-right:10px; margin-bottom:10px"><span class="button-text">' + b.title + '</span></button>';
    }).join('');
  }

  function pasteContent(id, data, send) {
    if (typeof Handlebars === 'undefined') {
      alert('Handlebars не загружен. Обновите страницу и попробуйте снова.');
      return;
    }
    var template = Handlebars.compile(buttons[id].content);
    var bb = template(data);

    var editor = document.querySelector('div.fr-element.fr-view');
    if (editor) {
      // вставляем BB-код как HTML (редактор XenForo обычно отображает bbcode)
      editor.innerHTML = bb;
    } else {
      // Если редактор не найден — показываем окно для копирования
      prompt('Скопируйте BB-код и вставьте в ответ на форуме:', bb);
    }

    if (send) {
      var submitBtn = document.querySelector('.button--icon.button--icon--reply.rippleButton');
      if (submitBtn) submitBtn.click();
    }
  }

  function getThreadData() {
    var usernameEl = document.querySelector('a.username');
    var authorID = 0, authorName = 'Игрок';
    if (usernameEl) {
      authorID = usernameEl.getAttribute('data-user-id') || 0;
      authorName = usernameEl.textContent.trim() || authorName;
    }
    var hours = new Date().getHours();
    var greeting = (hours > 4 && hours <= 11) ? 'Доброе утро' : (hours <= 15 ? 'Добрый день' : (hours <= 21 ? 'Добрый вечер' : 'Доброй ночи'));
    return {
      user: { id: authorID, name: authorName, mention: '[USER=' + authorID + ']' + authorName + '[/USER]' },
      greeting: greeting
    };
  }

  function init() {
    addButton('Ответы', 'selectAnswer');
    var btn = document.getElementById('selectAnswer');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var data = getThreadData();
      var panel = document.createElement('div');
      panel.style.cssText = 'position:fixed;left:50%;top:10%;transform:translateX(-50%);background:#222;padding:12px;border-radius:8px;z-index:99999;color:#fff;max-height:70vh;overflow:auto;';
      panel.innerHTML = '<div>' + buttonsMarkup(buttons) + '</div><div style="text-align:right;margin-top:8px;"><button id="closeAnswers" class="button--primary button">Закрыть</button></div>';
      document.body.appendChild(panel);

      buttons.forEach(function (b, idx) {
        var el = document.getElementById('answers-' + idx);
        if (el) el.addEventListener('click', function () {
          pasteContent(idx, data, false);
          panel.remove();
        });
      });

      document.getElementById('closeAnswers').addEventListener('click', function () { panel.remove(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();