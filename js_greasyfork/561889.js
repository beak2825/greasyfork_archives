// ==UserScript==
// @name         36-40 | Перемещение тем
// @namespace    https://forum.blackrussia.online
// @version      0.0.1
// @description  -
// @author       Soul_Crown
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license    none
// @copyright 2026,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/561889/36-40%20%7C%20%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/561889/36-40%20%7C%20%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const PIN_PREFIX = 2 // На рассмотрение
    const EXPECTATION_PREFIX = 14 // Ожидание
    const CLOSE_PREFIX = 7 // Закрыто
    
 
  const tasks = [
      {
          title: '======================================> Технический раздел <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В технический раздел (36)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1628,
      },
      {
          title: 'В технических раздел (37)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1670,
      },
      {   
          title: 'В технический раздел (38)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1712,
      },
      {
          title: 'В технический раздел (39)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1758,
      },
      {
          title: 'В технический раздел (40)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1800,
      },
      {
          title: '======================================> Жалобы на тех. спецов <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на тех. спецов (36)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1627,
      },
      {
          title: 'В жалобы на тех. спецов (37)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1669,
      },
      {
          title: 'В жалобы на тех. спецов (38)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1711,
      },
      {
          title: 'В жалобы на тех. спецов (39)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1757,
      },
      {
          title: 'В жалобы на тех. спецов (40)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1799,
      },
      {
          title: '======================================> Жалобы на администрацию <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на администрацию (36)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1654,
      },
      {
          title: 'В жалобы на администрацию (37)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1696,
      },
      {
          title: 'В жалобы на администрацию (38)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1738,
      },
      {
          title: 'В жалобы на администрацию (39)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1784,
      },
      {
          title: 'В жалобы на администрацию (40)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1826,
      },
      {
          title: '======================================> Жалобы на лидеров <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на лидеров (36)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1655,
      },
      {
          title: 'В жалобы на лидеров (37)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1697,
      },
      {
          title: 'В жалобы на лидеров (38)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1739,
      },
      {
          title: 'В жалобы на лидеров (39)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1785,
      },
      {
          title: 'В жалобы на лидеров (40)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1827,
      },
      {
          title: '======================================> Жалобы на игроков <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на игроков (36)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1656,
      },
      {
          title: 'В жалобы на игроков (37)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1698,
      },
      {
          title: 'В жалобы на игроков (38)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1740,
      },
      {
          title: 'В жалобы на игроков (39)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1786,
      },
      {
          title: 'В жалобы на игроков (40)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1828,
      },
      {
          title: '======================================> Обжалование наказаний <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В обжалования  наказаний (36)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1657,
      },
      {
          title: 'В обжалования  наказаний (37)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1699,
      },
      {
          title: 'В обжалования  наказаний (38)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1741,
      },
      {
          title: 'В обжалования  наказаний (39)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1787,
      },
      {
          title: 'В обжалования  наказаний (40)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 1829,
      },
      {
          title: '======================================> Прочее <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В заявки с окончательным ответом',
          prefix: CLOSE_PREFIX,
          status: false,
          open: false,
          move: 230,
      }
    ]
  
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        addMoveTasks()
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });
    
    function addMoveTasks() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectMoveTasks" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Перемещение</button>`,
        );
    }
    
    function buttonsMarkup(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }
 
    function editThreadData(move, prefix, pin = false, open = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else if(pin == true && open){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    discussion_open: 1,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json'
                }),
            }).then(() => location.reload());
        }
        if (move > 0) {
            moveThread(prefix, move);
        }
    }
 
    function moveThread(prefix, type) {
        // Функция перемещения тем
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: type,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
 
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();