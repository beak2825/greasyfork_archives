// ==UserScript==
// @name         Penza | Скрипт для кураторов администрации
// @namespace    https://forum.blackrussia.online
// @version      1.0.0
// @description  Скрипт для кураторов администрации сервера Penza
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
// @downloadURL https://update.greasyfork.org/scripts/556993/Penza%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/556993/Penza%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
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

    const START_COLOR_1 = `<font color=#9932CC>`
    const START_COLOR_2 = `<font color=#F0FFFF>`
    const END_COLOR = `</font>`

    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`

  const buttons = [
      {
         title: 'Приветствие',
         content:
         `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
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
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
        {
          title: '======================================> Отказы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #800080; border-color: #E6E6FA',
      },
      {
          title: 'Некоректный заголовок / содержание темы',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Жалоба в таком виде рассмотрена${END_COLOR} ${START_COLOR_1}не будет${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет нарушений',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}от администратора нет нарушений${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет доказательств',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В вашей жалобе${END_COLOR} ${START_COLOR_1}отсутствуют доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Недостаточно доказательств',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}их недостаточно для выдачи наказания игроку${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства обрываются',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваши доказательства${END_COLOR} ${START_COLOR_1}обрываются${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства отредактированы',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения,${END_COLOR} ${START_COLOR_1}могут быть не рассмотрены в качестве доказательств${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства подделаны',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт${END_COLOR} ${START_COLOR_1}будет заблокирован${END_COLOR}${START_COLOR_2}за поделку доказательств и обман администрации.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в плохом качестве',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваши доказательства в${END_COLOR} ${START_COLOR_1}плохом качестве${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нерабочая ссылка',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ссылка на Ваши доказательства${END_COLOR} ${START_COLOR_1}не работает либо доступ по ссылке закрыт${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательствам более 72 часов',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вашим доказательствам${END_COLOR} ${START_COLOR_1}более 72 часов${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нужен фрапс',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}На подобные виды нарушений необходимо предоставить${END_COLOR} ${START_COLOR_1}видео доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет /time',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В ваших доказательствах отсутствует${END_COLOR} ${START_COLOR_1}/time${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет иконки сервера',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В ваших доказательствах отсутствует${END_COLOR} ${START_COLOR_1}иконка сервера${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Дубликат темы',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вам уже был дан конкретный ответ в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}. За создание дубликатов этой темы Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Не тот сервер',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись сервером${END_COLOR}${START_COLOR_2}. Пересоздайте свою жалобу в разделе нужного вам сервера - *<a href='https://forum.blackrussia.online/#igrovye-servera.12'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на лидеров',
          content:
         `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на лидеров - *<a href='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2415/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на сотрудников фракций',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на сотрудников организаций.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
          {
          title: 'Не по форме(жб адм)',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба составлена${END_COLOR}${START_COLOR_1} не по форме${END_COLOR}${START_COLOR_2}.<br><br>` +
          `${START_COLOR_2}Форма для подачи жалобы на администратора - *<a href='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/'>Кликабельно</a>*${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет нарушений',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}от администратора нет нарушений${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
     {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'рядом 24/7',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Нарушений со стороны Администратора нет. ${END_COLOR} ${START_COLOR_1}Рядом вас находился магазин 24/7 где вы могли купить ремонтный набор${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Не достаем с воды',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В данной ситуации ${END_COLOR} ${START_COLOR_1}администратор не достаёт из воды${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
               {
          title: 'Адм предоставил док-ва',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Администратор предоставил доказательство${END_COLOR} ${START_COLOR_1}вашего нарушения${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Наказание было выдано ${START_COLOR_1}верно${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ошибка разделом',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы ошиблись${END_COLOR} ${START_COLOR_1}разделом${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Перемещаю в нужный раздел.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Ожидайте${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          status: true,
          move: 0,
      },
            {
          title: '48+ часов',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Срок написания жалобы составляет${END_COLOR} ${START_COLOR_1}два дня (48 часов)${END_COLOR}${START_COLOR_2} с момента совершенного нарушения со стороны администратора сервера.${END_COLOR}<br><br>`+
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Бан теха',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вам было выдано наказание  ${END_COLOR} ${START_COLOR_1}Техническим специалистом${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Обратитесь в Жалобы на Технических специалистов.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: '======================================> Одобрение жб <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #800080; border-color: #E6E6FA',
      },
      {
          title: 'Наказание будет снято',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба была рассмотрена, с администратором будет проведена ${END_COLOR} ${START_COLOR_1}профилактическая беседа${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Приносим извинения за предоставленные неудобства. Ваше наказание будет снято в ближайшее время!${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Одобрено,Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: 'Ошибка адм',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Спасибо за обращение, с администратором была проведена ${END_COLOR} ${START_COLOR_1}профилактическая беседа${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Одобрено,Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
            {
          title: '======================================> Передача жалоб <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #800080; border-color: #E6E6FA',
      },
           {
          title: 'ЗГА',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Заместителю Главного администратора${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: HA_PREFIX,
          status: true,
          move: 0,
      },
       {
          title: 'ГА',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Главному администратору${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: HA_PREFIX,
          status: true,
          move: 0,
      },
            {
          title: 'СА',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Специальной администрации${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: SPECY_PREFIX,
          status: true,
          move: 0,
      },
         {
          title: 'КП',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Передано ${END_COLOR} ${START_COLOR_1}Команде проекта${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: COMMAND_PREFIX,
          status: true,
          move: 0,
      },
                  {
          title: '======================================> Блокировки форум <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #800080; border-color: #E6E6FA',
      },
            {
          title: 'Дублирование',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}Заблокирован${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
           `${START_COLOR_2}За дублирование тем.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
         {
          title: 'Оск',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}Заблокирован${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
           `${START_COLOR_2}За оскорбление администрации.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
          `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: CLOSED_PREFIX,
          status: false,
          move: 0,
      },
        {
          title: 'Обман',
          content:
          `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваш форумный аккаунт будет${END_COLOR} ${START_COLOR_1}Заблокирован${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
           `${START_COLOR_2}За обман администрации.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="https://i.ibb.co/27y8xhBc/image.png"><br>` +
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
  const Button53 = buttonConfig("АР", 'https://forum.blackrussia.online/forums/Админ-раздел.2390/');
  const Button54 = buttonConfig("ОПС", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/');
  const Button55 = buttonConfig("Раздел 54", 'https://forum.blackrussia.online/forums/Сервер-№54-penza.2389/');
   const Button56 = buttonConfig("Жб адм", 'https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2414/');

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
        addButton('Меню кураторов', 'selectComplaintAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #9400D3');

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

})();// ==UserScript==


