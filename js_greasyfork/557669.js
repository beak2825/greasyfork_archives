// ==UserScript==
// @name         Script for Joe Deceased
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Script
// @author       Joe_Deceased
// @match        https://forum.blackrussia.online/threads/*
// @icon        https://tse4.mm.bing.net/th/id/OIP.eFSiDJnzvKJg1CSrqgUDSgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/557669/Script%20for%20Joe%20Deceased.user.js
// @updateURL https://update.greasyfork.org/scripts/557669/Script%20for%20Joe%20Deceased.meta.js
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
                        	  title: '| Приветствие |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=#FF0033] Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>'
        },
{
	  title: '|____________________________________________ Правила RolePlay процесса ____________________________________________|'
},
{
	  title: '| NonRP Поведение |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=Grey][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от RP |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=Grey][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP drive |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=Grey][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Обман |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг  отказ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0033]Отказана[/COLOR], игрок будет наказан по 1 пункту примечания в правиле 2.57:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| RP отыгровки в свою сторону |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.06.[/color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Затягивание RP |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]/me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| RK |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    title: '| Ссторонее ПО |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от наказания |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.34.[/color] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]выход игрока из игры не является уходом от наказания.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| OОC угрозы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп наказаниями |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа промо |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| ЕПП (фура/инк) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,

            prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест на аукционе |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP аксессуар |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск адм |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000]Mute 180 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| багаюз аним |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]| Jail 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман администрации |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками. Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками. Банк и личные счета предназначены для передачи денежных средств между игроками. Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________Chat Правила____________________________________________|'
},
{
	  title: '| Разговор не на русском |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000]| Устное замечание / Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Caps |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оскорбление |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/Упом родни |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
        tile: '| Мат в Vip Chat |',
    contenrt:
    	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
    status: false,
},
{
	  title: '| Flood |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
            prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп символами |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Слив гл. чата (СМИ) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Угроза о наказании(адм) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача себя за администратора |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧС администрации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в заблужд командами |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/упом род в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Шумы в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама в Voice |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Полит/религ пропоганда |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Изменение голоса софтом |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]«Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промо |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=Grey]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обьявления в госс |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=Grey]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________Передача на рассмотрение____________________________________________|'
},
{
	  title: '| На рассмотрение |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба взята на [COLOR=Orange]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба передана на [COLOR=WHITE]рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: TEXY_PREFIX,
	  status: true,
},
{
    	  title: '| Заместителю ГА |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба передана на [COLOR=WHITE]рассмотрение[/COLOR] [COLOR=#ff0000]Заместителю Главного Администратора [/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Главному администратору |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба передана на [COLOR=WHITE]рассмотрение[/COLOR] [COLOR=#ff0000]Главному администратору @Den_Medvedev[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: GA_PREFIX,
	  status: true,
},
{
	  title: '|____________________________________________NickName____________________________________________|'
},
{
	  title: '| NonRP Nik |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color].[/COLOR]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Oск Nick |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.gifer.com/TS0a.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Fake |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________В другой раздел____________________________________________|'
},
{
	  title: '| В жб на адм |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________Правила госс. структур____________________________________________|'
},
{
	  title: '| Работа в форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино в форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/С в личных целях |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Н/ПРО |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP эфир |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Редактирование в лич. целях |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
 
	  title: '| Розыск без причины (УМВД) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск/штраф без причины (ГИБДД) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (ФСБ) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]8.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Права в погоне (ГИБДД) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NRP Cop |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=Grey][FONT= courier new][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn / /jail 60 минут [/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________Правила ОПГ____________________________________________|'
},
{
	  title: '| NonRP В/Ч |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
       prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP огр/похищ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил ограблений и похищений.<br><br>"+
                "[B][CENTER][Spoiler][/COLOR][COLOR=Grey] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=Grey]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|____________________________________________Отказ жалобы____________________________________________|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://share.creavite.co/67221862b23406fceac122fb.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: '| Жалоба на 2-х и более игроков |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба написана на 2-х или более игроков. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '|____________________________________________RolePlay Биографии____________________________________________|'
},
{
        	  title: '| Био одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило нарушение Правила написания RP биографии <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Биография скопирована <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Неправильное написание заголовка биографии. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (3-ее лицо) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Написание Биографии от 3-го лица. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (NICK) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - NonRP NickName. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wBXBz7g5/zagruzka.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило большое количество ошибок. <br><br>"+
                "[B][CENTER][COLOR=Grey]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://lh6.googleusercontent.com/06I9sNqhrJ-ivS6H_eoV2UjOB93W5IpXcBKRVidmvhcqhQuzg6nHRIsiirUfZ6vRyR6wvG0vPSoI9mnD88mdMynCFO0pYGcIAkJHcZlOvhXSTYCkWLLMDEdWMSTBfaybCDp17QFl[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Jnzp8HjM/Post-by-deathberi-6-images.gif[/img][/url][/CENTER]<br>' ,
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 
 
];
 
 
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Важно', 'Vajno', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('ГА', 'Ga', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Спецу', 'Spec', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Теху', 'Texy', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Решено', 'Resheno', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Закрыто', 'Zakrito', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Реализовано', 'Realizovano', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Рассмотрено', 'Rassmotreno', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Ожидание', 'Ojidanie', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Без префикса', 'Prefiks', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('📒 ШАБЛЫ 📒', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
 
 
 	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});
 
 function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`
	);
	}
 
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`
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