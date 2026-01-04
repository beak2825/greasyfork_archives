// ==UserScript==
// @name Cкрипт для ЗГКФ by Anton_Bazalev || Purple (06)
// @namespace http://tampermonkey.net/
// @version 1.2.1
// @description Полный cкрипт для ЗГКФ 06 PURPLE
// @author Anton_Bazalev
// @match https://forum.blackrussia.online/*
// @icon https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant none
// @license MIT
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/548307/C%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%9A%D0%A4%20by%20Anton_Bazalev%20%7C%7C%20Purple%20%2806%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548307/C%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%9A%D0%A4%20by%20Anton_Bazalev%20%7C%7C%20Purple%20%2806%29.meta.js
// ==/UserScript==

(function () {
 'use strict';
 const UNACCСEPT_PREFIX = 4; // префикс отказано
 const ACCСEPT_PREFIX = 8; // префикс одобрено
 const PINN_PREFIX = 2; // префикс закрепить
 const SPECADM_PREFIX = 11; // специальному администратору
 const GA_PREFIX = 12; // главному адамнистратору
 const CLOSE_PREFIX = 7;
 const TEXY_PREFIX = 13;
 const REALIZOVANO_PREFIX = 5;
 const VAJNO_PREFIX = 1;
 const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
//const TotleEndOtkaz = "[B][CENTER][COLOR=lavender]✿❯────「Отказано, ❖ Закрыто」────❮✿[/COLOR]<br><br>";
//const TotleEndOdobreno = "[B][CENTER][COLOR=lavender]✿❯────「Одобрено, ❖ Закрыто」────❮✿[/COLOR]<br><br>";
const TotleEnd = "[B][CENTER][COLOR=lavender]С уважением[/COLOR] [COLOR=Blue]Заместитель Главного Куратора Форума[COLOR=lavender].[/COLOR]<br><br>";
const TotlePhotoTxt1 =  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HsNNJFPW/RLwzo.png[/img][/url]<br>"
const buttons = [
{
 title: '| Приветствие |',
 content: 
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Текст <br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
},
{
 title: '| На рассмотрение |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба взята [COLOR=yellow]на рассмотрение[/COLOR],<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: NARASSMOTRENIIRP_PREFIX,
 status: true,
},
{
 title: '| Передать ГА |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=yellow]передана на рассмотрение Главному Администратору[/COLOR],<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: GA_PREFIX,
 status: true,
},
{
 title: '| Передать ГКФ/ЗГКФ |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба передана на рассмотрение [COLOR=blue]Главному Куратору Форума/Заместителю Главнго Куратора Форума.[/COLOR]<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: NARASSMOTRENIIRP_PREFIX,
 status: true,
},
{
 title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RolePlay процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
 title: '| NonRP Поведение |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Уход от РП |',
 content:
 "[B][CENTER][[COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| NonRP Drive |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Помеха РП |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| NonRP обман |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Аморал |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]ИСключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]обоюдное согласие обеих сторон.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Слив склада фракции/семьи |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Обман в /do |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.10[/color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [Color=#ff0000]| | Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Помеха работе блогеров |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.12.[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [Color=#ff0000]| Ban 7 дней[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| DB |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| TK |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| SK |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| MG |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]телефонное общение также является IC чатом.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/FONT][/COLOR][/SIZE][/CENTER]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| DM |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Mass DM |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Обход системы/Багоюз |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Стороннее ПО |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Сокрытие ошибок системы |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.23.[/color] Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Сокрытие нарушителей |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников[Color=#ff0000]| Ban 15 - 30 дней / PermBan + ЧС Проекта[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ППИВ |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br><br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]также запрещен обмен доната на игровые ценности и наоборот;[/FONT][/COLOR][/SIZE]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]пополнение донат счет любого игрока взамен на игровые ценности;[/FONT][/COLOR][/SIZE]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]официальная покупка через сайт.[/FONT][/COLOR][/SIZE][/CENTER]<br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Ущерб ЭКО |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.30.[/color] Запрещено пытаться нанести ущерб экономике сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Реклама |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#ff0000]| Ban 7 дней / PermBan[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Обман Адм |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт с которого совершен обман, так и на все аккаунты нарушителя. [Color=#ff0000]| PermBan[/color][/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Конфликт религия |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| OOC угрозы/о наказании от АДМ |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.37.[/color] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка. [Color=#ff0000]| PermBan[/color][/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Оск проекта |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ЕПП Инко |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Арест в интерьере |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| NonRp акс |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.51.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Оск Адм |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Багоюз аним |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.55.[/color] Запрещается багоюз, связанный с анимацией в любых проявлениях. [Color=#ff0000]| Jail 120 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание:[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример:[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new] если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/color].[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение:[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]  разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/FONT][/COLOR][/SIZE][/CENTER]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Долг |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/FONT][/COLOR][/SIZE][/CENTER]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила игровых чатов╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
 title: '| CapsLock |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Оск |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Упом/оск родни |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]термины MQ, rnq расценивается, как упоминание родных.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Flood |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Злоуп симв |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Слив глоб чата |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Выдача за Адм |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Ввод в забл |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Музыка в войс |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Масс флуд, политика |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Транслит |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.20.[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]«Privet», «Kak dela», «Narmalna».[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Реклама промо |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Реклама ГОСС |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Мат в VIP чат |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Положение об игровых аккаунтах╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
 title: '| Оск ник |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>" +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Фейк ник |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ППВ |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.03.[/color] Передача своего личного игрового аккаунта третьим лицам [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГОСС организаций╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
 title: '| Работа в форме |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]|Jail 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ТС в личных целях |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.8.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| урон без IC причины |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещено наносить урон без IC причины на территории своей организации [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: За нарушение Mass DM игроку выдается предупреждение [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
   TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ГОСС Конты, Казино, Авторынок |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.13.[/color]Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
   "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: Семейные активности — захват семейного контейнера, битва за территорию, битва семей[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
     "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: за участие в семейных активностях в форме организации, игроку по решению администрации может быть выдано предупреждение [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Арест участников бизвара |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]1.14.[/color] Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
   "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Армия, урон вне ВЧ |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.02.[/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: За нарушение Mass DM игроку выдается предупреждение [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
   TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| NonRP адвокат |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]3.1.[/color] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| СМИ НПРО |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: игрок отправил одно слово, а редактор вставил полноценное объявление. [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| СМИ NonRP эфир |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих игровым правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>" +
  TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| СМИ Реклама промо |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.03.[/color] Запрещена реклама промокодов в объявлениях [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>" +
  TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| СМИ Замена объяв |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Больница исп-ние оружия |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]5.01.[/color] Запрещено использование оружия в рабочей форме [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: защита в целях самообороны, обязательно иметь видео доказательство в случае наказания администрации. [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Больница ввод в звблуждение |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]5.02. [/color] Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами [Color=#ff0000]| Ban 3-5 дней + ЧС организации[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола. [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Рохыск без IC причины |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без IC причины [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| NonRP ГОСС |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]6.03.[/color]  Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
   "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
    TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ГИБДД Права в погони |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ГИБДД Права в погони |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]9.01.[/color] Запрещено освобождать заключённых, нарушая игровую логику организации [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых. [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
   "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Примечание[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: Побег заключённого возможен только на системном уровне через канализацию. [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ФСИН Карцер, выговор, поощрения без IC причины |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
  "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]9.02.[/color] Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>" +
  "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Пример[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]: сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер [/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=courier new]| Warn[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
 title: '| NonRp вч |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]2.00.[/color] Запрещается нарушение правил нападения на Войсковую Часть. [Color=#ff0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Дуэль ОПГ |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]5.00.[/color] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=courier new]территория проведения войны за бизнес, когда мероприятие не проходит.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '| ОПГ DM |',
 content:
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new][Color=#ff0000]4.00.[/color] Запрещено без причины наносить урон игрокам на территории ОПГ. [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
 TotlePhotoTxt1 +
 TotleEnd,
 prefix: ACCСEPT_PREFIX,
 status: false,
},
{
 title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴В другой раздел╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
 title: '| В жб на адм |',
 content:
TotlePhotoTxt1 +
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
TotlePhotoTxt1 +
 TotleEnd,
 prefix: UNACCСEPT_PREFIX,
 status: false,
},
{
 title: '| Тех спецу |',
 content:
TotlePhotoTxt1 +
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба была передана [COLOR=yellow]на рассмотрение[/COLOR] [COLOR=orange]Техническому Специалисту[/COLOR].<br><br>"+
TotlePhotoTxt1 +
 TotleEnd,
 prefix: TEXY_PREFIX,
 status: true,
},
{
 title: '| В жб на лд |',
 content:
TotlePhotoTxt1 +
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
TotlePhotoTxt1 +
 TotleEnd,
 prefix: UNACCСEPT_PREFIX,
 status: false,
},
{
 title: '| В обжалования |',
 content:
TotlePhotoTxt1 +
 "[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
               TotlePhotoTxt1 +
		TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
	  TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
               TotlePhotoTxt1 +
		TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
	  TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
               TotlePhotoTxt1 +
		TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В ЖБ Орг |',
	  content:
	  TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел Жалобы на сотрудников организации. <br><br>"+
               TotlePhotoTxt1 +
		TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
	  TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
		TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Долг не банк |',
	  content:
	    	"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 TotlePhotoTxt1 +
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=red]отказана[/COLOR], так как все долговые перечисление должны перечисляться через банковскую систему.<br>"+
               TotlePhotoTxt1 +
		TotleEnd,
		 prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
		TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
		TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              TotlePhotoTxt1 +
			TotleEnd,
       prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка на фоне |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в видео-доказательстве присутствует музыка. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лица |',
	  content:
	   TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
	    TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Оск только в ООС |',
	  content:
	  TotlePhotoTxt1 +
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Оскорбление считается таковым, если оно было написано в ООС чат. <br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Био одобрена |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
					"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение формы подачи RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Био отказ (Уже одобрена) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило то, что Ваша предыдущая Биография уже получила статус Одобрено.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
	  		"[B][CENTER][COLOR=CCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	  		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Биография скопирована <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Написание Биографии от 1-го лица.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст разница с дат. рож.) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Возраст не совпадает с датой рождения.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст мал) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Возраст слишком мал.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Смысл несостык) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                 "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило присутствие смысловых несостыковок в вашей RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Имя не анг) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white] [FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение пункта правил - NickName должен быть указан на английском языка, как в заголовке, так и в самой теме.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (ООС инфа) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR][/B][/CENTER]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило написание информации из реального мира (OOC).<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Реалист) |',
	  content:
	     		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила нереалистичность Вашей биографии (OOC). <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Несовп возраст инфо и био) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница между возрастом указанным в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад мест рожд) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница между местом рождения в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад образование) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white] [FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница в образовании указанном в Информации и в Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило большое количество ошибок. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
      status: false,
},
      {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Ситуация одобрена |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Ситуация получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Ситуация отказ (Форма) |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Ситауция получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение формы подачи RP ситуации. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Ситуаций, закрепленные в данном разделе.<br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В ЖБ |',
	  content:
	  		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Ситуация [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы». <br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофиц RolePlay Организации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Организация одобрена |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Неофициальная RP Организация получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=white][FONT=courier new] Если Вы не будете проявлять активность в течение 7 дней, она будет закрыта.[/COLOR]<br><br>"+
               TotlePhotoTxt1 +
			TotleEnd,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Организация отказ |',
	  content:
	   		"[B][CENTER][COLOR=#CCCCCC][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
 TotlePhotoTxt1 +
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Организация получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
		 TotlePhotoTxt1 +
			TotleEnd,
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));


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
	}
	if (pin == true) {
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
// Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Arial';
  countElement.style.fontSize = '16px';
  countElement.style.color = 'red';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1, 'ТЕМЫ НА ОЖИДАНИИ'));
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'ТЕМЫ НА РАССМОТРЕНИИ'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
  
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
	})();

    (function() {
    'use strict';

    // Массив стоковых цветов для дней недели
    const dayColors = {
        "Пн": "#cccccc",   // Пн (стоковый цвет)
        "Вт": "#cccccc",   // Вт
        "Ср": "#cccccc",   // Ср
        "Чт": "#cccccc",   // Чт
        "Пт": "#cccccc",   // Пт
        "Сб": "#cccccc",   // Сб
        "Вс": "#cccccc",   // Вс
    };

    // Массив цветов для изменения при наведении
    const hoverColors = {
        "Пн": "#FF5733",   // Пн
        "Вт": "#33FF57",   // Вт
        "Ср": "#3357FF",   // Ср
        "Чт": "#9C27B0",   // Чт
        "Пт": "#00BCD4",   // Пт
        "Сб": "#FFEB3B",   // Сб
        "Вс": "#8D6E63",   // Вс
    };

    // Функция для создания элемента с подсчетом
    function createCountElement(count, text, day) {
        var countElement = document.createElement('div');
        countElement.className = 'count-element';
        countElement.textContent = text + ': ' + count;

        // Получаем стоковый цвет для дня
        const color = dayColors[day] || "#cccccc";
        const hoverColor = hoverColors[day] || "#cccccc";

        // Стиль элемента с учетом стокового цвета
        countElement.style.fontFamily = 'Arial, sans-serif';
        countElement.style.fontSize = '14px';  // Уменьшаем размер шрифта
        countElement.style.color = '#ffffff';
        countElement.style.backgroundColor = color;  // Устанавливаем стоковый цвет
        countElement.style.padding = '5px';  // Уменьшаем отступы
        countElement.style.margin = '2px 0';  // Уменьшаем отступы между элементами
        countElement.style.borderRadius = '5px';
        countElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        countElement.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

        // Анимация при наведении
        countElement.addEventListener('mouseover', function() {
            countElement.style.backgroundColor = hoverColor;  // Меняем цвет при наведении
            countElement.style.transform = 'scale(1.05)';
        });

        countElement.addEventListener('mouseout', function() {
            countElement.style.backgroundColor = color;  // Возвращаем стоковый цвет
            countElement.style.transform = 'scale(1)';
        });

        return countElement;
    }

    // Функция для получения дня недели и даты в формате ДД.ММ.ГГГГ
    function getDayOfWeekAndFullDate(dateString) {
        const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const date = new Date(dateString);
        const dayIndex = date.getDay();
        const dayOfWeek = daysOfWeek[dayIndex];

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${dayOfWeek} ${day}.${month}.${year}`;
    }

    // Функция для получения даты создания темы
    function getThreadCreationDate(element) {
        const dateElement = element.querySelector('time[datetime]');
        if (dateElement) {
            const dateTimeString = dateElement.getAttribute('datetime');
            return dateTimeString.split('T')[0]; // Возвращаем только дату (без времени)
        }
        return null;
    }

    // Функция для проверки, находится ли тема в пределах текущей недели
    function isWithinCurrentWeek(threadDate) {
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate);
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        const threadDateObj = new Date(threadDate);
        return threadDateObj >= oneWeekAgo && threadDateObj <= currentDate;
    }

    // Основная функция для подсчета элементов
    async function countElements() {
        // 1. Получаем все темы с нужными классами для "в ожидании" и "на рассмотрении"
        var elementsWaiting = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        var elementsUnderReview = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        // 2. Подсчитываем количество тем
        var waitingCount = elementsWaiting.length;
        var underReviewCount = elementsUnderReview.length;

        // 3. Получаем все темы на странице
        const currentPageThreads = document.querySelectorAll('.structItem.structItem--thread');

        // 4. Создаем объект для хранения количества тем по дням недели
        const weekCounts = {
            "Пн": {date: '', count: 0},
            "Вт": {date: '', count: 0},
            "Ср": {date: '', count: 0},
            "Чт": {date: '', count: 0},
            "Пт": {date: '', count: 0},
            "Сб": {date: '', count: 0},
            "Вс": {date: '', count: 0}
        };

        // 5. Перебираем все темы и считаем темы по дням недели
        currentPageThreads.forEach(element => {
            const threadDate = getThreadCreationDate(element);
            if (threadDate && isWithinCurrentWeek(threadDate)) {
                const dayOfWeekAndFullDate = getDayOfWeekAndFullDate(threadDate);
                const dayOfWeek = dayOfWeekAndFullDate.split(' ')[0];

                weekCounts[dayOfWeek].count++;
                weekCounts[dayOfWeek].date = dayOfWeekAndFullDate;
            }
        });

        // 6. Создаем контейнер для счетчика тем за неделю
        const counterContainerWeek = document.createElement('div');
        counterContainerWeek.style.position = 'absolute';
        counterContainerWeek.style.top = '10px';
        counterContainerWeek.style.left = '10px';
        counterContainerWeek.style.zIndex = '9999';
        counterContainerWeek.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerWeek.style.padding = '10px';
        counterContainerWeek.style.borderRadius = '8px';
        counterContainerWeek.style.color = '#fff';
        counterContainerWeek.style.fontFamily = 'Arial, sans-serif';
        counterContainerWeek.style.fontSize = '14px';
        counterContainerWeek.style.maxWidth = '300px';
        counterContainerWeek.style.maxHeight = '300px';
        counterContainerWeek.style.overflowY = 'auto';
        counterContainerWeek.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementWeek = document.createElement('div');
        headerElementWeek.textContent = 'Темы за неделю по дням:';
        headerElementWeek.style.fontWeight = 'bold';
        headerElementWeek.style.marginBottom = '10px';
        counterContainerWeek.appendChild(headerElementWeek);

        // Добавляем количество тем по дням недели в контейнер
        for (const day in weekCounts) {
            if (weekCounts[day].date !== '') {
                counterContainerWeek.appendChild(createCountElement(weekCounts[day].count, `${weekCounts[day].date}`, day));
            }
        }

        // 7. Создаем контейнер для счетчика тем в ожидании и на рассмотрении (в правом верхнем углу)
        const counterContainerStatus = document.createElement('div');
        counterContainerStatus.style.position = 'absolute';
        counterContainerStatus.style.top = '10px';  // Размещаем в верхней части
        counterContainerStatus.style.right = '10px';  // Размещаем справа
        counterContainerStatus.style.zIndex = '9999';
        counterContainerStatus.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        counterContainerStatus.style.padding = '10px';
        counterContainerStatus.style.borderRadius = '8px';
        counterContainerStatus.style.color = '#fff';
        counterContainerStatus.style.fontFamily = 'Arial, sans-serif';
        counterContainerStatus.style.fontSize = '14px';
        counterContainerStatus.style.maxWidth = '200px';
        counterContainerStatus.style.maxHeight = '200px';
        counterContainerStatus.style.overflowY = 'auto';
        counterContainerStatus.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';

        // Создаем заголовок для блока
        const headerElementStatus = document.createElement('div');
        headerElementStatus.textContent = 'Статус тем:';
        headerElementStatus.style.fontWeight = 'bold';
        headerElementStatus.style.marginBottom = '10px';
        counterContainerStatus.appendChild(headerElementStatus);

        // Добавляем количество тем в ожидании и на рассмотрении
        const waitingElement = createCountElement(waitingCount, `В ожидании`, 'Пн');
        const underReviewElement = createCountElement(underReviewCount, `На рассмотрении`, 'Вт');
        counterContainerStatus.appendChild(waitingElement);
        counterContainerStatus.appendChild(underReviewElement);

        // Вставляем контейнеры в body
        document.body.appendChild(counterContainerWeek);
        document.body.appendChild(counterContainerStatus);
    }

    // Вызываем функцию при загрузке страницы
    window.onload = function() {
        countElements();
    };

})();
