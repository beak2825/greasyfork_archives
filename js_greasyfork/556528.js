// ==UserScript==
// @name         Forum Script for Support Team
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Forum script for curator and deputy curator
// @author       kumiho
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://sun6-23.userapi.com/s/v1/ig1/Bg7Sgc3yqNZ1F5YedeolIhnyRKIclMmKRAjpf9Rzj0XKAsgR9fLgLgNB3TUBDBF_N7XKKgPK.jpg?size=2155x2155&quality=96&crop=2,2,2155,2155&ava=1
// @downloadURL https://update.greasyfork.org/scripts/556528/Forum%20Script%20for%20Support%20Team.user.js
// @updateURL https://update.greasyfork.org/scripts/556528/Forum%20Script%20for%20Support%20Team.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const PIN_PREFIX = 2; //  префикс закрепить
    const TRANSFER_PREFIX1 = 20; //  префикс передачи админам 31
    const TRANSFER_PREFIX2 = 21; //  префикс передачи в обжалования 31
    const TRANSFER_PREFIX3 = 22; //  префикс передачи в жб на игроков 31
    const TRANSFER_PREFIX4 = 23; //  префикс передачи в тех раздел 31
    const TRANSFER_PREFIX5 = 24 ; //  префикс передачи в жб на тех 31
    const TRANSFER_PREFIX6 = 25; //  префикс передачи админам 32
    const TRANSFER_PREFIX7 = 26; //  префикс передачи в обжалования 32
    const TRANSFER_PREFIX8 = 27; //  префикс передачи в жб на игроков 32
    const TRANSFER_PREFIX9 = 28; //  префикс передачи в тех раздел 32
    const TRANSFER_PREFIX10 = 29; //  префикс передачи в жб на тех 32
    const TRANSFER_PREFIX11 = 30; //  префикс передачи админам 33
    const TRANSFER_PREFIX12 = 31; //  префикс передачи в обжалования 33
    const TRANSFER_PREFIX13 = 32; //  префикс передачи в жб на игроков 33
    const TRANSFER_PREFIX14 = 33; //  префикс передачи в тех раздел 33
    const TRANSFER_PREFIX15 = 34; //  префикс передачи в жб на тех 33
    const TRANSFER_PREFIX16 = 35; //  префикс передачи админам 34
    const TRANSFER_PREFIX17 = 36; //  префикс передачи в обжалования 34
    const TRANSFER_PREFIX18 = 37; //  префикс передачи в жб на игроков 34
    const TRANSFER_PREFIX19 = 38; //  префикс передачи в тех раздел 34
    const TRANSFER_PREFIX20 = 39; //  префикс передачи в жб на тех 34
    const TRANSFER_PREFIX21 = 40; //  префикс передачи админам 35
    const TRANSFER_PREFIX22 = 41; //  префикс передачи в обжалования 35
    const TRANSFER_PREFIX23 = 42; //  префикс передачи в жб на игроков 35
    const TRANSFER_PREFIX24 = 43; //  префикс передачи в тех раздел 35
    const TRANSFER_PREFIX25 = 44; //  префикс передачи в жб на тех 35
    const COMMAND_PREFIX = 10; // команде проекта
    const CLOSE_PREFIX = 7; // префикс закрыто
    const DECIDED_PREFIX = 6; // префикс решено
    const TECHADM_PREFIX = 13 // теху администратору
    const WATCHED_PREFIX = 9; // рассмотрено
    const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
    const NO_PREFIX = 0;
    const buttons = [
            {
            title: 'Свой текст',
            content: "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                '[CENTER] текст [/CENTER]',
        },
        {
            title: '(-<--<-- Рассмотрение Жалоб на Техов -- >-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
        {
            title: 'На рассмотрении',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px] Ваша тема взята на [COLOR=rgb(255, 242, 0)]рассмотрение.[/color] Ответ поступит в ближайшее время. Пожалуйста, ожидайте.[/size][/FONT][/COLOR][/CENTER]<br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
            title: 'Выдано верно',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]После проверки доказательств и системы логирования, было принято решение, что наказание выдано [COLOR=rgb(0, 255, 0)]верно. [/COLOR][/CENTER]<br> <br>"+
            '[CENTER]Хотелось бы напомнить, что вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/CENTER]<br>' +
            '[CENTER]Рекомендуем вам более детально ознакомиться с [URL= https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/][COLOR=rgb(255,207,64)]правилами проекта.[/URL][/COLOR][/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Беседа с техом',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]С Техническим специалистом будет проведена строгая профилактическая беседа.[/CENTER]<br>'+
            '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
        status: false,
         },
         {
            title: 'Купил ИВ у игрока',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br>' +
            '[COLOR=rgb(255, 0, 0)]4.01.[/COLOR] Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
            '[CENTER]Вам на банковский счёт неоднократно переводились денежные средства от продавцов игровой валют. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
            '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
            '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
            '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
            '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
            '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
            '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
            '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
            '[CENTER]Технический специалист действовал согласно должностным инструкции, вердикт и наказания верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
            '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Наказание остается без изменений.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Покупка ИВ у бота',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]На ваш банковский счет поступили денежные средства от Ботовода. [COLOR=rgb(255, 0, 0)]Бот[/COLOR] – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
            '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br>' +
            '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил [COLOR=rgb(255, 0, 0)]2.28.[/COLOR][/CENTER] <br><br>' +
            '[CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/SPOILER]<br>' +
            '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
            title: 'Обход системы 2.21',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств и системы логирования, было принято решение, что наказание выдано [COLOR=rgb(0, 255, 0)]верно. [/COLOR][/CENTER]<br>'+
            '[CENTER]Вы нарушили правило пункта [COLOR=rgb(255, 0, 0)]2.21[/COLOR] общих правил проекта. [SPOILER="2.21"][COLOR=rgb(255, 0, 0)]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/SPOILER][/CENTER] <br>' +
            "[CENTER]Хотелось бы напомнить, что вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/CENTER] <br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Трансфер 4.05',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств и системы логирования, было принято решение, что наказание выдано [COLOR=rgb(0, 255, 0)]верно. [/COLOR][/CENTER]<br>'+
            '[CENTER]На проекте запрещено перекидывать игровую валюту с основного аккаунта на твинк аккаунт или же наоборот. Ваш аккаунт был заблокирован по пункту [COLOR=rgb(255, 0, 0)]4.05[/COLOR] общих правил проекта.[SPOILER="4.05"][COLOR=rgb(255, 0, 0)]4.05.[/COLOR] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
            "[CENTER]Хотелось бы напомнить, что вы автоматически соглашаетесь со всеми установленными правилами и обязуетесь их соблюдать в полной мере при регистрации своего игрового аккаунта на любом из серверов проекта.[/CENTER] <br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
             title: 'Заблокированный IP',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке, переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN.[/CENTER] <br>' +
            '[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER] <br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
        status: false,
         },
         {
            title: 'Чужая привязка',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. [/CENTER] <br><br>' +
            '[CENTER]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей. [/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
            title: 'Аккаунт будет разблокирован',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваш аккаунт будет разблокирован в течении 24х часов.  [/CENTER]<br>' +
            '[CENTER]Надеемся, что в процессе разблокировки никакое имущество не слетело в государство.[/CENTER]<br>' +
            '[CENTER]Если возникли проблемы с имуществом, пожалуйста, создайте новую тему для обсуждения компенсации. [/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
        status: false,
         },
         {
            title: 'ОБЖ одобрено',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Мы рассмотрели ваше обжалование, и пришли к вердикту, что срок блокировки аккаунта будет будет сокращён.[/CENTER]<br>' +
            '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-25703465][COLOR=rgb(255,207,64)]правилами проекта[/URL][/COLOR], чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
            '[CENTER]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
        status: false,
         },
         {
            title: 'В ОБЖ отказано',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Мы рады, что вы осознали свою ошибку.[/CENTER]<br>' +
            '[CENTER]На данный момент мы не готовы пойти к вам на встречу и снизить срок блокировки аккаунта.[/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
         },
         {
            title: 'Не подлежит обж',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Мы рады, что вы осознали свою ошибку. Вы получили блокировку за серьезное нарушение, мы не в силах снизить срок вашего наказания.<br><br>' +
            '[CENTER]Рекомендуем вам ознакомиться с [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/][COLOR=rgb(255,207,64)]правилами обжалования нарушения при выдаче наказания от технического специалиста.[/COLOR][/URL][/center]<br><br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
                title: 'Дубликат',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 0, 0)] ваш аккаунт на форуме может быть заблокирован.[/COLOR][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
              },
              {
        title: 'Нет окна блокировки',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Истек срок подачи',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]С момента выдачи наказания от Технического специалиста прошло более 14-и дней.<br> Изменение меры наказания новозможно. Вы можете попробывать написать обжалование.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию. Рекомендуем вам ознакомиться с [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/][COLOR=rgb(255,207,64)]правилами обжалования нарушения при выдаче наказания от технического специалиста.[/COLOR][/URL][/center]<br><br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
    {
        title: 'Нет ответа от игрока',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]К сожалению, ответа от вас в теме так и не поступило. <br>Пожалуйста, создайте новую тему, если вы все ещё не согласны с выданным наказанием.<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Восст. доступа к аккаунту',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br>Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
            "[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
            "[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
            '[CENTER]Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
    {
            title: '(-<--<--<-- Для Куратора/Заместителяᅠ-->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #7B68EE; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'ЖБ передана руководству',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 242, 0)]руководству.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: COMMAND_PREFIX,
        status: true,
    },
    {
            title: 'ОБЖ передано руководству',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обжалование передано на рассмотрение [COLOR=rgb(255, 242, 0)]руководству.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: COMMAND_PREFIX,
        status: true,
    },
    {
            title: 'ЖБ передана Куратору',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша жалоба передана на рассмотрение [COLOR=rgb(255, 142, 0)]Куратору технических специалистов.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255,255)]@Kumiho Legenda [/COLOR][/CENTER]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
            title: 'Обж передано Куратору',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обжалование передано на рассмотрение [COLOR=rgb(255, 142, 0)]Куратору технических специалистов.[/COLOR] Пожалуйста, ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 255,255)]@Kumiho Legenda [/COLOR][/CENTER]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: PIN_PREFIX,
        status: true,
    },
    {
            title: 'Передача теху',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема передана на рассмотрение [COLOR=rgb(255, 142, 0)]Техническому специалисту.[/COLOR] Пожалуйста, наберитесь терпения и ожидайте ответа. [/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: TECHADM_PREFIX,
        status: true,
    },
    {
            title: 'Жду ответ в личке',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Отписал вам в личные сообщения на форуме. <br> Ожидаю от вас ответа.[/CENTER]<br>'+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
             prefix: PIN_PREFIX,
             status: true,
        },
        {
            title: 'Покупка ИВ у бота',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]На ваш банковский счет поступили денежные средства от Ботовода. [COLOR=rgb(255, 0, 0)]Бот[/COLOR] – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
            '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br>' +
            '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил [COLOR=rgb(255, 0, 0)]2.28.[/COLOR][/CENTER] <br>' +
            '[CENTER][SPOILER="2.28"][COLOR=rgb(255, 0, 0)]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/SPOILER]<br>' +
            '[CENTER][COLOR=rgb(255,207,64)]Остались у вас какие-либо вопросы, касательно блокировки аккаунта?[/color][/CENTER]<br>' +
            '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
             prefix: PIN_PREFIX,
             status: true,
    },
    {
            title: 'Купил ИВ у игрока',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br>' +
            '[COLOR=rgb(255, 0, 0)]4.01.[/COLOR] Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
            '[CENTER]Вам на банковский счёт неоднократно переводились денежные средства от продавцов игровой валют. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
            '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
            '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
            '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
            '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
            '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
            '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
            '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
            '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказания верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
            '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
            '[CENTER][COLOR=rgb(255,207,64)]Остались у вас какие-либо вопросы, касательно блокировки аккаунта?[/CENTER][/COLOR]<br>' +
            '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
             prefix: PIN_PREFIX,
             status: true,
        },
        {
            title: '(-<--<--<-- Чистка от оффтопа ЖБ на тех -->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'Форма подачи "ЖБ НА ТЕХ"',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | [COLOR=rgb(255, 0, 0)]Махинации[/COLOR]<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Правила раздела ЖБ на тех',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Хочу занять должность',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе вашего игрового сервера, где вы можете ознакомиться с открытыми должностями и формами подач.<br><br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
            title: 'В тех. раздел',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обращение не относится к разделу «Жалобы на технических специалистов».<br>' +
            '[CENTER]Пожалуйста, обратитесь с данной темой в «Технический раздел» вашего сервера» - [URL= https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br><br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
            title: 'В поддержку',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, обратитесь в Техническую поддежку проекта.<br><br>[COLOR=rgb(255, 255, 0)]Конктактная информация:[/COLOR][/CENTER]<br>'+
            '[CENTER]Телеграмм -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL][/CENTER]<br>'+
            '[CENTER]ВКонтакте - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] [/CENTER]<br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
    {
        title: 'В гос. раздел',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема не относится к разделу "Жалобы на технических специалистов". Пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных организаций вашего сервера.[/CENTER]<br><br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'В крим. раздел',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема не относится к разделу "Жалобы на технических специалистов". Пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных организаций вашего сервера [/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'В жб на адм',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы получили наказание от Администратора сервера. Ваше обращение не относится к разделу «Жалобы на технических специалистов».<br>' +
            '[CENTER]Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
    {
        title: 'В жб на игр',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Данная тема не относится к разделу «Жалобы на технических специалистов». Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
        title: 'В обж от адм',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел «Обжалования» вашего сервера. <br> Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/'][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
            title: 'НЕ ОТНОСИТСЯ',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][COLOR=rgb(255,207,64)]кликабельно.[COLOR][/URL]" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',

         prefix: UNACCEPT_PREFIX,
         status: false,
    },
        {
        title: '(-<--<--<-- Для ответов в Тех разделе -->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #ff; background: #ff00ff; box-shadow: 0 0 2px 0 rgba((255, 0, 255)),0 2px 2px 0 rgba((255, 0, 255)),0 1px 3px 0 rgba((255, 0, 255)); border: none; border-color: #ff00ff',
              },
              {
                title: 'Форма подачи',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER]Пожалуйста, заполните форму, создав новую тему:[/CENTER] <code> <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно)</code>[/SIZE][/FONT][/COLOR]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/CENTER][/COLOR]',
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Не относится к Тех. разделу',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваше обращение не относится к Техническому разделу. Пожалуйста, ознакомьтесь с правилами данного раздела - [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/'][COLOR=rgb(255,207,64)]кликабельно.[/COLOR][/URL]" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
         prefix: UNACCEPT_PREFIX,
         status: false,
    },
        {
                title: 'Проблема решилась',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за обращение! Мы искренне рады за то, что ваша проблема была решена и мы смогли помочь вам.<br>Если вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в [URL= https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/][COLOR=rgb(255,207,64)]Технический раздел.[/COLOR][/URL][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Решено.[/ICODE][/size][/CENTER][/COLOR]',
                prefix: DECIDED_PREFIX,
                status: false,
              },
              {
                title: 'Отвязка привязок',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной [COLOR=rgb(255,207,64)]«Чужая привязка».[/color] В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
                title: 'Передано логисту',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5); color: rgb(255,215,0, 1)',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и передана [COLOR=rgb(255, 152, 0)]Техническому специалисту по логированию[/color] для дальнейшего вердикта. Создавать новые темы с данной проблемой — не нужно. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
               '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
                prefix: TECHADM_PREFIX,
                status: true,
              },
              {
                title: 'Запрос доп. информации',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=15px][FONT=Arial]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>Дата покупки<br>Способ приобретения (у игрока, в магазине или через донат;<br>Фрапс покупки (если есть);<br>NickName игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE] [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
               '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
                prefix: PIN_PREFIX,
                status: true,
              },
              {
                title: 'Проблемы с загрузкой форума',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте Настройки.<br>• Найдите во вкладке Приложения свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите Очистить -> Очистить Кэш.<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите Конфиденциальность и безопасность -> Очистить историю.<br>• В основных и дополнительных настройках поставьте галочку в пункте Файлы cookie и данные сайтов.<br>После этого нажмите Удалить данные.<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
            title: 'Законопослушность',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
              '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно тремя способами:<BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>3.На работе "Электрика"(доступна с 12 Игрового Уровня), для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>[/CENTER]'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
      title: "Баг со штрафами",
    content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке. <br> [COLOR=rgb(255, 255,0)]Команде проекта[/color] известно о данном баге и активно ведется иправление.<br><br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
                title: 'Передано КП',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и находится на рассмотрении у [COLOR=rgb(255, 255,0)]Команды проекта.[/color] Пожалуйста, ожидайте ответа от разработчиков. Создавать новые темы с данной проблемой — не нужно.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
               '[CENTER][size=15px][COLOR=rgb(255, 255,0)][ICODE]На рассмотрении.[/ICODE][/size][/CENTER][/COLOR]',
                prefix: COMMAND_PREFIX,
                status: true,
              },
              {
                title: 'Проблема известна КП',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][COLOR=rgb(255, 255,0)]Команде проекта[/color] уже известно о данной проблеме, она обязательно будет исправлена в кратчайший срок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
                            title: 'Не начислили рейтинг за груз',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Наша система построена следующим образом:<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если вы почините ваш автомобиль, поломка до, будет учтена.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
                title: 'Передано тестерам',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb((0, 255, 255, 0)); color: rgb((0, 255, 255, 0))',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема передана на [COLOR=rgb(0, 255, 255)]тестирование.[/color][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]',
                prefix: PIN_PREFIX,
                status: true,
              },
              {
               title: 'Пропали вещи с аукциона',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командами [COLOR=rgb(255,207,64)]/reward, /roulette.[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды [COLOR=rgb(255,207,64)]/time[/color] в новом обращении.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
                title: 'Сервер не отвечает',
                content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>1) Изменить IP-адрес любыми средствами<br>2) Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть<br>3) Использование VPN <br>4) Перезагрузка роутера<br><br>Если методы выше не помогли, то переходим к следующим шагам:<br>1) Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>2)Соглашаемся со всей политикой приложения.<br>3) Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4) Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
            title: 'Перенапр в поддержку',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Пожалуйста, обратитесь в Техническую поддежку проекта.<br><br>[COLOR=rgb(255, 255, 0)]Конктактная информация:[/COLOR][/CENTER]<br>'+
            '[CENTER]Телеграмм -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL][/CENTER]<br>'+
            '[CENTER]ВКонтакте - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] [/CENTER]<br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
    {
        title: 'Перенапр в гос. раздел',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема не относится к разделу «Технический раздел». Пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных организаций вашего сервера.[/CENTER]<br><br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Перенапр в крим. раздел',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема не относится к разделу «Технический раздел». Пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных организаций вашего сервера [/CENTER]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'Перенапр в жб на адм',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы получили наказание от Администратора сервера.<br>' +
            '[CENTER]Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/][COLOR=rgb(255,207,64)]Кликабельно.[/COLOR][/URL]<br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
    {
        title: 'Перенапр в жб на игр',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Данная тема не относится к разделу «Технический раздел». Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][COLOR=rgb(255,207,64)]Кликабельно.[/COLOR][/URL]" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
        title: 'Перенапр в обж от адм',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел «Обжалования» вашего сервера. <br> Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/'][COLOR=rgb(255,207,64)]Кликабельно.[/COLOR][/URL]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
              title: 'Перенапр в ЖБ на тех',
             content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вы получили наказание от технического специалиста вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если вы не согласны с наказанием.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ссылка на раздел, где можно оформить жалобу на технического специалиста: [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/'][COLOR=rgb(255,207,64)]Кликабельно.[/color][/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
        title: 'Хочу должность',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе вашего игрового сервера, где вы можете ознакомиться с открытыми должностями и формами подач.<br><br>' +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
                title: 'Кикнули за ПО',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример:[/COLOR]<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>Пожалуйста, обратите внимания на значения [COLOR=rgb(255,207,64)]PacketLoss[/color] и [COLOR=rgb(255,207,64)]Ping.[/color]<br><br>[COLOR=rgb(255,207,64)]PacketLoss[/color] - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>[COLOR=rgb(255,207,64)]Ping[/color] - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
        title: 'Нет доказательств',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Без доказательств (фото или видеофиксация) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга:<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/size][/CENTER][/COLOR]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
                title: 'Правила восст',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/'][COLOR=rgb(255,207,64)]кликабельно.[/color][/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Краш/Вылет',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш запрос о вылетах был получен. Данные о вылетах отправляются разработчикам автоматически, поэтому дублирование их в техническом разделе не требуется.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если возникли проблемы с подключением к игре, то в ближайшее время они будут решены. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[CENTER][COLOR=rgb(255,0,0)][ICODE]Отказано.[/ICODE][/CENTER][/COLOR]',
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'в Предл по улучш',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не относится к технической проблеме. <br>  Если вы хотите предложить изменения в игровом моде - обратитесь в раздел[URL='https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/'][COLOR=rgb(255,207,64)] Предложения по улучшению.[/color][/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
                            title: 'Все дет. для прошивки',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации какой либо прошивки необходимо поставить все детали данного типа SPORT SPORT+ и т.п.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
              {
                title: 'По проблемам с донатом',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если не были зачислены [COLOR=rgb(255,207,64)]BLACK COINS[/color] — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления [COLOR=rgb(255,207,64)]BLACK COINS[/color] необходимо ввести в игре команду: [COLOR=rgb(255,207,64)]/donat.[/color][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вам необходимо быть внимательными при осуществлении покупок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                '[CENTER][COLOR=rgb(30, 144, 255)]Телеграмм[/color] -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL][/CENTER]<br>'+
                '[CENTER][COLOR=rgb(65, 105, 225)]ВКонтакте[/color] - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] [/CENTER]<br>'+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
                prefix: DECIDED_PREFIX,
                status: false,
              },
              {
                            title: 'Исчезла статистика аккаунта',
                content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Аккаунт не может пропасть или аннулироваться просто так. Даже если вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
                "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
            '[COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено.[/ICODE][/size][/CENTER][/COLOR]',
                prefix: CLOSE_PREFIX,
                status: false,
              },
             {
            title: '(-<--<--<--<-- Сервер №31 -->-->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'Перенаправление в ТР 31',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технических раздел"[/COLOR] сервера [COLOR=rgb(0, 255, 127)]31 | EKB. [/color][/center]',
        prefix: TRANSFER_PREFIX4,
        status: false,
    },
    {
            title: 'Перенаправление в Жб Тех 31',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(0, 255, 127)]31 | EKB. [/color][/center]',
        prefix: TRANSFER_PREFIX5,
        status: false,
    },
    {
            title: 'Перенаправление в жб на адм 31',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(0, 255, 127)]31 | EKB. [/color][/center]',
        prefix: TRANSFER_PREFIX1,
        status: false,
    },
    {
            title: 'Перенаправление в жб игр 31',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(0, 255, 127)]31 | EKB. [/color][/center]',
        prefix: TRANSFER_PREFIX3,
        status: false,
    },
    {
            title: 'Перенаправление в обж адм 31',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 255, 127)]31 | EKB. [/color][/center]',
        prefix: TRANSFER_PREFIX2,
        status: false,
    },
{

            title: '(-<--<--<--<-- Сервер №32 -->-->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'Перенаправление в ТР 32',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технических раздел"[/COLOR] сервера [COLOR=rgb(160, 52, 41)]32 | KRASNODAR. [/color][/center]',
        prefix: TRANSFER_PREFIX9,
        status: false,
    },
    {
            title: 'Перенаправление в Жб Тех 32',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(160, 52, 41)]32 | KRASNODAR. [/color][/center]',
        prefix: TRANSFER_PREFIX10,
        status: false,
    },
    {
            title: 'Перенаправление в жб на адм 32',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(160, 52, 41)]32 | KRASNODAR. [/color][/center]',
        prefix: TRANSFER_PREFIX6,
        status: false,
    },
    {
            title: 'Перенаправление в жб игр 32',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(160, 52, 41)]32 | KRASNODAR. [/color][/center]',
        prefix: TRANSFER_PREFIX8,
        status: false,
    },
    {
            title: 'Перенаправление в обж адм 32',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(160, 52, 41)]32 | KRASNODAR. [/color][/center]',
        prefix: TRANSFER_PREFIX7,
        status: false,
    },
{
            title: '(-<--<--<--<-- Сервер №33 -->-->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'Перенаправление в ТР 33',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технических раздел"[/COLOR] сервера [COLOR=rgb(255, 255, 114)]33 | ARZAMAS. [/color][/center]',
        prefix: TRANSFER_PREFIX14,
        status: false,
    },
    {
            title: 'Перенаправление в Жб Тех 33',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(255, 255, 114)]33 | ARZAMAS. [/color][/center]',
        prefix: TRANSFER_PREFIX15,
        status: false,
    },
    {
            title: 'Перенаправление в жб на адм 33',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(255, 255, 114)]33 | ARZAMAS. [/color][/center]',
        prefix: TRANSFER_PREFIX11,
        status: false,
    },
    {
            title: 'Перенаправление в жб игр 33',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(255, 255, 114)]33 | ARZAMAS. [/color][/center]',
        prefix: TRANSFER_PREFIX13,
        status: false,
    },
    {
            title: 'Перенаправление в обж адм 33',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(255, 255, 114)]33 | ARZAMAS. [/color][/center]',
        prefix: TRANSFER_PREFIX12,
        status: false,
    },
{
            title: '(-<--<--<--<-- Сервер №34 -->-->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'Перенаправление в ТР 34',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технических раздел"[/COLOR] сервера [COLOR=rgb(153, 213, 59)]34 | NOVOSIBIRSK. [/color][/center]',
        prefix: TRANSFER_PREFIX19,
        status: false,
    },
    {
            title: 'Перенаправление в Жб Тех 34',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(153, 213, 59)]34 | NOVOSIBIRSK. [/color][/center]',
        prefix: TRANSFER_PREFIX20,
        status: false,
    },
    {
            title: 'Перенаправление в жб на адм 34',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(153, 213, 59)]34 | NOVOSIBIRSK. [/color][/center]',
        prefix: TRANSFER_PREFIX16,
        status: false,
    },
    {
            title: 'Перенаправление в жб игр 34',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(153, 213, 59)]34 | NOVOSIBIRSK. [/color][/center]',
        prefix: TRANSFER_PREFIX18,
        status: false,
    },
    {
            title: 'Перенаправление в обж адм 34',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 255, 127)][COLOR=rgb(153, 213, 59)]34 | NOVOSIBIRSK. [/color][/center]',
        prefix: TRANSFER_PREFIX17,
        status: false,
    },
{
            title: '(-<--<--<--<-- Сервер №35 -->-->-->-->-)',
            dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
    {
            title: 'Перенаправление в ТР 35',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технических раздел"[/COLOR] сервера [COLOR=rgb(0, 150, 34)]35 | GROZNY. [/color][/center]',
        prefix: TRANSFER_PREFIX24,
        status: false,
    },
    {
            title: 'Перенаправление в Жб Тех 35',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(0, 150, 34)]35 | GROZNY. [/color][/center]',
        prefix: TRANSFER_PREFIX25,
        status: false,
    },
    {
            title: 'Перенаправление в жб на адм 35',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(0, 150, 34)]35 | GROZNY. [/color][/center]',
        prefix: TRANSFER_PREFIX21,
        status: false,
    },
    {
            title: 'Перенаправление в жб игр 35',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(0, 150, 34)]35 | GROZNY. [/color][/center]',
        prefix: TRANSFER_PREFIX23,
        status: false,
    },
    {
            title: 'Перенаправление в обж адм 35',
        content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
            '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 150, 34)]35 | GROZNY. [/color][/center]',
        prefix: TRANSFER_PREFIX22,
        status: false,
    },
    ];

    // Добавляем стили для кнопок
    const style = document.createElement('style');
    style.textContent = `
        .bgButton {
            background: #1a1a1a;
            color: #ffffff;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 6px 8px;
            margin: 2px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
            min-width: 50px;
            max-width: 55px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1.1;
            word-break: break-word;
            white-space: normal;
            flex-shrink: 0;
        }

        .bgButton:hover {
            background: #2a2a2a;
            border-color: #555;
        }

        .bgButtonsContainer {
            display: flex;
            gap: 2px;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 5px 0;
            margin-bottom: 10px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }

        .bgButtonsContainer::-webkit-scrollbar {
            display: none;
        }

        @media (max-width: 768px) {
            .bgButton {
                min-width: 48px;
                max-width: 52px;
                font-size: 10px;
                padding: 5px 6px;
            }
        }

        @media (min-width: 768px) {
            .bgButtonsContainer {
                flex-wrap: wrap;
                overflow-x: visible;
            }
        }
    `;
    document.head.appendChild(style);

    // Функция для создания контейнера с кнопками
        function createButtonsContainer() {
        const container = document.createElement('div');
        container.className = 'bgButtonsContainer';

        // Создаем кнопки
        const buttonsData = [
            { text: "ТР 31", href: "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1458/" },
            { text: "ТР 32", href: "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1460/" },
            { text: "ТР 33", href: "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1502/" },
            { text: "ТР 34", href: "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1544/" },
            { text: "ТР 35", href: "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.1586/" },
            { text: "ЖБ 31", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.1457/" },
            { text: "ЖБ 32", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.1459/" },
            { text: "ЖБ 33", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.1501/" },
            { text: "ЖБ 34", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.1543/" },
            { text: "ЖБ 35", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.1585/" },
            { text: "ЖБИ 31", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1444/" },
            { text: "ЖБИ 32", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1488/" },
            { text: "ЖБИ 33", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/" },
            { text: "ЖБИ 34", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1572/" },
            { text: "ЖБИ 35", href: "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1614/" },
            { text: "ОПС", href: "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/" }
        ];

        buttonsData.forEach(buttonInfo => {
            const button = document.createElement("button");
            button.textContent = buttonInfo.text;
            button.className = "bgButton";
            button.addEventListener("click", () => {
                window.location.href = buttonInfo.href;
            });
            container.appendChild(button);
        });

        return container;
    }

    function initializeScript() {
        // Всегда добавляем кнопки навигации в изначальное положение
        const bgButtons = document.querySelector(".pageContent");
        if (bgButtons) {
            const buttonsContainer = createButtonsContainer();
            bgButtons.appendChild(buttonsContainer);
        }

        // Добавляем функциональные кнопки только на страницах с threads
        if (window.location.href.includes('threads')) {
            $(document).ready(() => {
                // Загрузка скрипта для обработки шаблонов
                $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

                // Добавление кнопок при загрузке страницы
                addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0, 0.8);');
                addButton('Тех. Спец', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 120, 215, 0.8);');
                addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(76, 175, 80, 0.8)');
                addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(76, 175, 80, 0.8);');
                addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(244, 67, 54, 0.8);');
                addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(244, 67, 54, 0.8);');
                addAnswers();

                // Поиск информации о теме
                const threadData = getThreadData();

                $(`button#ff`).click(() => pasteContent(8, threadData, true));
                $(`button#prr`).click(() => pasteContent(2, threadData, true));
                $(`button#zhb`).click(() => pasteContent(21, threadData, true));
                $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
                $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX1, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX2, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX3, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX4, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX5, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX6, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX7, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX8, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX9, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX10, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX11, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX12, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX13, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX14, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX15, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX16, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX17, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX18, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX19, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX20, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX21, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX22, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX23, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX24, false));
                $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX25, false));
                $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
                $('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
                $('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
                $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
                $('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

                $(`button#selectAnswer`).click(() => {
                    XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
                    buttons.forEach((btn, id) => {
                        if (id > 1) {
                            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                        } else {
                            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                        }
                    });
                });
            });
        }
    }

    // Вспомогательные функции
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

    function editThreadData(prefix, pin = false, may_lens = true) {
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
                    discussion_open: 1,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if(may_lens === true) {
            if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
                moveThread(prefix, 230); }

            if(prefix == WAIT_PREFIX) {
                moveThread(prefix, 917);
            }

            if(prefix == TRANSFER_PREFIX1) {
                moveThread(prefix, 1442);
            }
            if(prefix == TRANSFER_PREFIX3) {
                moveThread(prefix, 1444);
            }
            if(prefix == TRANSFER_PREFIX5) {
                moveThread(prefix, 1457);
            }
            if(prefix == TRANSFER_PREFIX4) {
                moveThread(prefix, 1458);
            }
            if(prefix == TRANSFER_PREFIX2) {
                moveThread(prefix, 1445);
            }
            if(prefix == TRANSFER_PREFIX6) {
                moveThread(prefix, 1486);
            }
            if(prefix == TRANSFER_PREFIX8) {
                moveThread(prefix, 1488);
            }
            if(prefix == TRANSFER_PREFIX10) {
                moveThread(prefix, 1459);
            }
            if(prefix == TRANSFER_PREFIX9) {
                moveThread(prefix, 1460);
            }
            if(prefix == TRANSFER_PREFIX7) {
                moveThread(prefix, 1489);
            }
            if(prefix == TRANSFER_PREFIX11) {
                moveThread(prefix, 1529);
            }
            if(prefix == TRANSFER_PREFIX13) {
                moveThread(prefix, 1531);
            }
            if(prefix == TRANSFER_PREFIX15) {
                moveThread(prefix, 1501);
            }
            if(prefix == TRANSFER_PREFIX14) {
                moveThread(prefix, 1502);
            }
            if(prefix == TRANSFER_PREFIX12) {
                moveThread(prefix, 1528);
            }
            if(prefix == TRANSFER_PREFIX16) {
                moveThread(prefix, 1570);
            }
            if(prefix == TRANSFER_PREFIX18) {
                moveThread(prefix, 1572);
            }
            if(prefix == TRANSFER_PREFIX20) {
                moveThread(prefix, 1543);
            }
            if(prefix == TRANSFER_PREFIX19) {
                moveThread(prefix, 1544);
            }
            if(prefix == TRANSFER_PREFIX17) {
                moveThread(prefix, 1573);
            }
            if(prefix == TRANSFER_PREFIX21) {
                moveThread(prefix, 1612);
            }
            if(prefix == TRANSFER_PREFIX23) {
                moveThread(prefix, 1614);
            }
            if(prefix == TRANSFER_PREFIX25) {
                moveThread(prefix, 1585);
            }
            if(prefix == TRANSFER_PREFIX24) {
                moveThread(prefix, 1586);
            }
            if(prefix == TRANSFER_PREFIX22) {
                moveThread(prefix, 1615);
            }
            if(prefix == COMMAND_PREFIX) {
                moveThread(prefix, 490);
            }
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

    // Запускаем скрипт
    initializeScript();
})();