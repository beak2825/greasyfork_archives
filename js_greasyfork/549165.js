// ==UserScript==
// @name         Спец заказ для Халисы
// @namespace    https://forum.blackrussia.online
// @version      4.0.0
// @description  by Sasha_Prishvin
// @author       Sasha_Prishvin
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn-icons-png.flaticon.com/128/4080/4080314.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549165/%D0%A1%D0%BF%D0%B5%D1%86%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BB%D1%8F%20%D0%A5%D0%B0%D0%BB%D0%B8%D1%81%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549165/%D0%A1%D0%BF%D0%B5%D1%86%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BB%D1%8F%20%D0%A5%D0%B0%D0%BB%D0%B8%D1%81%D1%8B.meta.js
// ==/UserScript==
 
(async function () {
  `use strict`;
const ZAKRUTO_PREFIX = 7;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const SPECY_PREFIX = 11;
const OJIDANIE_PREFIX = 14;
const REALIZOVANO_PREFIX = 5;
const PREFIKS = 0;
const KACHESTVO = 15;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const data = await getThreadData(),
      greeting = data.greeting, // greeting уже строка!
      user = data.user;
const buttons = [
      {
      title: 'Шубка',
      content:
        '[SIZE=4][COLOR=lavender][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Раздел Жалобы на игроков <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '[SIZE=4][COLOR=lavender][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
      {
      title: '| На рассмотрение |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Приятной игры на [/COLOR][COLOR=#FF4500]ULYANOVSK[/COLOR][/CENTER][/B]`,
      prefix: PIN_PREFIX,
      status: true,
    },
     {
      title: '| Не по форме |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вашa жалобa составленa не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=4][CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Одобрено |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Ваша жалоба одобрена, игрок будет наказан.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Наказание будет выдано в течение 24-х часов.[/COLOR][/CENTER][/B]<`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Одобрено, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Передать Теху |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Ваша жалоба была передана Техническому специалисту сервера.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Возможно на рассмотрение жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>',
      prefix: TEX_PREFIX,
      status: true,
    },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->---> Причины отказов <---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
    },
    {
      title: '| Нет нарушений |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Со стороны игрока не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано,закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| От 3 лица |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано,закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Отсутствуют док-ва |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг, написав новую жалобу.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано,закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Недостаточно док-в |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Предоставленных доказательств недостаточно для принятия решения,[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]если у вас имеют дополнительные доказательства прикрепите их, составив новую жалобу.[/COLOR][/CENTER][/B]` +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Док-ва отредактированы |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Доказательства были подвергнуты редактированию - следовательно, жалоба рассмотрению не подлежит.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Док-ва в соц-сети |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вашa жалобa отказана т.к доказательства загруженные в соцсети не принимаются.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Загрузите докозательства в фото/видео хостинги как YouTube, Imgur, Япикс.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]]<br>`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Не работают док-ва |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Ваши доказательства нерабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
      title: '| Нету /time |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), жалоба не подлежит рассмотрению.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нужен фрапс |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Неполный фрапс |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Видео запись не полная, к сожелению мы вынуждены отказать.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нету условий сделки |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]В ваших доказательствах отсутствуют условия сделки, жалоба рассмотрению не подлежит.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нету Тайм-кодов |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Если видео длится 3 и более минуты, вам следует указать таймкоды, в противном случае жалоба будет отказана.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: '| Системный промо |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Ваша жалоба была проверена и вердикт такой: данный промокод является системным, или был выпущен разработчиками.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Уже был ответ |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
      title: '| Уже был наказан |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Ваша жалоба отказана, т.к нарушитель уже был наказан ранее. Просьба не создавать дубликаты данной темы.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Прошло 72 часа |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]С момента совершения нарушения прошло 72 часа, жалоба не подлежит рассмотрению.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
   {
      title: '| Долг был дан не через банк |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Условия о долге в соц. сетях |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Договоры вне игры не будут считаться доказательствами.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Отказано, закрыто.[/COLOR][/CENTER][/B]]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->---> В другой раздел <---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
    },
    {
      title: '| В жалобы на АДМ |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Приятной игры на [/COLOR][COLOR=##FF4500]ULYANOVSK[/COLOR][/CENTER][/B].`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '| В жалобы на лидеров |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Приятной игры на [/COLOR][COLOR=##FF4500]ULYANOVSK[/COLOR][/CENTER][/B].`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: '| В жалобы на хелперов |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Обратитесь в раздел жалобы на агентов поддержки.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Приятной игры на [/COLOR][COLOR=#FF4500]ULYANOVSK[/COLOR][/CENTER][/B].`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '| В жалобы на сотрудников |',
      content:
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]' +
        `[FONT=georgia][SIZE=4][B][CENTER][COLOR=lavender]Приятной игры на [/COLOR][COLOR=#FF4500]ULYANOVSK[/COLOR][/CENTER][/B].`,
      prefix: CLOSE_PREFIX,
      status: false,
    }, 
     
];
 
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
           addButton('👑 ШАБЛОНЧИКИ 😎', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id >= 1) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            }
        });
    });
});
 
function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}
 
function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
    (btn, i) =>
      `<button id="answers-${i}" class="button--primary button ` +
      `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
 
function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
 
    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');
 
    if(send == true){
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
    mention: `[COLOR=#FFD700][USER=${authorID}]${authorName}[/USER][/COLOR]`,
  },
  greeting:
  4 < hours && hours <= 11
    ? 'Доброе утро'
    : 11 < hours && hours <= 15
    ? 'Добрый день'
    : 15 < hours && hours <= 21
    ? 'Добрый вечер'
    : 'Доброй ночи',
};
}
 
$(document).ready(() => {
        // Загрузка скрипта для работы шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);
 
        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Закрыто`, `zakruto`);
    
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#zakruto`).click(() => editThreadData(ZAKRUTO_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 2) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });
 
    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }
 
    function buttonsMarkup(buttons) {
 
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join(``)}</div>`;
    }
 
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();
 
        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);
 
        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }
 
    async function getThreadData() {
      const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
      const authorName = $('a.username').html();
      const hours = new Date().getHours();
  
      const greeting = 4 < hours && hours <= 11
          ? 'Доброе утро'
          : 11 < hours && hours <= 15
          ? 'Добрый день'
          : 15 < hours && hours <= 21
          ? 'Добрый вечер'
          : 'Доброй ночи';
 
      return {
          user: {
              id: authorID,
              name: authorName,
              mention: `[COLOR=#FFD700]${authorName}[/COLOR]`,
          },
          greeting: greeting // теперь это просто строка
      };
  }
 
    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;
 
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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