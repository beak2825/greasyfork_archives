// ==UserScript==
// @name         36-40 | Скрипт для технических специалистов
// @namespace    https://forum.blackrussia.online
// @version      0.0.2
// @description  -
// @author       Soul Crown
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2025,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/562560/36-40%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/562560/36-40%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const PIN_PREFIX = 2; // На рассмотрение
    const TECH_PREFIX = 13; // Тех. специалисту
    const KP_PREFIX = 10; // Команде проекта
    const WATCHED_PREFIX = 9; // Рассмотрено
    const DECIDED_PREFIX = 6; // Решено
    const UNACCEPT_PREFIX = 4 // Отказано
    const CLOSE_PREFIX = 7; // Закрыто
    const EXPECTATION_PREFIX = 14 // Ожидание

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
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> ЛОГИСТАМ <============================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'На рассмотрение',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема взята на рассмотрение.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: TECH_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать ЗКТС / КТС',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема закреплена и ожидает вердикта куратора и / или заместителся куратора технических специалистов.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать тестерам',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана на тестирование.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: EXPECTATION_PREFIX,
             status: false,
             open: true,
             move: 917,
        },
        {
            title: 'Передать КП',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема закреплена и ожидает вердикта участников Команды Проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: KP_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Перемещаю тему',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Созданная вами тема не относится к назначению этого раздела. Перемещаю тему в соответсвующий раздел.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: EXPECTATION_PREFIX,
            status: false,
            open: true,
            move: 0,
        },
        {
            title: 'Не по форме',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема составлена не по форме. Ознакомиться с правилами раздела жалоб на технических специалистов можно в этой теме — *<a href="https://forum.blackrussia.online/threads/Шаблон-для-подачи-жалобы-на-технического-специалиста.11906522/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не по теме',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема не относится к разделу жалоб на технических специалистов. Ознакомиться с правилами раздела жалоб на технических специалистов можно в этой теме — *<a href="https://forum.blackrussia.online/threads/Шаблон-для-подачи-жалобы-на-технического-специалиста.11906522/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Срок подачи жб на теха',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}С момента выдачи наказания техническим специалистом прошло более 14 дней. В настоящий момент пересмотр решения о блокировке аккаунта невозможен, однако Вы можете попробовать написать обжалование через некоторый промежуток времени.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Нет окна блокировки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Тема без прикрепленного скриншота окна блокировки не может быть рассмотрена. Пересоздайте тему, прикрепив в ней ссылку со скриншотом с любого удобного для вас фотохостинга, например: Imgur, Google Photo, япикс и т.д.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не подлежит обжалованию',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В соответсвии с действующими правилами проекта, аккаунт, который был заблокирован не может быть разблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Доква в соц. сетях',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Загрузка доказательств в социальные сети (VK, Instagram и т.д.) запрещена. Воспользуйтесь фото / видео - хостингом (например: Imgur, Япикс и т.д.).${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Доква отредактированы',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваши доказательства отредактированы и не могут использоваться как полноценные доводы о нарушении. Пересоздайте тему, прикрепив в ней ссылку с оригинальными доказательствами.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Доква подделаны',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваши доказательства подделаны. Ваш форумный аккаунт будет заблокирован за подделку доказательств и обман администрации.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Аккаунт будет разблокирован',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После дополнительной перепроверки доказательств, было принято решение, что наказание выдано ошибочно и оно будет снято в ближайшее время. Приносим извинения за доставленные неудобства.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Запросить привязки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Укажите имеющиеся привязки к игровому аккаунту:${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. VK ID (узнать можно здесь — *<a href="https://regvk.com/">Кликабельно</a>*):${END_COLOR}<br>` +
            `${START_COLOR_2}2. Telegram ID (узнать можно здесь — *<a href="https://t.me/Getmyid_bot">Кликабельно</a>*):${END_COLOR}<br>` +
            `${START_COLOR_2}3. Email:${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если какие либо привязки отсутствуют поставьте прочерк.${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: TECH_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Вам знакома почта?',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}К вашему игровому аккаунту привязана электронная почта, которую вы не указали / указали неправильно.<br>Если вам знакома данная почта *почта, 4-5 символов заменить на звезды *, то укажите ее полный адрес.${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: TECH_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Указал верные привязки (взлом)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш игровой аккаунт будет разблокирован в ближайшее время, просьба внимтельнее относиться к безопасности своего аккаунта, с целью недопущения подобных ситуаций в будущем.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Взломали',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В целях безопасности Ваш игровой аккаунт будет заблокирован с причиной «Взломан». Для восстановления доступа к игровому аккаунту обратитесь в раздел жалоб на технических специалистов.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Взломали и украли имущество',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В целях безопасности Ваш игровой аккаунт будет заблокирован с причиной «Взломан». Аккаунт, на который было передано Ваше имущество будет заблокирован с причиной «Махинации». Для восстановления доступа к игровому аккаунту обратитесь в раздел жалоб на технических специалистов. Также напоминаем, что в подобных случаях имущество не восстанавливается.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Аккаунт, на который было передано Ваше имущество будет заблокирован с причиной «Махинации».${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не подтвердил привязки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы не подтвердили привязки к игровому аккаунту.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: PIN_PREFIX,
            status: true,
            open: true,
            move: 0,
        },
        {
            title: 'Имущество будет восстановлено',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Имущество будет восстановлено в течение 14 дней. Убедительная просьба не менять игровой Nickname в течении этого времени. Для активации восстановления воспользуйтесь командами: /roulette, /recovery.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Имущество не может быть восстановлено',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Созданная Вами тема не относится к технической проблеме. Ознакомиться с правилами восстановления игровых ценностей можно в этой теме — *<a href="https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D1%8B%D1%85-%D1%86%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9.11906607/unread">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Репутация семьи будет обнулена (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После проверки доказательств и системы логирования выношу вердикт: Репутация семьи будет обнулена.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Репутация семьи не будет обнулена (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После проверки доказательств и системы логирования выношу вердикт: Репутация семьи не будет обнулена.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Игрок будет заблокирован (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}После проверки доказательств и системы логирования было принято решение, что нарушитель будет заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Игрок  не будет заблокирован (жб на игроков)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для выдачи наказания игроку ваших доказательств недостаточно.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 0,
        },
        {
            title: 'Вам в тех. раздел',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в технический раздел своего сервера — *<a href="https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на адм',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на администрацию своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на лд',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на лидеров своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на игроков',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на игроков своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в обжалования',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел обжалований наказаний своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в тех. поддержку',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Обратитесь в техническую поддержку BLACK RUSSIA$ для последующей консультации.${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. Тех. поддержка (VK) - *<a href="http://vk.com/br_tech">Кликабельно</a>*;<br>2. Тех. поддержка (Telegram) - *<a href="https://t.me/br_techBot">Кликабельно</a>*;<br>3. Тех. поддержка (Сайт)  - *<a href="https://blackrussia.online/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Бан ФА за дубликат',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш форумный аккаунт будет заблокирован за многочисленное дублирование тем.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: '=====> ФОРУМНИКАМ <=========================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'На рассмотрение',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема взята на рассмотрение.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать логисту',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема закреплена и ожидает вердикта технического специалиста по логированию.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: TECH_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Передать тестерам',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема передана на тестирование.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: EXPECTATION_PREFIX,
             status: false,
             open: true,
             move: 917,
        },
        {
            title: 'Передать КП',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема закреплена и ожидает вердикта участников команды проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: KP_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Известно КП',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Команде проекта уже известно о данной недоработке и в скором времени она будет исправлена. Благодарим за обращение.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Не баг / неактульный баг',
             content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Проблема с которой вы столкнулись не является недоработкой или она уже была исправлена.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Не по форме',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема составлена не по форме. Ознакомиться с правилами технического раздела можно в этой теме — *<a href="https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%B2-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B5%D1%81%D0%BB%D0%B8-%D0%BD%D0%B5-%D0%BF%D0%BE-%D1%84%D0%BE%D1%80%D0%BC%D0%B5-%E2%80%94-%D0%BE%D1%82%D0%BA%D0%B0%D0%B7.11906517/unread">Кликабельно</a>*.<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Не по теме',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваша тема не относится к техническому разделу. Ознакомиться с правилами технического раздела можно в этой теме — *<a href="https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%B2-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B5%D1%81%D0%BB%D0%B8-%D0%BD%D0%B5-%D0%BF%D0%BE-%D1%84%D0%BE%D1%80%D0%BC%D0%B5-%E2%80%94-%D0%BE%D1%82%D0%BA%D0%B0%D0%B7.11906517/unread">Кликабельно</a>*.<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Проблема решилась сама',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Мы рады, что проблема решилась сама собой. При возникновении технических проблем, не стесняйтесь обращаться к нам за помощью, мы с радостью поможем вам.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: WATCHED_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Срок подачи недоработки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}С момента обнаружения недоработки прошло более 30 дней, соответсвенно, тема не может быть рассмотрена.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Нет фото / видео - фиксации',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В вашей теме отстуствует фото / видео фиксация недоработки, без которой тема не может быть рассмотрена. Пересоздайте тему, прикрепив в ней ссылку с фото / видео фиксацией недоработки, если они у вас присутсвуют.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Загрузка доказательств',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для загрузки скриншотов или видеозаписей воспользуйтесь любым удобным для Вас фото / видео - хостингом, например: Imgur, Google фото, Япикс и т.д.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Доква в соц. сетях',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Загрузка доказательств в социальные сети (VK, Instagram и т.д.) запрещена. Воспользуйтесь фото / видео - хостингом (например: Imgur, Япикс и т.д.).${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Нерабочая ссылка',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Доступ к доказательствам по ссылке закрыт и / или ссылка была удалена. Перезагрузите доказательства и прикрепите ссылку на них в следующей теме.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Отвязка привязок',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка».В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Блокировка по IP',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке. Переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN. Приносим свои извинения за доставленные неудобства.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
            prefix: CLOSE_PREFIX,
            status: false,
            open: false,
            move: 230,
        },
        {
            title: 'Запросить доп. информацию',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для дальнейшего рассмотрения темы заполните форму ниже:${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. Доказательства вашего владения этим имуществом:<br>2. Все детали пропажи (дата, время, действия после которых пропало имущество):<br>3. Информация о том, как вы получили это имущество:${END_COLOR}<br><br>` +
            `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Проблемы с кешем (форум)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы столкнулись с проблемой загрузки страниц форума, то выполните следующие действия:${END_COLOR}<br><br>` +
            `${START_COLOR_2}• Откройте Настройки.<br>• Найдите во вкладке Приложения свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите Очистить -> Очистить Кэш.<br><br>После следуйтеданным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите Конфиденциальность и безопасность -> Очистить историю.<br>• В основных и дополнительных настройках поставьте галочку в пункте Файлы cookie и данные сайтов.<br>После этого нажмите Удалить данные.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Кик за ПО',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы были отключены от сервер античитом<br><br>Пример:<br><img src="https://i.ibb.co/FXXrcVS/image.png"><br>Обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе выше нуля происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Для решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Законопослушность',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Администрация, технические специалисты и другие должностные лица на проекте не могут поспособствовать обнулению законопослушности.<br><br>Для повышения законопослушности вы можете воспользоваться одним из трех доступных способов:<br><br>1. Повышение законопослушности через /donate - услуги.<br>2. Повышение законопослушности путем выполнения заказов на работе «Электрик».<br>3. Повышение законопослушности в PayDay.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Баг со штрафами',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Сервер не отвечает',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте выполнить следующие действия:<br><br>• Изменить свой IP - адрес;<br>• Переключиться на Wi-Fi или мобильный интернет;<br>• Включить VPN;<br>• Перезагрузить роутер или интернет.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если методы выше не помогли, то попробуйте переустановить игру.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Проблемы с донатом',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Система построена таким образом, что денежные средства не будут списаны со счета, пока наша платформа не уведомит платежную систему о начислении Black Coins. Для проверки зачисления Black Coins необходимо ввести в игре команду: /donat.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В остальных же случаях, если не были зачислены Black Coins, то вероятнее всего, была допущена ошибка при вводе реквизитов.<br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты — *<a href="https://blackrussia.online/oferta.php">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения — *<a href="https://vk.com/br_tech">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Слетел аккаунт',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Игровой аккаунт не может просто так пропасть. Проверьте правильность введённых данных (Nickname, Server).${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Хочу занять должность',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Команда технических специалистов не занимается назначением тех или иных лиц на какие либо должности проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Создайте заявление на пост лидера / агента поддержки в разделе своего сервера — *<a href="https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,

        },
        {
            title: 'Предложения по улучшению',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Команда технических специалистов не занимается рассмотрением предложений, связанных с улучшением игрового мода.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Оставить своё предложение вы можете здесь — *<a href="https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8E.656/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Нужны все детали для прошивки',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Для установки прошивки на автомобиль нужно приобрести все детали для ее установки.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Пропали вещи с аукциона',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы выставили то или иное имущество на аукцион, а его никто не купил, то воспользуйтесь командой/reward. В случае отсутствия имущества в добыче, пересоздайте тему в техническом разделе.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Восстановление доступа к аккаунту',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Если вы обезопасили свой аккаунт и привязали его к странице ВКонтакте, то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - *<a href="https://vk.com/blackrussia.online">Кликабельно</a>*.<br>Если вы обезопасили свой аккаунт и привязали его к боту в Telegram, то сбросить пароль или пин-код вы можете здесь - *<a href="https://t.me/br_helper_bot">Кликабельно</a>*.<br><br>Если же вы не обезопасили свой игровой аккаунт, то вернуть к нему доступ в случае утери пароля или пин-кода не получится.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Рассмотрено${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на техов',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на технических специалистов своего сервера — *<a href="https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на адм',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на администрацию своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на лд',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на лидеров своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Вам в жб на игроков',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел жалоб на игроков своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в обжалования',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Вы ошиблись разделом. Обратитесь в раздел обжалований наказаний  своего сервера — *<a href="https://forum.blackrussia.online/#igrovye-servera.12">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title:'Вам в тех. поддержку',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Обратитесь в техническую поддержку BLACK RUSSIA для последующей консультации.${END_COLOR}<br><br>` +
            `${START_COLOR_2}1. Тех. поддержка (VK) - *<a href="http://vk.com/br_tech">Кликабельно</a>*;<br>2. Тех. поддержка (Telegram) - *<a href="https://t.me/br_techBot">Кликабельно</a>*;<br>3. Тех. поддержка (Сайт)  - *<a href="https://blackrussia.online/">Кликабельно</a>*.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Ответ от тестеров в прошлой теме',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}В одной из прошлых тем, вы уже получили ответ от одного из представителей отдела тестирования.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
            title: 'Бан ФА за дубликат',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}Ваш форумный аккаунт будет заблокирован за многочисленное дублирование тем.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
    ];

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

    const buttons1 = [
        {
            title: '=====> Продажа ИВ <=========================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Продажа ИВ (Банк)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы перевели игровую валюту в размере (сумма) рублей на банковский счет игрока (ник), после ее получения игрок снял ее, так как знал о предстоящем переводе. До и после передачи средств между вами не было никаких обсуждений и договоренностей, а также вы никогда не взаимодействовали с данным игроком до передачи игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Продажа ИВ (Трейд)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали игровую валюту в размере (сумма) рублей игроку (ник) через систему трейда. До и после передачи средств между вами не было никаких обсуждений и договоренностей, вы зашли в игру, встретились с покупателм, передали деньги и вышли из игры, а также вы никогда не взаимодействовали с данным игроком до передачи игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Продажа ИВ (Обмен)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы провели обмен с игроком (ник), в котором вы получили (указать что) и передали (указать что) с доплатой (сумма) рублей. Как видите сделка неравноценная и вы вышли в большой минус. Исходя из этого мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Продажа ИВ (Аукцион)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы купили (выбрать: аксессуар / скин / авто / бизнес / сим-карту / номерной знак) (название) у игрока (ник) через систему аукциона за (сумма) рублей, что значительно превышает рыночную стоимость этой игровой ценности. Исходя из этого мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Продажа ИВ (Маркетплейс)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы купили (выбрать: аксессуар / скин / сим-карту / номерной знак) (название) у игрока (ник) через систему маркетплейса за (сумма) рублей, что значительно превышает рыночную стоимость этой игровой ценности. Исходя из этого мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> Покупка ИВ <==========================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Покупка ИВ (Банк)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) на ваш банковский счет была переведена игровая валюта в размере (сумма) рублей от игрока (ник), известного, как продавец игровой валюты. После получения средств, вы без колебаний сняли их с банковского счета, так как знали о предстоящем переводе. До и после получения средств между вами не было никаких обсуждений и договоренностей, а также вы никогда не взаимодействовали с данным игроком до получения игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Покупка ИВ (Трейд)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы получили игровую валюту в размере (сумма) рублей от игрока (ник), известного, как продавец игровой валюты через систему трейда. До и после получения средств между вами не было никаких обсуждений и договоренностей, вы зашли в игру, встретились с продавцом, получили деньги и вышли из игры, а также вы никогда не взаимодействовали с данным игроком до получения игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Покупка ИВ (Обмен)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы провели обмен с игроком (ник), в котором вы получили (указать что) с доплатой (сумма) рублей и передали (указать что). Как видите сделка неравноценная и вы вышли в большой плюс. Игрок, с которым вы проводили обмен является продавцом игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Покупка ИВ (Бот)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) на ваш банковский счет была переведена игровая валюта в размере (сумма) рублей от ботовода. Бот - программа, целью которой является выполнение задач заработка игровой валюты для ее последующей продажи. После получения средств, вы без колебаний сняли их с банковского счета, так как знали о предстоящем переводе. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Покупка ИВ (Аукцион)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы продали (выбрать: аксессуар / скин / авто / бизнес / сим-карту / номерной знак) (название) игроку (ник) через систему аукциона за (сумма) рублей, что значительно превышает рыночную стоимость этой игровой ценности. Игрок, который купил у вас эту игровую ценность является продавцом игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Покупка ИВ (Маркетплейс)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы продали (выбрать: аксессуар / скин / авто / бизнес / сим-карту / номерной знак) (название) игроку (ник) через систему маркетплейса за (сумма) рублей, что значительно превышает рыночную стоимость этой игровой ценности. Игрок, который купил у вас эту игровую ценность является продавцом игровой валюты. Из всего вышесказанного мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> Трансфер <============================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Трансфер ИВ (Банк)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы с аккаунта (ник) перевели игровую валюту на банковский счет своего второго аккаунта (ник 2) в размере (сумма) рублей, тем самым совершив трансфер игровой валюты, что запрещено правилами проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Трансфер ИВ (Трейд)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы с аккаунта (ник) передали игровую валюту через систему трейда на свой второй аккаунт (ник 2) через систему трейда в размере (сумма) рублей, тем самым совершив трансфер игровой валюты, что запрещено правилами проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Трансфер ИВ / ИЦ (Обмен)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы с аккаунта (ник) провели обмен со своим вторым аккаунтом (ник 2), в котором на аккаунт (ник) вы получили (указать что) (выбрать: с доплатой (сумма) рублей / ничего), а на аккаунт (ник 2) (указать что), тем самым совершив трансфер (выбрать: игровой валюты / игровых ценностей), что запрещено правилами проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Трансфер ИВ / ИЦ (Маркетплейс)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы с аккаунта (ник) купили у своего второго аккаунта (ник 2) (выбрать: аксессуар / скин / сим-карту / номерной знак) (название) через систему маркетплейса за (сумма) рублей, тем самым совершив трансфер (выбрать: игровой валюты / игровых ценностей), что запрещено правилами проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Трансфер ИВ / ИЦ (Аукцион)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы с аккаунта (ник) купили у своего второго аккаунта (ник 2) (выбрать: аксессуар / скин / авто / бизнес / сим-карту / номерной знак) (название) через систему аукциона за (сумма) рублей, тем самым совершив трансфер (выбрать: игровой валюты / игровых ценностей), что запрещено правилами проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Трансфер ИЦ (Трейд)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы с аккаунта (ник) передали (выбрать: аксессуар / скин / сим-карту / номерной знак) (название) на свой второй аккаунт (ник 2), тем самым совершив трансфер игровых ценностей, что запрещено правилами проекта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> Ущерб экономике <====================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Раздача денег перед уходом с игры',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали игровую валюту в размере (сумма) рублей игроку (ник), аргументируя это тем, что вы уходите с проекта, что запрещено правилами игры.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Получение денег, от игрока, уходящего с игры',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы получили игровую валюту в размере (сумма) рублей от игрока (ник), который уходил с проекта, что запрещено правилами игры.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Розыгрыши с большим призом (организатор)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали игровую валюту в размере (сумма) рублей игроку (ник), аргументируя это тем, что он выиграл в конкурсе. Проведение конкурсов не запрещено правилами проекта, однако, сумма, которую вы передали игроку в качестве приза слишком большая, из-за чего ваш игровой аккаунт и был заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Розыгрыши с большим призом (победитель)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы получили игровую валюту в размере (сумма) рублей от игрока (ник), который проводил конкурс. Проведение конкурсов и участие в них не запрещено правилами проекта, однако, сумма, которую вы получили от игрока в качестве приза слишком большая, из-за чего ваш игровой аккаунт и был заблокирован.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> Передача аккаунта <==================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Передан',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) на ваш аккаунт был произведен вход в игру с устройства и IP адреса, с которых ранее входы не производились. Перед входом не было никаких признаков взлома, а во время того, когда, возможно, новый владелец аккаунта находился в игре его действия были странными и резко отличались от тех, что были на аккаунте до вероятной передачи аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> Махинации <==========================================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Махинации (Покупка ИВ)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали игровую валюту в размере (сумма) рублей с аккаунта (ник), с которого вы ранее купили игровую валюту, на свой второй аккаунт (ник 2), исходя из этого, мною и было принято решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Махинации (NonRp обман) (ИВ)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали игровую валюту в размере (сумма) рублей с аккаунта (ник), с которого вы ранее обманули игрока (ник 2) на (указать на что), на свой второй аккаунт (ник 3), исходя из этого, мною и было приянто решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Махинации (NonRp обман) (ИЦ)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали (указать что) с аккаунта (ник), с которого вы ранее обманули игрока (ник 2) на (указать на что), на свой второй аккаунт (ник 3), исходя из этого, мною и было приянто решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Махинации со взломом',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) вы передали (указать что) с аккаунта (ник), который вы ранее взломали, на свой аккаунт (ник 2), исходя из этого, мною и было приянто решение о блокировке вашего игрового аккаунта.${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: '=====> Правила владения бизнесами <==========================================================',
            color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #8A2BE2; border-color: #E6E6FA',
        },
        {
            title: 'Продажа дж в казино',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) Вы продаали должность (менеджера / крупье) в казино, тем самым нарушая пункт правил владения казино:<br>[QUOTE]2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на любые должности, связанные с деятельностью заведения | Ban 3 - 5 дней.[/QUOTE]${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
            title: 'Продажа дж в казино (обход через семью)',
            content:
            `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
            `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
            `${START_COLOR_2}(Дата) Вы продаали должность (менеджера / крупье) в казино путем продажи должности заместителя семьи (название семьи) за (сумма) рублей, тем самым обходя пункт правил владения казино:<br>[QUOTE]2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на любые должности, связанные с деятельностью заведения | Ban 3 - 5 дней.[/QUOTE]${END_COLOR}<br><br>` +
            `${START_COLOR_1}Передано руководству${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        }
    ];

    const prefixes = [
        {
             title: 'На рассмотрении',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFD700',
             prefix: PIN_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
             title: 'Команде проекта',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFFF00',
             prefix: KP_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
             title: 'Тех. специалисту',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #0000FF',
             prefix: TECH_PREFIX,
             status: true,
             open: true,
             move: 0,
        },
        {
             title: 'Рассмотрено',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000',
             prefix: WATCHED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Решено',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000',
             prefix: DECIDED_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Отказано',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000',
             prefix: UNACCEPT_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Закрыто',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000',
             prefix: CLOSE_PREFIX,
             status: false,
             open: false,
             move: 230,
        },
        {
             title: 'Ожидание',
             color: 'border-radius: px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E6E6FA',
             prefix: EXPECTATION_PREFIX,
             status: false,
             open: false,
             move: 0,
        },
    ];

        $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFA500');
