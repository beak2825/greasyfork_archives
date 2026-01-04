    // ==UserScript==
    // @name         Script для подач заявок BLACK RUSSIA
    // @namespace    https://forum.blackrussia.online/
    // @version      0.3
    // @description  Специально для Черной России BLACK RUSSIA
    // @author       Reeefa
    // @match        https://forum.blackrussia.online/threads/*
    // @include      https://forum.blackrussia.online/threads/
    // @grant        none
    // @license      MIT
    // @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/552639/Script%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%20%D0%B7%D0%B0%D1%8F%D0%B2%D0%BE%D0%BA%20BLACK%20RUSSIA.user.js
// @updateURL https://update.greasyfork.org/scripts/552639/Script%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%20%D0%B7%D0%B0%D1%8F%D0%B2%D0%BE%D0%BA%20BLACK%20RUSSIA.meta.js
    // ==/UserScript==
     
    (function () {
        'use strict';
     
        const ACCEPT_PREFIX = 8; // префикс одобрено
        const UNACCEPT_PREFIX = 4; // префикс отказано
    	const PIN_PREFIX = 2; //  префикс закрепить
    	const COMMAND_PREFIX = 10; // команде проекта
    	const CLOSE_PREFIX = 7; // префикс закрыто
    	const DECIDED_PREFIX = 6; // префикс решено
    	const TECHADM_PREFIX = 13 // тех администратору
        const GA_PREFIX = 12 // главному администратору
        const SPEC_PREFIX = 11 // спец админу
    	const WATCHED_PREFIX = 9; // рассмотрено
    	const WAIT_PREFIX = 14; // ожидание
    	const NO_PREFIX = 0;
     
        const ZB_TECH = 1191;
        const TECH = 488;
        const ZB_PLAYER = 470;
        const ZB_LEADER = 469;
        const OBJ = 471;
     
        const buttons = [
        {
            title: '----------------------------------------------------------| Заявление на Агента поддержки |---------------------------------------------------------',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
            {
            title: '| 1.RED  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              {
            title: '| 2.GREEN  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              {
            title: '| 3.BLUE  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              {
            title: '| 4.YELLOW  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
             {
            title: '| 5.ORANGE  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
             {
            title: '| 6.PURPLE  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              {
            title: '| 7.LIME  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
             {
            title: '| 8.PINK  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12.Ссылка на ваш Телеграм: https://t.me/Smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 16. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 17.Скриншот /mm > доп.безопасность:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
                  "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
             {
            title: '| 9.CHERRY |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
            
             {
            title: '| 10.BLACK  |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
           "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Скриншот доп. безопасности /mm 4 > 1 (/time):[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 16. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
            
                         {
            title: '| 11.INDIGO |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
             {
            title: '| 12.WHITE |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
             {
            title: '| 13.MAGENTA |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Имя пользователя телеграмм аккаунта: https://t.me/Smyrfak [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 16. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                         {
            title: '| 14.CRIMSON |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                      {
            title: '| 15.GOLD |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                      {
            title: '| 16.AZURE |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 17.PLATINUM |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 18.AQUA |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 19.GRAY |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 20.ICE |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                          {
            title: '| 21.CHILLI |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Имя пользователя телеграмм аккаунта: https://t.me/Smyrfak [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 16. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                 {
            title: '| 22.CHOCO |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте: https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                {
            title: '| 23.MOSCOW |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте: https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
            {
            title: '| 24.SPB |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте(Не надо гиперссылкой https://vk.com/id12344567 (VK ID)):https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 25.UFA |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте: https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 26.SOCHI |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте: https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
               {
            title: '| 27.KAZAN |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте: https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              {
            title: '| 28.SAMARA |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте: https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              {
            title: '| 29.ROSTOV |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Ваш игровой NickName: Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Ваше реальное имя: Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики (/time):[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Скриншот /history (/time):[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Скриншот вашей дополнительной безопасности в игре (/time):[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Полная дата вашего рождения: 05.02.2005[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ваш минимальный суточный онлайн: 2+[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Какие руководящие должности занимали ранее:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Имеется ли опыт в сфере поддержки/администрирования: Имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Какова ваша цель на данном посту?: Подниматься по карьерной лестнице.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Готовы ли вы, получить блокировку аккаунта, если не справитесь с должностью, а так же, в случае обмана администрации в возрасте (Если вы не согласны с данным пунктом, то смысла в дальнейшем прохождении на пост Агента Поддержки - нет ): Готов[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Ваш логин Discord: smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ссылка на страницу VK: https://vk.com/smyrfak [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
                           {
            title: '| 30.ANAPA |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Ознакомлены ли вы с правилами серверов:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Ознакомлены ли вы с правилами агента поддержки:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ознакомлены ли вы с командами сервера:Ознакомлен[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Занимали ли вы данную должность на других проектах/серверах:Занимал[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте в формате id(набор цифр): https://vk.com/id758928850[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
           "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 16. Скриншот /mm > доп.безопасность:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
            
            
            
            
            
            
                 {
            title: '----------------------------------------------------------| Заявление на Лидера |---------------------------------------------------------',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
               {
            title: '| ГИБДД [RED]   |',
          content:
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4]  1. Никнейм:Hardin_Myrphy[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 2. Игровой уровень:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 3. Скриншот статистики аккаунта с /time:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 4. Были ли варны/баны (если да, то за что):Не имелось[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 5. Есть ли у вас твинк аккаунты? (если да, то написать никнеймы):Не имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 6. Почему именно вы должны занять пост лидера?:Ответственный,пунктуальный,адекватный. Имею желание поднять фракцию.[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+ 
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 7. Имеется ли опыт в данной организации?:Имеется[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 8. Ссылка на одобренную RP биографию персонажа:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 9. Были ли вы лидером любой другой организации?:Не был[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 10. Ваш часовой пояс:МСК+8[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 11. Ссылка на страницу ВКонтакте:https://vk.com/smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 12. Логин Discord аккаунта:smyrfak[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 13. Ваше реальное имя:Алексей[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
          "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 14. Ваш реальный возраст:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
           "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
            "[HEADING=3][CENTER][I][COLOR=rgb(220, 220, 220)][FONT=georgia][SIZE=4] 15. Город, в котором проживаете:Южно-Сахалинск[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
          "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
        "[HEADING=3][CENTER][COLOR=rgb(255,255,0)][I][B][FONT=georgia][SIZE=4]Ожидаю вердикта![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
            prefix: WAIT_PREFIX,
            status: true,
            },
              
         {
              title: '------------------------------------------------------| INFORMATION |-------------------------------------------------------------------',
              content:
                  '[COLOR=rgb(220, 220, 220)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
                 {
              title: '| РАЗРАБОТЧИК BLAKE CAPONE  |',
              content:
                  '[COLOR=rgb(220, 220, 220)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
              },
                  {
              title: '|  VK |',
              content:
         
        "[HEADING=3][CENTER][COLOR=rgb(220, 220, 220)][I][B][FONT=georgia][SIZE=4]https://vk.com/smyrfak[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
                prefix: UNACCEPT_PREFIX,
                status: false,
                },
                 {
              title: '| Форумный аккаунт |',
              content:
         
        "[HEADING=3][CENTER][COLOR=rgb(220, 220, 220)][I][B][FONT=georgia][SIZE=4]https://forum.blackrussia.online/members/blake-cap%D0%BEne-%E2%99%A1.1831642/[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
                prefix: UNACCEPT_PREFIX,
                status: false,
                },
    ];
     
    $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
     
    // Добавление кнопок при загрузке страницы
    addButton('Выбрать заявку', 'selectAnswer');
     
    // Поиск информации о теме
    const threadData = getThreadData();
     
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
     
    $(`button#selectAnswer`).click(() => {
    XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
    buttons.forEach((btn, id) => {
    if(id > 0) {
    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
    } else {
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
            editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].thread);
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
     
    function editThreadData(prefix, pin = false, thread = 0) {
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
     
        if(thread != 0) {
            moveThread(prefix, thread)
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

