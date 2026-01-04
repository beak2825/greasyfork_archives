// ==UserScript==
// @name         Penza | Скрипт для руководства сервера
// @namespace    https://forum.blackrussia.online
// @version      1.0.2
// @description  Скрипт для руко сервера Penza
// @author       Yuri_Germany
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2024,
// @icon https://avatars.mds.yandex.net/i?id=2e5b30b9c5657d05784ad9708e8c9b3597a65679-12890014-images-thumbs&n=13
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/555850/Penza%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/555850/Penza%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
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
  // Конфигурация снежинок
    const SNOW_CONFIG = {
        maxSnowflakes: 30,
        snowflakeCreationInterval: 500,
        columns: 12,
        minSize: 12,
        maxSize: 20,
        minDuration: 15,
        maxDuration: 25,
        minOpacity: 0.3,
        maxOpacity: 0.7
    };

    // Конфигурация гирлянды
    const GARLAND_CONFIG = {
        colors: [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFE66D',
            '#FFA5A5', '#9BDE7E', '#D4A5A5', '#FF9F68'
        ],
        animationSpeed: 1500,
        ballSize: 12,
        ballSpacing: 25,
        garlandHeight: 30,
        wireColor: '#2C3E50',
        wireHeight: 2
    };

    const START_COLOR_1 = `<font color=#DC143C>`
    const START_COLOR_2 = `<font color=#F0FFFF>`
    const END_COLOR = `</font>`

    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`

  const buttons = [
      {
         title: 'Приветствие',
         content:
         `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
      },
      {
          title: 'Жалобу на рассмотрение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: 'Передать теху',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба передана техническому специалисту${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: TECH_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: 'Передать главной администрации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба передана главной администрации${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: HA_PREFIX,
          status: true,
          move: 0,
      },
        {
          title: '======================================> Отказы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'Не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба составлена${END_COLOR}${START_COLOR_1}не по форме${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
          {
          title: 'Не логируется',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}По данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.${START_COLOR_1}${END_COLOR}${START_COLOR_2}${END_COLOR}.<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Некоректный заголовок / содержание темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Жалоба в таком виде рассмотрена${END_COLOR} ${START_COLOR_1}не будет${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет нарушений',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}от игрока нет нарушений${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет доказательств',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В вашей жалобе${END_COLOR} ${START_COLOR_1}отсутствуют доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Недостаточно доказательств',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}их недостаточно для выдачи наказания игроку${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства обрываются',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваши доказательства${END_COLOR} ${START_COLOR_1}обрываются${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства отредактированы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения,${END_COLOR} ${START_COLOR_1}могут быть не рассмотрены в качестве доказательств${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства подделаны',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт${END_COLOR} ${START_COLOR_1}будет заблокирован${END_COLOR}${START_COLOR_2}за поделку доказательств и обман администрации.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в плохом качестве',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваши доказательства в${END_COLOR} ${START_COLOR_1}плохом качестве${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нерабочая ссылка',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ссылка на Ваши доказательства${END_COLOR} ${START_COLOR_1}не работает либо доступ по ссылке закрыт${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательствам более 72 часов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вашим доказательствам${END_COLOR} ${START_COLOR_1}более 72 часов${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нужен фрапс',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}На подобные виды нарушений необходимо предоставить${END_COLOR} ${START_COLOR_1}видео доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет /time',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В ваших доказательствах отсутствует${END_COLOR} ${START_COLOR_1}/time${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет иконки сервера',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В ваших доказательствах отсутствует${END_COLOR} ${START_COLOR_1}иконка сервера${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет тайм-кодов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Если видео доказательства длятся более трёх минут, то вы должны указать${END_COLOR} ${START_COLOR_1}тайм-коды их ключевых моментов${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Жалоба на 2+ игроков',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}На каждого игрока подается${END_COLOR} ${START_COLOR_1}отдельная жалоба${END_COLOR}${START_COLOR_2}. Составьте индивидуальные жалобы на каждых игроков.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Жалоба от 3-его лица',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба составлена${END_COLOR} ${START_COLOR_1}от 3-его лица${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет условий договора',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В условиях Вашей сделки отсутствуют${END_COLOR} ${START_COLOR_1}условия договора${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Долг вне банка',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Администрация не несёт ответственности за не возврат долга, который был выдан${END_COLOR} ${START_COLOR_1}вне банка${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Дубликат темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вам уже был дан конкретный ответ в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}. За создание дубликатов этой темы Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Не тот сервер',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись сервером${END_COLOR}${START_COLOR_2}. Пересоздайте свою жалобу в разделе нужного вам сервера - *<a href='https://forum.blackrussia.online/#igrovye-servera.12'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на администрацию',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на администрацию - *<a href='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2414/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на лидеров',
          content:
         `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на лидеров - *<a href='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2415/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на сотрудников фракций',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на сотрудников организаций.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '======================================> Правила RP процесса <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'nRP поведение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/QUOTE]${END_COLOR}<br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто.${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Уход от RP',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'nRP вождение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Помеха RP процессу',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'OOC / IC обман',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Аморал',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Слив склада',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Обман в /do',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Фрак. / раб. т/с в лич. целях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Помеха блогерам',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'DB',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'TK',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'SK',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'MG',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
    },
    {
          title: 'DM',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
      `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Mass DM',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игроку и более | Warn / Ban 3 - 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Обход системы / Багоюз',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Стороннее ПО',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Сокрытие багов и ошибок от адм',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.23. Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Сокрытие нарушителей от адм',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проекта[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Попытки и действия нанесения вреда проекту',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | PermBan + ЧС проекта[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нанесение вреда ресурсам проекта',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Реклама',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Обман адм',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Использование уязвимостей правил',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.33. Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Конфликт на основе политики / религии',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'OOC угрозы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Распространение ООС информации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.38. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan + ЧС проекта[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Злоупотребление нарушениями',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 15 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оск. проекта, призыв его покинуть',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'ЕПП',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'nRP вождение (фура)',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Задержание в интерьере',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'nRP аксессуар',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оск. администрации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Багоюз анимации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Невозврат долга',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '======================================> Правила игровых чатов <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'CapsLock',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оскорбление в ООС',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Упом. / оск. родных',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Flood',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Злоупотребление символами',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Слив глоб. чатов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Выдача себя за администратора',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Ввод в заблуждение командами',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оффтоп, мат, капс в репорт',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) | Report Mute 30 минут.[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Музыка в ГЧ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Шум в ГЧ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Пропаганда религии / политики',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Софт для голоса в ГЧ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.19. Запрещено использование любого софта для изменения голоса | Mute 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Транслит',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Реклама промокода',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Объявления в гос. учреждении',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Мат в VIP чат',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.23. Запрещено использование нецензурных слова, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '======================================> Правила игровых аккаунтов <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'Некорректный никнейм',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Fake',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '=================================> ГОСС <=================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'NonRP EDIT',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нарушение правил проведения эфиров',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Замена объявлений',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Любое NonRP поведение гос. сотрудника',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]6.03. Запрещено nRP поведение | Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Выдача розыска без причины',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]6.02. Запрещено выдавать розыск без Role Play причины | Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Изъятие в/у во время погони',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Госс б/у',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Госс подработка',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Задержание бвс до начала бв',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.14. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нарушение правил обращение в /d',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]За нарушение правил общения в рации департамента будет выдана блокировка чата на 30 минут.[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '======================================> Правила ОПГ <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'Провокация госс',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2. Запрещено провоцировать сотрудников государственных организаций | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'NonRP в/ч',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нападение на в/ч через стену для взрыва',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]Нападение на военную часть разрешено только через блокпост "КПП" с последовательностью взлома | /Warn NonRP В/Ч[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
       `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
  ];

    const cats = [
        {
          title: 'Приветствие',
          content:
         `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
        },
            {
          title: 'На рассмотрение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша тема взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: 'Передать главному администратору',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба передана главному администратору${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: '======================================> Отказы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'Не по форме(обж)',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба составлена${END_COLOR}${START_COLOR_1} не по форме${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Форма для подачи заявки на обжалования - *<a href='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/'>Кликабельно</a>*${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
          {
          title: 'Не по форме(жб адм)',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба составлена${END_COLOR}${START_COLOR_1} не по форме${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Форма для подачи жалобы на администратора - *<a href='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/'>Кликабельно</a>*${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Некоректный заголовок / содержание темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Жалоба в таком вид рассмотрена${END_COLOR} ${START_COLOR_1}не будет${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет нарушений',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}от администратора нет нарушений${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
     {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'рядом 24/7',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Нарушений со стороны Администратора нет. ${END_COLOR} ${START_COLOR_1}Рядом вас находился магазин 24/7 где вы могли купить ремонтный набор${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Не достаем с воды',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В данной ситуации ${END_COLOR} ${START_COLOR_1}администратор не достаёт из воды${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
               {
          title: 'Адм предоставил док-ва',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Администратор предоставил доказательство${END_COLOR} ${START_COLOR_1}вашего нарушения${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Наказание было выдано ${START_COLOR_1}верно${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ошибка разделом',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Перемещаю в нужный раздел.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          status: true,
          move: 0,
      },
            {
          title: '48+ часов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Срок написания жалобы составляет${END_COLOR} ${START_COLOR_1}два дня (48 часов)${END_COLOR}${START_COLOR_2} с момента совершенного нарушения со стороны администратора сервера.${END_COLOR}<br><br>`+
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Бан теха',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вам было выдано наказание  ${END_COLOR} ${START_COLOR_1}Техническим специалистом${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Обратитесь в Жалобы на Технических специалистов.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в ${END_COLOR} ${START_COLOR_1}предыдущей теме${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: '======================================> Одобрение жб <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
      {
          title: 'Наказание будет снято',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба была рассмотрена, с администратором будет проведена ${END_COLOR} ${START_COLOR_1}профилактическая беседа${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Приносим извинения за предоставленные неудобства. Ваше наказание будет снято в ближайшее время!${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено,Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: 'Ошибка адм',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Спасибо за обращение, с администратором была проведена ${END_COLOR} ${START_COLOR_1}профилактическая беседа${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено,Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: '======================================> Обжалование <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
       {
          title: 'ГА',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Главному администратору${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: HA_PREFIX,
          status: true,
          move: 0,
      },
            {
          title: 'СА',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Специальной администрации${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: SPECY_PREFIX,
          status: true,
          move: 0,
      },
         {
          title: 'КП',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Команде проекта${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: COMMAND_PREFIX,
          status: true,
          move: 0,
      },
                     {
          title: 'Не подлежит обж',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Данное наказание не подлежит ${END_COLOR} ${START_COLOR_1}обжалованию${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_COLOR_2}В случае несогласия с вынесенным наказанием и прошествия менее 48 часов, вы можете обратиться в раздел "Жалобы на администрацию".${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В обж отказ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В обжаловании ${END_COLOR} ${START_COLOR_1}отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}В случае несогласия с вынесенным наказанием и прошествия менее 48 часов, вы можете обратиться в раздел "Жалобы на администрацию".${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нрп обман(отк)',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Если вы хотите обжаловать наказание за НонРП-обман, то должны самостоятельно связаться с человеком, которого обманули. После этого он обязан подать обжалование, приложив доказательства договорённости о возврате имущества, ссылку на вашу жалобу, скриншот окна блокировки обманувшего, а также ссылки на ВК обеих сторон. В противном случае обжаловать наказание за НонРП-обман ${END_COLOR} ${START_COLOR_1}не получится${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Одобрено',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваше наказание будет снято в скором времени.  ${END_COLOR} ${START_COLOR_1}Впредь не нарушайте правила${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Одобрено, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нету ссылки ВК',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Прикрепите ссылку на свой профиль ${END_COLOR} ${START_COLOR_1}ВКонтакте${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Ожидаю ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
                  {
          title: '======================================> Блокировки форум <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #FF0000; border-color: #E6E6FA',
      },
            {
          title: 'Дублирование',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}Заблокирован${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
           `${START_COLOR_2}За дублирование тем.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
         {
          title: 'Оск',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}Заблокирован${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
           `${START_COLOR_2}За оскорбление администрации.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
        {
          title: 'Обман',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}Заблокирован${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
           `${START_COLOR_2}За обман администрации.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.postimg.cc/tgD5Xwhj/1618083711121.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
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

  const Button51 = buttonConfig("Обж", 'https://forum.blackrussia.online/forums/Обжалование-наказаний.2417/');
  const Button52 = buttonConfig("Заявки", 'https://forum.blackrussia.online/forums/Сервер-№54-penza.3139/');
  const Button53 = buttonConfig("АР", 'https://forum.blackrussia.online/forums/Админ-раздел.2390/');
  const Button54 = buttonConfig("ОПС", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/');
  const Button55 = buttonConfig("Раздел 54", 'https://forum.blackrussia.online/forums/Сервер-№54-penza.2389/');
   const Button56 = buttonConfig("Жб адм", 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2414/');

  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button55);
  bgButtons.append(Button56);

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFA500');
        addButton('Тех. специалисту', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #0000FF');
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000');
        addButton('Меню жалоб', 'selectComplaintAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #9400D3');
        addButton('Меню руковоства', 'selectCatsAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E9967A')

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true));
        $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true));
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
// Состояние
    let effectsActive = false;
    let snowInterval = null;
    let garlandInterval = null;
    let currentSnowflakes = 0;
    let currentColorIndex = 0;

    // Сохранение состояния
    function saveEffectsState(isActive) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('snowGarlandActive', isActive);
        } else {
            localStorage.setItem('snowGarlandActive', isActive);
        }
    }

    function loadEffectsState() {
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue('snowGarlandActive', false);
        } else {
            return localStorage.getItem('snowGarlandActive') === 'true';
        }
    }

    // Создание кнопки
    function createEffectsButton() {
        const button = document.createElement('button');
        button.innerHTML = '❄️🎄';
        button.id = 'snow-garland-toggle-button';
        button.title = 'Включить/выключить снег и гирлянду';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.95);
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        `;

        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'rgba(255, 255, 255, 1)';
        });

        button.addEventListener('mouseout', function() {
            if (!effectsActive) {
                this.style.transform = 'scale(1)';
                this.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // Загрузка состояния
        effectsActive = loadEffectsState();
        if (effectsActive) {
            setTimeout(() => {
                startAllEffects();
                updateButtonStyle(true);
            }, 1000);
        }

        button.addEventListener('click', function() {
            effectsActive = !effectsActive;
            saveEffectsState(effectsActive);

            if (effectsActive) {
                startAllEffects();
                updateButtonStyle(true);
            } else {
                stopAllEffects();
                updateButtonStyle(false);
            }
        });

        function updateButtonStyle(isActive) {
            if (isActive) {
                button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                button.style.boxShadow = '0 2px 15px rgba(102, 126, 234, 0.4)';
                button.style.color = 'white';
                button.style.transform = 'scale(1.05)';
            } else {
                button.style.background = 'rgba(255, 255, 255, 0.95)';
                button.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                button.style.color = 'inherit';
                button.style.transform = 'scale(1)';
            }
        }

        document.body.appendChild(button);
    }

    // === СНЕЖИНКИ ===
    function startSnowfall() {
        stopSnowfall();
        currentSnowflakes = 0;

        let snowContainer = document.getElementById('snow-container');
        if (!snowContainer) {
            snowContainer = document.createElement('div');
            snowContainer.id = 'snow-container';
            snowContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
                overflow: hidden;
            `;
            document.body.appendChild(snowContainer);
        }

        snowContainer.innerHTML = '';
        const columnWidth = window.innerWidth / SNOW_CONFIG.columns;

        function createSnowflake() {
            if (!document.getElementById('snow-container') ||
                currentSnowflakes >= SNOW_CONFIG.maxSnowflakes) {
                return;
            }

            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄';

            const size = Math.random() * (SNOW_CONFIG.maxSize - SNOW_CONFIG.minSize) + SNOW_CONFIG.minSize;
            const opacity = Math.random() * (SNOW_CONFIG.maxOpacity - SNOW_CONFIG.minOpacity) + SNOW_CONFIG.minOpacity;

            snowflake.style.cssText = `
                position: absolute;
                top: -50px;
                color: white;
                text-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
                font-size: ${size}px;
                opacity: ${opacity};
                user-select: none;
                pointer-events: none;
                z-index: 9998;
                will-change: transform;
            `;

            const columnIndex = Math.floor(Math.random() * SNOW_CONFIG.columns);
            const baseX = columnIndex * columnWidth + Math.random() * columnWidth;
            const startX = Math.max(10, Math.min(window.innerWidth - 10, baseX));

            const animationDuration = Math.random() * (SNOW_CONFIG.maxDuration - SNOW_CONFIG.minDuration) + SNOW_CONFIG.minDuration;
            const swayAmplitude = Math.random() * 20 + 15;
            const rotationSpeed = (Math.random() - 0.5) * 3;

            snowflake.style.left = startX + 'px';

            let startTime = null;
            let animationId = null;

            currentSnowflakes++;

            function animateSnowflake(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / (animationDuration * 1000);

                if (progress >= 1 || !document.getElementById('snow-container')) {
                    if (animationId) cancelAnimationFrame(animationId);
                    if (snowflake.parentNode) snowflake.parentNode.removeChild(snowflake);
                    currentSnowflakes = Math.max(0, currentSnowflakes - 1);
                    return;
                }

                const y = progress * (window.innerHeight + 100);
                const xSway = Math.sin(progress * Math.PI * 4) * swayAmplitude * progress;
                const rotation = progress * 180 * rotationSpeed;

                snowflake.style.transform = `translate(${xSway}px, ${y}px) rotate(${rotation}deg)`;

                if (progress > 0.8) {
                    snowflake.style.opacity = (opacity * (1 - progress) / 0.2).toString();
                }

                animationId = requestAnimationFrame(animateSnowflake);
            }

            animationId = requestAnimationFrame(animateSnowflake);
            snowContainer.appendChild(snowflake);
        }

        snowInterval = setInterval(() => {
            if (effectsActive && document.getElementById('snow-container')) {
                createSnowflake();
            }
        }, SNOW_CONFIG.snowflakeCreationInterval);

        // Первые снежинки
        setTimeout(() => {
            for (let i = 0; i < Math.min(5, SNOW_CONFIG.maxSnowflakes); i++) {
                setTimeout(createSnowflake, i * 200);
            }
        }, 100);
    }

    function stopSnowfall() {
        const snowContainer = document.getElementById('snow-container');
        if (snowContainer) {
            snowContainer.style.opacity = '0';
            snowContainer.style.transition = 'opacity 0.8s ease';
            setTimeout(() => {
                if (snowContainer.parentNode) {
                    snowContainer.parentNode.removeChild(snowContainer);
                }
            }, 800);
        }

        if (snowInterval) {
            clearInterval(snowInterval);
            snowInterval = null;
        }
        currentSnowflakes = 0;
    }

    // === ГИРЛЯНДА ===
    function startGarland() {
        stopGarland();

        const garlandContainer = document.createElement('div');
        garlandContainer.id = 'garland-container';
        garlandContainer.style.cssText = `
            position: fixed;
            top: ${GARLAND_CONFIG.garlandHeight}px;
            left: 0;
            width: 100%;
            z-index: 9997;
            pointer-events: none;
        `;

        // Провод
        const wire = document.createElement('div');
        wire.id = 'garland-wire';
        wire.style.cssText = `
            position: absolute;
            top: ${GARLAND_CONFIG.ballSize / 2}px;
            left: 50px;
            right: 50px;
            height: ${GARLAND_CONFIG.wireHeight}px;
            background: ${GARLAND_CONFIG.wireColor};
            border-radius: 2px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        `;
        garlandContainer.appendChild(wire);

        // Шары
        const viewportWidth = window.innerWidth - 100;
        const ballCount = Math.floor(viewportWidth / GARLAND_CONFIG.ballSpacing);

        for (let i = 0; i < ballCount; i++) {
            const ball = document.createElement('div');
            ball.className = 'garland-ball';
            const colorIndex = i % GARLAND_CONFIG.colors.length;
            const ballColor = GARLAND_CONFIG.colors[colorIndex];

            ball.style.cssText = `
                position: absolute;
                top: 0;
                left: ${50 + (i * GARLAND_CONFIG.ballSpacing)}px;
                width: ${GARLAND_CONFIG.ballSize}px;
                height: ${GARLAND_CONFIG.ballSize}px;
                border-radius: 50%;
                background: ${ballColor};
                box-shadow:
                    0 0 10px ${ballColor},
                    0 2px 8px rgba(0,0,0,0.3),
                    inset -3px -3px 5px rgba(0,0,0,0.2),
                    inset 2px 2px 5px rgba(255,255,255,0.3);
                transition: all 0.8s ease;
                cursor: pointer;
                pointer-events: auto;
            `;

            // Блик
            const highlight = document.createElement('div');
            highlight.style.cssText = `
                position: absolute;
                top: 3px;
                left: 3px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.8);
                box-shadow: 0 0 5px white;
            `;
            ball.appendChild(highlight);

            ball.addEventListener('mouseover', function() {
                if (effectsActive) {
                    this.style.transform = 'scale(1.4) translateY(-2px)';
                    this.style.boxShadow =
                        `0 0 20px ${this.style.background},
                         0 5px 15px rgba(0,0,0,0.4)`;
                }
            });

            ball.addEventListener('mouseout', function() {
                if (effectsActive) {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow =
                        `0 0 10px ${this.style.background},
                         0 2px 8px rgba(0,0,0,0.3)`;
                }
            });

            garlandContainer.appendChild(ball);
        }

        document.body.appendChild(garlandContainer);

        // Анимация гирлянды
        function animateGarland() {
            const balls = document.querySelectorAll('.garland-ball');
            if (!balls.length) return;

            currentColorIndex = (currentColorIndex + 1) % GARLAND_CONFIG.colors.length;
            const nextColor = GARLAND_CONFIG.colors[currentColorIndex];

            balls.forEach((ball, index) => {
                setTimeout(() => {
                    if (effectsActive && ball.parentNode) {
                        ball.style.background = nextColor;
                        ball.style.boxShadow =
                            `0 0 15px ${nextColor},
                             0 3px 12px rgba(0,0,0,0.4)`;

                        ball.style.transform = 'translateY(-3px) scale(1.1)';

                        setTimeout(() => {
                            if (effectsActive && ball.parentNode) {
                                ball.style.transform = 'translateY(0) scale(1)';
                            }
                        }, 300);
                    }
                }, (index * 80) % 800);
            });
        }

        garlandInterval = setInterval(animateGarland, GARLAND_CONFIG.animationSpeed);
        setTimeout(animateGarland, 200);
    }

    function stopGarland() {
        if (garlandInterval) {
            clearInterval(garlandInterval);
            garlandInterval = null;
        }

        const garland = document.getElementById('garland-container');
        if (garland) {
            garland.style.opacity = '0';
            garland.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (garland.parentNode) {
                    garland.parentNode.removeChild(garland);
                }
            }, 500);
        }
    }

    // Управление всеми эффектами
    function startAllEffects() {
        startSnowfall();
        startGarland();
    }

    function stopAllEffects() {
        stopSnowfall();
        stopGarland();
    }

    // Обработчики изменения размера
    function handleResize() {
        if (effectsActive) {
            stopAllEffects();
            setTimeout(startAllEffects, 300);
        }
    }

    // Инициализация
    function init() {
        if (!document.getElementById('snow-garland-toggle-button')) {
            createEffectsButton();

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(handleResize, 250);
            });

            // SPA-навигация
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(() => {
                        if (effectsActive) {
                            if (!document.getElementById('snow-container') ||
                                !document.getElementById('garland-container')) {
                                startAllEffects();
                            }
                        }
                    }, 1500);
                }
            }).observe(document, { subtree: true, childList: true });
        }
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();