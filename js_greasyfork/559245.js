// ==UserScript==
// @name         BLACK | Скрипт для ГС/ЗГС ОПГ by Spino
// @namespace    https://forum.blackrussia.online
// @version      0.0.1
// @description  Скрипт для упрощения работы ГС/ЗГС BLACK.
// @author       Adrian_Spinobelov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/559245/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20by%20Spino.user.js
// @updateURL https://update.greasyfork.org/scripts/559245/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20by%20Spino.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const IMPORTANT_PREFIX = 1 // Префикс "Важно"
    const buttons = [
        {
           title: '---------------------------------------------------------------> ЗАЯВКИ <---------------------------------------------------------------',
 title: `Закрытие заявок`,
            content :
            `  [CENTER] [SIZE=7] [URL=https://ibb.co/51gRYCr][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL] <br>`+
            `  [CENTER] [FONT=georgia] [SIZE=3] [COLOR=#adb5bd]  Здравствуйте, уважаемые игроки! [/COLOR] <br>`+
            `[CENTER] [color=#adb5bd] Оглашу вам список  одобренных и отказанных  кандидатов ниже, просьба ознакомиться с причинами отказа и со списком одобренных кандидатов. [/color]<br>`+
            `[CENTER] [color=#adb5bd] В случае если вы не согласны с решениям Старшей Администрации то составьте свою претензию в раздел «Жалобы на Администрацию». [/color] <br><br>`+
            `[CENTER] [color=blue] ГС ОПГ [URL='https://vk.com/spinobelov']*Кликабельно*[/URL] [/color]<br>`+
            `[CENTER] [color=blue] ЗГС ОПГ [URL='https://vk.com/id759155493']*Кликабельно*[/URL] [/color]<br>`+
            ` [CENTER] [color=#e5e5e5] [SIZE=3]  Список одобренных кандидатов; [/size] [/color]<br>`+
           `[CENTER] [color=#adb5bd] [SIZE=3] [LIST=1]
             [*]
             [*]
             [*]
             [*]
             [*]
            [/LIST] [/color] <br><br>`+
            `  [CENTER]   [color=#e5e5e5] [FONT=georgia] [SIZE=3] Список отказанных игроков; [/size] [/color]<br>`+
           `[CENTER] [color=#adb5bd] [FONT=georgia] [SIZE=3] [LIST]
             [*]  — [color=#adb5bd] Причина отказа: [/color]
             [*]  — [color=#adb5bd] Причина отказа: [/color]
             [*]  — [color=#adb5bd] Причина отказа: [/color]
             [*]  — [color=#adb5bd] Причина отказа: [/color]
             [*]  — [color=#adb5bd] Причина отказа: [/color]
            [/LIST]<br><br>`+
            `[CENTER] [SIZE=4] [COLOR=red] Примечание: [/COLOR] [/FONT] <br>`+
            `[FONT=georgia][SIZE=3] [color=#adb5bd] После одобрение, с вами свяжется Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу. <br>`+
            `[FONT=georgia][SIZE=3] Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы!<br><br>`+
            `[FONT=georgia][SIZE=3] Всем одобренным кандидатам, желаю удачи на обзвоне! Не забудьте почитать правила до обзвона😝[/COLOR]`+
            `[CENTER] [SIZE=7] [URL=https://ibb.co/51gRYCr][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL] <br>`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Заявки на рассмотрении`,
            content:
            `  [CENTER] [SIZE=7] [URL=https://ibb.co/51gRYCr][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL] <br>`+
                `[SIZE=3] [COLOR=#adb5bd] [FONT=georgia][CENTER] Здравствуйте, уважаемымые игроки![/CENTER]<br>` +
                `[CENTER] Заявки взяты на рассмотрение!.<br>` +
                `Ожидайте рассмотрения ГС|ЗГС.<br> [/COLOR] ` +
                `  [CENTER] [SIZE=7] [URL=https://ibb.co/51gRYCr][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL] <br>`+
                `[COLOR=#adb5bd][SIZE=3]На рассмотрение.[/color][/CENTER][/FONT][/SIZE]`,
            prefix: PIN_PREFIX,
            status: true,
 },
        {
            title: `Донабор`,
            content:
                `[CENTER] [SIZE=7] [URL=https://ibb.co/51gRYCr][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL] <br>`+
                `[SIZE=3] [COLOR=#adb5bd][FONT=georgia][CENTER] Здравствуйте, уважаемымые игроки![/CENTER]<br>` +
                `[CENTER] Заявки открыты на донабор!.<br><br>` +
                `Скорее подавайте!.<br>` +
                `[COLOR=#adb5bd] [SIZE=3]  Ожидание [/color] [/CENTER][/FONT][/SIZE]`+
                `[CENTER] [SIZE=7] [URL=https://ibb.co/51gRYCr][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL] <br>`,

            prefix: IMPORTANT_PREFIX,
            status: true,
  },
        {
            title: '---------------------------------------------------------------> Раздел Жалоб <---------------------------------------------------------------',
        },
        {
            title: 'Приветствие',
            content:
            "[CENTER][FONT=georgia][SIZE=3][COLOR=#e5e5e5]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER][/SIZE] [/COLOR]<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[CENTER][FONT=georgia][SIZE=3] [COLOR=#e5e5e5] текст [/FONT][/CENTER][/SIZE] [/COLOR]",
        },
        {
            title: 'На рассмотрение',
            content:
            "[CENTER][FONT=georgia][color=#adb5bd][size=3]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Запросил доказательства у лидера.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br> [/color]"+
            '[COLOR=red]На рассмотрении.[/COLOR][/FONT][/CENTER][/size]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/3429391/']*Кликабельно*[/URL]<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является лидером',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данный игрок не является лидером организации.<br>[/color]"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В предоставленных доказательствах отсутствует /time, жалоба не подлежит рассмотрению.<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Соц. сети',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>[/color]"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба составлена от 3-го лица, темы подобного формата рассмотрению не подлежат.<br[/color]>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}..<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов, в противном случае жалоба будет отказана.<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество докв',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 48 часов',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "С момента выдачи наказания/нарушения прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В вашей жалобе отсутствуют доказательства для рассмотрения. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {

            title: `Недостаточно док-вы`,
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение лидера.<br>[/color]`+
            ` [CENTER][color=red] Отказано[/color],закрыто.[/CENTER][/FONT]<br><br>[/size]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br>[/color]"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>[/color]"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет нарушений',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Исходя из приложенных выше доказательств - нарушения со стороны лидера отсутствуют.<br>[/color]"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Лидер прав',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>[/color]"+
            "Лидер предоставил доказательства.<br>"+
            '[COLOR=RED]Закрыто.[/size][/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Таймкоды',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Видеформат длится более 3-х минут.Укажите таймкоды на видеозаписи.<br>[/color]"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Правила раздела',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела. <br>[/color]"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жалобы на старший состав',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ошиблись разделом, обратитесь в жалобы на старший состав. <br>[/color]"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
 },
        {
            title: 'Док-ва отредактированы',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Представленные доказательства выше были отредактирован, подобные жалобы рассмотрению не подлежат.<br>[/color]"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: CLOSE_PREFIX,
            status: false,
         },
        {
            title: '--------------------------------------------------------------->Одобрение жалобы<---------------------------------------------------------------'
        },
        {
            title: 'Проинструкировать',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Благодарим за ваше обращение! Лидер будет проинструктирован.<br>[/color]"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выговор',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
             `[CENTER] Лидер получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>[/color]`+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание по ошибке',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В следствие беседы с лидером, было выяснено, наказание было выдано по ошибке.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>[/color]"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER][/size]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '--------------------------------------------------------------->Передать жалобу<---------------------------------------------------------------'
        },
        {
            title: 'Ошибка сервером',
            content:
            "[CENTER][FONT=georgia][size=3][color=#adb5bd]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/CENTER]<br>"+
            "[CENTER][FONT=georgia] Ошиблись сервером. [/FONT][/CENTER][/color]"+
            "[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER][/size]",
            prefix: CLOSE_PREFIX,
            status: false,
         },
        {
            title: '---------------------------------------------------------------> Раздел для проверки форума <------------------------------------------',
        },
        {
            title: `Еженедельник 50 б`,
            content:
            `[center][font=georgia][size=3][color=#adb5bd]Еженедельный отчет был успешно просмотрен.<br><br>[/color]`+
           "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
           "[color=red] Получаете +50 баллов в таблицу лидеров.<br><br>[/size] [/color]",
         },
        {
            title: `Еженедельник 40 б`,
            content:
            `[center][font=georgia][size=3][color=#adb5bd]Еженедельный отчет был успешно просмотрен.<br><br>[/color]`+
           "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
           "[size=3][color=red] Получаете +40 баллов в таблицу лидеров.<br><br>[/size][/color]",
          },
        {
             title: `Еженедельник 30 б`,
            content:
            `[center][font=georgia][size=3][color=#adb5bd]Еженедельный отчет был успешно просмотрен.<br><br>[/color]`+
           "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
           "[size=3][color=red] Получаете +30 баллов в таблицу лидеров.<br><br>[/size][/color]",
        },
        {
            title: `Еженедельник 20 б`,
            content:
            `[center][font=georgia][size=3][color=#adb5bd]Еженедельный отчет был успешно просмотрен.<br><br>[/color]`+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[size=3][color=red] Получаете +20 баллов в таблицу лидеров.<br><br>[/size][/color]",
         },
        {
           title: `Роспись ГС ОПГ`,
            content:
           `[center] [url=https://gifyu.com/image/SYNoC][img]https://s10.gifyu.com/images/SYNoC.gif[/img][/url], `
},
        {
           title: `Одобрено ГС ГОСС`,
            content:
           `[center] [url=https://gifyu.com/image/SYNo5][img]https://s12.gifyu.com/images/SYNo5.gif[/img][/url], `
},
        {
            title: `отказано ГС ГОСС`,
            content:
           `[center] [url=https://gifyu.com/image/SYNoo][img]https://s10.gifyu.com/images/SYNoo.gif[/img][/url], `

        }
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        addButton('На рассмотрение', 'pin');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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