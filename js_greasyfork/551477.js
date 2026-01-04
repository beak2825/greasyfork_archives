// ==UserScript==
// @name         BARNAUL | Скрипт для ГКФ/ЗГКФ/ГС/ЗГС
// @description  Для Кураторов Форума
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @author       Leon_Graves
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/551477/BARNAUL%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9A%D0%A4%D0%97%D0%93%D0%9A%D0%A4%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/551477/BARNAUL%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%9A%D0%A4%D0%97%D0%93%D0%9A%D0%A4%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
{
         title: '——————————————————Передача на рассмотрение——————————————————'
},
{
	  title: '| На рассмотрение |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
        '[COLOR=rgb(255, 255, 255)][B][I]На рассмотрении......[/I][/B]<br><br>' +
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
            '[COLOR=rgb(255, 255, 255)][B][I]Ожидайте ответа...[/I][/B]<br><br>' +
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
  title: '——————————————————Направление в нужный в раздел——————————————————'
},
{
  title: '| В жб на адм |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| В жб на лд |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| В жб на сотрудников госску |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на сотрудников» в разделе Государственных организаций. <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| В жб на сотрудников опэгэшников |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на сотрудников» в разделе Криминальных организаций. <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| В обжалования |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| В тех раздел |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| В жб на теху |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
	  title: ' ——————————————————Правила RP процесса ——————————————————'
},
{
	  title: '| NonRP Поведение |',
	  content:
	
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Уход от RP |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP drive |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| NonRP Обман |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал действия |',
	  content:
	    '[CENTER][[url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Cлив склада |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| DB — DriveBY|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| RK — Revenge Kill|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK — Team Kill|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| SK — Spawn Kill|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG — Power Gaming|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG — Meta Gaming |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООC информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| DM — Death Math |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
    title: '| Cторонее ПО/ЧИТЫ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{ 
	  title: '| OОC угрозы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Злоуп наказаниями |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Продажа промо |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
    {
	  title: '| ЕПП (фура/инк) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| NonRP аксессуар |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в названии (Бизнеса) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#ff0000]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]названия семей, бизнесов, компаний и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск адм |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАC ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000]Mute 180 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| багаюз аним |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]| Jail 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман администрации |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками. Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками. Банк и личные счета предназначены для передачи денежных средств между игроками. Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",

        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '—————————————————— Chat Правила ——————————————————'
},
{
	  title: '| Caps |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Оскорбление |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/Упом родни |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
        tile: '| Мат в Vip Chat |',
    contenrt:
    	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
    status: false,
},
{
    title: '| Flood |',
	  content:
	    '[CENTER][[url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
            prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп символами |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Cлив гл. чата (CМИ) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Угроза о наказании(адм) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача себя за администратора |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧC администрации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в заблужд командами |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Музыка в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/упом род в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Шумы в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Cильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Полит/религ пропоганда |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Транслит |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промо |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '——————————————————NikName——————————————————'
},
{
	  title: '| Oск Nickname|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
     prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Fake nickname |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
     prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '——————————————————Правила форума——————————————————'
},
{
   title: '| Провокация, розжиг конфликта |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещена совершенно любая реклама любого направления.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| 18+ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Flood , Offtop |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.07.[/color] Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Религия/политика |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены споры на тему религии/политики.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха развитию проекта |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Попрошайничество |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещено вымогательство или попрошайничество во всех возможных проявлениях.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп Caps/транслит |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещено злоупотребление Caps Lock`ом или транслитом.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дубликат тем |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещена публикация дублирующихся тем.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '——————————————————Правила госс. структур——————————————————'
},
{
	  title: '| Работа в форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино б/у ГОCC |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/C в личных целях |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Редактирование в лич. целях |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для CМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧC организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| Обыск без отыгровки |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.05.[/color] Запрещено проводить обыск игрока без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NRP Cop |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '——————————————————Правила ОПГ——————————————————'
},
{
	  title: '| Нарушение правил ОПГ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение общих правил криминальных организаций.<br><br>"+
                "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Cтрогий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
                "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
   title: '| NonRP огр/похищ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил ограблений и похищений.<br><br>"+
                "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Cтрогий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
              "[B][CENTER][COLOR=WHITE] Приятной игры на сервере [/COLOR][COLOR=CORNFLOWERBLUE] BARNAUL [/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
        prefix: ACCCEPT_PREFIX,
	  status: false,
},
{
	  title: '——————————————————Отказ жалобы——————————————————'
},
{
  title: '| Нарушений не найдено |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    '[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Админ не возвращают игровых ценностей|',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Недостаточно док-в |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока недостаточно. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Отсутствуют док-ва |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока отсутствуют. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Док-ва отредактированы |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства на нарушение от данного игрока отредактированы. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Не по форме |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Заголовок не по форме |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как заголовок вашей жалобы составлен не по форме. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Не вижу /time |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Более 72-х часов/Прошло 3-ех дней|',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Док-ва соц сеть |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, Instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Условия сделки нет |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в ваших доказательствах отсутствуют условия сделки. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Нужен фрапс |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс (запись экрана). <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Фрапс обрывается |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Не относится к Жалобам на игроков |',
  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>" +
    "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как оно не относится к разделу 'Жалобы на игроков'.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]" +
    "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Док-ва не открываются |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Жалоба от 3-го лица |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
{
  title: '| Ошиблись сервером |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zv50wL7h/57-20250815142452.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером. Перенаправляю вашу жалобу на нужный сервер. <br><br>" +
    "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>" +
    "[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/sgF1TpSn/2776718330-preview-P84-Rw.png[/img][/url]<br>",
  prefix: UNACCCEPT_PREFIX,
  status: false,
},
 
 
];
 
 
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрении', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Закрыто', 'Zakrito');
    addButton('Рассмотрено', 'Rassmotreno');
    addButton('МЕНЮ', 'selectAnswer');
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
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
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
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
