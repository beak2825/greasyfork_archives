// ==UserScript==
// @name         Для ГС/ЗГС ГОСС | Diniel_Shevchenko
// @namespace    https://forum.blackrussia.online/
// @version      1.4
// @description  Создано для Заместителя главного следящего и главного следящего за ГОСС
// @author       Diniel_Shevchenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://gas-kvas.com/grafic/uploads/posts/2024-01/gas-kvas-com-p-kontur-brillianta-na-prozrachnom-fone-26.png
// @downloadURL https://update.greasyfork.org/scripts/551400/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%7C%20Diniel_Shevchenko.user.js
// @updateURL https://update.greasyfork.org/scripts/551400/%D0%94%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1%20%7C%20Diniel_Shevchenko.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
    const NARASMOTRENII_PREFIX = 2; // Жалоба на рассмотрении
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const WATCHED_PREFIX = 9; // рассмотрено
	const TEX_PREFIX = 13; // техническому специалисту
    const GA_PREFIX = 12; // Главному администратору
	const NO_PREFIX = 0;
	const buttons = [
         {
      title: 'Отказ с указанием причины вручную',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
             '[CENTER][FONT=georgia][I]Текст[/I][/FONT][/CENTER]'+
             '[Color=Flame][CENTER]Отказано. Закрыто[/I][/CENTER][/color][/FONT]',
    },
      {
      title: 'Создано: BY Diniel_Shevchenko',
dpstyle: 'oswald: 3px;     color: #fff; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
    },
    {
      title: 'Жалоба на рассмотрении',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +

        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',

      prefix: NARASMOTRENII_PREFIX,
      status: true,
    },
          {
     title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОдобрение жалобыㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
     dpstyle: 'oswald: 3px;     color: #fff; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
    },
          {
         title: 'Уже наказан',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
           "[CENTER][I][SIZE=5][FONT=courier new] [/FONT][/SIZE][SIZE=4][FONT=courier new]Данный Лидер уже был наказан.[/FONT][/SIZE][/I][/CENTER]<br>" +
         '[Color=Red][CENTER] Решено [/I][/CENTER][/color][/FONT]',
          prefix: DECIDED_PREFIX,
            status: false,
     },
          {
         title: 'Уже проведена беседа',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
           "[CENTER][I][SIZE=5][FONT=courier new] [/FONT][/SIZE][SIZE=4][FONT=courier new]С данным Лидером уже была проведена беседа по поводу нарушения указанного вами в жалобе.[/FONT][/SIZE][/I][/CENTER]<br>" +
         '[Color=Red][CENTER] Решено [/I][/CENTER][/color][/FONT]',
          prefix: DECIDED_PREFIX,
            status: false,
     },
    {
      title: 'Беседа с лд',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Благодарю за вашу жалобу, с Лидером будет проведена беседа. [/FONT][/I][/B][/CENTER] "+
        'ㅤ' +
        '[Color=Lime][CENTER]Рассмотренно, закрыто.[/CENTER][/color]<br> ' +
        'ㅤ'+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
         {
      title: 'Беседа с лд снято наказание',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Благодарю за вашу жалобу, с Лидером будет проведена беседа. Ваше наказание будет снято. [/FONT][/I][/B][/CENTER] "+
        'ㅤ'+
        '[Color=Lime][CENTER]Рассмотренно, закрыто.[/CENTER][/color]<br> ' +
        'ㅤ'+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
         {
      title: 'Беседа с лд наказан зам',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Благодарю за вашу жалобу, с Лидером будет проведена беседа. Заместитель будет наказан [/FONT][/I][/B][/CENTER] "+
        'ㅤ'+
        '[Color=Lime][CENTER]Рассмотренно, закрыто.[/CENTER][/color]<br> ' +
        'ㅤ'+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: WATCHED_PREFIX,
      status: false,
    },
          {
      title: 'Проведена работа',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Благодарю за вашу жалобу, с Лидером будет проведена работа.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        'ㅤ'+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
          {
      title: 'Проведена работа снято наказание',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Благодарю за вашу жалобу, с Лидером будет проведена работа. Ваше наказание будет снято.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        'ㅤ'+
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
         {
      title: 'Будет Наказан',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Благодарю за вашу жалобу, Лидер будет наказан.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
         {
      title: 'Будет Наказан снято наказание',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Благодарю за вашу жалобу, Лидер будет наказан. Ваше наказание будет снято.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia [/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
      status: false,
    },
         {
     title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОтказ жалобыㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
     dpstyle: 'oswald: 3px;     color: #fff; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
    },
          {
      title: 'Нарушений не найдено',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны данного Лидера не было найдено.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
          {
      title: 'Больше не ЛД',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Данный игрок более не является лидером.[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
        },
         {
      title: 'Не работают доква',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают доказательства[/CENTER]<br>" +
        '[Color=Flame][CENTER]Закрыто[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нету /time',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: 'Ошиблись сервером',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись сервером, переподайте жалобу в нужный раздел вашего сервера.[/CENTER]<br>"+
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
         {
      title: 'Обратитесь в жб на сс.',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом, переподайте жалобу в раздел жалоб на старший состав фаркции[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Более 72 часов',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента получения наказания прошло более 72 часов[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
        title: 'Нет Опры',
        content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
         '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER]В вашей жалобе отсутствуют какие-либо доказательства.[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
         {
      title: 'Требуются TimeCode',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/CENTER]<br>" +
        '[CENTER][SPOILER="Пример"]<br>' +
        "1:56 - Лидер совершил ДМ<br>" +
        '2:34 - Лидер оскорбил игрока<br>' +
        "3:50 - Лидер уволил меня из организации[/SPOILER][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
         {
      title: 'Неполный фрапс',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загруженные доказательства должны быть с полной фиксацией процесса нарушения[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нужен фрапс',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Дублирование темы',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Дублирование темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: 'Фотохостинги',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx - Imgur - YouTube и прочие фото-видео хостинги. Доказательства из ВК/Instagram, прочее не принимаются.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
             {
     title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤПеренос жалобыㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
     dpstyle: 'oswald: 3px;     color: #fff; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
    },
         {
      title: 'Переношу в жалобы на адм',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +

        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Переношу вас в раздел жалоб на администрацию, не создавайте дубликатов тем и ожидайте ответ в этой теме[/CENTER]<br>" +
        '[Color=Flame][CENTER][I][FONT=georgia]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',

      prefix: NARASMOTRENII_PREFIX,
      status: true,
    },
         {
      title: 'Переношу в жалобы на игроков',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +

        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Переношу вас в раздел жалоб на игроков, не создавайте дубликатов тем и ожидайте ответ в этой теме[/CENTER]<br>" +
        '[Color=Flame][CENTER][I][FONT=georgia]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',

      prefix: NARASMOTRENII_PREFIX,
      status: true,
    },

         {
      title: 'ЛД ЗАЯВКИ/Еженедельник',
dpstyle: 'oswald: 3px;     color: #fff; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF4500',
    },
         {
      title: 'Заявки ЛД на рассмотрении',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/YqxGNLsc/S2qGP.png[/img][/url][/CENTER]<br>' +

        "[CENTER]Данная тема закрыта на рассмотрение[/CENTER]<br>" +
        '[Color=Flame][CENTER][I][FONT=georgia]Результаты будут обьявлены в этой теме[/I][/CENTER][/color][/FONT]',

      prefix: NARASMOTRENII_PREFIX,
      status: true,
    },
     {
      title: 'Еженедельник одобрен',
      content:
        '[Color=Lime][CENTER][I][FONT=georgia]Рассмотренно.[/CENTER][/color][/font][/I]<br> ',
      prefix: WATCHED_PREFIX,
      status: false,
    },
        ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Дать отпор', 'selectAnswer', 'border-radius: 11px; margin-right: 8px; border: 3px solid; border-color: rgb(203, 40, 33, 0.5);');
//	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
//  addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
//  addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
//	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
//	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
    $('button#GA').click(() => editThreadData(GA_PREFIX, true));
    $('button#zakrepleno').click(() => editThreadData(NARASMOTRENII_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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