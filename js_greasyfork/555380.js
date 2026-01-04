// ==UserScript==
// @name         Спец заказ для Меня
// @namespace    https://forum.blackrussia.online
// @version      2.2.5
// @description  by Sasha_Prishvin
// @author       Sasha_Prishvin
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         https://cdn-icons-png.flaticon.com/128/4080/4080314.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555380/%D0%A1%D0%BF%D0%B5%D1%86%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%B5%D0%BD%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555380/%D0%A1%D0%BF%D0%B5%D1%86%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%B5%D0%BD%D1%8F.meta.js
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
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Раздел Жалобы на игроков <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
     },
    {
      title: ' Одобрено, игрок буден наказан ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url]<br>[/CENTER]' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Игрок будет наказан.<br><br>[/COLOR][/CENTER][/B]`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#66FF66]Одобрено[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: ' Отказано ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Со стороны игрока нет нарушений.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF0000]Отказано[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: true,
    },
    {
      title: ' Недостаточно док-в ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Доказательств недостаточно для принятия решения.<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF0000]Отказано[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: ' Взломан ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваш аккаунт будет заблокирован с причиной "Взломан".<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Аккаунты, на которые передавалось имущество, будут заблокированы.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Чтобы разблокировать ваш аккаунт, напишите обжалование в разделе "жалобы на технических специалистов" своего сервера.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#66FF66]Рассмотрено[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
   {
      title: ' Индивидуально | Рассмотрено ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url]<br>[/CENTER]' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Игрок будет наказан.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, ваш аккаунт будет заблокирован за использования сторонего програмного обеспечения.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]На предоствленной вами видеозаписи, данный факт прекрасно виден.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#66FF66]Рассмотрено[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
     },
      {
      title: ' Индивидуально | Закрыто ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url]<br>[/CENTER]' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Со стороны лидера семьи нарушений нет.[/COLOR][/CENTER][/B]<br><br>`+
       // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
       // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, ваш аккаунт будет заблокирован за использования сторонего програмного обеспечения.[/COLOR][/CENTER][/B]<br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]На предоствленной вами видеозаписи, данный факт прекрасно виден.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
     {
      title: ' Пытался купить донат ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url]<br>[/CENTER]' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]После проверки доказательств и системы логирования вердикт:[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Игрок будет наказан.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, доношу до вашего сведения, что ваши действия нарушают пункт правил 2.28.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]В следующий раз вы также будете заблокированы.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28[/COLOR][COLOR=lavender]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [/COLOR][COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR].<br><br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – [COLOR=rgb(255, 0, 0)]наказуемо[/COLOR].<br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Пример[/COLOR][COLOR=lavender]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности [/COLOR][COLOR=rgb(255, 0, 0)]запрещено[/COLOR][COLOR=lavender].<br>[/COLOR][COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Исключение[/COLOR][COLOR=lavender]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#66FF66]Рассмотрено[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
     },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->---> Жалобы на тех спец <---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
    },
    {
      title: ' Индивидуальные ситуации ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Напишите всои привязки в прошлой теме.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ссылка на прошлую тему: https://forum.blackrussia.online/threads/Обжалование-ВЗЛОМАН-bruno_vendetta.13836675/[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Прошлая тема открыта.[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Вы продали данный предмет в 53 раза дороже рынка, за что и были заблокированы.[/COLOR][/CENTER][/B]<br><br>`+
       // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][/COLOR][/CENTER][/B]<br><br>`+
     //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
     //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][/COLOR][/CENTER][/B]<br><br>`+
     //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][/COLOR][/CENTER][/B]<br><br>`+
     //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
    //  prefix: PIN_PREFIX,
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Передано руководству ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша тема закреплена и находится на рассмотрении.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ожидайте ответа. Создавать дубликаты данной темы не нужно.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Передано руководству...[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' на рассмотрение ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша тема закреплена и находится на рассмотрении.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ожидайте ответа. Создавать дубликаты данной темы не нужно.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]На рассмотрении.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: TEX_PREFIX,
      status: true,
    },
    {
      title: ' Жалоба не по форме ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша жалоба написана не по форме.<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, ознакомьтесь с формой написания жалобы на технического специалиста.<br>` +
        '[SPOILER="Форма подачи жалобы на технического специалиста"][COLOR=rgb(255, 0, 0)]01[/COLOR][COLOR=lavender]. Ваш игровой никнейм:[/COLOR]<br>[COLOR=rgb(255, 0, 0)]02[/COLOR][COLOR=lavender]. Игровой никнейм технического специалиста:[/COLOR]<br>[COLOR=rgb(255, 0, 0)]03[/COLOR][COLOR=lavender]. Сервер, на котором Вы играете:[/COLOR]<br>[COLOR=rgb(255, 0, 0)]04[/COLOR][COLOR=lavender]. Описание ситуации (описать максимально подробно и раскрыто):[/COLOR]<br>[COLOR=rgb(255, 0, 0)]05[/COLOR][COLOR=lavender]. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[/COLOR]<br>[COLOR=rgb(255, 0, 0)]06[/COLOR][COLOR=lavender]. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/B][/FONT][/COLOR][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF0000]Отказано[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' ОБЖ не по форме ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обжалование написано не по форме.<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, ознакомьтесь с формой написания обжалования.<br>` +
        '[SPOILER="Форма подачи обжалования"][COLOR=rgb(255, 0, 0)]01[/COLOR][COLOR=lavender]. Ваш игровой никнейм:[/COLOR]<br>[COLOR=rgb(255, 0, 0)]02[/COLOR][COLOR=lavender]. Игровой никнейм технического специалиста:[/COLOR]<br>[COLOR=rgb(255, 0, 0)]03[/COLOR][COLOR=lavender]. Сервер, на котором Вы играете:[/COLOR]<br>[COLOR=rgb(255, 0, 0)]04[/COLOR][COLOR=lavender]. Описание ситуации (описать максимально подробно и раскрыто):[/COLOR]<br>[COLOR=rgb(255, 0, 0)]05[/COLOR][COLOR=lavender]. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[/COLOR]<br>[COLOR=rgb(255, 0, 0)]06[/COLOR][COLOR=lavender]. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/B][/FONT][/COLOR][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF0000]Отказано[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Не по теме ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение никак не связано с жалобами на технических специалистов.[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Дубликат ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша тема является дубликатом предыдущей темы.[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Посмотреть ответ вы можете в [URL='']прошлой теме[/URL] (кликабельно).[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
   {
      title: ' Дубликат - в бан ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша тема является дубликатом предыдущей темы.[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Посмотреть ответ вы можете в [URL='https://forum.blackrussia.online/threads/quali_killed-Покупка-ИВ.13513263/']прошлой теме[/URL] (кликабельно).[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваш форумный аккаунт будет заблокирован за нарушение правил пользования форумом.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Не работают док-ва ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваши доказательства нерабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Док-ва плохого качества ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваши доказательства нечитаемы, так как они в плохом качестве.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
	    title: ' Нет окна блокировки ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
	    content:
	      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Без окна о блокировке тема не подлежит рассмотрению.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Создайте новую тему, прикрепив окно блокировки с фотохостинга.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Фотохостинги:[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://yapx.ru/']yapx.ru[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://imgur.com/']imgur.com[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://imgbb.com']ImgBB.com[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://imgfoto.host/']ImgFoto.host[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://postimages.org/']Postimages.org[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender](все кликабельно)[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
    	prefix: ZAKRUTO_PREFIX,
	    status: false,
    },
    {
	    title: ' Доква в соц сети ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
	    content:
	      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Доказательства из социальных сетей не принимаются.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Создайте новую тему, прикрепив окно блокировки с фотохостинга.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Фотохостинги:[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://yapx.ru/']yapx.ru[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://imgur.com/']imgur.com[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://imgbb.com']ImgBB.com[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://imgfoto.host/']ImgFoto.host[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender][URL='https://postimages.org/']Postimages.org[/URL][/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender](все кликабельно)[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
    	prefix: ZAKRUTO_PREFIX,
	    status: false,
    },
    {
      title: ' Запрос привязок ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
	      `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ ).[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]3. Укажите почту, которая привязана к аккаунту[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ожидаю ваш ответ.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: TEX_PREFIX,
      status: true,
    },
    {
      title: ' Ошибка, разбан ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
	      `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваш аккаунт был заблокирован ошибочно.[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
   {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->---> Перенаправить <---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
    },
    {
      title: ' Переношу в жб на игроков ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение никак не связано с жалобами на технических специалистов.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Переношу вашу тему в раздел жалоб на игроков.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: OJIDANIE_PREFIX,
      status: false,
    },
    {
      title: ' Напишите в жб на игроков ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение никак не связано с жалобами на технических специалистов.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, обратитесь в раздел жалобы на игроков.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: OJIDANIE_PREFIX,
      status: false,
    },
    {
      title: ' Напишите в обжалования наказаний',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше наказание было выдано не техническим специалистом.[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, обратитесь в раздел обжалование наказаний.[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Напишите в жб на админа',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше наказание выдано не техническим специалистом.[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, обратитесь в раздел жалобы на администрацию.[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Напишите в жб сотрудника ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение никак не связано с жалобами на технических специалистов.[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, обратитесь в раздел жалоб на сотрудников данной организации вашего сервера.[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Напишите в тех раздел 07 ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение никак не связано с жалобами на технических специалистов.[/COLOR][/CENTER][/B]<br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, обратитесь в  [URL='https://forum.blackrussia.online/forums/Технический-раздел-lime.365/']технический раздел[/URL] (кликабельно).[/COLOR][/CENTER][/B]<br><br>` +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->--->--->---> Правила <---<---<---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
    },
    {
      title: ' 2.28 ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]10 10/2025 19:11 вы написали сообщение RP чат - "вирты продам 1".[/COLOR][/CENTER][/B]<br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, договоров до сделки не было.[/COLOR][/CENTER][/B]<br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было доказано, что аккаунт Egorik_Hasite, от которого вы получали игровую валюту, продавал игровую валюту и другим аккаунтам.[/COLOR][/CENTER][/B]<br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Из этого можно сделать вывод, что аккаунт Kewazzo_Towerssx специально сдавался в играх.[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Следовательно, вы получили 2 000 000 ИВ от аккаунта Kewazzo_Towerssx.[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за попытку продажи игровой валюты, что нарушает пункт правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28[/COLOR][COLOR=lavender]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [/COLOR][COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR].<br><br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – [COLOR=rgb(255, 0, 0)]наказуемо[/COLOR].<br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Пример[/COLOR][COLOR=lavender]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности [/COLOR][COLOR=rgb(255, 0, 0)]запрещено[/COLOR][COLOR=lavender].<br>[/COLOR][COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Исключение[/COLOR][COLOR=lavender]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' 4.05 ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]У вас было множество транзакций с аккаунтом Asco_Jaguar.[/COLOR][/CENTER][/B]<br>`+
    //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, вы обменялись ZAZ 968 на ZAZ 968 с доплатой Tevis_Grade 35 000 123.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было даказано, что на оба аккаунты били подключения с одного устройства.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, IP адреса на обоих аккаунтах были схожи и находились в одном городе.[/COLOR][/CENTER][/B]<br>`+
    //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
    //    `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за трансфер игровой валюты через систему обмена имуществом, что нарушает пункт правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        '[CENTER][COLOR=rgb(255, 0, 0)]4.05[/COLOR][COLOR=lavender]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>[COLOR=lavender]Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/CENTER][/COLOR]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' 2.28 | Покупка ИВ у бота ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]28 10 2025 года в 17:38 вы сняли со своего банковского счета №198060 сумму - 8 260 000  ИВ.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было доказано, что аккаунт Veeneesex_Hodr , который переводил вам ИВ, является ботом, который продает игровую валюту.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за покупку игровой валюты у аккаунта Veeneesex_Hodr c помощью банковской системы, что нарушает пункт правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28[/COLOR][COLOR=lavender]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [/COLOR][COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR].<br><br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – [COLOR=rgb(255, 0, 0)]наказуемо[/COLOR].<br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Пример[/COLOR][COLOR=lavender]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности [/COLOR][COLOR=rgb(255, 0, 0)]запрещено[/COLOR][COLOR=lavender].<br>[/COLOR][COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Исключение[/COLOR][COLOR=lavender]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' 2.28 | через трейд ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]06 11 2025 года в 15:38 вы получили от игрока Berries_Miller через трейд сумму - 80 000 000.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было доказано, что аккаунт Berries_Miller продает игровую валюту.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за покупку игровой валюты у аккаунта Berries_Miller  c помощью системы трейда, что нарушает пункт правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28[/COLOR][COLOR=lavender]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [/COLOR][COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR].<br><br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – [COLOR=rgb(255, 0, 0)]наказуемо[/COLOR].<br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Пример[/COLOR][COLOR=lavender]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности [/COLOR][COLOR=rgb(255, 0, 0)]запрещено[/COLOR][COLOR=lavender].<br>[/COLOR][COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Исключение[/COLOR][COLOR=lavender]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' 2.28 | Покупка ИВ через банк ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]17 октября 2025 года в 08:07 вы сняли со своего банковского счета №356544 сумму - 13 500 000 ИВ.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, данные действия были сделанны всего через 4 минуты, после того как пришла игровая валюта на счет.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было доказано, что аккаунт Roma_Morozav, который переводил вам ИВ, является продавцом игровой валюты.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за покупку игровой валюты у аккаунта Roma_Morozav c помощью банковской системы, что нарушает пункт правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28[/COLOR][COLOR=lavender]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [/COLOR][COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR].<br><br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – [COLOR=rgb(255, 0, 0)]наказуемо[/COLOR].<br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Пример[/COLOR][COLOR=lavender]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности [/COLOR][COLOR=rgb(255, 0, 0)]запрещено[/COLOR][COLOR=lavender].<br>[/COLOR][COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Исключение[/COLOR][COLOR=lavender]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: false,
    },
     {
      title: ' 2.28 | через маркет ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]06 10 2025 года в 14:29 вы выставили на маркетплейс Рюкзак ColorBlock за 1 980 000.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом рыночная стоимость данного предмета состовляет - 50 000.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, данный предмет был куплен всего через 11 минут после выставления.[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
      //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за покупку игровой валюты, через систему маркетплейса, что нарушает пункт правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 2.28.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28[/COLOR][COLOR=lavender]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [/COLOR][COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR].<br><br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – [COLOR=rgb(255, 0, 0)]наказуемо[/COLOR].<br>[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Пример[/COLOR][COLOR=lavender]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности [/COLOR][COLOR=rgb(255, 0, 0)]запрещено[/COLOR][COLOR=lavender].<br>[/COLOR][COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=lavender]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.<br>[/COLOR][COLOR=rgb(255, 0, 0)]Исключение[/COLOR][COLOR=lavender]: покупка игровой валюты или ценностей через официальный сайт разрешена.[/B][/FONT][/SPOILER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' Трансфер | Маркет ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]13 09 2025 года в 20:40 вы выставили на маркетпелйсе на продажу предмет Одежда Лера Кокетка за 11 500 000.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]По моим данным рыночная цена данного предмета состовляет 40 000.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, данный предмет был куплен игроком Vladimir_Bigkorol.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, покупка и продажа данного предмена производилась с одинакого IP адреса.[/COLOR][/CENTER][/B]<br>`+
    //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за трансфер игровой валюты через систему маркетплейса, что нарушает пункт правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        '[CENTER][COLOR=rgb(255, 0, 0)]4.05[/COLOR][COLOR=lavender]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>[COLOR=lavender]Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/CENTER][/COLOR]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' Трансфер | Обмен имущ ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]10 октября 2025 года в 22:03 вы обменялись машинами с игроком Tevis_Grade.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, вы обменялись ZAZ 968 на ZAZ 968 с доплатой Tevis_Grade 35 000 123.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было даказано, что на оба аккаунты били подключения с одного устройства.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, IP адреса на обоих аккаунтах в момент сделки были схожи и находились в одном городе.[/COLOR][/CENTER][/B]<br>`+
    //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за трансфер игровой валюты через систему обмена имуществом, что нарушает пункт правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        '[CENTER][COLOR=rgb(255, 0, 0)]4.05[/COLOR][COLOR=lavender]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>[COLOR=lavender]Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/CENTER][/COLOR]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
     {
      title: ' Трансфер | Банк ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]06 11/ 025 года в 22:07 вы перевели со своего банковского счета №482238 сумму - 1 600 000 ИВ.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, вы переводили на аккаунт Emek_Onely.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было даказано, что на оба аккаунты были подключения с одного устройства.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, IP адреса на обоих аккаунтах в момент сделки были схожи и находились в одном городе.[/COLOR][/CENTER][/B]<br>`+
    //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за трансфер игровой валюты через банковскую систему, что нарушает пункт правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        '[CENTER][COLOR=rgb(255, 0, 0)]4.05[/COLOR][COLOR=lavender]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>[COLOR=lavender]Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/CENTER][/COLOR]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
     {
      title: ' Трансфер | Трейд ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]05 06 2025 года в 21:57 вы обменялись с игроком Artem_Zavalenkov.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, вы обменялись с вашей доплатой 9 882 151, при этом [/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, было даказано, что на оба аккаунты были подключения с одного устройства.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, IP адреса на обоих аккаунтах в момент сделки были схожи и находились в одном городе.[/COLOR][/CENTER][/B]<br>`+
    //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за трансфер игровой валюты через систему трейда, что нарушает пункт правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с пунктом правил 4.05.[/COLOR][/CENTER][/B]<br><br>`+
        '[CENTER][COLOR=rgb(255, 0, 0)]4.05[/COLOR][COLOR=lavender]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR]<br><br>[COLOR=lavender]Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/CENTER][/COLOR]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
     {
      title: ' Махинации со взломом ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]05 11 2025 года в 19:48 вы получили от аккаунта Kisliy_Unisexxx 7 405 003 ИВ через + аксесуары трейд.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]При этом, в данный момент аккаунт Kisliy_Unisexxx был взломан.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Владелец аккаунта сам заявил о взломе.[/COLOR][/CENTER][/B]<br>`+
    //    `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Также, покупка и продажа данного предмена производилась с одинакого IP адреса.[/COLOR][/CENTER][/B]<br>`+
    //  `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
  //    `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если у вас есть обоснование для данной ситуации, то напишите в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данные действия были приняты за помощь злоумышленнику сохранить, перебросить игровую валюту со взломанного аккаунта.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Если вы не согласны с наказанием, то напишите обоснование действий, о которых сказано выше, в сообщении ниже.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Жалоба передана руководству для окончательного вердикта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->---> Для тех.раздела <---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      dpstyle: 'oswald: 3px;     color: #5555ff; background: #FFA500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFA500',
    },
    {
      title: ' Индивидуально ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url]<br>[/CENTER]' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваш пин-код от данного банковского счета - 4499.[/COLOR][/CENTER][/B]<br><br>`+
    //    `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваш дом (7527) слетел 11 10 2025 года в 00:00[/COLOR][/CENTER][/B]<br><br>`+
     //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]У вас была возможность заплатить за аренду дома.[/COLOR][/CENTER][/B]<br><br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender].[/COLOR][/CENTER][/B]<br><br>`+
       // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FFCC00]На рассмотрении[/COLOR].[/CENTER][/B]`+
      `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#66FF66]Рассмотрено[/COLOR][COLOR=lavender], закрыто.[/COLOR][/CENTER][/B]<br>`+
     //   `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
    },
    {
      title: ' Переношу тему ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение не относится к данному разделу.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Переношу тему в нужный раздел.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PREFIKS,
      status: false,
    },
    {
      title: 'Логисту',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша тема закреплена и передана техническому специалисту по логированию.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, ожидайте ответ в данной теме.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Создавать новые темы с данной проблемой не нужно.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]На рассмотрении.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: TEX_PREFIX,
      status: false,
    },
    {
      title: ' На рассмотрение ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 217, 10); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваша тема закреплена и находится на рассмотрении.[/COLOR][/CENTER][/B]<br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ожидайте ответа. Создавать дубликаты данной темы не нужно.[/COLOR][/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: ' Не по форме ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение составлено не по форме.[/COLOR][/CENTER][/B]<br><br>`+
        '[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Пожалуйста, заполните форму, создав новую тему: <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/COLOR][/CENTER][/B]<br><br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: 'Ошибки системы нет',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Чтобы положить оружие на семейный склад необходимо взять его в руки.[/COLOR][/CENTER][/B]<br><br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
        // `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender] [/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ошибки системы нет.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: 'Известно',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Команде проекта уже известно о данной проблеме.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Создавать новые темы с данной проблемой не нужно.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: 'Не относится к разделу',      // Забыл пинкот от счета
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',  // Забыл пинкот от счета
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ваше обращение не относится к данному разделу.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF0000]Закрыто[/COLOR].[/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: ZAKRUTO_PREFIX,
      status: false,
    },
    {
      title: ' Данное имущ не востанавливаем ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Данное имущество не подлежит восстановлению.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: ' не востанавливаем ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Имущество не подлежит восстановлению.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/B]<br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: ' Будет восстановление ',
      dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(36, 72, 224); font-family: UtromPressKachat',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]<br>' +
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=#FF4500]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Вам будет восстановлена общая стоимость компанентов - 46 930 000.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Убедительная просьба, не менять никнейм до момента восстановления.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Для активации восстановления используйте команды: /roulette, /recovery.[/COLOR][/CENTER][/B]<br><br>`+
        `[FONT=georgia][SIZE=5][B][CENTER][COLOR=lavender]Ожидайте вердикта от команды проекта.[/COLOR][/CENTER][/B]`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J0kFRJ26/IMG-6163.png[/img][/url][/CENTER]',
      prefix: COMMAND_PREFIX,
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
    mention: `[USER=${authorID}]${authorName}[/USER]`,
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
            `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,           // !
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
              mention: `[USER=${authorID}]${authorName}[/USER]`,
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

// Кнопки перехода

const bgButtons = document.querySelector(".pageContent");
  const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.style = "color: #E6E6FA; background-color: #000000; border-color: #E6E6FA; border-radius: 13px";
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
  window.location.href = href;
  });
  return button;
  };

  const Button50 = buttonConfig("жб 07", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.352/');
  const Button51 = buttonConfig("Тех. раздел 07", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-lime.365/');
  const Button52 = buttonConfig("Жб на техов 07", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%967-lime.1188/');
  const Button53 = buttonConfig("Тех. раздел 63", 'https://forum.blackrussia.online/forums/Технический-раздел-stavropol.2747/');
  const Button54 = buttonConfig("Правила проекта", 'https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/');
  const Button55 = buttonConfig("Правила Тех раздел", 'https://forum.blackrussia.online/forums/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.231/');
  const Button56 = buttonConfig("Курилка", 'https://forum.blackrussia.online/forums/Курилка.15/');

  bgButtons.append(Button50);
  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button55);
  bgButtons.append(Button56);
  bgButtons.append(Button57);