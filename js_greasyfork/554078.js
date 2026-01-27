// ==UserScript==
// @name         Penza | Скрипт для ЗГС/ГС ГОСС
// @namespace    https://forum.blackrussia.online
// @version      1.0.3
// @description  Скрипт для руковоства ГОСС сервера Penza
// @author       Yuri_Germany
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2026,
// @icon https://avatars.mds.yandex.net/i?id=2e5b30b9c5657d05784ad9708e8c9b3597a65679-12890014-images-thumbs&n=13
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/554078/Penza%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/554078/Penza%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DECLINED_PREFIX = 4;
    const SPECY_PREFIX = 11;
    const APPROVED_PREFIX = 8;
    const WAIT_PREFIX = 2;
    const TECH_PREFIX = 13;
    const WATCHED_PREFIX = 9;
    const CLOSED_PREFIX = 7;
    const HA_PREFIX = 12;
  const COMMAND_PREFIX = 10;

    const START_COLOR_1 = `<font color=#7CFC00>`
    const START_COLOR_2 = `<font color=#F0FFFF>`
    const END_COLOR = `</font>`

    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`
    const cats = [
        {
          title: 'Приветствие',
          content:
         `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
        },
            {
          title: 'Заявки на рассмотрение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}Здравствуйте уважаемые игроки${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Заявки были взяты${END_COLOR} ${START_COLOR_1}на рассмотрение!${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ожидайте расмотрения от ГС/ЗГС ГОСС${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}На расмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
        {
          title: 'Донабор',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1},Здравствуйте уважаемые игроки${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2} Заявки открыты на ${END_COLOR} ${START_COLOR_1}донабор!${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Скорее подавайте!${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Ожидание...${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
            {
          title: 'Жалобу на рассмотрение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
            {
          title: 'Запрос док-ва у лд',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Запросил доказательства у${END_COLOR} ${START_COLOR_1}лидера.${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },

      {
          title: '======================================> Одобрение жалобы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #228B22; border-color: #E6E6FA',
      },
      {
          title: 'Проинструкировать',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Благодарим за ваше обращение! Лидер будет${END_COLOR}${START_COLOR_1} проинструктирован${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WATCHED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ошибка лд',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В следствие беседы с лидером, было выяснено, наказание было выдано${END_COLOR}${START_COLOR_1} по ошибке${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Ваше наказание будет снято в ближайшее время, если оно еще не снято.${END_COLOR}<br><br>` +
        `${START_COLOR_2}Приносим извинения за предоставленные неудобства.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WATCHED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: '======================================> Отказ жалобы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #228B22; border-color: #E6E6FA',
      },
      {
          title: 'Нет нарушений',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}от лидера нет нарушений${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: 'Лд прав',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Лидер предоставил ${END_COLOR} ${START_COLOR_1}доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
     {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: 'Не является лд',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Данный игрок не является${END_COLOR} ${START_COLOR_1}лидером организации.${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
   {
          title: 'Не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба составлена ${END_COLOR}${START_COLOR_1}не по форме${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
          {
          title: 'Не логируется',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}По данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.${START_COLOR_1}${END_COLOR}${START_COLOR_2}${END_COLOR}.<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Некоректный заголовок / содержание темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Жалоба в таком виде рассмотрена${END_COLOR} ${START_COLOR_1}не будет${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет доказательств',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В вашей жалобе${END_COLOR} ${START_COLOR_1}отсутствуют доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Недостаточно доказательств',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}их недостаточно для выдачи наказания игроку${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства обрываются',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваши доказательства${END_COLOR} ${START_COLOR_1}обрываются${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства отредактированы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения,${END_COLOR} ${START_COLOR_1}могут быть не рассмотрены в качестве доказательств${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства подделаны',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт${END_COLOR} ${START_COLOR_1}будет заблокирован${END_COLOR}${START_COLOR_2}за поделку доказательств и обман администрации.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в плохом качестве',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваши доказательства в${END_COLOR} ${START_COLOR_1}плохом качестве${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нерабочая ссылка',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ссылка на Ваши доказательства${END_COLOR} ${START_COLOR_1}не работает либо доступ по ссылке закрыт${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательствам более 72 часов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вашим доказательствам${END_COLOR} ${START_COLOR_1}более 72 часов${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нужен фрапс',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}На подобные виды нарушений необходимо предоставить${END_COLOR} ${START_COLOR_1}видео доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет /time',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В ваших доказательствах отсутствует${END_COLOR} ${START_COLOR_1}/time${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет иконки сервера',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В ваших доказательствах отсутствует${END_COLOR} ${START_COLOR_1}иконка сервера${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет тайм-кодов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Если видео доказательства длятся более трёх минут, то вы должны указать${END_COLOR} ${START_COLOR_1}тайм-коды их ключевых моментов${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Дубликат темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вам уже был дан конкретный ответ в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}. За создание дубликатов этой темы Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Не тот сервер',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись сервером${END_COLOR}${START_COLOR_2}. Пересоздайте свою жалобу в разделе нужного вам сервера - *<a href='https://forum.blackrussia.online/#igrovye-servera.12'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на администрацию',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на администрацию - *<a href='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2414/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на сотрудников фракций',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на сотрудников организаций.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: 'В жб на СС фракций',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на Страший состав вашей организации.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
          {
          title: '======================================> Еженедельный отчет <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #228B22; border-color: #E6E6FA',
      },
         {
          title: 'Еженедельник +50',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}Здравствуйте уважаемый лидер${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Еженедельный отчет был успешно${END_COLOR} ${START_COLOR_1}просмотрен${END_COLOR}${START_COLOR_2}!${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы получаете +50 баллов в таблицу лидеров.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WATCHED_PREFIX,
          status: false,
          move: 2428,
      },
               {
          title: 'Еженедельник +20',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/P52NzDxb/Verh.png"><br>` +
         `${START_COLOR_1}Здравствуйте уважаемый лидер${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Еженедельный отчет был успешно${END_COLOR} ${START_COLOR_1}просмотрен${END_COLOR}${START_COLOR_2}!${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы получаете +20 баллов в таблицу лидеров.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/m2SrB97X/Niz.png"><br>` +
          `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WATCHED_PREFIX,
          status: false,
          move: 2428,
      },
    ];

  const bgButtons = document.querySelector(".pageContent");
  const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.style.color = "#FFFFFF";
  button.style.backgroundColor = "#212529";
  button.style.borderColor = "#6c757d";
  button.style.borderRadius = "13px";
  button.style.borderStyle = "solid";
  button.style.borderWidth = "1px";
  button.style.padding = "0.5rem 1rem";
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

  const Button51 = buttonConfig("Жалобы", 'https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2415/');
  const Button52 = buttonConfig("Лд раздел", 'https://forum.blackrussia.online/forums/Раздел-государственных-организаций.2425/');
  const Button53 = buttonConfig("АБ", 'https://forum.blackrussia.online/threads/penza-Антиблат-старшего-состава-ГОСС.13678103/page-21#post-59492922');
  const Button54 = buttonConfig("Госс", 'https://forum.blackrussia.online/forums/Государственные-организации.2391/');
  const Button56 = buttonConfig("Заявки", 'https://forum.blackrussia.online/forums/Лидеры.3141/');

  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button56);

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFA500');
        addButton('Рассмотрено', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #0000FF');
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000');
        addButton('Меню ГОСС', 'selectCatsAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E9967A')

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true));
        $('button#tech').click(() => editThreadData(0, WATCHED_PREFIX, true));
        $('button#accepted').click(() => editThreadData(0, APPROVED_PREFIX, false));
        $('button#watch').click(() => editThreadData(0, WATCHED_PREFIX, false));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#close').click(() => editThreadData(0, CLOSED_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(0, DECLINED_PREFIX, false));

        $(`button#selectComplaintAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
        $(`button#selectCatsAnswer`).click(() => {
            XF.alert(buttonsMarkup(cats), null, 'Выберите ответ:');
            cats.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
        $(`button#selectMoveTask`).click(() => {
            XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });

    function addButton(name, id, hex="grey") {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #C0C0C0; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #C0C0C0; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent2(id, data = {}, send = false) {
        const template = Handlebars.compile(cats[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(cats[id].move, cats[id].prefix, cats[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
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