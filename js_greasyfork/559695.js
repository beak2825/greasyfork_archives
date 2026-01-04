// ==UserScript==
// @name         KRASNOYARSK | Скрипт для кураторов форума
// @namespace    https://forum.blackrussia.online
// @version      0.4
// @description  -
// @author       Soul_Crown
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2024,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/559695/KRASNOYARSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559695/KRASNOYARSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DECLINED_PREFIX = 4;
    const APPROVED_PREFIX = 8;
    const WAIT_PREFIX = 2;
    const TECH_PREFIX = 13;
    const WATCHED_PREFIX = 9;
    const CLOSED_PREFIX = 7;
    const HA_PREFIX = 12;
  
    const START_COLOR_1 = `<font color=#FFB6C1>`
    const START_COLOR_2 = `<font color=#FFFAFA>`
    const END_COLOR = `</font>`
 
    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`
 
  const buttons = [
      {
         title: 'Приветствие',
         content:
         `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}*Префикс*${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
      },
      {
          title: 'На рассмотрение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба закреплена и находится на${END_COLOR} ${START_COLOR_1}на рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: 'Передать теху',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба закреплена и находится на${END_COLOR} ${START_COLOR_1}на рассмотрении${END_COLOR}${START_COLOR_2} у технического специалиста.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: TECH_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: 'Передать главной администрации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба закреплена и находится на${END_COLOR} ${START_COLOR_1}на рассмотрении${END_COLOR}${START_COLOR_2} у руководства сервера.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: 'Передать ГКФ / ЗГКФ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба закреплена и находится на${END_COLOR} ${START_COLOR_1}на рассмотрении${END_COLOR}${START_COLOR_2} у главного куратора форума и / или его заместителя.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
          title: '======================================> Отказы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'Не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Пожалуйста, пересоздайте тему, заполнив следующую форму:<br>[QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет нарушений',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После детального разбора ситуации, проверки доказательств и системы логирования, было принято решение, что${END_COLOR} ${START_COLOR_1}от игрока нет нарушений${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет доказательств',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Жалобы без доказательств${END_COLOR} ${START_COLOR_1}не подлежат рассмотрению${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Недостаточно доказательств',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}После проверки Ваших доказательств, было принято решение, что${END_COLOR} ${START_COLOR_1}их недостаточно для выдачи наказания игроку${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства обрываются',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Предоставленные вами доказательства являются неполными, соответсвенно, жалоба рассмотрению${END_COLOR} ${START_COLOR_1}не подлежит${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` + 
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства отредактированы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения,${END_COLOR} ${START_COLOR_1}могут быть не рассмотрены в качестве доказательств${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в плохом качестве',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Убедительная просьба загрузить доказательства в более высоком качестве и прикрепить их в новой теме.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательства в соц. сетях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Загрузка доказательств в соц. сети (ВКонтакте, instagram)${END_COLOR} ${START_COLOR_1}запрещается${END_COLOR}${START_COLOR_2}. Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нерабочая ссылка',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ссылка на Ваши доказательства${END_COLOR} ${START_COLOR_1}не работает либо доступ по ссылке закрыт${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Доказательствам более 72 часов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}С момента совершения нарушения игроков прошло 72 часов. В случае, если жалоба написана по истечении этого времени, то она рассмотрению${END_COLOR} ${START_COLOR_1}не подлежит${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нужен фрапс',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}На подобные виды нарушений необходимо предоставить${END_COLOR} ${START_COLOR_1}видео - доказательства${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет /time',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}К сожалению, жалоба не может быть рассмотрена, так как в доказательствах отсутствует прописанный${END_COLOR} ${START_COLOR_1}/time${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет иконки сервера',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}К сожалению, жалоба не может быть рассмотрена, так как в доказательствах отсутствует${END_COLOR} ${START_COLOR_1}иконка сервера${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет тайм-кодов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Если видео доказательства длятся более трёх минут, то вы должны указать${END_COLOR} ${START_COLOR_1}тайм-коды их ключевых моментов${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Жалоба на 2+ игроков',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}На каждого игрока подается${END_COLOR} ${START_COLOR_1}отдельная жалоба${END_COLOR}${START_COLOR_2}. Составьте индивидуальные жалобы на каждых игроков.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Жалоба от 3-его лица',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Жалобы, составленные от 3 - его лица рассмотрению${END_COLOR} ${START_COLOR_1}не подлежат${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Нет условий договора',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Так как между вами и игроком не было никаких конкретных договоренностей, то и нарушений от игрока быть не может, так как невозможно нарушить договор, которого не было. В будущем, чтобы избежать подобных случаев, перед непосредственной сделкой составляйте условия договора с игроком, после чего ожидайте его согласия с ними.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Жалоба не от лидера семьи',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба не может быть рассмотрена, так как вы не являетесь${END_COLOR} ${START_COLOR_1}лидером семьи${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Не тот сервер',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись сервером${END_COLOR}${START_COLOR_2}. Пересоздайте свою жалобу в разделе нужного вам сервера - *<a href='https://forum.blackrussia.online/#igrovye-servera.12'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на администрацию',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на администрацию - *<a href='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2120/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на лидеров',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на лидеров - *<a href='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2121/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на сотрудников фракций',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на сотрудников организаций.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В обжалования наказаний',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел обжалований наказаний - *<a href='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2123/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В тех. раздел',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в тех. раздел - *<a href='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-krasnoyarsk.2094/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'В жб на тех. специалистов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вы${END_COLOR} ${START_COLOR_1}ошиблись разделом${END_COLOR}${START_COLOR_2}.<br>Обратитесь в раздел жалоб на тех. специалистов - *<a href='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9647-krasnoyarsk.2093/'>Кликабельно</a>*${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {

          title: '======================================> Правила RP процесса <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'nRP поведение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/QUOTE]${END_COLOR}<br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Уход от RP',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'nRP вождение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Помеха RP процессу',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'OOC / IC обман',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Аморал',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Слив склада',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Фрак. / раб. т/с в лич. целях',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Помеха блогерам',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'DB',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'TK',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'SK',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'MG',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
    },
    {
          title: 'DM',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Mass DM',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Обход системы / Багоюз',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Стороннее ПО',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'ППИВ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'Реклама',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Использование уязвимостей правил',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.33. Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Конфликт на основе политики / религии',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'OOC угрозы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оск. проекта, призыв его покинуть',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'ЕПП',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
         title: 'nRP вождение (фура)',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Задержание в интерьере',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'nRP аксессуар',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оск. администрации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Багоюз анимации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Невозврат долга',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,          
      },
      {
          title: '======================================> Правила игровых чатов <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'CapsLock',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оскорбление в ООС',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Упом. / оск. родных',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Flood',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Злоупотребление символами',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Слив глоб. чатов',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0, 
     },
     {
          title: 'Выдача себя за администратора',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Ввод в заблуждение командами',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Оффтоп, мат, капс в репорт',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) | Report Mute 30 минут.[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Музыка в ГЧ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Шум в ГЧ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Пропаганда религии / политики',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Софт для голоса в ГЧ',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.19. Запрещено использование любого софта для изменения голоса | Mute 60 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Транслит',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Реклама промокода',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Объявления в гос. учреждении',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Мат в VIP чат',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '======================================> Правила игровых аккаунтов <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'Некорректный никнейм',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Fake',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,        
      },
      {
          title: '======================================> Правила ГОСС <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'NonRP EDIT',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нарушение правил проведения эфиров',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     { 
          title: 'Замена объявлений',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Любое NonRP поведение гос. сотрудника',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]6.03. Запрещено nRP поведение | Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     { 
          title: 'Выдача розыска без причины',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]6.02. Запрещено выдавать розыск без Role Play причины | Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     { 
          title: 'Изъятие в/у во время погони',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     { 
          title: 'Одиночный патруль',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     { 
          title: 'Госс б/у',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Госс подработка',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Задержание бвс до начала бв',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]1.14. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нарушение правил обращение в /d',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]За нарушение правил общения в рации департамента будет выдана блокировка чата на 30 минут.[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: '======================================> Правила ОПГ <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'Провокация госс',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]2. Запрещено провоцировать сотрудников государственных организаций | Jail 30 минут[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     { 
          title: 'NonRP в/ч',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
     },
     {
          title: 'Нападение на в/ч через стену для взрыва',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба одобрена, нарушитель будет наказан${END_COLOR} ${START_COLOR_1}по пункту правил${END_COLOR}${START_COLOR_2}: [QUOTE]Нападение на военную часть разрешено только через блокпост "КПП" с последовательностью взлома | /Warn NonRP В/Ч[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 0,
      },
  ];
  
    const biography = [
        {
          title: 'Приветствие',
          content:
         `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}*Префикс*${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
        },
        {
          title: 'RP биография одобрена',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay биография проверена и получет статус -${END_COLOR} ${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 2127,
        },
        {
            title: '======================================> Отказы <======================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
           title: 'Не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay биография составлена${END_COLOR} ${START_COLOR_1}не по форме${END_COLOR}${START_COLOR_2}.<br>Ознакомиться с правилами составления Roleplay биографий вы можете в этой теме - *<a href='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Заголовок не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Заголовок Вашей темы составлен${END_COLOR} ${START_COLOR_1}не по форме${END_COLOR}${START_COLOR_2}.<br>Ознакомиться с правилами составления Roleplay биографий вы можете в этой теме - *<a href='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Тема от 3-его лица',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Повествование в Вашей Roleplay биографии ведется${END_COLOR}${START_COLOR_1}от 3-его лица${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Копипаст',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay биография частично либо полностью схожа${END_COLOR} ${START_COLOR_1}с уже существующей темой${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Мало информации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В Вашей Roleplay биографии написано${END_COLOR} ${START_COLOR_1}недостаточно информации о персонаже${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Много ошибок',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}При написании темы вы допустили${END_COLOR} ${START_COLOR_1}слишком много ошибок${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'NonRP никнейм автора темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay биография не может быть рассмотрена, так как у вас${END_COLOR} ${START_COLOR_1}NonRolePlay Nickname${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Проблемы с возрастом',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Возраст Вашего персонажа расходится с датой рождения, которую Вы указали.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Нет 18 лет',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вашему персонажу${END_COLOR} ${START_COLOR_1}менее 18 лет${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'PG в теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В вашей теме${END_COLOR} ${START_COLOR_1}содержится PG${END_COLOR} ${START_COLOR_2}: [QUOTE]("Power Gaming" - Изображение из себя героя)[/QUOTE]${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Не по теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваше сообщение никак не относится к теме данного раздела.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
     },
     {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих тем${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2129,
      },
    ];

    const situations = [
        {
         title: 'Приветствие',
         content:
         `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}*Префикс*${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
        },
        {
          title: 'RP ситуация одобрена',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay ситуация проверена и получет статус -${END_COLOR} ${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          open: true,
          status: true,
          move: 2124,
        },
        {
          title: '======================================> Отказы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
          title: 'Не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay ситуация составлена${END_COLOR} ${START_COLOR_1}не по форме${END_COLOR}${START_COLOR_2}.<br>Ознакомиться с правилами составления Roleplay ситуации вы можете в этой теме - *<a href='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126,
     },
     {
          title: 'Тема от 3-его лица',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay ситуация написана${END_COLOR}${START_COLOR_1}от 3-его лица${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126,
      },
      {
          title: 'Копипаст',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay ситуация частично либо полностью схожа${END_COLOR} ${START_COLOR_1}с уже существующей темой${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126,
     },
     {
          title: 'NonRP никнейм автора темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay ситуация не может быть рассмотрена, так как у вас${END_COLOR} ${START_COLOR_1}NonRolePlay Nickname${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126,
     },
     {
          title: 'Не по теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваше сообщение никак не относится к теме данного раздела.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126, 
     },
     {
          title: 'Нет смысла',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay ситуация${END_COLOR} ${START_COLOR_1}не имеет смысла${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126, 
     },
     {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих тем${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2126,
      },
     ];

    const organizations = [
        {
         title: 'Приветствие',
         content:
         `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}*Префикс*${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
        },
        {
          title: 'RP организация одобрена',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay организация проверена и получет статус -${END_COLOR} ${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.<br><br>Обращаем ваше внимание, что вы можете вносить различные измения в RolePlay организацию об участниках, о ее устройстве и т.д. на свое усмотрение. Если в течение 2-ух недель в теме не будет никаких изменений, то она будет закрыта.<br><br>${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 2117,
        },
        {
          title: 'Нет изменений после двух недель',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}По истечению двух недель изменений в теме не последовало.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Одобрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: APPROVED_PREFIX,
          status: false,
          move: 2124,
        },
        {
          title: '======================================> Отказы <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
          title: 'Не по форме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay организация составлена${END_COLOR} ${START_COLOR_1}не по форме${END_COLOR}${START_COLOR_2}.<br>Ознакомиться с правилами составления Roleplay организаций вы можете в этой теме - *<a href='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.13425777/'>Кликабельно</a>*.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
     },
     {
          title: 'Нет 3 участников в организации',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В Вашей организации${END_COLOR} ${START_COLOR_1}менее 3 участников${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
     },
     {
          title: 'Нет истории появления',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В Вашей организации${END_COLOR} ${START_COLOR_1}не расписана история ее появления${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
     },
     {
          title: 'NonRP никнейм автора темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша Roleplay организация не может быть рассмотрена, так как у вас${END_COLOR} ${START_COLOR_1}NonRolePlay Nickname${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
     },
     {
          title: 'Нет одобренной биографии',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В Вашей теме${END_COLOR} ${START_COLOR_1}отсутствует одобренная Roleplay биография${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
     },
     {
          title: 'Не по теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваше сообщение никак не относится к теме данного раздела.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
     },
     {
          title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
          `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих тем${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_1}Отказано${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 2119,
      },
     ];
     
  const bgButtons = document.querySelector(".pageContent");
  const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.style = "border-radius: 13px; background-color: #E6E6FA";
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

  const Button51 = buttonConfig("Жалобы", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.2122/');
  const Button52 = buttonConfig("Биографии", 'https://forum.blackrussia.online/forums/РП-биографии.2102/');
  const Button53 = buttonConfig("Ситуации", 'https://forum.blackrussia.online/forums/РП-ситуации.2101/');
  const Button54 = buttonConfig("Организации", 'https://forum.blackrussia.online/forums/Неофициальные-rp-организации.2099/');
  const Button55 = buttonConfig("ОПС", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/');
 
  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button55);

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFA500');
        addButton('Тех. специалисту', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #0000FF');
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000');
        addButton('Меню жалоб', 'selectComplaintAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E6E6FA');
        addButton('Меню биографий', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E6E6FA')
        addButton('Меню ситуаций', 'selectSituationsAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E6E6FA');
        addButton('Меню организаций', 'selectOrganizationsAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E6E6FA');
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true));
        $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true));
        $('button#accepted').click(() => editThreadData(0, APPROVED_PREFIX, false));
        $('button#watch').click(() => editThreadData(0, WATCHED_PREFIX, false));
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
        $(`button#selectBiographyAnswer`).click(() => {
            XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
            biography.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
        $(`button#selectSituationsAnswer`).click(() => {
            XF.alert(buttonsMarkup(situations), null, 'Выберите ответ:');
            situations.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, false));
                }
            });
        })
        $(`button#selectOrganizationsAnswer`).click(() => {
            XF.alert(buttonsMarkup(organizations), null, 'Выберите ответ:');
            organizations.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent4(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent4(id, threadData, false));
                }
            });
        })
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
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
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
        const template = Handlebars.compile(biography[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
 
        if (send == true) {
            editThreadData(biography[id].move, biography[id].prefix, biography[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }
    
    function pasteContent3(id, data = {}, send = false) {
        const template = Handlebars.compile(situations[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
 
        if (send == true) {
            editThreadData(situations[id].move, situations[id].prefix, situations[id].status, situations[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }
 
    function pasteContent4(id, data = {}, send = false) {
        const template = Handlebars.compile(organizations[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
 
        if (send == true) {
            editThreadData(organizations[id].move, organizations[id].prefix, organizations[id].status, organizations[id].open);
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