-       addButton('Команде проекта', 'kp', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFD700');
-       addButton('Тех. специалисту', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #0000FF');
-       addButton('Рассмотрено', 'watch', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000');
-       addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000');
-       addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000');
-       addButton('Закрыто', 'close', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000');

        addMoveTasks();
        addAnswers1();
        addAnswers();

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(0, PIN_PREFIX, true, true));
        $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true, true));
        $('button#kp').click(() => editThreadData(0, KP_PREFIX, true, true));
        $('button#watch').click(() => editThreadData(230, WATCHED_PREFIX, false));
        $('button#decided').click(() => editThreadData(230, DECIDED_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(230, UNACCEPT_PREFIX, false));
        $('button#close').click(() => editThreadData(230, CLOSE_PREFIX, false));

        $(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#selectAnswers1`).click(() => {
            XF.alert(buttons1Markup(buttons1), null, 'Выберите ответ:');
            buttons1.forEach((btn, id) => {
                if (id > 999) {
                    $(`button#answers-${id}`).click(() => pasteContent1(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent1(id, threadData, false));
                }
            });
        });


        $(`button#selectMoveTasks`).click(() => {
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

    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`,
        );
    }

    function addAnswers1() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers1" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Заготовки для ответов</button>`,
        );
    }

    function addMoveTasks() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectMoveTasks" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Перемещение</button>`,
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

    function buttons1Markup(buttons1) {
        return `<div class="select_answer">${buttons1
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function tasksMarkup(tasks) {
        return `<div class="select_answer">${tasks
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

    function pasteContent1(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons1[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons1[id].move, buttons1[id].prefix, buttons1[id].status, buttons1[id].open);
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