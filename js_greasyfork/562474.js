// ==UserScript==
// @name   KF_script_by_Gallows
// @name:ru  Кураторы форума by D. Gallows
// @description  Suggestions for improving the script write here ---> https://docs.google.com/forms/d/e/1FAIpQLSco6CMyoQ6Hz2o6SZK_fy9oSmJhCjFNBEtUgxmUn9O2MXL1FA/viewform?usp=header
// @description:ru Предложения по улучшению скрипта и информацию о багах писать сюда ---> https://docs.google.com/forms/d/e/1FAIpQLSco6CMyoQ6Hz2o6SZK_fy9oSmJhCjFNBEtUgxmUn9O2MXL1FA/viewform?usp=header
// @autor Dmitriy_Gallows
// @version 1.05.20
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license   MIT
// @supportURL https://vk.com/id520020196 | Dmitriy_Gallows CHEREPOVETS
// @icon https://i.postimg.cc/ZKwZvbfd/Developer.png
// @downloadURL https://update.greasyfork.org/scripts/562474/KF_script_by_Gallows.user.js
// @updateURL https://update.greasyfork.org/scripts/562474/KF_script_by_Gallows.meta.js
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
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ Отказанные жалобы на игроков     ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF0000;  width: 96%; border-radius: 20px;',

},

  {
  title: 'Взято на рассмотрение',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(255, 255, 255)][FONT=times new roman][SIZE=4]Ваша жалоба успешно принята к рассмотрению. Просим вас воздержаться от подачи дублирующих заявок и дождаться решения по текущему запросу в рамках этой темы.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
    "[CENTER][COLOR=yellow][ICODE] На рассмотрении [/ICODE][/color][/CENTER]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
  prefix: PINN_PREFIX,
  status: true,
  dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
{
  title: 'Спец. администратору',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=red][ICODE] Специальному администратору. [/ICODE][/color][/CENTER]<br>" +
    '[Color=yellow][CENTER]Ожидайте ответа[/I][/CENTER][/color][/FONT]' +
   '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
  prefix: SPECY_PREFIX,
  status: true,
dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
  title: 'Передано ГА',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=red][ICODE] Главному администратору. [/ICODE][/color][/CENTER]<br>" +
    "<br>[CENTER] [B][COLOR=yellow]Ожидайте ответа[/COLOR][/B] </CENTER><br><br>" +
   '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
  prefix: GA_PREFIX,
  status: true,
dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Передано теху',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Ваша жалоба была передана на рассмотрение [/ICODE][COLOR=orange][ICODE] Техническому специалисту. [/ICODE][/color][/CENTER]<br>" +
        '[Color=yellow][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]' +
    '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: TEXY_PREFIX,
      status: true,
    dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
 {
  title: 'Нарушение этических норм в жалобе',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER]Ваша жалоба содержит элементы неуважения к игроку, в связи с чем она не будет рассмотрена[/CENTER]<br><br>" +
   '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE] ✧✦ [/COLOR][/B][/CENTER]' +
   '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
  prefix: CLOSE_PREFIX,
  status: false,
 dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=red]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=gold]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=gold]2.[/color] Nick_Name игрока:[/CENTER]<br><br>" +
            "[CENTER][COLOR=gold]3.[/color] Суть жалобы:[/CENTER]<br><br>" +
            "[CENTER][COLOR=gold]4.[/color] Доказательство:[/SPOILER][/CENTER]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Прошло 3-е суток',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Жалоба не подлежит рассмотрению, если с момента возможного нарушения со стороны игрока прошло более [COLOR=red]72[/COLOR] часов[/CENTER]<br><br>" +
     '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE] [/COLOR][/B][/CENTER]' +
    '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Фотохостинги',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Для подтверждения ваших слов, все доказательства должны быть загружены на официальные платформы, такие как Yapx, Imgur или YouTube. Использование других источников может привести к недоразумениям или невозможности проверки предоставленных материалов.[/CENTER]<br><br>" +
         '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE] [/COLOR][/B][/CENTER]' +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Видео обрывается',
      content:
      "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваше [COLOR=gold]видеодоказательство[/COLOR] обрывается. Рекомендуем использовать видеохостинг [COLOR=red]YouTube[/COLOR], который загружает видео без ограничений по продолжительности. Это обеспечит стабильную доступность вашего доказательства и облегчит процесс [COLOR=gold]рассмотрения[/COLOR] вашей жалобы.[/CENTER]<br><br>" +
         '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
  '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Потребуеться фрапс',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Для применения наказания к игроку необходимо предоставить видеозапись данного инцидента.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
    '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
	  title: 'Дублирование темы',
	  content:
		"[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
		"[CENTER]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
	 '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  prefix: CLOSE_PREFIX,
      status: false,
      dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
	  title: 'Нет доказательств',
	  content:
		"[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
		"[CENTER]Без предоставления доказательств (включая скриншоты или видеоматериалы) решение проблемы невозможно. В случае, если у вас есть необходимые доказательства, пожалуйста, создайте новую тему, прикрепив файлы с фото-хостинга, таких как yapx.ru или imgur.com, и предоставьте их для дальнейшего рассмотрения.<br><br>" +
       '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
       '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
 prefix: CLOSE_PREFIX,
      status: false,
       dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
      {
      title: '24h',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, [COLOR=gold]прошло 24 часа[/COLOR] с момента получения вашей видеозаписи, но таймкоды нарушений так и не были [COLOR=gold]добавлены.[/COLOR] В связи с этим, жалоба [COLOR=red]закрыта.[/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
         '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
      dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Недостаточно доказательств',
      content:
      "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Предоставленные вами доказательства недостаточны для вынесения наказания данному игроку. Пожалуйста, предоставьте дополнительные материалы, которые могут подтвердить факт нарушения.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
      dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Не работают док-ва',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства, предоставленные вами, нерабочие. Пожалуйста, загрузите рабочие материалы или укажите корректные ссылки.[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
         '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
       {
      title: 'Плохое качество',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Качество предоставленных вами доказательств недостаточно для полноценного рассмотрения жалобы. В связи с этим, мы не можем принять их для дальнейшей обработки[/CENTER]<br><br>" +
       '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Нет /time',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На предоставленных вами доказательствах отсутствует необходимая метка времени [COLOR=gold](/time)[/COLOR],что делает их неполными и неподтвержденными для дальнейшего рассмотрения.[/CENTER]<br><br>" +
      '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'От 3-го лица',
      content:
     "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы, написанные от имени [COLOR=gold]третьих лиц[/COLOR], не подлежат рассмотрению. Пожалуйста, подайте жалобу от собственного имени.[/CENTER]<br><br>" +
      '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
      {
      title: 'Нету условий сделки',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В предоставленных доказательствах не указаны [COLOR=gold]условия сделки[/COLOR], что является обязательным.[/CENTER]<br><br>" +
     '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
      dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
      {
      title: 'Таймкоды',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Видеозапись слишком длинная [COLOR=gold](более 3 минут).[/COLOR] У вас есть [COLOR=gold]24 часа,[/COLOR] чтобы предоставить таймкоды нарушений. В противном случае жалоба будет [COLOR=red]закрыта.[/COLOR][/CENTER]<br><br>" +
     "[CENTER][B][COLOR=yellow][SIZE=5][FONT=times new roman] ✦✧ На рассмотрении ✧✦ [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: PINN_PREFIX,
      status: true,
            dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Нарушения отсутствуют',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На основании представленных доказательств [COLOR=gold]нарушений[/COLOR] со стороны игрока [COLOR=gold]не установлено.[/COLOR][/CENTER]<br><br>" +
         '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Жалобу на сотрудника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Обратитесь в раздел [COLOR=gold]жалоб[/COLOR] на сотрудников для дальнейшего [COLOR=gold]рассмотрения.[/COLOR][/CENTER]<br><br>" +
         '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Разделом ошиблись',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Извините, но вы ошиблись [COLOR=gold]разделом.[/COLOR] Этот раздел предназначен для подачи жалоб на [COLOR=gold]игроков.[/COLOR][/CENTER]<br><br>" +
       '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
  title: 'Ошиблись сервером',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER]К сожалению, ваша жалоба была подана не в тот [COLOR=gold]раздел.[/COLOR] Данный раздел принадлежит серверу [SIZE=4][COLOR=green][ICODE] MAGADAN. [/ICODE][/COLOR][/SIZE][/CENTER]<br><br>" +
    '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
  prefix: CLOSE_PREFIX,
  status: false,
 dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
      {
      title: 'Долг через трейд',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Займ может быть осуществлен исключительно через зачисление игровых ценностей на [COLOR=gold]банковский счет.[/COLOR] На предоставленных вами доказательствах займ был проведен через обмен с другим игроком, что является [COLOR=gold]нарушением правил.[/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
      {
      title: 'Доступ к складу 3 лицу',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы самостоятельно доверили и выдали [COLOR=gold]права игроку,[/COLOR] предоставив ему возможность получения [COLOR=gold]денежных средств[/COLOR] со склада.[/CENTER]<br><br>" +
         '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Слив фамы замом',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В настоящее время [COLOR=gold]не существует[/COLOR] ни одного правила, которое регулирует подобные ситуации. [COLOR=gold]Вы самостоятельно[/COLOR] назначили этого человека на должность заместителя. Рекомендуем более тщательно подходить к выбору кандидатов на эту [COLOR=gold]роль.[/COLOR] [/CENTER]<br><br>" +
       '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
      {
      title: 'Кража патронов с склада фамы',
      content:
      "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны игрока [COLOR=gold]не выявлено.[/COLOR] Игрок оплатил установленную сумму за разрешение на  [COLOR=gold]определенное количество[/COLOR] патронов, которое Вы ему выдали.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
     '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
      prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
	  title: 'Дубликат',
	  content:
	 "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
		"[CENTER]Ответ на данный вопрос уже был дан в аналогичной теме. Пожалуйста, воздержитесь от создания идентичных или схожих тем, так как это может привести к блокировке вашего аккаунта на форуме.<br><br>" +
		   '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	    prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
	  title: 'Доква отредактирована',
	  content:
	    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
		"[CENTER]Ваши доказательства признаны подделанными или отредактированными. На этом основании жалоба отклонена<br><br>" +
	 '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
        '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	    prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
	  title: 'Раннее был заблокирован',
	  content:
	 "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
		"[CENTER]Данный игрок ранее уже был заблокирован за нарушение правил проекта.<br><br>" +
		  '[CENTER][B][COLOR=green][SIZE=4][FONT=times new roman][COLOR=red]Отказано[/COLOR], [COLOR=white]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]' +
       '[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]' +
    "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	    prefix: CLOSE_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},

  {
  title: ' Правила поведения в рамках RolePlay ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #22FF22; width: 96%; border-radius: 15px;',
},
  {
  title: 'Nrp обман',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
    "[QUOTE][FONT=Georgia][I][CENTER][COLOR=gold] 2.05. [/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=Indigo] | PermBan [/COLOR]<br><br>" +
    "[COLOR=red] Примечание [/COLOR]: администрация сервера [U]не несет[/U] ответственность за аккаунты игроков, а также содержащиеся на них или утерянные материальные игровые ценности в случае взлома, обмана, невнимательности и так далее.[/QUOTE][/I][/FONT][/CENTER]" +
    "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
    "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
  prefix: RESHENO_PREFIX,
  status: false,
   dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
 {
  title: 'DM',
  content: "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
    "[CENTER][COLOR=gold][FONT=Georgia][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=red][FONT=Georgia][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=Orange][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
    "[LIST]<br>" +
    "[*][LEFT][CENTER][FONT=Georgia][COLOR=red][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
    "[*][LEFT][CENTER][COLOR=red][FONT=Georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Georgia][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
    "[/LIST]<br>" +
    "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
    "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
  prefix: RESHENO_PREFIX,
  status: false,
   dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
{
      title: 'DB',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=Indigo] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
       dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'TK',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.15.[/color] Запрещено TK (Team Kill) — убийство или нанесение урона члену своей или союзной фракции/организации без наличия веской и обоснованной IC (внутриигровой) причины.[COLOR=Indigo]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
       dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'SK',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.16.[/color] Запрещен SK [COLOR=gold](Spawn Kill)[/color] — убийство или нанесение урона на титульной территории любой фракции или организации, а также в зоне появления игрока, включая выход из закрытых интерьеров. Такое поведение нарушает честность игры, создавая несправедливые условия для игроков, которые не могут защититься сразу после респауна. [COLOR=Indigo] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/QUOTE][/CENTER]<br><br>" +
       "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      prefix: RESHENO_PREFIX,
      status: false,
       dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'MG',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.18.[/color] Запрещен MG [COLOR=gold](MetaGaming)[/color] — использование информации, полученной вне игры (ООС), для действий или решений внутри игрового процесса (IC), которую ваш персонаж не мог бы узнать в рамках своей роли или ситуации в игре. [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
       {
      title: 'Mass DM',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.20.[/color] Запрещен Mass DM [COLOR=gold](Mass DeathMatch)[/color] — убийство или нанесение урона трем и более игрокам без веской IC причины, при этом действия игрока должны иметь логическое объяснение в рамках сюжета и персонажа. [COLOR=Indigo] | Warn / Ban 3 - 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
          "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
  title: 'NRP поведение',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
    "[CENTER][QUOTE][COLOR=gold]2.01.[/color] Запрещено поведение, нарушающее нормы [COLOR=gold]Role Play[/color] процесса — любые действия, мешающие нормальному протеканию ролевого процесса, включая неадекватное поведение, отступление от ситуации или слишком грубое нарушение правил ролевого взаимодействия, что нарушает атмосферу игры и усложняет взаимодействие с другими игроками. [COLOR=Indigo] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
    "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
    "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
  prefix: RESHENO_PREFIX,
  status: false,
 dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Nrp Drive',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.03.[/color] Запрещен[COLOR=gold] NonRP Drive[/color] — вождение транспортного средства в условиях, которые невозможны для него, а также манера вождения, не соответствующая реалистичному поведению в игре. [COLOR=Indigo] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Помеха игр. процессу',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=Indigo] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Аморал. действия',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=Indigo] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
      "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Уход от RP',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.02.[/color] [COLOR=red]Запрещено[/color] целенаправленно уходить от[COLOR=gold] Role Play[/color] процесса различными способами — действия, которые мешают нормальному ролевому взаимодействию или препятствуют его продолжению. [COLOR=Indigo] | Jail 30 минут / Warn [/COLOR][/QUOTE][/CENTER]<br><br>" +
          "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=Book Antiqua]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
        prefix: RESHENO_PREFIX,
        status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Слив склада',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold] 2.09. [/color] [COLOR=red]Запрещено[/color] сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=Indigo]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Обман в /do',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.10.[/color] [COLOR=red]Запрещено[/color] в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=Indigo]| Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'ППИВ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.28.[/color] [COLOR=red]Запрещенo[/color] покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=Indigo] | PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Обход системы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.21.[/color] [COLOR=red]Запрещено[/color] пытаться обходить игровую систему или использовать любые баги сервера [COLOR=Indigo] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Стороннее ПО',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.22.[/color] [COLOR=red]Запрещено[/color] хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=Indigo] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Сокрытие багов',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.23.[/color] [COLOR=red]Запрещено[/color] скрывать от администрации баги системы, а также распространять их игрокам [COLOR=Indigo] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
            "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Уязвимость правил',
      content:
          "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.33.[/color]  [COLOR=red]Запрещено[/color] пользоваться уязвимостью правил [COLOR=Indigo] | Ban 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Вред ресурсам проекта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.26.[/color][COLOR=red]Запрещенo[/color] намеренно наносить вред ресурсам проекта [COLOR=gold](игровые серверы, форум, официальные Discord-серверы и так далее)[/color] [COLOR=Indigo] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},

    {
      title: 'Сокрытие нарушителей',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=Indigo] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Вред репутации проекта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
      "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=Indigo] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
      "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},

     {
      title: 'Слив адм. информ.',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.27.[/color] [COLOR=red]Запрещенo[/color] распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта [COLOR=Indigo] | PermBan + ЧС проекта[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Ущерб экономике',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.30.[/color] [COLOR=red]Запрещенo[/color] пытаться нанести ущерб экономике сервера [COLOR=Indigo] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Реклама',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.31.[/color] [COLOR=red]Запрещенo[/color] рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=Indigo] | Ban 7 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
 {
      title: 'Обман адм.',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.32.[/color] [COLOR=red]Запрещенo[/color] введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=Indigo] | Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Уязвимость правил',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.33.[/color] [COLOR=red]Запрещенo[/color] пользоваться уязвимостью правил [COLOR=Indigo] | Ban 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Уход от наказания',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.34.[/color] [COLOR=red]Запрещенo[/color] уход от наказания [COLOR=Indigo] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Продажа промо',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.43.[/color] [COLOR=red]Запрещена[/color] продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=Indigo] | Mute 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
          "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'ЕПП фура и инко',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.47.[/color] [COLOR=red]Запрещено[/color] ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=Indigo] | Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Продажа/покупка репутации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.48.[/color][COLOR=red]Запрещена[/color] продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [COLOR=Indigo] | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Многокр. покупка репутации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.49.[/color][COLOR=red]Запрещена[/color] многократная продажа или покупка репутации семьи любыми способами. [COLOR=Indigo] | Ban 15 - 30 дней / PermBan + удаление семьи[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Арест на аукционе',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.50.[/color] [COLOR=red]Запрещены[/color]  задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=Indigo] | Ban 7 - 15 дней + увольнение из организации[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'NRP аксессуар',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.52.[/color] [COLOR=red]Запрещено[/color] располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=Indigo] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
            "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Оск. названия ценностей',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.53.[/color] [COLOR=red]Запрещено[/color] устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [COLOR=Indigo] | Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]  [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
        "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
      dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
   class: 'kf-btn',
},
    {
      title: 'Багоюз анимации',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.55.[/color] [COLOR=red]Запрещается[/color] багоюз связанный с анимацией в любых проявлениях. [COLOR=Indigo] | Jail 60 / 120 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Невозврат долга',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.57.[/color] [COLOR=red]Запрещается[/color] брать в долг игровые ценности и не возвращать их. [COLOR=Indigo] | Ban 30 дней / Permban=[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
        dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},

    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ Этика общения в игровом чате ᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #00FFFF; width: 96%; border-radius: 15px;',
	},
 {
  title: 'Упом/Оск родных',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=skyblue][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
   "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
    "[CENTER][QUOTE][COLOR=gold]3.04.[/color] [COLOR=red]Запрещено[/color] оскорблять и упоминать родных, независимо от чата  (IC или OOC)[COLOR=Indigo] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
    "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman] Одобрено, [COLOR=#FF0000]Закрыто[/COLOR] [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
    "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]", // Убедитесь, что строка добавляется как часть content
  prefix: RESHENO_PREFIX,
  status: false,
 dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
  {
      title: 'Политика/провокация',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.18.[/color] [COLOR=red]Запрещены[/color] любые формы политического и религиозного пропагандирования, а также провокационные действия, направленные на создание конфликтов между игроками, коллективный флуд или нарушение порядка в любых чатах. [COLOR=Indigo] | Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
       {
      title: 'CapsLock',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.02.[/color][COLOR=red] Запрещено[/color] использование верхнего регистра [COLOR=gold](CapsLock)[/color] при написании любого текста в любом чате [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
         "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Межнац. и религ. конфликт',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=Indigo] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Перенос конфликта',
      content:
       "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.36.[/color][COLOR=red]Запрещено[/color] переносить конфликты из IC в OOC и наоборот [COLOR=Indigo] | Warn[/COLOR][/QUOTE][/CENTER]<br><br>" +
          "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'OOC угрозы',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.37.[/color] [COLOR=red]Запрещено[/color] OOC угрозы, в том числе и завуалированные [COLOR=Indigo] | Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Оск. администрации',
      content:
         "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
    '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
    "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.54.[/color][COLOR=red]Запрещено[/color] неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=Indigo] | Mute 180 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
   {
      title: 'Оскорбление в OOC',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.03.[/color][COLOR=red]Запрещены[/color]  Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Flood',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.05.[/color][COLOR=red]Запрещен[/color] флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Злоуп. символами',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.06.[/color][COLOR=red]Запрещено[/color] злоупотребление знаков препинания и прочих символов [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Слив глобал. чата',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.08.[/color][COLOR=red]Запрещены[/color] любые формы «слива» посредством использования глобальных чатов [COLOR=Indigo] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Выдача себя за администратора.',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.10.[/color][COLOR=red]Запрещена[/color] выдача себя за администратора, если таковым не являетесь [COLOR=Indigo] |  Ban 7 - 15 дней.[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Ввод в забл',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.11.[/color][COLOR=red]Запрещено[/color] введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=Indigo] |  Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Транслит и оффтоп в репорт',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.12.[/color][COLOR=red]Запрещено[/color] подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [COLOR=Indigo] |  Report Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Музыка в Voice',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.14.[/color][COLOR=red]Запрещено[/color] включать музыку в Voice Chat [COLOR=Indigo] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Шумы в voice',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.16.[/color][COLOR=red]Запрещено[/color] создавать посторонние шумы или звуки [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Смена голоса в voice',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.19.[/color][COLOR=red]Запрещено[/color] использование любого софта для изменения голоса [COLOR=Indigo] | Mute 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Транслит',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.20..[/color][COLOR=red]Запрещено[/color] использование транслита в любом из чатов  [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Реклама промо',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.21.[/color][COLOR=red]Запрещается[/color] реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=Indigo] | Ban 30 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Объявления в ГОСС',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.22.[/color][COLOR=red]Запрещено[/color] публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Мат в VIP чат',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]3.23.[/color][COLOR=red]Запрещено[/color] использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=Indigo] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ Положение об игровых аккаунтах     ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #b1c1c7;  width: 96%; border-radius: 15px;',
},
    {
      title: 'ППВ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.03.[/color][COLOR=red]Запрещена[/color]  совершенно любая передача игровых аккаунтов третьим лицам [COLOR=Indigo] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Мультиаккаунт',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.04.[/color][COLOR=red]Разрешается[/color] зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=Indigo] | PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Трансфер между твинками',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.05.[/color][COLOR=red]Запрещено[/color] передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества [COLOR=Indigo] |  Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Формат ника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.06.[/color][COLOR=red]Никнейм[/color]  игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [COLOR=Indigo] |  Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Формат ника',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.07.[/color] В игровом никнейме запрещено использовать более двух заглавных букв[COLOR=Indigo] |  Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Бессмысленный ник',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.08.[/color][COLOR=red]Запрещено[/color] использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки[COLOR=Indigo] |  Устное замечание + смена игрового никнейма[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Оскорбительный ник',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.09.[/color][COLOR=red]Запрещено[/color] использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[COLOR=Indigo] |  Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'Фейк ник',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.10.[/color][COLOR=red]Запрещено[/color] создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=Indigo] |  Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ Жалобы на ГОСС     ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #4169e2;  width: 96%; border-radius: 15px;',
},
     {
      title: 'Работа в форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]1.07.[/color][COLOR=red]Запрещено[/color] всем сотрудникам государственных организаций  выполнять работы где-либо в форме, принадлежащей своей фракции[COLOR=Indigo] |  Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Т/С в лич. целях',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]1.08.[/color][COLOR=red]Запрещено[/color] использование фракционного транспорта в личных целях[COLOR=Indigo] |  Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'НППЭ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.02.[/color][COLOR=red]Запрещено[/color] проведение эфиров, не соответствующих Role Play правилам и логике[COLOR=Indigo] |  mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Казик/Бу/Конты',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]1.13.[/color][COLOR=red]Запрещено[/color] находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции[COLOR=Indigo] |  Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]  Одобрено, [COLOR=#FF0000]Закрыто[/COLOR]   [/FONT][/SIZE][/COLOR][/B][/CENTER]" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Арест бизва',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]1.14.[/color][COLOR=red]Запрещено[/color] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара[COLOR=Indigo] |  Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'НПРО',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.01.[/color][COLOR=red]Запрещено[/color] редактирование объявлений, не соответствующих ПРО[COLOR=Indigo] |  mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Замена объявлений',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.04.[/color][COLOR=red]Запрещено[/color] редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=Indigo] |  Ban 7 дней + ЧС организации[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},


    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠ  Жалобы на ОПГ      ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF4500;  width: 96%; border-radius: 15px;',
},
     {
      title: 'Провокация ГОСС',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]2.[/color][COLOR=red]Запрещено[/color] провоцировать сотрудников государственных организаций [COLOR=Indigo] |  Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
     {
      title: 'ДМ на территории ОПГ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]4.[/color][COLOR=red]Запрещено[/color] без причины наносить урон игрокам на территории ОПГ [COLOR=Indigo] |  Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Дуэли',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]5.[/color][COLOR=red]Запрещено[/color] устраивать дуэли где-либо, а также на территории ОПГ [COLOR=Indigo] |  Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'NRP в/ч',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[COLOR=Indigo] |  Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Перестрелка в люд. места',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]6.[/color][COLOR=red]Запрещено[/color] устраивать перестрелки с другими ОПГ в людных местах [COLOR=Indigo] |  Jail 60 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Реклама в чате ОПГ',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]7.[/color][COLOR=red]Запрещена[/color] любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации[COLOR=Indigo] |   Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},
    {
      title: 'Уход от погони на респу',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]<br>" +
        '[Color=turquoise][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][ICODE] Игрок будет наказан по пункту правил [/ICODE][/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=gold]8.[/color][COLOR=red]Запрещено[/color] уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество[COLOR=Indigo] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
       "<br>[CENTER][url=https://postimages.org/][img]https://i.ibb.co/4FnVsC8/image.png[/img][/url][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
     dpstyle: "background: #262629; color: #fff; border: 1px solid #3A3A3D; padding: 6px 12px; border-radius: 8px; margin: 4px; font-size: 13px; display: inline-block; cursor: pointer; transition: 0.15s ease;",
  class: 'kf-btn',
},







  ];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

 // Добавление кнопок при загрузке страницы
    addButton('❄️ by. Gallows ❄️', 'selectAnswer');

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
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #007777;">${name}</button>`,
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