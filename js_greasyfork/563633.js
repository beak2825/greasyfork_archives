// ==UserScript==
// @name         Для кураторов форума N. Novgorod
// @namespace    http://tampermonkey.net/
// @version      0.1beta
// @description  Скрипт для облегчения работы кураторов форума. Связь с разработчиком: https://vk.com/gold_chell
// @author       Ярослав Голдчелл || Jarik_Goldchell
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563633/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20N%20Novgorod.user.js
// @updateURL https://update.greasyfork.org/scripts/563633/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20N%20Novgorod.meta.js
// ==/UserScript==
//Жалобы на игроков
(function() {
  'use strict';
const UNACCEPT_PREFIX = 4; //Префикс Отказано
const ACCEPT_PREFIX = 8; //Префикс Одобрено
const RASSMOTENO_PREFIX = 9; //Префикс Рассмотрено
const VAJNO_PREFIX = 1; //Префикс Важно
const PIN_PREFIX = 2; //Префикс На рассмотрении
const GA_PREFIX = 12; //Префикс Главному администратору
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14; //Префикс Ожидание
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; //Префикс Закрыто
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13; //Префикс Тех. Специалисту
const buttons = [
    {
        title: 'Свой ответ (Отказано)',
        content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
        title: 'На рассмотрение',
        content:
            "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
            "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
            "[B][COLOR=YELLOW][FONT=georgia]Ваша жалоба взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
            "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
            "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
    },
    {
        title: 'Перенос темы в другой раздел',
        content:
        "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваша жалоба была отправлена не в тот раздел. Переношу ее в нужный. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
        "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
        "[B][COLOR=#808080][FONT=georgia][ICODE]Ожидайте.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    },
    {
        title: 'Передать теху',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша жалоба была передана на рассмотрение техническим специалистом. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#808080][FONT=georgia][ICODE]Ожидайте.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: TEX_PREFIX,
        status: true,
    },
    {
        title: 'Передать ГА',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша жалоба была передана на рассмотрение главным администратором. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#808080][FONT=georgia][ICODE]Ожидайте.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: GA_PREFIX,
        status: true,
    },
    {
        title: 'Укажите тайм-коды',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]В вашей жалобе доказательства длятся дольше 3 минут, предоставьте тайм-коды. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидаем, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: PIN_PREFIX,
        status: 123,
    },
    {
        title: 'Доказательства владелец фам',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]В вашей жалобе нету доказательств, что вы владелец семьи. Для наказания по этому пункту правил, надо доказать, что вы владелец семьи. Прикрепите доказательства сообщением ниже. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидаем, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: PIN_PREFIX,
        status: 123,
    },
    {
        title: '----------------Правила Игрового Процесса----------------',
    },
    {
        title: 'Нон рп поведение [2.01]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/COLOR][/B]<br><br>" +
    '[B][COLOR=RED]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=RED]Jail 30 минут [/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание[/COLOR]: ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/FONT][/B]<br><br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Уход от рп [2.02]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=RED]Jail 30 минут / Warn[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание:[/COLOR]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
       prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Нон рп езда [2.03]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.03.[/COLOR]Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[COLOR=RED]| Jail 30 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание:[/COLOR] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Помеха работе [2.04]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.04.[/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=RED]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример:[/COLOR] таран дальнобойщиков, инкассаторов под разными предлогами.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'OOC обман/попытка [2.05]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.05. [/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=RED]| Permban[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Аморал [2.08]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.08. [/COLOR]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=RED]| Jail 30 минут / Warn[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]обоюдное согласие обоих сторон.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Слив склада [2.09]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.09. [/COLOR]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Использование фрак тачки в лц[2.11]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.11. [/COLOR]Запрещено использование рабочего или фракционного транспорта в личных целях[COLOR=RED]| Jail 30 минут[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'DB [2.13]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.13. [/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=RED]| Jail 60 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'TK [2.15]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.15. [/COLOR]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=RED]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'SK [2.16]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[COLOR=RED]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'MG [2.18]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.18. [/COLOR]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=RED]| Mute 30 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]телефонное общение также является IC чатом.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'DM [2.19]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.19. [/COLOR]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=RED]| Jail 60 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Mass DM [2.20]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[COLOR=RED]| Warn / Ban 3 - 7 дней[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Обход системы [2.21]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[COLOR=RED]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками; Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; Банк и личные счета предназначены для передачи денежных средств между игроками; Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Читы [2.22]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.22. [/COLOR]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]запрещено внесение любых изменений в оригинальные файлы игры.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]блокировка за включенный счетчик FPS не выдается.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Реклама [2.31]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.31. [/COLOR]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [COLOR=RED]| Ban 7 дней / PermBan[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Полит/религ конфликт [2.35]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.35. [/COLOR]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[COLOR=RED]| Mute 120 минут / Ban 7 дней[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Оск проекта [2.40]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.40. [/COLOR]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[COLOR=RED] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'ЕПП фура [2.47]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.47. [/COLOR]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[COLOR=RED]| Jail 60 минут[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Задержание в интерьере [2.50]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.50. [/COLOR]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=RED]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нон рп акс [2.52]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.52. [/COLOR]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=RED]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Оск адм [2.54]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.54. [/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[COLOR=RED]| Mute 180 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов [COLOR=RED]Mute 180 минут.[/COLOR][/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Сбив аним/стрельбы [2.55]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]2.55. [/COLOR]Запрещается багоюз, связанный с анимацией в любых проявлениях. [COLOR=RED]| Jail 120 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: '--------------------Организации--------------------'
    },
    {
        title: 'Нон рп вч [ВЧ 2]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Правила нападения на воинскую часть. 2 пункт. [/COLOR]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[COLOR=RED]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/FONT][/B]<br><br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Работа в форме Госс [1.07]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Общие правила государственных организаций. 1.07. [/COLOR]Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=RED]| Jail 30 минут[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'БУ/Казино в форме Госс [1.13]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Общие правила государственных организаций. 1.13. [/COLOR]Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота [COLOR=RED]| Jail 30 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]Семейные активности — захват семейного контейнера, битва за территорию, битва семей[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]за участие в семейных активностях в форме организации, игроку по решению администрации может быть выдано предупреждение [COLOR=RED]| Warn[/COLOR][/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Арест на тт опг [1.16]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Общие правила государственных организаций. 1.16. [/COLOR]Игроки, состоящие в силовых структурах, не имеют права находиться и открывать огонь на территории ОПГ с целью поимки или ареста преступника вне проведения облавы [COLOR=RED]| Warn[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]территория ОПГ — это место, где находятся автопарк криминальной организации и её штаб со складом.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нон рп адво [3.01]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Общие правила государственных организаций. 3.01. [/COLOR]Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий[COLOR=RED]| Warn[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нарушение правил редактирования обьявлений [4.01]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Общие правила государственных организаций. 4.01. [/COLOR]Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=RED]| Mute 30 Минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]игрок отправил одно слово, а редактор вставил полноценное объявление[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Слив СМИ 1 раз [4.04]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]Общие правила государственных организаций. 4.04. [/COLOR]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=RED]| Ban 7 дней + ЧС организации[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нон рп коп',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B]Запрещено неподобающее логике и RolePlay процессу поведение сотрудника силовых структур, а также применение своих полномочий без причины. [COLOR=RED]| Warn[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]Сотрудник ГИБДД начинает просто так выдавать розыск, забирать права или выдавать штрафы. [/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: '--------------------Игровые Чаты--------------------',
    },
    {
        title: 'Caps [3.02]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.02. [/COLOR]Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [COLOR=RED]| Mute 30 минут.[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]"ПрОдАм", "куплю МАШИНУ".[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Оск в ООС [3.03]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=RED]| Mute 30 минут[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Оск род [3.04]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.04. [/COLOR]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]термины "MQ", "rnq" расценивается, как упоминание родных.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Флуд [3.05]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[COLOR=RED]| Mute 30 минут[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Злоупотебление знаками [3.06]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.06. [/COLOR]Запрещено злоупотребление знаков препинания и прочих символов[COLOR=RED]| Mute 30 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Слив глоб. чатов [3.08]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов. [COLOR=RED]| PermBan[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]Сотрудник СМИ заменяет текст объявления на себе выгодный в больших количествах. [/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Выдача за адм [3.10]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.10. [/COLOR]Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=RED]| Ban 7 - 15 дней.[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Ввод в заблуждение [3.11]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.11. [/COLOR]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Полит/религ оск [3.18]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.18. [/COLOR]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=RED]| Mute 120 минут / Ban 10 дней[/COLOR][/COLOR][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Транслит [3.20]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.20. [/COLOR]Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]«Privet», «Kak dela», «Narmalna».[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Реклама промо [3.21]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=RED]| Ban 30 дней[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Примечание: [/COLOR]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Исключение: [/COLOR]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Мат в вип чат [3.23]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]3.23. [/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=RED]| Mute 30 минут[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: '--------------------Игровые аккаунты--------------------',
    },
    {
        title: 'Оск ник [4.09]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]4.09. [/COLOR]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе завуалированные), а также слова политической или религиозной направленности.[COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Фейк [4.10]',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба одобрена. Игрок будет наказан по данному пункту правил:[/B]<br><br>" +
    '[B][COLOR=RED]4.10. [/COLOR]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/B]<br>' +
    '[B][SPOILER][COLOR=RED]Пример: [/COLOR]подменять букву i на L и так далее, по аналогии.[/SPOILER][/FONT][/B]<br>' +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: '-------------------------Отказ-------------------------',
    },
    {
        title: 'Не по форме',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Не по форме.[/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нету доказательств',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Нету доказательств или они не действительны. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Доказательства не работают',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Доказательства не работают или они недействительны. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нету /time',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Нету /time.[/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Недостаточно доказательств',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Данных доказательств недостаточно для выдачи наказания. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нужен фрапс',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Для выдачи данного наказания надо иметь видеофиксацию нарушений (фрапс). [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Не логируется',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: В данном случае нужна видеозапись, так как данный чат не логируется.[/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нарушений не найдено',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: На предоставленных доказательствах нарушений не найдено. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Закрыт доступ к доказательствам',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Доступ к вашим доказательствам закрыт. Откройте доступ глобально или по ссылке. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Не указал тайм-коды',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: За 24 часа не были указаны тайм-коды нарушений. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Не доказал, что владелец',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Не прикрепили доказательства, что вы являетесь лидером семьи. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Нету условий',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Нету условий сделки. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Не согласился с условиями',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Игрок не согласился из поставленными условиями. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Соц сети',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Нельзя загружать доказательства в социальные сети по типу: VK, Instagram. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Доказательства отредактированы',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: Запрещено редактировать доказательства в свою пользу и для подделки нарушений игрока. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Прошло 72 часа',
        content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша жалоба отказана. Причина: С момента нарушения прошло 72 часа. [/FONT][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=RED][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    ];
$(document).ready(() => {
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
  addButton('ЖБ на игроков', 'selectAnswer');
const threadData = getThreadData();
$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Жалобы на игроков. Выберите ответ');
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
          `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
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
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty()
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
//РП Био

(function() {
    'use strict';
const BIOUNACCEPT_PREFIX = 4;
const BIOACCEPT_PREFIX = 8;
const BIOPIN_PREFIX = 2;
const buttons2 = [
{
     title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
     title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
     title: 'Одобрено',
    content:
    "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img] <br> <br>" +
    "[B][COLOR=WHITE][FONT=georgia]Ваша RolePlay биография проверена. Выношу свой вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/COLOR][/B]<br><br>" +
    "[img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img] <br> <br>" +
    "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOACCEPT_PREFIX,
    status: false,
},
{
     title: 'На доработку',
    content:
    "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография проверена. Выношу свой вердикт - [COLOR=#00FF00]Биография требует доработки (меньше 200 слов), вам дается 24 часа на ее дополнение.[/COLOR][/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидаем, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOPIN_PREFIX,
    status: 123,
},
{
      title: 'Отказ',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Нарушение Правил написания RP биографий[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
       title: 'Отказ (заголовок)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Заголовок написан не по форме.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
  title: 'Отказ (пг)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено приписывать персонажу сверхспособности или вещи которые разрешают нарушать какое либо правило сервера. Пример: Сбежал из психушки и начал убивать людей.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (Существующая знаменитость)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено называть персонажа именем какого-то существующего известного человека.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (плагиат)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Запрещено использовать РП биографии других людей[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (орфограф. ошибки)',
    content:
   "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Биография должна быть читабельна и не содержать грамматических или орфографических ошибок.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (Шрифт, размер)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Шрифт биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Отказ (отсутствие фото, иных материалов)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: В биографии должны присутствовать фотографии и иные материалы, относящиеся к истории вашего персонажа.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
   title: 'Отказ (не дополнил)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Не дополнил(а) биографию за 24 часа[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
     title: 'Отказ (логика)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: В биографии не должно быть логических противоречий.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
      title: 'Отказ (Оффтоп)',
    content:
    "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваше обращение никак не относится к сути данного раздела. [/COLOR][/B]" +
        "[COLOR=#FF0000][B]Закрыто.[/FONT][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: BIOUNACCEPT_PREFIX,
      status: false,
},
    {
    title: 'На рассмотрение',
    content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOPIN_PREFIX,
    status: 123,
    },
    {
    title: 'Отказ (Не по форме)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Ваша биография заполнена не по форме или расписаны не все пункты.[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
{
       title: 'Отказ (<200 слов, >600)',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR][/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.13425782/']Правилами написания RolePlay Биографий[/URL].[/FONT][/COLOR][/B]<br>" +
      "[B][COLOR=YELLOW][FONT=georgia]Причина отказа: Минимальный объём RP биографии — 200 слов, максимальный — 600..[/FONT][/COLOR][/B]<br><br>" +
    "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
   "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: BIOUNACCEPT_PREFIX,
    status: false,
},
    {
        title: 'Закрыть принудительно',
        content: "", //пусто
        prefix: BIOUNACCEPT_PREFIX,
        status: false,
    },
];

    $(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('РП биографии', 'selectAnswer2');

	const threadData = getThreadData();


$(`button#selectAnswer2`).click(() => {
XF.alert(buttonsMarkup(buttons2), null, 'РП биографии. Выберите ответ');
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
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

//-----------------------------------------------------------------------------------------------------------------
//-------------------------------------------РП Ситуации-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
const SITAUNACCEPT_PREFIX = 4;
const SITAACCEPT_PREFIX = 8;
const SITAPIN_PREFIX = 2;
const buttons3 = [
  {
   title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
    {
        title: 'Одобрена',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша РП ситуация получает статус - [/COLOR][/B]" +
       "[COLOR=#00FF00][B]Одобрено.[/B][/COLOR] [FONT=georgia]Приятной игры и времяпровождения.[/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'На доработку',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia] Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - Отказано. [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FFA500][FONT=georgia][ICODE]На доработке[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAPIN_PREFIX,
        status: false,
    },
    {
        title: 'Отказ',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша РП ситуация получает статус - [/COLOR][/B]" +
       "[COLOR=#FF0000][B]Отказано.[/B][/COLOR][/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: SITAUNACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'Отказ (оффтоп)',
      content:
      "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваше обращение никак не относится к сути данного раздела. [/COLOR][/B]" +
        "[COLOR=#FF0000][B]Закрыто.[/FONT][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: SITAUNACCEPT_PREFIX,
      status: false,
    },
    {
    title: 'На рассмотрение',
    content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша RolePlay ситуация взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: SITAPIN_PREFIX,
    status: 123,
    },
    {
        title: 'Принудительно закрыть',
        content: "",
        prefix: SITAPIN_PREFIX,
        status: 123,
    },
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('РП ситуации', 'selectAnswer3');

	const threadData = getThreadData();


$(`button#selectAnswer3`).click(() => {
XF.alert(buttonsMarkup(buttons3), null, 'РП ситуации. Выберите ответ');
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
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

//-----------------------------------------------------------------------------------------------------------------
//--------------------------Неофициальные RP организации-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
const NEOFUNACCEPT_PREFIX = 4;
const NEOFACCEPT_PREFIX = 8;
const NEOFPIN_PREFIX = 2;
const buttons4 = [
  {
    title: 'Свой ответ (Отказано)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#bf0202][FONT=georgia][ICODE]Отказано, закрыто.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
   title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE][FONT=georgia]{{ greeting }}, уважаемый[/FONT][/COLOR][COLOR=#ffff00] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url][/COLOR] <br><br>" +
       '[B][COLOR=#00ff00][FONT=georgia][ICODE]Закрыто, одобрено.[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Одобрена',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша Неофициальная РП организация получает статус - [/COLOR][/B]" +
       "[COLOR=#00FF00][B]Одобрено.[/B][/COLOR] [FONT=georgia]Приятной игры и времяпровождения.[/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: NEOFACCEPT_PREFIX,
        status: false,
},
{
    title: 'На доработку',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia] Вам даётся 24 часа на дополнение вашей Неофициальной РП организации, в противном случае она получит статус - Отказано. [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FFA500][FONT=georgia][ICODE]На доработке[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: NEOFPIN_PREFIX,
        status: false,
},
{
    title: 'Отказ',
        content:
        "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=YELLOW][FONT=georgia]Ваша Неофициальная РП организация получает статус - [/COLOR][/B]" +
       "[COLOR=#FF0000][B]Отказано.[/B][/COLOR][/FONT] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL][/COLOR] <br><br>" +
       "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: NEOFUNACCEPT_PREFIX,
        status: false,
},
{
   title: 'Отказ (оффтоп)',
      content:
      "[CENTER][B][COLOR=#40E0D0]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
        "[B][COLOR=YELLOW][FONT=georgia]Ваше обращение никак не относится к сути данного раздела. [/COLOR][/B]" +
        "[COLOR=#FF0000][B]Закрыто.[/FONT][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/IMG][/URL] <br> <br>" +
      "[B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
      prefix: NEOFUNACCEPT_PREFIX,
      status: false,
},
    {
    title: 'На рассмотрение',
    content:
    "[CENTER][B][COLOR=#40E0D0][FONT=georgia]{{ greeting }}, уважаемый[/COLOR][COLOR=#FFA500] [ICODE]{{ user.name }}[/ICODE][/FONT][/COLOR][/B] <br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=YELLOW][FONT=georgia]Ваша Неофициальная RolePlay организация взята на рассмотрение. Ожидайте вердикта.[/FONT][/COLOR][/B]<br><br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/50TR78gy/1619558447629-2.png[/img][/url] <br> <br>" +
    "[B][COLOR=#FFA500][FONT=georgia][ICODE]Ожидайте, на рассмотрение.[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: NEOFPIN_PREFIX,
    status: 123,
    },
    {
    title: 'Принудительно закрыть',
    content: "",
    prefix: NEOFUNACCEPT_PREFIX,
    status: false,
    }
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('Неоф. RP организации', 'selectAnswer4');

	const threadData = getThreadData();

$(`button#selectAnswer4`).click(() => {
XF.alert(buttonsMarkup(buttons4), null, 'Неофициальные RP организации. Выберите ответ');
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: yellow; border-style: double; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
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
//-----------------------------------------------------------------------------------------------------------------
//--------------------------Кнопка-подпись автора скрипта-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';

    // Функция для создания кнопки-подписи
    function addSignatureButton() {
        // Создаем красивую кнопку-подпись
        const signatureButton = $(`
            <button type="button"
                    class="button button--primary rippleButton"
                    id="scriptSignature"
                    style="border-radius: 15px;
                           border: 2px solid #FFD700;
                           margin-right: 7px;
                           margin-bottom: 10px;
                           background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
                           color: white;
                           font-weight: bold;
                           cursor: pointer;">
                🐰 Script by J. Goldchell 🐰
            </button>
        `);

        // Добавляем обработчик клика
        signatureButton.click(() => {
            XF.alert(
                `<!-- Иконка и информация о скрипте -->
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🐰</div>
                    <h2 style="color: #6A11CB; margin-bottom: 10px;">Для кураторов форума N. Novgorod</h2>
                    <p style="color: #2575FC; margin-bottom: 5px;"><strong>Версия:</strong> 0.1beta</p>
                    <p style="color: #666; margin-bottom: 15px;"><strong>Автор:</strong> Ярослав Голдчелл (Jarik_Goldchell)</p>
                    <p style="color: #FFD700; margin-bottom: 20px;">
                        <strong>Связь с разработчиком:</strong><br>
                        <a href="https://vk.com/gold_chell" target="_blank" style="color: #007bff; text-decoration: none;">
                            https://vk.com/gold_chell
                        </a>
                    </p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #6A11CB;">
                        <p style="margin: 0; color: #495057; font-size: 14px;">
                            Скрипт для облегчения работы кураторов форума.
                        </p>
                    </div>
                </div>`,
                null,
                '🐰 О скрипте'
            );
        });

        // Добавляем кнопку рядом с другими
        $('.button--icon--reply').before(signatureButton);
    }

    // Добавляем кнопку после загрузки DOM
    $(document).ready(() => {
        addSignatureButton();
    });

})();