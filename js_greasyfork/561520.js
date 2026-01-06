// ==UserScript==
// @name   script_by_vifer
// @name:ru script ГА/ЗГА/Кураторы
// @description  Suggestions for improving the script write here ---> https://forms.gle/xt2YvQApsCDhXcwq8
// @description:ru Предложения по улучшению скрипта и информацию о багах писать сюда ---> https://forms.gle/xt2YvQApsCDhXcwq8
// @version 1.16.8
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   none
// @supportURL vk.com/notre3
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/561520/script_by_vifer.user.js
// @updateURL https://update.greasyfork.org/scripts/561520/script_by_vifer.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ   👨‍💻 Жалобы на администрацию 👨‍💻    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
    {
      title: 'На рассмотрении',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「На рассмотрении」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: PINN_PREFIX,
      status: true,
    },
        {
      title: 'Спец. администратору',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Специальному администратору.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
      status: true,
    },
        {
      title: 'Передано ГА',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Главному администратору.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Передано теху',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(255, 69, 0)]Техническому специалисту.[/color][/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
      status: true,
    },
    {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name администратора:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Дата выдачи/получения наказания:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Суть жалобы:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]5.[/color] Доказательства:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Пункт незаполнен',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Один из пунктов Вашей жалобы не заполнен/заполнен некорректно.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Фотохостинги',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на [URL='http://yapx.ru'][U]yapx[/U][/URL]/[URL='http://imgur.com'][U]imgur[/U][/URL]/[URL='http://youtube.com'][U]YouTube[/U][/URL].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
       {
      title: 'Дата выдачи',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Отсутствует дата выдачи наказания со стороны администрации.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Дублирование темы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ответ был дан в прошлой теме. Напомню, что если Вы продолжите создавать идентичные темы - к Вашему форумному аккаунту могут быть применены санкции в виде блокировки.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'В жалобы на тех. спеца',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обратитесь в [U][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.600/']раздел жалоб на технических специалистов[/URL][/U].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Если Вы не согласны с выданным наказанием - обратитесь в [U][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.597/']раздел жалоб на администрацию[/URL][/U].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Неуваж. контекст',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалоба с неуважением к администрации рассмотрена не будет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано ❖ Закрыто[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Нет доказательств',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на выданное наказание от данного администратора.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
       {
      title: 'Не работают док-ва',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства нерабочие.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Недостаточно док-в',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательств, предоставленных Вами недостаточно для принятия каких-либо мер в сторону администрации.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
      {
      title: 'Плохое качество',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Качество доказательств, предоставленными Вами низкое, в связи с этим, мы не можем принять их.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '48 часов',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С момента выдачи наказания прошло более 48 часов, жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Нет /time',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'От 3-го лица',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы, написанные от 3-го лица рассмотрению не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Бан IP',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Перезагрузите роутер или переключитесь на мобильный интернет. [/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Технический раздел',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обратитесь в [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-magenta.613/'][U]технический раздел[/U][/URL].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ссылку на ВК',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Прикрепите ссылку на Ваш ВКонтакте.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Со стороны администратора отсутствуют нарушения, наказание выдано [COLOR=rgb(255, 0, 0)] верно [/color].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Нет нарушений',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Наказание выдано верно, нарушений со стороны администратора нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Будет проведена работа',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br>" +
        "[CENTER][FONT=georgia][I][B]Приносим свои глубочайшие извинения за предоставленные неудобства, с администратором будет проведена работа.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Решено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Наказание будет снято',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Наказание будет снято.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Решено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Приняты меры к админу',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]К администратору предприняты меры, приносим свои извинения. <br><br> Ваша тема будет пересмотрена.[/FONT][/I][/B][/CENTER] <br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Решено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },

        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ😭 Обжалование наказаний 😭 ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
    {
      title: 'До минимальных мер',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше обжалование было рассмотрено и принято решение о сокращении Вашего наказания до минимальных мер.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
      {
      title: 'Отказано №1',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В обжаловании отказано.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
  {
      title: 'Отказано №2',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На данный момент мы не готовы пойти к Вам на встречу и обжаловать наказание.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Если Вы не согласны с выданным наказанием - обратитесь в [U][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.597/']раздел жалоб на администрацию[/URL][/U].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Сливы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Различные формы 'слива' обжалованию не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
            {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваше обжалование составлено [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name администратора:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Дата выдачи/получения наказания:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Суть заявки:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]5.[/color] Доказательства:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
  {
      title: 'Смена ника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваш аккаунт разблокирован, у вас есть 24 часа на смену игрового никнейма. При игнорировании отведённого Вам времени, Ваш аккаунт будет заблокирован и обжалованию не будет подлежать.[/CENTER]<br><br>" +
        '[Color=Flame][CENTER]Тема открыта, после смены никнейма отпишитесь в данной теме.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: true,
    },
        {
      title: 'Никнейм не был сменён',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Смены никнейма не произошло, блокировка возвращена.[/FONT][/I][/B][/CENTER] <br>" +
         '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
        },
       {
      title: 'Никнейм сменён',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Смену никнейма подтверждаю, блокировка снята.[/FONT][/I][/B][/CENTER] <br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Решено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
            {
      title: 'Пункт незаполнен',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Один из пунктов Вашего обжалования не заполнен/заполнен некорректно.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Сливы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Различные формы `слива` обжалованию не подлежат. Закрыто.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: 'Неуваж. контекст',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Обжалования с неуважением к администрации рассмотрены не будут.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Дата выдачи',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Отсутствует дата выдачи наказания со стороны администрации.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нет доказательств',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на выданное наказание от данного администратора.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
      title: 'Нет /time',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают докaзательства.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

    {
      title: 'Фотохостинги',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на [URL='http://yapx.ru'][U]yapx[/U][/URL]/[URL='http://imgur.com'][U]imgur[/U][/URL]/[URL='http://youtube.com'][U]YouTube[/U][/URL].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Дублирование темы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ответ был дан в прошлой теме. Напомню, что если Вы продолжите создавать идентичные темы - к Вашему форумному аккаунту могут быть применены санкции в виде блокировки.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на теха',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обратитесь в [U][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9613-magenta.1194/']раздел жалоб на технических специалистов[/URL][/U].[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалованию не подлежит',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Наказания подобного типа обжалованию не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Бан IP',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Перезагрузите роутер или переключитесь на мобильный интернет. [/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Технический раздел',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Обратитесь в технический раздел.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ссылку на ВК',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Прикрепите ссылку на Ваш ВКонтакте.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'ЧС фракции',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Черный список фракции снимается в правительстве.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Переношу в нужный раздел',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Переношу Вашу тему в необходимый раздел.[/CENTER]<br><br>"
    },
    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ❌ Отказанные жалобы на игроков ❌    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
    {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name игрока:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Суть жалобы:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Доказательство:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
           {
      title: 'Прошло 3 дня',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С момента возможного нарушения со стороны игрока прошло более 72 часов, жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
       {
      title: 'Неуважение в жалобе',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В вашей жалобе присутствует неуважение к игроку/администрации, жалоба рассмотрена не будет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Фотохостинги',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Видеозапись',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В данном случае, для выдачи наказания игроку, требуется видеозапись.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Видео обрывается',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваше видеодоказательство обрывается. Видеохостинг YouTube загружает видео без ограничений, рекомендуем использовать его..[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Нет доказательств',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на совершенное нарушение от данного игрока.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
      title: 'Недостаточно доказательств',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательств, предоставленных Вами, недостаточно для выдачи наказания данному игроку.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
       {
      title: 'Не работают док-ва',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства, предоставленные Вами, нерабочие.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
           {
      title: 'Плохое качество',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Качество доказательств, предоставленными Вами низкое, в связи с этим, мы не можем принять их.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Нет /time',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'От 3-го лица',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы, написанные от 3-го лица рассмотрению не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Отсутствуют условия сделки',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствуют условия сделки.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
        {
      title: 'Нет нарушений',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушений со стороны игрока нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Жалобу на сотрудника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Обратитесь в раздел жалоб на сотрудников.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания жалоб на игроков.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Ошиблись сервером',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись сервером. Данный раздел принадлежит серверу Tver.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
            {
      title: 'Займ денег через трейд',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. На ваших доказательствах займ был осуществлен через обмен с игроком.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'Доступ к складу 3 лицу',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы сами доверили и выдали права игроку для обеспечения возможности получения денег со склада.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Кража патронов с склада фамы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушения со стороны игрока отсутствуют. Игрок заплатил опеределенную сумму за разрешение определенного количества патронов, которую Вы выдали ему.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Таймкоды',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша видеозапись длится более 3-х минут. У Вас есть 24 часа, чтобы прикрепить таймкоды нарушений, в ином случае жалоба будет закрыта.[/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「На рассмотрении」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: PINN_PREFIX,
      status: true,
    },
        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🍺 Правила RolePlay процесса 🍺  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
      {
      title: 'NRP поведение',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Уход от RP',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      status: false,
    },
    {
      title: 'NDrive',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Помеха RP',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'NRP обман',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | PermBan [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Аморал. действия',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Слив склада',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание:[/color] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание:[/color] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом. [/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Обман в /do',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.10.[/color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    }, {
      title: 'Т/С в лич. целях',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.11.[/color] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Помеха блогерам',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.12.[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [COLOR=rgb(255, 0, 0)] | Ban 7 дней [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Пример[/color]спам в чат оскорблениями и провокационными сообщениями, мешая работе блогера в проведении трансляции и взаимодействии с аудиторией.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'DB',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Исключение:[/color] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'TK',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'SK',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'MG',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'DM',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'TDM',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)] | Warn / Ban 3 - 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Обход системы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание[/color] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Стороннее ПО',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание[/color]  запрещено внесение любых изменений в оригинальные файлы игры.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Сокрытие багов',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.23.[/color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Сокрытие нарушителей',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Вред репутации проекта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Вред ресурсам проекта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.26.[/color] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Слив адм. информ.',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.27.[/color] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [COLOR=rgb(255, 0, 0)] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'ППИВ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)] | PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание:[/color] любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание:[/color] нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Ущерб экономике',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.30.[/color] Запрещено пытаться нанести ущерб экономике сервера [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Реклама',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Ввод в забл/Обман адм.',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Уязвимость правил',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.33.[/color] Запрещено пользоваться уязвимостью правил [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Межнац. и религ. конфликт',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'OOC угрозы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Распр. личной информ.',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.38.[/color] Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп. наказаниями',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.39.[/color] Злоупотребление нарушениями правил сервера [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оск. проекта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Продажа аккаунта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.42.[/color] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [COLOR=rgb(255, 0, 0)] | PermBan [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Продажа промокода',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=rgb(255, 0, 0)] | Mute 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Fdrive',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Продажа/покупка репутации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.48.[/color] Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [COLOR=rgb(255, 0, 0)] | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Арест на аукционе',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней + увольнение из организации[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'NRP аксессуар',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оск. названия ценностей',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [COLOR=rgb(255, 0, 0)] | Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оск. администрации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)] | Mute 180 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Багоюз анимации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)] | Jail 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Невозврат долга',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=rgb(255, 0, 0)] | Ban 30 дней / Permban=[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание[/color] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
            {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🍺 Правила поведение в игровых чатах 🍺  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
    {
      title: 'CapsLock',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оскорбление в OOC',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Упоминание родных',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Флуд',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп. символами',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Слив глобал. чата',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Выдача себя за адм.',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)] | Ban 7 - 15[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Введение в заблуждение',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание[/color] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Транслит и оффтоп в репорт',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.12.[/color] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [COLOR=rgb(255, 0, 0)] | Report Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Музыка в voice',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.14.[/color] Запрещено включать музыку в Voice Chat [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Шумы в voice',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.16.[/color] Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]Примечание:[/color] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Политика, провокация',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Смена голоса в voice',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.19.[/color] Запрещено использование любого софта для изменения голоса [COLOR=rgb(255, 0, 0)] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Транслит',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.20.[/color] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)] | Ban 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Объявления в ГОСС',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Мат в VIP чат',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
                {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ🍺 Положение об игровых аккаунтах 🍺  ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
     {
      title: 'ППВ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.03.[/color] Запрещена совершенно любая передача игровых аккаунтов третьим лицам [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Мультиаккаунт',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.04.[/color] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Трансфер между твинками',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.05.[/color] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества [COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Формат ника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Две заглавных буквы в нике',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.07.[/color] В игровом никнейме запрещено использовать более двух заглавных букв [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Бессмысленный ник',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.08.[/color] Запрещено использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оскорбительный ник',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Фейк ник',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Бизнес на твинках',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.11.[/color] Владеть бизнесами разрешается с одного основного аккаунта [COLOR=rgb(255, 0, 0)] | Обнуление аккаунта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'ТК и СК актив',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.14.[/color] Запрещено, имея транспортную или строительную компанию не проявлять активность в игре. [COLOR=rgb(255, 0, 0)] | Обнуление компании без компенсации[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Идентичный промокод',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.15.[/color] Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка. [COLOR=rgb(255, 0, 0)] | Permban или обнуление имущества, заработанного с помощью промокода, а также самого промокода. [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ🚓 Жалобы на ГОСС 🚓   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
{
      title: 'Работа в форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Т/С в лич. целях',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'DM без причины на ТТ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.11.[/color] Всем силовым структурам запрещено наносить урон без IC причины на территории своей организации [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Казик/Бу/Конты',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.13.[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Арест бизвар',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.14.[/color] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Арест на ТТ ОПГ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]1.16.[/color] Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'ДМ вне в/ч',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [COLOR=rgb(255, 0, 0)] | DM / Jail 60 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Закрытие метки сбора матов',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещено закрывать метку сбора автомобилями, с целью сохранения материалов на складе [COLOR=rgb(255, 0, 0)] | Jail 30 минут;[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Услуги адвоката на ТТ ФСИН',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.01[/color] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'НПРО',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'НППЭ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Замена объявлений',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'NRP розыск/штраф',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]7.02.[/color] Запрещено выдавать розыск, штраф без IC причины [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Кража в/у при погоне',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [COLOR=rgb(255, 0, 0)] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'ДМ вне УФСБ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]8.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [COLOR=rgb(255, 0, 0)] | DM / Jail 60 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'ДМ вне ФСИН',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]9.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [COLOR=rgb(255, 0, 0)] | DM / Jail 60 минут / Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
            {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ🔫 Жалобы на ОПГ 🔫   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
    {
      title: 'Провокация ГОСС',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.[/color] Запрещено провоцировать сотрудников государственных организаций [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'ДМ на территории ОПГ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]4.[/color]Запрещено без причины наносить урон игрокам на территории ОПГ [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Дуэли',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]5.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Перестрелка в люд. местах',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]6.[/color] Запрещено устраивать перестрелки с другими ОПГ в людных местах [COLOR=rgb(255, 0, 0)] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Реклама в чате ОПГ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]7.[/color] Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Уход от погони на респу',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]8.[/color] Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'NRP в/ч',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=rgb(255, 0, 0)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Обход взлома в/ч',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE]Нападение на военную часть разрешено через блокпост с последовательностью взлома или взрыва стены, заранее подготовленным динамитом [COLOR=rgb(255, 0, 0)] | /Warn NonRP В/Ч[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },





  ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('💖 Script by. Vifer 💖', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
  });

  function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #BF40BF;">${name}</button>`,
    );
  }

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
    };
  }

    function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
                              sticky: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }

function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
    }
})();
