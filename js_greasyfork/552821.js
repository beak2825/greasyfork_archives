// ==UserScript==
// @name         Кураторы форума / Crimson
// @namespace    http://tampermonkey.net/
// @version      18
// @description  https://vk.com/id516435748 по всем вопросам и улучшению скрипта сюда
// @author       James_Adamson
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://forum.blackrussia.online/data/avatars/o/173/173347.jpg?1753743513
// @downloadURL https://update.greasyfork.org/scripts/552821/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%20Crimson.user.js
// @updateURL https://update.greasyfork.org/scripts/552821/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%20Crimson.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
        '[CENTER][I][SIZE=4][FONT=georgia][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] . [/COLOR][/FONT][/CENTER]',
   },
   {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении(жб)',
      content:
      '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }}[/COLOR][/FONT][/SIZE][/I] <br><br>' +
      '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваша жалоба взята на рассмотрение <br>Не нужно создавать копии, ожидайте ответа в данной теме [/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
   },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для зга',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваша жалоба была передана на рассмотрение [Color=#FF0000]Заместителю Главного Администратора [/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ожидайте его ответа [/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваша жалоба была передана на рассмотрение [Color=#9370DB]техническому специалисту [/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ожидайте его ответа [/COLOR][/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп поведение',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ffd700]| Jail 30 минут[/color]. <br> [Color=#ffd700][SPOILER=Примечание]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от рп',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ffd700]| Jail 30 минут / Warn[/color]. <br> [Color=#ffd700][SPOILER=Примечание]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп драйв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>2.03 Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ffd700]| Jail 30 минут[/color]. <br> [Color=#ffd700][SPOILER=Примечание]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха работягам',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> [Color=#ffd700] 2.04[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [Color=#ffd700]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color] <br> [Color=#ffd700][SPOILER=Пример]таран дальнобойщиков, инкассаторов под разными предлогами [/SPOILER][/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп развод',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.05[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ffd700]| PermBan[/color] <br> [Color=#ffd700][SPOILER=Примечание]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации [/SPOILER][/color] <br> [Color=#ffd700] [Color=#ffd700][SPOILER=Примечание] Администрация не возвращает игровое имущество в случаи обмана, вы можете договориться с игроком на возврат имущества и разблокировку аккаунта [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны) [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморал действия',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.08[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ffd700]| Jail 30 минут / Warn[/color] <br> [Color=#ffd700][SPOILER=Исключение]обоюдное согласие обеих сторон [/SPOILER][/color] [/COLOR][/FONT][/CENTER] " +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.09[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.13[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ffd700] | Jail 60 минут[/color] <br> [Color=#ffd700][SPOILER=Исключение]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]  Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.15[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ffd700] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.16[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ffd700] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'МГ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.18[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]использование смайлов в виде символов «))», «=D» запрещено в IC чате [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]телефонное общение также является IC чатом.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.19[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ffd700] | Jail 60 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'масс ДМ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.20[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ffd700] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'багоюз',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.21[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ffd700] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#ffd700][SPOILER=Примечание]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; <br> Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; <br> Банк и личные счета предназначены для передачи денежных средств между игроками; <br> Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
    {
      title: 'сторонее по',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.22[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#ffd700][SPOILER=Примечание]запрещено внесение любых изменений в оригинальные файлы игры [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]разрешено изменение шрифта, его размера и длины чата (кол-во строк) [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]блокировка за включенный счетчик FPS не выдается [/SPOILER][/color]  [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.39[/color] Злоупотребление нарушениями правил сервера [Color=#ffd700] | Ban 7 - 30 дней [/color] [Color=#ffd700][SPOILER=Примечание]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней [/SPOILER][/color] [Color=#ffd700][SPOILER=Примечание]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.47[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ffd700] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп аксесуар',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.52[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ffd700] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное [/SPOILER][/color]  [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не возврат долга',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.57[/color] Запрещается брать в долг игровые ценности и не возвращать их.  [Color=#ffd700] | Ban 30 дней / permban [/color] <br> [Color=#ffd700]  [SPOILER=Примечание] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется. [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда. [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами [/color][/SPOILER][/color][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'баг с аним',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.55[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ffd700] | Jail 120 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе [/color][/SPOILER][/color][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴казик/ночной клуб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'принятие за деньги',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.01[/color] Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника или крупье [Color=#ffd700] | Ban 3 - 5 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'капс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.02[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.03[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.04[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ffd700] | Mute 120 минут / Ban 7 - 15 дней [/color] <br> [Color=#ffd700][SPOILER=Примечание]термины (MQ), (rnq) расценивается, как упоминание родных.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.05[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.06[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив глобал чата',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.08[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ffd700] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'реклама',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.31[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#ffd700] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }}[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.37[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ffd700] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'оск адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.54[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ffd700] | Mute 180 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#FF8C00] | Mute 180 минут [/color][/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.10[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ffd700] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'продажа промо',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.43[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ffd700] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.11[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ffd700] | Ban 15 - 30 дней / PermBan[/color] <br> [Color=#FF8C00][SPOILER=Примечание]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оффтоп в реп',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.12[/color] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=#ffd700] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка войс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.14[/color] Запрещено включать музыку в Voice Chat [Color=#ffd700] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в воис',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.16[/color] Запрещено создавать посторонние шумы или звуки [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>3.18 Запрещено политическое и религиозное пропагандирование [Color=#ffd700] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.19[/color] Запрещено использование любого софта для изменения голоса [Color=#ffd700] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'оск проекта',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.40[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ffd700] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]«Privet», «Kak dela», «Narmalna».[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.21[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ffd700] | Ban 30 дней [/color] <br> [Color=#ffd700][SPOILER=Примечание]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьява в гос орг',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.22[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево»[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мат в vip',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.23[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп ник',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.06[/color]  Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ffd700] | Устное замечание + смена игрового никнейма [/color] <br> [Color=#ffd700][SPOILER=Пример]John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]_scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск ник',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.09[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ffd700] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фейк',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.10[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ffd700] | Устное замечание + смена игрового никнейма / PermBan [/color] <br> [Color=#ffd700][SPOILER=Пример]подменять букву i на L и так далее, по аналогии [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }}[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.07[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в личн целях',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.08[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'арест в инте',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.50[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#ffd700] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'казино/бу в форме госс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.13[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нарущение ПРО (СМИ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.01[/color] Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ППЭ (СМИ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.02[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.04[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ffd700] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без рп причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#ffd700] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ/ГИБДД)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 7.02[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ffd700] | Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP коп',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#ffd700] |  Warn [/color] [Color=#ffd700][SPOILER=Примечание]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]- открытие огня по игрокам без причины <br> - расстрел машин без причины <br> - нарушение ПДД без причины <br> - сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 7.05[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ffd700] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация гос',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 2. Запрещено провоцировать сотрудников государственных организаций [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'провокация опг на их тере',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон без причины на тере',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 4. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#ffd700] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дуэли',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 5. Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'перестрелки в людных местах',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 6. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#ffd700] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в /f',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#ffd700] |  Mute 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'cкрыться от копа на базе',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп вч',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#ffd700] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'находится на тере бв лишний',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.06[/color] На территории проведения бизвара может находиться только сторона атаки и сторона защиты [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(джаил)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(варн)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(бан)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Одобрено, [COLOR=#FF8C00] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴перенаправление ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на игроков',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на игрока - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-игроков.640/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на администратора - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.638/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на лидера - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо оформить повторную в обжалование - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, обратитесь в технический отдел - [URL=https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на технического специалиста - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, оформите повторное обращение в разделе *Жалобы на сотрудников* нужной организации [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на ап',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на Агента Поддержки - [URL=https://forum.blackrussia.online/index.php?forums/Раздел-для-хелперов-сервера.623/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Нарушений со стороны данного игрока не было найдено [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мало докв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Недостаточно доказательств на нарушение от данного игрока [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'дубликат',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваша жалоба составлена не по форме <br>Убедительная просьба ознакомиться [URL= https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]с правилами подачи жалоб на игроков[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] На ваших доказательствах отсутствует /time, не подлежит оценки ситуации и выдачи наказания [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'укажите таймкоды',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов <br>В противном случае жалоба будет отказана <br> [COLOR=#FFFF00][SPOILER=Тайм-коды это]Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты <br> Пример: <br> 0:37 - Условия сделки <br> 0:50 - Процесс обмена <br> 1:50 - Исход события <br>2:03 - Нарушение договорных условий <br>2:06 - /time [/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'более 72 часов',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения, более - не подлежит рассмотрению [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Загрузка доказательств в соц. сети (ВКонтакте, instagram, Telegram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur) [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Для более детального рассмотрения ситуации необходима видеофиксация (фрапс), желательно на 40+ секунд до совершенного  нарушения [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваш фрапс обрывается, загрузите полное доказательство на ютуб [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Доказательства, прикрепленные к жалобе не работают по какой-либо причине. Повторите загрузку на ютуб для дальнейшего ознакомления [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] В вашей жалобе отсутствуют доказательства [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'плохое качество докв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваши доказательства в плохом качестве, рассмотрение жалобы не возможно [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
   {
      title: 'доква отредактированы',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваши доказательства отредактированы [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации) [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись сервером, подайте повторное обращение на необходимый [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не подтвердил условия сделки',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок, на которого подается жалоба не подтвердил условия сделки [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur) <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur) <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
       {
      title: 'при сливе склада нужен лд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Жалоба о сливе склада семьи или самой семьи принимается только от лидера семьи [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
   },
    {
      title: 'не доказал что владелец фамы',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Нет доказательств того, что вы являетесь владельцем семьи [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не указал тайм-коды',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FON]=georgia][COLOR=#FF8C00][SIZE=4] Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [Color=#FF0000]Отказано [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ответный дм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] На видео видно как вы первые начали стрельбу, игрок оборонялся (тоесть ответный ДМ). <br> Вы будете наказаны по пункту правил:<br>[Color=#ffd700] 2.19[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ffd700] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг ток через банк',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. [/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замены нет',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('жалобы игр', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


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

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}

}


function moveThread(prefix, type) {
// Перемещение темы
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


(function() {
    'use strict';
const ACCEPT_PREFIX = 9;
const buttons1 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴хзшки ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'СКРИПТ АКТУАЛЬНЫЙ ТОЛЬКО ДЛЯ КФ/МКФ СЕРВЕРА CRIMSON',
    },
    {title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп поведение',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.01[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ffd700]| Jail 30 минут[/color]. <br> [Color=#ffd700][SPOILER=Примечание]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Рассмотрено, [COLOR=#FF0000] закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от рп',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.02[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ffd700]| Jail 30 минут / Warn[/color] <br> [Color=#ffd700][SPOILER=Примечание]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF0000][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF0000] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп драйв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.03[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ffd700]| Jail 30 минут[/color] <br> [Color=#ffd700][SPOILER=Примечание]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха работягам',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.04[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [Color=#ffd700]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color] <br> [Color=#ffd700][SPOILER=Пример]таран дальнобойщиков, инкассаторов под разными предлогами [/SPOILER][/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп развод',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.05[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ffd700]| PermBan[/color] <br> [Color=#ffd700][SPOILER=Примечание]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации [/SPOILER][/color] <br> [Color=#ffd700] [Color=#ffd700][SPOILER=Примечание] Администрация не возвращает игровое имущество в случаи обмана, вы можете договориться с игроком на возврат имущества и разблокировку аккаунта [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны) [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморал действия',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.08[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ffd700]| Jail 30 минут / Warn[/color] <br> [Color=#ffd700][SPOILER=Исключение]обоюдное согласие обеих сторон.[/SPOILER][/color] [/COLOR][/FONT][/CENTER] " +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.09[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.13[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ffd700] | Jail 60 минут[/color] <br> [Color=#ffd700][SPOILER=Исключение]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]  Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.15[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ffd700] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.16[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ffd700] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22 Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'МГ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.18[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]телефонное общение также является IC чатом [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.19[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ffd700] | Jail 60 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'масс ДМ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.20[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ffd700] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'богоюз',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.21[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ffd700] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#ffd700][SPOILER=Примечание]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; <br> Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; <br> Банк и личные счета предназначены для передачи денежных средств между игроками; <br> Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
    {
      title: 'сторонее по',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.22[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#ffd700][SPOILER=Примечание]запрещено внесение любых изменений в оригинальные файлы игры.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]блокировка за включенный счетчик FPS не выдается.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.39[/color] Злоупотребление нарушениями правил сервера [Color=#ffd700] | Ban 7 - 30 дней [/color] [Color=#ffd700][SPOILER=Примечание]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней [/SPOILER][/color] [Color=#ffd700][SPOILER=Примечание]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.47[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ffd700] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп аксесуар',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.52[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ffd700] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное[/SPOILER][/color]  [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не возврат долга',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.57[/color] Запрещается брать в долг игровые ценности и не возвращать их.  [Color=#ffd700] | Ban 30 дней / permban [/color] <br> [Color=#ffd700]  [SPOILER=Примечание] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Примечание] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами [/color][/SPOILER][/color][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'баг с аним',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.55[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#ffd700] | Jail 120 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе [/color][/SPOILER][/color][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴казик/ночной клуб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',

    },
    {
      title: 'принятие за деньги',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.01[/color] Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника или крупье  [Color=#ffd700] | Ban 3 - 5 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'капс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.02[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.03[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.04[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ffd700] | Mute 120 минут / Ban 7 - 15 дней [/color] <br> [Color=#ffd700][SPOILER=Примечание]термины (MQ), (rnq) расценивается, как упоминание родных.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.05[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.06[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив глобал чата',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.08[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ffd700] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'реклама',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.31[/color]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#ffd700] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.37[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ffd700] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'оск адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.54[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ffd700] | Mute 180 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#FF8C00] | Mute 180 минут [/color][/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.10[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ffd700] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'продажа промо',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.43[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ffd700] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.11[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ffd700] | Ban 15 - 30 дней / PermBan[/color] <br> [Color=#FF8C00][SPOILER=Примечание]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка войс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.14[/color] Запрещено включать музыку в Voice Chat [Color=#ffd700] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в воис',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.16[/color] Запрещено создавать посторонние шумы или звуки [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Примечание]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.18[/color] Запрещено политическое и религиозное пропагандирование [Color=#ffd700] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.19[/color] Запрещено использование любого софта для изменения голоса [Color=#ffd700] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'оск проекта',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.40[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ffd700] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]«Privet», «Kak dela», «Narmalna».[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.21[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ffd700] | Ban 30 дней [/color] <br> [Color=#ffd700][SPOILER=Примечание]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Исключение]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/color]  [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьява в гос орг',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.22[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ffd700] | Mute 30 минут [/color] <br> [Color=#ffd700][SPOILER=Пример]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево»[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мат в vip',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 3.23[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп ник',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.06[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ffd700] | Устное замечание + смена игрового никнейма [/color] <br> [Color=#ffd700][SPOILER=Пример]John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]_scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки [/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск ник',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.09[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ffd700] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фейк',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.10[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ffd700] | Устное замечание + смена игрового никнейма / PermBan [/color] <br> [Color=#ffd700][SPOILER=Пример]подменять букву i на L и так далее, по аналогии.[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.07[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в личн целях',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.08[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'арест в инте',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.50[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#ffd700] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'казино/бу в форме госс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.13[/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне теры военки (армия)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 2.02[/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#ffd700] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нарущение ПРО (СМИ)',
      content:

        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.01[/color] Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ППЭ (СМИ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.02[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ffd700] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 4.04[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ffd700] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оружие в форме (цб)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 5.01[/color] Запрещено использование оружия в рабочей форме.; [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без рп причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#ffd700] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ/ГИБДД)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 7.02[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ffd700] | Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP коп',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#ffd700] |  Warn [/color] [Color=#ffd700][SPOILER=Примечание]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ [/SPOILER][/color] <br> [Color=#ffd700][SPOILER=Пример]- открытие огня по игрокам без причины <br> - расстрел машин без причины <br> - нарушение ПДД без причины <br> - сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SPOILER][/color] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 7.05[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ffd700] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'остановка и осмотр т/с без рп (ГИБДД)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 7.04[/color] Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки; [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'маскировка в лич целях (ФСБ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 8.04[/color] Запрещено использовать маскировку в личных целях; [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
       {
      title: 'провокация гос',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 2. Запрещено провоцировать сотрудников государственных организаций [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обыск без рп (ФСБ)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 8.06[/color] Запрещено проводить обыск игрока без Role Play отыгровки. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'провокация опг на их тере',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон без причины на тере',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 4. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#ffd700] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дуэли',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 5. Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'перестрелки в людных местах',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 6. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#ffd700] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в /f',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#ffd700] |  Mute 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'cкрыться от копа на базе',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> 8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#ffd700] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп вч',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#ffd700] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'находится на тере бв лишний',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок будет наказан по пункту правил:<br>[Color=#ffd700] 1.06[/color] На территории проведения бизвара может находиться только сторона атаки и сторона защиты [Color=#ffd700] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(джаил)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(варн)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(бан)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Нарушений со стороны данного игрока не было найдено [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мало докв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Недостаточно доказательств на нарушение от данного игрока [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'дубликат',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
       '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] На ваших доказательствах отсутствует /time [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'укажите таймкоды',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов.<br>В противном случае жалоба будет отказана. <br> [COLOR=#FFFF00][SPOILER=Тайм-коды это]Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты. <br> Пример: <br> 0:37 - Условия сделки. <br> 0:50 - Сам обмен. <br> 1:50 - Конец обмена. <br>2:03 - Сабвуфера нет. <br>2:06 - /time. [/SPOILER][/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: 123,
    },
    {
      title: 'более 72 часов',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения[/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
	  status: false,
    },
    {
      title: 'соц сеть',
      content:

        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur) [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] В таких случаях нужен фрапс. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваш фрапс обрывается, загрузите полный фрапс на ютуб [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] В вашей жалобе отсутствуют доказательства [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваши доказательства отредактированы [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации) [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись сервером.<br> Обратитесь в раздел жалоб на игроков вашего сервера [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не подтвердил условия сделки',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER]" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
       {
      title: 'при сливе склада нужен лд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Жалоба о сливе склада семьи или самой семьи принимается только от лидера семьи [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
   },
    {
      title: 'не доказал что владелец фамы',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Нет доказательств того, что вы являетесь владельцем семьи [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не указал тайм-коды',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [Color=#FF0000]Отказано [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ответный дм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] На видео видно как вы первые начали стрельбу, он лишь начал обороняться (тоесть ответный ДМ). <br> Вы будете наказаны по пункту правил:<br><br>[Color=#ffd700] 2.19[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ffd700] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Жалоба такого же содержания уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг ток через банк',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замены нет',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#FF8C00][FONT=georgia]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ffd700]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][I][FONT=georgia][COLOR=#ffd700][SIZE=4] Рассмотрено, [COLOR=#FF8C00] закрыто [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
];

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons1[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons1[id].prefix, buttons1[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}

}


function moveThread(prefix, type) {
// Перемещение темы
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


(function() {
    'use strict';
const BIOUNACCEPT_PREFIX = 4;
const BIOACCEPT_PREFIX = 8;
const BIOPIN_PREFIX = 2;
const buttons2 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴хзшки ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'СКРИПТ АКТУАЛЬНЫЙ ТОЛЬКО ДЛЯ КФ/МКФ СЕРВЕРА CRIMSON',
    },
    {title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'био одобрено',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Ваша РП биография получает статус - [Color=#00FF00]Одобрено [/color] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
        prefix: BIOACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био на доработке',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вам дается 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#FF0000]Отказано [/COLOR][/FONT][/CENTER]',
      prefix: BIOPIN_PREFIX,
	  status: 123,
    },
    {
      title: 'био отказ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило нарушение [URL= https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/] Правил написания RP биографий[/URL] <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'био отказ меньше 200',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило - Минимальный объём RP биографии — 200 слов <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био отказ более 600',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причина отказа: Максимальное количество слов - 600 <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'био отказ шрифт',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано.[/color]<br>Причиной отказа послужило -  Шрифт биографии должен быть georgia либо Verdana, минимальный размер — 15 <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(плагиат)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причина отказа - Плагиат тематики<br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(не дополнил)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило - Игнорирование требования дополнить биографию в течение 24-х часов <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(возарст не совпадает с датой)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило - возраст не совпадает с датой рождения <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(мат)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило - ненормативная лексика <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(грам ошибки)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило - грамматические ошибки <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ(пункт ошибки)',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП биография получает статус - [Color=#FF0000]Отказано [/color]<br>Причиной отказа послужило - пунктуационные ошибки <br><br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴перенаправление ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на игроков',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на игрока - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-игроков.640/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на администратора - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.638/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на лидера - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо оформить повторную в обжалование - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, обратитесь в технический отдел - [URL=https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на технического специалиста - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, оформите повторное обращение в разделе *Жалобы на сотрудников* нужной организации [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на ап',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на Агента Поддержки - [URL=https://forum.blackrussia.online/index.php?forums/Раздел-для-хелперов-сервера.623/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: BIOUNACCEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('биографии', 'selectAnswer1');

	// Поиск информации о теме
	const threadData = getThreadData();


$(`button#selectAnswer1`).click(() => {
XF.alert(buttonsMarkup(buttons2), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons2.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons2[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons2[id].prefix, buttons2[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == BIOUNACCEPT_PREFIX) {
		moveThread(prefix, 647);
	}
	if(prefix == BIOACCEPT_PREFIX) {
		moveThread(prefix, 645);
	}
	if(prefix == BIOPIN_PREFIX) {
		moveThread(prefix, 646);
	}
}


function moveThread(prefix, type) {
// Перемещение темы
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


(function() {
    'use strict';
const SITAUNACCEPT_PREFIX = 4;
const SITAACCEPT_PREFIX = 8;
const SITAPIN_PREFIX = 2;
const buttons3 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴хзшки ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'СКРИПТ АКТУАЛЬНЫЙ ТОЛЬКО ДЛЯ КФ/МКФ СЕРВЕРА CRIMSON',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'сита одобрена',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП ситуация получает статус - [Color=#ffd700]Одобрено [/color] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: SITAACCEPT_PREFIX,
	  status: 12345,
    },
    {
      title: 'сита на доработке',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Вам дается 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - [Color=#FF0000]Отказано [/COLOR][/FONT][/CENTER]',
      prefix: SITAPIN_PREFIX,
	  status: 123,
    },
    {
      title: 'сита отказ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'сита отказ копирка',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> Причиной отказа послужило: Запрещено копировать чужие RP ситуации <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
           {
      title: 'сита отказ шрифт',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано [/color] <br> Причиной отказа послужило: RP ситуация должна быть читабельной <br> Минимальный размер шрифта — 15. Разрешенные шрифты: Verdana, georgia <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита одобрена+денег не дам',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП ситуация получает статус - [Color=#ffd700]Одобрено [/color] <br> [QUOTE]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП [/QUOTE] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: SITAACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сита отказ+денег не дам',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша РП ситуация получает статус - [Color=#FF0000]Отказано[/color] <br> [QUOTE]Так же хочу отметить, что игровую валюту вы не получите за ограбление чего-либо по РП [/QUOTE] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴перенаправление ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на игроков',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на игрока - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-игроков.640/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на администратора - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.638/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на лидера - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо оформить повторную в обжалование - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, обратитесь в технический отдел - [URL=https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на технического специалиста - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, оформите повторное обращение в разделе *Жалобы на сотрудников* нужной организации [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на ап',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на Агента Поддержки - [URL=https://forum.blackrussia.online/index.php?forums/Раздел-для-хелперов-сервера.623/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: SITAUNACCEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('cитуации', 'selectAnswer2');


	// Поиск информации о теме
	const threadData = getThreadData();


$(`button#selectAnswer2`).click(() => {
XF.alert(buttonsMarkup(buttons3), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons3.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons3[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons3[id].prefix, buttons3[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == SITAPIN_PREFIX) {
		moveThread(prefix, 643);
	}
	if(prefix == SITAACCEPT_PREFIX) {
		moveThread(prefix, 642);
	}
	if(prefix == SITAUNACCEPT_PREFIX) {
		moveThread(prefix, 644);
	}
}


function moveThread(prefix, type) {
// Перемещение темы
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


(function() {
    'use strict';
const NEOFUNACCEPT_PREFIX = 4;
const NEOFACCEPT_PREFIX = 8;
const NEOFPIN_PREFIX = 2;
const buttons4 = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴хзшки ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'СКРИПТ АКТУАЛЬНЫЙ ТОЛЬКО ДЛЯ КФ/МКФ СЕРВЕРА CRIMSON',
    },
    {title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициальные RP организации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неоф орг одобрена',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#ffd700]Одобрено [/color] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: NEOFACCEPT_PREFIX,
	  status: 12345,
    },
    {
      title: 'неоф на доработке',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Вам дается 24 часа на дополнение вашей неофициальной RP организации, в противном случае она получит статус - [Color=#FF0000]Отказано [/COLOR][/FONT][/CENTER]',
      prefix: NEOFPIN_PREFIX,
	  status: 123,
    },
    {
      title: 'неоф орг отказ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color] <br> Приятной игры на сервере [Color=#DC143C]CRIMSON. [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'неоф орг отказ госс фракция ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color]<br> Причиной отказа послужило: Запрещено создавать неофиц. организации имеющие схожие тематики с государственными организациями<br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'неоф орг нету актива ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color]<br> Причиной отказа послужило: В течение недели в теме не наблюдалось активности, организация была расформирована <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неоф орг копирка ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color]<br> Причиной отказа послужило: Запрещено копировать чужие неофициальные RP организации, а также воссоздавать собственные ранее созданные неофициальные RP организации, которые были распущены <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
   {
      title: 'неоф орг мин 3 чел ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color]<br> Причиной отказа послужило: Минимальный состав участников для создания неофициальной RP организации — 3 человека <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'неоф орг нету рп био ',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4]Ваша Неофициальная RP организация получает статус - [Color=#FF0000]Отказано[/color]<br> Причиной отказа послужило: Лидер должен иметь одобренную RP биографию <br> Приятной игры на сервере [Color=#DC143C]CRIMSON [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴перенаправление ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на игроков',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на игрока - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-игроков.640/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на адм',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на администратора - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.638/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на лидера - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо оформить повторную в обжалование - [URL= https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.641/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, обратитесь в технический отдел - [URL=https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на технического специалиста - [URL= https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, оформите повторное обращение в разделе *Жалобы на сотрудников* нужной организации [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на ап',
      content:
        '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FF8C00]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=georgia][COLOR=#FF8C00][SIZE=4] Вы ошиблись разделом, необходимо составить повторную жалобу на Агента Поддержки - [URL=https://forum.blackrussia.online/index.php?forums/Раздел-для-хелперов-сервера.623/]*Кликабельно*[/URL] [/COLOR][/FONT][/CENTER]',
      prefix: NEOFUNACCEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('неофициалки', 'selectAnswer3');
    addButton('❄ Скрипт от James_Adamson ❄', '/');



	// Поиск информации о теме
	const threadData = getThreadData();




$(`button#selectAnswer3`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons4.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons4[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons4[id].prefix, buttons4[id].status);
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == NEOFACCEPT_PREFIX) {
		moveThread(prefix, 635);
	}
	if(prefix == NEOFPIN_PREFIX) {
		moveThread(prefix, 636);
	}
	if(prefix == NEOFUNACCEPT_PREFIX) {
		moveThread(prefix, 637);
	}
}


function moveThread(prefix, type) {
// Перемещение темы
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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-10-16
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/%D0%9E%D1%81%D0%BA-%D1%80%D0%BE%D0%B4%D0%BD%D0%B8.13080997/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();