// ==UserScript==
// @name         OMSK | CHIEF Script TF Version
// @namespace    https://forum.blackrussia.online/
// @version      1.0.2
// @description  Скрипт для Руководства сервера OMSK | ТФ версия | VK - https://vk.com/la_la_knife
// @author       Sasha_Dodobrodel🦔
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/552270/OMSK%20%7C%20CHIEF%20Script%20TF%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/552270/OMSK%20%7C%20CHIEF%20Script%20TF%20Version.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SA_PREFIX = 11; // Префикс для Специальной Администрации
const GA_PREFIX = 12; // Префикс для Главного Администратора
const TEX_PREFIX = 13; // Префикс для Технического Специалиста

const buttons = [
{
    title: 'Приветствие',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(80, 200, 120, 0.5); background: #50c878; color: white;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
    '[CENTER] [/CENTER][/FONT][/SIZE]',
},
{
    title: 'На рассмотрение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Mqs0cgwx/IMG-20240103-233852.jpg[/img][/url][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Запросить доква',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Запрошу доказательства у администратора.[/CENTER]<br><br>" +
    "[CENTER]Ожидайте ответа.[/CENTER]<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Наказание за форум',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Игрок написал на вас жалобу, исходя из этой жалобы вам было выдано наказание.[/CENTER]<br><br>" +
    "[CENTER]Проверю верность вредикта куратора форума , ожидайте ответа.[/CENTER]<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Отправить на рассмотрение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
    "[CENTER]Ожидайте ответа.<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Бан по IP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/CENTER]<br><br>" +
    "[CENTER]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет.<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: WATCHED_PREFIX,
    status: false,
},
{
    title: 'Жалоба одобрена в сторону игрока',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: WATCHED_PREFIX,
    status: false,
},
{
    title: 'Наказать адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша жалоба была одобрена и администратор будет наказан,Cпасибо за информацию.[/CENTER]<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: WATCHED_PREFIX,
    status: false,
},
{
    title: 'Дублирование темы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); background: #ff2400; color: white;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
    "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
    '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Передано Тех. Специалисту',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: TEX_PREFIX,
    status: true,
},
{
    title: 'Передано ГА',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша жалоба будет передана Главному Администратору на рассмотрение. Ожидайте его ответа.<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: GA_PREFIX,
    status: true,
},
{
    title: 'Передано СА',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной администрации[/COLOR] <br><br>" +
    "[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT][/SIZE]',
    prefix: SA_PREFIX,
    status: true,
},
{
    title: 'DM нарушение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
    "[LIST]<br>" +
    "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
    "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
    "[/LIST]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Недостаточно доказательств',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); background: #ff2400; color: white;',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отсутствуют доказательства',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); background: #ff2400; color: white;',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
    "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Беседа с админом',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5); background: #8a2be2; color: white;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]С администратором будет проведена беседа,Cпасибо за информацию.[/CENTER]<br><br>" +
    "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
    '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: 'Ошиблись сервером',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5); background: #8a2be2; color: white;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
    '[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: 'Наказать админа и снять наказание',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;',
    content:
    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваша жалоба одобрена, администратор будет наказан.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
    '[CENTER]Приятной игры на нашем сервера.[/CENTER]',
    prefix: WATCHED_PREFIX,
    status: false,
},
{
    title: '---------- Обжалования ------------------------------------------------------------------------------------------------------------------------',
    dpstyle: 'oswald: 3px; color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
},
{
    title: 'Обжалование на рассмотрении',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
    '[CENTER][Color=Orange]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
    prefix: PIN_PREFIX,
    status: true,
},
{
    title: 'Одобрить обжалование',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.<br><br>" +
    '[CENTER][Color=Green]Одобрено.[/CENTER][/FONT][/SIZE][/color]<br><br>',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказать обжалование',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); background: #ff2400; color: white;',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER] {{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]В обжаловании отказано.<br><br>" +
    '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: 'Снизить наказание',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше наказание будет снижено до минимальных мер.<br><br>" +
    '[CENTER][Color=#AEF359]Одобрено.[/CENTER][/FONT][/SIZE][/color]',
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
    title: 'Обжалование не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); background: #ff2400; color: white;',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR].<br><br>" +
    '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/SIZE][/color]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: 'Передать ГА (Обжалование)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование передано Главному администратору.[/CENTER]<br><br>" +
    '[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
    prefix: GA_PREFIX,
    status: true,
},
{
    title: 'Передать СА (Обжалование)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);',
    content:
    '[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    "[CENTER]Ваше обжалование передано Специальной администрации.[/CENTER]<br><br>" +
    '[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
    prefix: SA_PREFIX,
    status: true,
}
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); background: #98fb98;');
addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); background: #ff2400; color: white;');
addButton('Закрыто', 'close', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5); background: #8a2be2; color: white;');
addButton('Тех. Специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0, 0.5); background: #ffa500; color: white;');
addAnswers();

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if(id > 0 && btn.prefix !== undefined) {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
} else {
$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
}
});
});
});

function addButton(name, id, style) {
$('.button--icon--reply').before(
`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
);
}

function addAnswers() {
$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px; background: #7851A9; color: white;">ОТВЕТЫ</button>`);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
.map(
(btn, i) =>
`<button id="answers-${i}" class="button--primary button ` +
`rippleButton" style="margin:4px; ${btn.dpstyle || 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);'}"><span class="button-text">${btn.title}</span></button>`,
)
.join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
if (!buttons[id] || !buttons[id].content) return;

const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');

if(send == true && buttons[id].prefix !== undefined){
editThreadData(buttons[id].prefix, buttons[id].status);
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

function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;

if(pin == false){
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
}
if(pin == true){
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
sticky: 1,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}
}

function getFormData(data) {
const formData = new FormData();
Object.entries(data).forEach(i => formData.append(i[0], i[1]));
return formData;
}
})();