// ==UserScript==
// @name         KURSK | Скрипт для Логистов
// @namespace    https://openuserjs.org/users/King73
// @version      full
// @description  Na nebesax
// @author       tankov, mad kid dorabotal

// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn-icons-png.flaticon.com/512/5584/5584136.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563134/KURSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%B3%D0%B8%D1%81%D1%82%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/563134/KURSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%B3%D0%B8%D1%81%D1%82%D0%BE%D0%B2.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const WATCHING_PREFIX = 2; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const GA_PREFIX = 12;
    const TEX_PREFIX = 13;
    const SPEC_PREFIX = 11;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        {
            title: `свой текст`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            'текст<br><br>' +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',
        },
        {
            title: `На рассмотрение`,
            content:
            '[CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока взята на [COLOR=rgb(251, 160, 38)]рассмотрение.[/COLOR]<br><br>' +

            '[CENTER]Не создавайте новые темы и дождитесь ответа от администратора в данной теме.[/SIZE][/FONT][/CENTER]<br>',

            prefix: WATCHING_PREFIX, PIN_PREFIX,
            status: true,
        },
{
    title: "----------------------------------------------------- Жалобы на игроков (одобрено) -----------------------------------------------------"
},
        {
            title: `NonRP Крыша`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            '[QUOTE][CENTER][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/FONT][/SIZE][/CENTER]<br>' +
            '[LIST][*][LEFT][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/SIZE][/LEFT][/LIST][/QUOTE]<br><br>' +
            '[CENTER][FONT=verdana][Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(158, 28, 0)][B]KURSK[/B][/COLOR].[/SIZE][/FONT][/CENTER]<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Уход от РП`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][B]2.02.[/B][/SIZE][/COLOR][SIZE=4][B] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/B][/SIZE][/B][/CENTER]" +
            "[LIST][*][SIZE=4][FONT=verdana][B][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/B][/B][/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[CENTER][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `NRP вождение`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][B]2.03.[/B][/SIZE][/COLOR][SIZE=4][B] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/B][/SIZE][/B][/CENTER]<br><br>" +
            "[LIST][*][B][B][FONT=verdana][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/SIZE][/FONT][/LIST][/QUOTE]" +
            '<br>[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
         {
            title: `Помеха работягам`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/SIZE]<br><br>" +
            "[LIST][*][SIZE=4][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/B][/CENTER][/QUOTE][/LIST]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `NRP Обман`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4][B]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SIZE][/B]" +
            "[LIST][*][COLOR=rgb(255, 0, 0)][SIZE=4][B]Примечание: [/B][/SIZE][/COLOR][SIZE=4][B]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/B][/SIZE]<br>[*][SIZE=4][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/B][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Аморальные действия`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][B][COLOR=rgb(255, 0, 0)][SIZE=4]2.08.[/SIZE][/COLOR][SIZE=4] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/SIZE][/B]" +
            "[LIST][*][SIZE=4][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] обоюдное согласие обеих сторон.[/B][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Слив склада`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][COLOR=rgb(255, 0, 0)][B][FONT=verdana][SIZE=4]2.09.[/SIZE][/FONT][/B][/COLOR][FONT=verdana][SIZE=4][B] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [/B][/SIZE][/FONT][COLOR=rgb(255, 0, 0)][B][FONT=verdana][SIZE=4]Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/B][/COLOR][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Обман /do`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[CENTER][QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)][B][SIZE=4]2.09.[/SIZE][/B][/COLOR][SIZE=4][B] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [/B][/SIZE][COLOR=rgb(255, 0, 0)][B][SIZE=4]Ban 15 - 30 дней / PermBan[/SIZE][/B][/COLOR][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Фракционное Т/С`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][FONT=verdana][center][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.11. [/COLOR]Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Затягивание рп (/me, /do)`,
            content:
            `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT]<br><br>" +
            "[QUOTE][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.12.[/COLOR] Запрещено целенаправленное затягивание Role Play процесса [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SIZE][/B]<br><br>" +
            "[SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/B][/B][/SIZE][/QUOTE]" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `DB`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4][B]2.13.[/B][/SIZE][/COLOR][SIZE=4][B] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/B][/SIZE]" +
            "[LIST][*][B][SIZE=4][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/B][/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `TK`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][center][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `SK`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][center][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `MG`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][SIZE=4][COLOR=rgb(255, 0, 0)][B]2.18.[/B][/COLOR][B] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/B][COLOR=rgb(255, 0, 0)][B]| Mute 30 минут[/B][/COLOR][/SIZE]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)][B]Примечание:[/B][/COLOR][B] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/B][/SIZE][/B][*][B][SIZE=4][COLOR=rgb(255, 0, 0)][B]Примечание: [/B][/COLOR][B]телефонное общение также является IC чатом.[/B][/SIZE][/B][*][B][SIZE=4][COLOR=rgb(255, 0, 0)][B]Исключение:[/B][/COLOR][B] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/B][/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `DM`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/FONT][/SIZE]" +
            "[LIST][*][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/SIZE][*][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Mass DM`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][FONT=verdana][SIZE=4][B][COLOR=rgb(255, 0, 0)]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней.[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Обход системы, использование багов`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][COLOR=rgb(255, 0, 0)][FONT=verdana][SIZE=4][B]2.21. [/B][/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4][B]Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR] [/B][/SIZE][/FONT]" +
            "[LIST][*][SIZE=4][FONT=verdana][B][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/B][/FONT][/SIZE]" +
            "[*][SIZE=4][FONT=verdana][B][COLOR=rgb(255, 0, 0)]Пример: [/COLOR]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками;" +
            "Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;Банк и личные счета предназначены для передачи денежных средств между игроками;" +
            "Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/B][/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Стороннее ПО`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][SIZE=4][B][FONT=verdana][COLOR=rgb(255, 0, 0)]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR] [/FONT][/B][/SIZE]" +
            "[LIST][*][SIZE=4][FONT=verdana][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры.[/B][/FONT][/SIZE]" +
            "[*][SIZE=4][FONT=verdana][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/B][/FONT][/SIZE]" +
            "[*][SIZE=4][FONT=verdana][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] блокировка за включенный счетчик FPS не выдается.[/B][/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Сокрытие багов`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][SIZE=4][B][FONT=verdana][COLOR=rgb(255, 0, 0)]2.22.[/COLOR] ЗЗапрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR] [/FONT][/B][/SIZE]" +
            "[LIST][*][SIZE=4][FONT=verdana][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] игрок, зная об ошибке, дающей преимущество, при обращении администрации вводит её в заблуждение, чтобы сохранить ошибку в тайне.[/B][/FONT][/SIZE]" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Реклама соц. сетей`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][SIZE=4][B][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan[/COLOR][/B][/SIZE]" +
            "[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/B][/B][/SIZE]" +
            "[*][SIZE=4][B][SIZE=4][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт с которого совершен обман, так и на все аккаунты нарушителя. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/B][/SIZE][/B][/SIZE][/LIST][/QUOTE]" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Обман администрации`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>` +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][/SIZE][/B]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/SIZE][/B]<br>" +
            "[*][B][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. [COLOR=rgb(255, 0, 0)]| Permban[/COLOR][/B][/SIZE]" +
            "[*][B][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта. [COLOR=rgb(255, 0, 0)]| Permban + ЧС Проекта[/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `конфликты национальности или религии`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `OOC угрозы`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.37.[/COLOR] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/SIZE][/B]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Распространение лич. данных`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.38.[/COLOR] Запрещено распространять личную информацию игроков и их родственников [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan + ЧС Проекта[/COLOR][/SIZE][/B]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] распространение личной информации пользователя без его согласия запрещено.[/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Злоупотребление нарушениями`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][SIZE=4][B][COLOR=rgb(255,0 ,0)]2.39.[/COLOR] Злоупотребление нарушениями правил сервера [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][/B][/SIZE]" +
            "[LIST][*][SIZE=4][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил серверов, которые были совершены за прошедшие 7 дней, с момента проверки истории наказаний игрока.[/B][/SIZE]<br>" +
            "[*][SIZE=4][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) не учитываются.[/B][/SIZE]<br>" +
            "[*][SIZE=4][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] пункты правил: 2.54, 3.04 учитываются в качестве злоупотребления нарушениями правил серверов.[/B][/SIZE][/LIST][/QUOTE]<br><br>" +
            "[*][SIZE=4][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/B][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Оск проекта`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][FONT=verdana][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/B][/QUOTE]" +
            '<br>[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `продажа промо`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][B][COLOR=rgb(255, 0, 0)]2.43.[/COLOR] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=rgb(255, 0, 0)]| Mute 120 минут[/COLOR][/B][/QUOTE]" +
            '<br>[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `NRP сон`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][B][COLOR=rgb(255, 0, 0)]2.44.[/COLOR] На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) [COLOR=rgb(255, 0, 0)]| Kick[/COLOR][/B][/SIZE][/CENTER]" +
            "[LIST][*][B][SIZE=4][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] сон разрешается с 23:00 до 6:00 в совершенно любых местах, но только на соответствующих и привычных для этого объектах (скамейки, кровати и так далее).[COLOR=rgb(255, 0, 0)][/COLOR][/B][/SIZE][/B][/LIST]" +
            "[LIST][*][B][SIZE=4][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] сон запрещается в тех местах, где он может оказывать любую помеху другим игрокам сервера.[/B][/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `ЕПП дально/инко`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]" +
            '<br>[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `задержание в интерьере`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][FONT=verdana][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `NRP акс`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][B][COLOR=rgb(255, 0, 0)]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/B][/SIZE][/CENTER]" +
            "[LIST][*][B][SIZE=4][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/B][/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `не уваж отн к администрации`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR][/SIZE][/B]" +
            '[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.[/B][/B][/SIZE][/LIST]<br><br>' +
            "[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/B][/B][/SIZE][/QUOTE][/LIST]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `баг аним`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][COLOR=rgb(255, 0, 0)]2.55.[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/SIZE][/B][/CENTER]" +
            "[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [COLOR=rgb(255, 0, 0)]Jail на 120 минут[/COLOR]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[COLOR=rgb(255, 0, 0)][/COLOR][/B][/B][/SIZE]" +
            "[*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [COLOR=rgb(255, 0, 0)]Jail на 60 минут[/COLOR].[/SIZE][/LIST][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Не вернул долг`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][B]2.57.[/B][/COLOR][B] Запрещается брать в долг игровые ценности и не возвращать их. [/B][COLOR=rgb(255, 0, 0)][B]| Ban 30 дней / permban[/B][/COLOR][/SIZE][/CENTER]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)][B]Примечание:[/B][/COLOR][B] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/B][/SIZE][/B][/LIST]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)][B]Примечание:[/B][/COLOR][B] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/B][/SIZE][/B][/LIST]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)][B]Примечание:[/B][/COLOR][B] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/B][/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `NonRP в\ч`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][FONT=verdana] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=rgb(255, 0, 0)]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/FONT][/SIZE][/CENTER][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: "NRP коп",
            content: "[Center][color=rgb(255, 0, 0)][FONT=verdana][size=4]Здравствуйте.[/center][/size][/color]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][FONT=verdana][color=rgb(255, 0, 0)]6.02.[/color] Запрещено выдавать розыск без Role Play причины [color=rgb(255, 0, 0)]| Warn[/COLOR][/FONT][/SIZE][/CENTER][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `---------------------------------------------------------- жалобы на игроков (чаты) ----------------------------------------------------------`,
        },
        {
            title: `CapsLock`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][FONT=verdana][SIZE=4][B][COLOR=rgb(255, 0, 0)]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/B][/QUOTE]<br>" +
            "[LIST][*][SIZE=4][FONT=verdana][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR]«ПрОдАм», «куплю МАШИНУ».[/B][/B][/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `оск, расизм, религия, сексизм в ООС`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Упом/оск родни`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/B][/CENTER]" +
            '[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] термины "MQ", "rnq" расценивается, как упоминание родных.[/B][/B][/SIZE]' +
            "[*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/B][/B][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `FLOOD`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Злоупотребление знаками`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/FONT][/SIZE][/B][/CENTER]" +
            "[LIST][*][SIZE=4][FONT=verdana][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/B][/B][/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Слив глобал чата`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Выдача себя за администратора`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)]| Ban 7 - 15[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Введение в заблуждение командами`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][B][COLOR=rgb(255, 0, 0)]3.11. [/COLOR]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/SIZE][/CENTER]" +
            "[LIST][*][B][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SIZE][/B][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `капс, оффтоп, оск и т.д. в реп`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]3.12.[/COLOR] Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) [COLOR=rgb(255, 0, 0)]| Report Mute 30 минут[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `музыка в войс`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][color=rgb(255, 0, 0)]3.14.[/color] Запрещено включать музыку в Voice Chat [color=rgb(255, 0, 0)]| Mute 60 минут[/color][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Шум в войс`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/FONT][/SIZE][/B][/CENTER]" +
            "[LIST][*][SIZE=4][FONT=verdana][B][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/B][/B][/FONT][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Политика / религия`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Изменение голоса в войс (прога)`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][color=rgb(255, 0, 0)]3.19.[/color] Запрещено использование любого софта для изменения голоса [color=rgb(255, 0, 0)]| Mute 60 минут[/color][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `транслит`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][COLOR=rgb(255, 0, 0)]3.20.[/COLOR] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/B][/CENTER]" +
            '[LIST][*][SIZE=4][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/SIZE][/LIST][/QUOTE]<br><br>' +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Реклама промо`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][COLOR=rgb(255, 0, 0)]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][/SIZE][/B][/CENTER]" +
            "[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/B][/B][/SIZE]" +
            "[*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/B][/B][/SIZE]" +
            "[*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/B][/B][/SIZE][/LIST][/QUOTE]<br><br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `объявление на госс терртории`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][SIZE=4][COLOR=rgb(255, 0, 0)]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/B][/CENTER]" +
            '[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] в помещении центральной больницы писать в чат: "Продам эксклюзивную шапку дешево!!!"[/B][/B][/SIZE][/LIST][/QUOTE]<br><br>' +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `мат в vip`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][B][FONT=verdana][SIZE=4][COLOR=rgb(255, 0,0 )]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Реклама соц. сетей`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>`+
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][SIZE=4][B][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan[/COLOR][/B][/SIZE][/CENTER]" +
            "[LIST][*][SIZE=4][B][B][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/B][/B][/SIZE]" +
            "[*][SIZE=4][B][SIZE=4][B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт с которого совершен обман, так и на все аккаунты нарушителя. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/B]/SIZE][/B][/SIZE][/LIST][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `НПР СМИ`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][FONT=verdana][SIZE=4][B][COLOR=rgb(255, 0, 0)]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Объявления сми в свою пользу`,
            content:
            "[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)]принята [/COLOR]администрацией сервера. В ближайшее время, [COLOR=rgb(209, 72, 65)]игрок будет наказан согласно пункту правил:[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
            "[QUOTE][CENTER][FONT=verdana][SIZE=4][B][COLOR=rgb(255, 0, 0)]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(255, 0, 0)]| Ban 7 дней + ЧС организации[/COLOR][/B][/QUOTE]<br>" +
            '[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].<br>',

            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `---------------------------------------------------- Передача жалобы другим лицам ----------------------------------------------------`,
            },
        {
            title: `ГА`,
            content: `[CENTER][FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `[QUOTE][SIZE=4]Ваша жалоба на указанного игрока была передана [COLOR=rgb(246, 40, 45)][B]Главному администратору.[/B][/COLOR][/QUOTE]<br>`+
            "В ближайшее время ваша жалоба будет рассмотрена, ожидайте вердикта!<br><br>" +
            "[COLOR=rgb(250, 197, 28)][B]На рассмотрении.[/B][/COLOR]",

            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: `тех`,
            content: `[CENTER][FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `[QUOTE][SIZE=4]Ваша жалоба на указанного игрока была передана [COLOR=rgb(57, 57, 255)][B]Техническому специалисту.[/B][/COLOR][/QUOTE]<br>`+
            "В ближайшее время ваша жалоба будет рассмотрена, ожидайте вердикта!<br><br>" +
            "[COLOR=rgb(250, 197, 28)][B]На рассмотрении.[/B][/COLOR]",

            prefix: TEX_PREFIX,
            status: true,
        },

         {
            title: `--------------------------------------------------------- жалобы на игроков (отказ) ---------------------------------------------------------`,
        },
        {
            title: `недостаточно док-ва`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Недостаток / не полнота доказательств для корректного рассмотрения вашей жалобы.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].[/FONT][/SIZE][/CENTER]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Док-ва не открываются`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Не открываются предоставленные доказательства для рассмотрения вашей жалобы.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].[/FONT][/SIZE][/CENTER]",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Отсуствуют док-ва`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Отсутствие доказательств.<br><br>" +
            "[CENTER][SIZE=4][FONT=verdana]Если у вас они есть то просьба создать новую жалобу, выложить их на фото или видео платформы([URL='https://www.youtube.com/']You[COLOR=rgb(255, 0, 0)]Tube[/COLOR][/URL] или [URL='https://www.imgur.com/']Imgur[/URL]) и прикрепить в новой жалобе.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)]KURSK[/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Док-ва в соц. сетях`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Доказательства в социальной сети.<br><br>" +
            "[CENTER][SIZE=4][FONT=verdana]Просьба создать новую жалобу, выложить их на фото или видео платформы([URL='https://www.youtube.com/']You[COLOR=rgb(255, 0, 0)]Tube[/COLOR][/URL] или [URL='https://www.imgur.com/']Imgur[/URL]) и прикрепить в новой жалобе.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нарушений нет`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Нету нарушений.<br>" +
            '[CENTER][SIZE=4][FONT=verdana]Советуем вам ознакомится с [url="https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/"]"Правилами серверов"[/url].<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет /time`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: На доказательствах нету времени (/time).<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Док-ва отредакт`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Доказательства отредактированы.<br>" +
            "[CENTER][SIZE=4][FONT=verdana]Просьба создать новую жалобу и прекрепить оригинальные доказательства (фото/видео).<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Не по форме`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Жалоба составлена не по форме.<br>" +
            '[CENTER][SIZE=4][FONT=verdana]Просим вас ознакомиться с [url="https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/"]"Правилами подачи жалоб на игроков"[/url].' +
            "<br><br>[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `В ЖБ на адм`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Не правильный раздел.<br><br>" +
            '[CENTER][SIZE=4][FONT=verdana]Подайте жалобу в раздел [url="https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/"]"Жалобы на администрацию"[/url]<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `В ЖБ на лд`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Не правильный раздел.<br><br>" +
            '[CENTER][SIZE=4][FONT=verdana]Подайте жалобу в раздел [url="https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2457/"]"Жалобы на Лидеров"[/url]<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `В Обжалование`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Не правильный раздел.<br><br>" +
            '[CENTER][SIZE=4][FONT=verdana]Оставьте обжалование в раздел [url="https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2459/"]"Обжалование наказаний"[/url]<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `В ЖБ на техов`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Не правильный раздел.<br><br>" +
            '[CENTER][SIZE=4][FONT=verdana]Подайте жалобу в раздел [url="https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9655-kursk.2429/"]"Жалобы на технических специалистов"[/url]<br><br>' +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет нарушений в логах`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: В данный момент не можем подтвердить нарушение со стороны игрока.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `/report - 1`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            `[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Вам нужно было написать администрации сервера (/report - 1) о вашей проблеме.<br><br>`+
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `док-ва от 3 лица`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: <br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Прошло 72 часа`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: С момента нарушения игрока прошло более 72-х часов.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет таймкодов`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Не кликабельно док-ва`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Доказательства не кликабельно<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нету доступа к док-вам`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Нету доступа к доказательствам.<br><br>" +
            "[CENTER][SIZE=4][FONT=verdana]Просьба создать новую жалобу, выложить их на фото или видео платформы([URL='https://www.youtube.com/']You[COLOR=rgb(255, 0, 0)]Tube[/COLOR][/URL] или [URL='https://www.imgur.com/']Imgur[/URL]) и прикрепить в новой жалобе.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Дубликат`,
            content: `[CENTER][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]Здравствуйте.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>`+
            `[QUOTE][CENTER][FONT=verdana][SIZE=4]Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][U]отклонена[/U][/COLOR] администрацией сервера.[/SIZE][/FONT][/CENTER][/QUOTE]<br><br>`+
            "[CENTER][SIZE=4][FONT=verdana]Причина отклонения жалобы на игрока: Дубликат жалобы один и более раз.<br><br>" +
            "[Center][SIZE=4][FONT=verdana]Благодарим вас за обращение. Приятной игры на сервере [COLOR=rgb(184, 49, 47)][B]KURSK[/B][/COLOR].",

            prefix: UNACCEPT_PREFIX,
            status: false,
        },
           ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
       addButton(`На рассмотрение`, `pin`)
       $("button#pin").css("background-color", "#3A3B3C");
        $("button#pin").css("border", "2px solid #eeff01")
        $("button#pin").css("border-radius", "15px")
        addButton(`Одобрено`, `accepted`);
        $("button#accepted").css("background-color", "#3A3B3C");
        $("button#accepted").css("border", "2px solid #4AA02C")
        $("button#accepted").css("border-radius", "15px")
        addButton(`Отказано`, `unaccept`);
        $("button#unaccept").css("background-color", "#3A3B3C");
        $("button#unaccept").css("border", "2px solid #E42217")
        $("button#unaccept").css("border-radius", "15px")
        addButton(`Ответы`, `selectAnswer`);
       $("button#pin, button#accepted, button#unaccept").css("margin-right", "5px");

       /*$("body").css("background-image", "url('https://i.artfile.ru/1920x1280_1076217_[www.ArtFile.ru].jpg')");
       $("body").css("background-size", "100%");
       $("body").css("background-repeat", "no-repeat");
       $("body").css("background-attachment", "fixed");
       $("div .p-body-pageContent").css("opacity", "0.6");*/


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
       $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id != 0 && id != 100) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));}
                 else {
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
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/spreadsheets/d/13ADEJLnL4Y9JVhQFX6U0Kirt9gKf93LfjPADw9wfldQ/edit#gid=1928965921
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/test.6402380/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();