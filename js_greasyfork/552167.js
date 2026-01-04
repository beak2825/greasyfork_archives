// ==UserScript==
// @name         Скрипт для КФ | by R.Ferrera
// @namespace    https://forum.blackrussia.online/
// @version      2.15
// @description  Для кураторов форума
// @author       Reymon_Ferrera
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Kuk
// @icon https://i.ytimg.com/vi/7GbS_oUhQD0/maxresdefault.jpg?7857057827
// @copyright 2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/552167/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%7C%20by%20RFerrera.user.js
// @updateURL https://update.greasyfork.org/scripts/552167/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%7C%20by%20RFerrera.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;
    const buttons = [
        {
            title: 'приветствие',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>',
        },
        {
            title: 'игрок будет наказан',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]Игрок будет наказан[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(0, 255, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
            title: 'на рассмотрении',
            content:
            "[url=https://postimages.org/][img]https://i.postimg.cc/F1t9hDsC/o8j1v-Vd-1-1.gif[/img][/url]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=courier new]Ваша жалоба взята на рассмотрение.[/FONT][/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)][FONT=courier new]Просьба не создавать[/COLOR] дубликатов этой темы и ожидать ответа администрации.[/FONT][/CENTER]<br>" +
            "[CENTER][FONT=tahoma][I][COLOR=rgb(243, 121, 52)]На рассмотрении...[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url]",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
            title: '_____________________________________________правила рп процесса_____________________________________________',
        },
        {
	        title: 'нрп поведение',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Игрок будет наказан по следующему пункту регламента:[/I]<br>" +
            "[COLOR=rgb(255, 0, 0)][I]2.01. [/I][/COLOR][I]Запрещено поведение, нарушающее нормы процессов Role Play режима игры |[/I][COLOR=rgb(255, 0, 0)][I] Jail 30 минут[/I][/COLOR][/FONT][/CENTER][LIST]<br>" +
            "[*][I][CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/I][/FONT][/CENTER][/I][/LIST]<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(0, 255, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'уход от рп',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][COLOR=rgb(255, 0, 0)][I]2.02.[/I][/COLOR][I] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [/I][COLOR=rgb(255, 0, 0)][I]Jail 30 минут / Warn[/I][/COLOR][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][COLOR=rgb(255, 0, 0)][I]Примечание: [/I][/COLOR][COLOR=rgb(255, 255, 255)][I]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежа[/I][/COLOR][I]ния смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нрп драйф',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'спасатели экономики',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] таран дальнобойщиков, инкассаторов под разными предлогами.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нрп обман/попытка нрп обмана',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/B][/FONT][/CENTER][LIST]<br>" +
            "[*][B][I][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/I][/B][/CENTER][/FONT][/I][/B]<br>" +
            "[*][B][I][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/B][/I][/CENTER][/FONT][/I][/B][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'рп отыгровки в свою сторону',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.06.[/COLOR] Запрещены любые Role Play отыгровки в свою сторону или пользу | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'аморал действия',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] обоюдное согласие обеих сторон.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'слив склада/семьи',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.09.[/COLOR] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'обман в /do',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.10.[/COLOR] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'фракционный транспорт в личных целях',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]2.11.[/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'целенаправленное затягивание рп процесса',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.12.[/COLOR] Запрещено целенаправленное затягивание Role Play процесса | Jail 30 минут[/I][/B][/FONT][/CENTER][LIST]<br>" +
            "[*][B][I][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/B][/I][/CENTER][/FONT][/I][/B][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'db',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/I][/B][/FONT][/CENTER][LIST]<br>" +
            "[*][B][I][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/B][/I][/CENTER][/FONT][/I][/B][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" + 
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'rk',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.14.[/COLOR] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/B][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'tk',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'sk',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'pg не актуально',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.17.[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/B][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'mg',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/B][/I][/CENTER][/FONT][/B][/I]<br>" +
            "[*][I][B][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] телефонное общение также является IC чатом.[/B][/I][/CENTER][/FONT][/B][/I]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'dm',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/B][/I][/CENTER][/FONT][/B][/I]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'mass dm',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней[/COLOR][/B][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'обход системы',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.21.[/COLOR] Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней /[/COLOR][COLOR=rgb(255, 0, 0)]PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/B][/I][/CENTER][/FONT][/B][/I]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками;Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;Банк и личные счета предназначены для передачи денежных средств между игроками;Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'читы',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] блокировка за включенный счетчик FPS не выдается.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'скрытие багов',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.23.[/COLOR] Запрещено скрывать от администрации баги системы, а также распространять их игрокам | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'скрытие нарушителей',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.24.[/COLOR] Запрещено скрывать от администрации нарушителей или злоумышленников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'вред репутации проекта',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.25.[/COLOR] Запрещены попытки или действия, которые могут навредить репутации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
         {
	        title: 'вред ресурсам проекта',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.26.[/COLOR] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'распостранение адм инфы',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.27.[/COLOR] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | [COLOR=rgb(255, 0, 0)]PermBan + ЧС проекта[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] команды администрации, видеозаписи и прочее.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'покупка/продажа игровой валюты',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] также запрещен обмен доната на игровые ценности и наоборот;[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] пополнение донат счет любого игрока взамен на игровые ценности;[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] официальная покупка через сайт.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'трансфер имущкой',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.29.[/COLOR] Запрещен трансфер имущества между серверами проекта | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] обменять деньги с одного сервера на другой и так далее.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'ущерб эко',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.30.[/COLOR] Запрещено пытаться нанести ущерб экономике сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'реклама сторонних ресурсов',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'обман администрации',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][I][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/B][/I][/CENTER][/FONT][/B][/I]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт с которого совершен обман, так и на все аккаунты нарушителя. | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'запрещено пользоваться уязвимостью правил',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.33.[/COLOR] Запрещено пользоваться уязвимостью правил | [COLOR=rgb(255, 0, 0)]Ban 15 дней[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'уход от наказания',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.34.[/COLOR] Запрещен уход от наказания | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] выход игрока из игры не является уходом от наказания.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'реклама сторонних ресурсов',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | [COLOR=rgb(255, 0, 0)]Ban 7 дней / PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'конфликты в ic/ooc',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'перенос конфликтов из ic в ooc и наоборот',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.36.[/COLOR] Запрещено переносить конфликты из IC в OOC и наоборот | [COLOR=rgb(255, 0, 0)]Warn[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] все межфракционные конфликты решаются главными следящими администраторами.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'ooc угрозы',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]2.37.[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'распространение личной информации игрока',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.38.[/COLOR] Запрещено распространять личную информацию игроков и их родственников | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] личное предоставление данной информации, разрешение на распространение от владельца.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'злоупотребление наказаниями',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.39.[/COLOR] Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 30 дней[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'оск проекта',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'продан/передан/взломан',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.41.[/COLOR] Передача своего личного игрового аккаунта третьим лицам | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'попытка покупки/продажи игровой валюты',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.42.[/COLOR] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'продажа/обмен/покупка промокода',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.43.[/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [COLOR=rgb(255, 0, 0)]Mute 120 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'езда по полям(легковой тс)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.46.[/COLOR] Запрещено ездить по полям на любом транспорте | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'езда по полям(грузовой тс)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]Одобрено.[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'покупка семейного рейтинга/скрытие нарушителей',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.48.[/COLOR] Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | [COLOR=rgb(255, 0, 0)]Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] сокрытие информации о продаже репутации семьи приравнивается к пункту правил 2.24.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'многократная покупка/продажа семейной репутации',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.49.[/COLOR] Многократная продажа или покупка репутации семьи любыми способами. | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan + удаление семьи[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'задержание в интерьере',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'вмешательство в рп процесс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.51.[/COLOR] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нрп аксессуар',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нецензурное название бизнеса',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.53.[/COLOR] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [COLOR=rgb(255, 0, 0)]Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] названия семей, бизнесов, компаний и т.д.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'неуважение к администрации',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][I][FONT=verdana][COLOR=rgb(255, 0, 0)]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут[/COLOR][/FONT][/I][/CENTER][LIST]<br>" +
            "[*][FONT=verdana][I][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [COLOR=rgb(255, 0, 0)]Mute 180 минут[/COLOR].[/I][/CENTER][/I][/FONT][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'сбив анимации',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.55.[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 60 / 120 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][CENTER][I][FONT=verdana][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [COLOR=rgb(255, 0, 0)]Jail[/COLOR] на [COLOR=rgb(255, 0, 0)]120 минут[/COLOR]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/I][/FONT][/I][/CENTER]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [COLOR=rgb(255, 0, 0)]Jail[/COLOR] на [COLOR=rgb(255, 0, 0)]60 минут[/COLOR].[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'тиминг в мертвой руке',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][B][COLOR=rgb(255, 0, 0)]2.56.[/COLOR] Запрещается объединение в команду между убийцей и выжившим на мини-игре Мертвая рука | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/B][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][B][FONT=verdana][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] правило действует только на время Хэллоуинского ивента.[/I][/B][/CENTER][/FONT][/B][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" + 
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'невозврат долга',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. | [COLOR=rgb(255, 0, 0)]Ban 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'фек',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/I][/CENTER][/FONT][/I]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
            title: '_____________________________________________игровые чаты_____________________________________________',
        },
        {
	        title: 'общ на казахском к сожал не актуально',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.01. [/COLOR]Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [COLOR=rgb(255, 0, 0)]Устное замечание / Mute 30 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'капсс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'оск в ooc',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'оск/упом родни',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] термины MQ, rnq расценивается, как упоминание родных.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'flood',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'злоупотребление символами',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'оскорбление',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.07.[/COLOR] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'слив',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'угрозы наказания со стороны администрации',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.09.[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'выдача себя за администратора',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'ввод в заблуждение путем злоупотреблением команд',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'музыка в войс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.14.[/COLOR] Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
         {
	        title: 'оск/упом родни в войс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.15.[/COLOR] Запрещено оскорблять игроков или родных в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'шум в войс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'реклама в войс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.17.[/COLOR] Запрещена реклама в Voice Chat не связанная с игровым процессом | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'политический/религиозный розжиг',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'софт для изменения голоса',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.19.[/COLOR] Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'транслит',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.20.[/COLOR] Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'реклама промо',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней[/COLOR][/I][/FONT][/CENTER][LIST]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/I][/CENTER][/FONT][/I]<br>" +
            "[*][I][FONT=verdana][CENTER][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/I][/CENTER][/FONT][/I][/LIST]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'обьявления в помещениях госс организаций',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][I][COLOR=rgb(255, 0, 0)]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'мат в вип чат',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан по следующему пункту регламента:<br>" +
            "[CENTER][FONT=verdana][B][I][COLOR=rgb(255, 0, 0)]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: '_____________________________________________правила госс/опг_____________________________________________'
        },
        {
	        title: 'нарушение правил редактирование обьявлений',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан и получит [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/COLOR]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'редактирование обьявлений в личных целях',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан и получит [COLOR=rgb(255, 0, 0)]Ban 7 дней и чс организации.[/COLOR]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нрп коп',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан и получит [COLOR=rgb(255, 0, 0)]Jail 30 минут/Warn.[/COLOR]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нрп в/Ч(опг)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан и получит [COLOR=rgb(255, 0, 0)]Warn.[/COLOR]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'нрп в/ч(гражданский)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I][B]Игрок будет наказан и получит [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/COLOR]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: '__________________________________передача/перенаправление жалоб__________________________________'
        },
        {
	        title: 'перенести самостоятельно',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=tahoma][I][B][COLOR=rgb(41, 105, 176)]Переношу вашу тему в нужный раздел[/COLOR][/B][/I]<br>" +
            "[B][I][COLOR=rgb(41, 105, 176)]Ожидайте ответа администрации...[/COLOR][/I][/B][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OJIDANIE_PREFIX,
            status: false,
        },
        {
	        title: 'обратитесь в жалобы на лидеров',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Обратитесь в раздел жалобы на лидеров -> <br>" +
            "[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/CENTER]" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	        title: 'обратитесь в жалобы на администрацию',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Обратитесь в раздел жалобы на администрацию -><br>" +
            "[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/CENTER]" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	        title: 'передать куратору',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Передаю вашу жалобу Куратору Администрации.<br>" +
            "Ожидайте вынесения вердикта.<br>" +
            "[COLOR=rgb(243, 121, 52)][FONT=times new roman]На рассмотрении...[/FONT][/COLOR][/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
	        title: 'передать главному админу',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Передаю вашу жалобу Главному Администратору.<br>" +
            "Ожидайте вынесения вердикта.<br>" +
            "[COLOR=rgb(243, 121, 52)][FONT=times new roman]На рассмотрении...[/FONT][/COLOR][/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: GLAVNOMYADMINY_PREFIX,
            status: false,
        },
        {
	        title: 'передать специальнному администратору',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Передаю вашу жалобу Специальному администратору.<br>" +
            "Ожидайте вынесения вердикта.<br>" +
            "[COLOR=rgb(243, 121, 52)][FONT=times new roman]На рассмотрении...[/FONT][/COLOR][/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: SPECADMINY_PREFIX,
            status: false,
        },
        {
	        title: 'передать техническому специалисту',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Передаю вашу жалобу Техническому Специалисту.<br>" +
            "Ожидайте вынесения вердикта.<br>" +
            "[COLOR=rgb(243, 121, 52)][FONT=times new roman]На рассмотрении...[/FONT][/COLOR][/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: TEXSPECY_PREFIX,
            status: false,
        },
        {
            title: 'обратитесь в раздел жалобы на сотрудников',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Обратитесь в раздел Жалобы на сотрудников [B]вашей фракции[/B].[/I][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	        title: '__________________________________________причины отказов__________________________________________'
        },
        {
	        title: 'нарушений игрока нет',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Не вижу нарушений со стороны игрока.<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'недостаточно доказательств',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Недостаточно доказательств для рассмотрения вашей жалобы.<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'ответ был дан в прошлой жалобе',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Ответ был дан в прошлой жалобе.<br>Прозьба не создавать повторные темы,иначе ваш форумный аккаунт может быть [COLOR=rgb(255, 0, 0)]заблокирован.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'доказательства с соц сетей',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Доказательства с социальных сетей не принимаются.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'жалоба не по форме',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Ваша жалоба составлена не по форме.<br>Убедительно прошу ознакомиться с правилами подачи жалоб.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отствует /time',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Отсутствует /time.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿ [/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'требуются таймкоды',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Если ваше доказательство длится более 3-х минут - вы должны указать таймкоды.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'более 72 часов',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]С момента нарушения прошло более 72 часов.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'нету условий сделки',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Отсутствуют условия сделки.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'нужен фрапс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Нужен фрапс.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'нужен фрапс+промотка чата',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Нужен фрапс+промотка чата.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'нужна промотка чата',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Нужна промотка чата.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'неполный фрапс',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Запись обрывается.<br>Загрузите на YouTube полную запись.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отсутствуют/не работают доказательства',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]В вашей жалобе отсутствуют/не работают доказательства.<br>Рассмотрению не подлежит.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'доказательства отредактированы',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Ваши докозательства отредоктированы.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'от 3 лица',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Жалобы от 3-их лиц не принимаются.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'плохое качество',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Ваши доказательства имеют плохое качество.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'не логируется',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Данный проступок не доказать с помощью логов.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'нарушение есть, но украдено мало',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Факт нарушения есть, но украдено очень мало.[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'игрок уже наказан',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][I]Игрок уже наказан[/COLOR]<br>" +
            "[COLOR=rgb(255, 0, 0)]✿❯──── ❖ Закрыто」────❮✿[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
     title: '__________________________________________рп биографии__________________________________________',
        },
        {
	        title: 'одобрено',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]✿❯────「Одобрено ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'на дополнение',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Вам даётся 24 часа на дополнение вашей РП биографии.[/I][/CENTER]<br>" +
            "[CENTER][FONT=tahoma][I][COLOR=rgb(243, 121, 52)]На рассмотрении...[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
	        title: 'не дополненил',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Вы не дополнили рп боиграфию за данные вам 24 часа.[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Причиной могло послужить не соответствие правил создания РП биографий [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ(не по форме)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Биография не по форме [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ(3 лицо)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Причина; биография от 3 лица[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ(грамматические ошибки)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] В вашей биографии большое кол-во грамматических либо орфографических ошибок [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ(несовпадение возвраста и даты рождения)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Возраст не совпадает с датой рождения [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ(мало информации)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] В вашей биографии мало информации про вас[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	        title: 'отказ(копипаст)',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Ваша биография скопирована [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'БИО нету 18-ти лет',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Вашему персонажу должно быть минимум 18 лет [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'Био отказ(3е лицо)',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER][/FONT]" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
             prefix: OTKAZANO_PREFIX,
             status: false,
    },
    {
            title: 'Био отказ Загол Темы',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[Color=rgb(255, 0, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I]Ваша РП биография получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0, 0)]✿❯────「Отказано ❖ Закрыто」────❮✿[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][I] Заголовок не по форме [/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cHkjHNMq/SGgJ.gif[/img][/url][/CENTER]",
             prefix: OTKAZANO_PREFIX,
             status: false,
    },
        {
            title: '__________________________________________рп ситуации_______________________________________________',
        },
        {
	        title: 'одобрено',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП ситуация получает статус:[/I][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(0, 238, 0)]Одобрено.[/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	        title: 'на доработку',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Вам даётся 24 часа на дополнение вашей РП ситуации.[/I][/CENTER]<br>" +
            "[CENTER][FONT=tahoma][I][COLOR=rgb(243, 121, 52)]На рассмотрении...[/COLOR][/I][/FONT][/CENTER]<br>" +
            "[CENTER][B][B][I][COLOR=rgb(255, 0 , 0)]Приятной игры на Black Russia ![/COLOR][/I][/B][/B][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
	        title: 'отказано',
	        content:
	        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП ситуация получает статус: Отказано.<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: '_______________________________________неофициальные организации_______________________________________',
        },
        {
            title: 'одобрено',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша неофициальная организация получает статус: Одобрено.[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
            title: 'на доработку',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Вам даётся 24 часа на дополнение вашей неофициальной организации.[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
            title: 'отказано',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша неофициальная организация получает статус: Отказано.<br>Причиной отказа могло послужить какое-либо нарушение из Правила создания неофициальной организации.[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'запрос активности',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша неофициальная организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
            title: 'закрытие активности',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
           '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
           "[CENTER][I]Активность небыла предоставлена. Организация закрыта.[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'не по форме',
            content:
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXMmTGS8/49224-CE2-6-B89-42-F1-8-B9-D-248-F3970945-F.gif[/img][/url][/CENTER]" +
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][I]Ваша РП ситуация получает статус: Отказано.<br>Заявление подано не по форме[/I][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qMT2jR1n/4882-emo.gif[/img][/url][/CENTER]",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#spec').click(() => editThreadData(SPEC_PREFIX, true));

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
const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button4 = buttonConfig("RP Biography", "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.2606/");

    bgButtons.append(Button4);

    const Button5 = buttonConfig("RP Situation", "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.2605/");

    bgButtons.append(Button5);

    const Button6 = buttonConfig("RP Organization", "https://forum.blackrussia.online/forums/%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2603/");

    bgButtons.append(Button6);