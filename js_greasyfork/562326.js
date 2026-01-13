// ==UserScript==
// @name         White Russia | Project Team FULL V16
// @namespace    https://sampproject.ru/
// @version      16.0
// @description  Огромный пак кнопок, исправленные ссылки, чистый стиль
// @author       Founder
// @match        https://*.sampproject.ru/*
// @match        http://*.sampproject.ru/*
// @match        https://sampproject.ru/*
// @include      https://*.sampproject.ru/index.php?threads/*
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/562326/White%20Russia%20%7C%20Project%20Team%20FULL%20V16.user.js
// @updateURL https://update.greasyfork.org/scripts/562326/White%20Russia%20%7C%20Project%20Team%20FULL%20V16.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    // ================= ССЫЛКИ (ТВОИ) =================
    const BANNER = "https://i.postimg.cc/Hrr0BByH/f3eabafac57241f0ac0dd6776a1c00ff.gif"; 
    const DIVIDER = "https://i.postimg.cc/hhK9HSdL/RLwzo.png"; 
    
    const GIF_WAIT = "https://i.postimg.cc/946rCB0y/download-2.gif"; 
    const GIF_OK = "https://i.postimg.cc/jwfn7Fmy/Ctfdw-H3.gif";     
    const GIF_NO = "https://i.postimg.cc/673dyzBH/68f0dc94377d6e26798dec2b.gif"; 

    // Теги команды
    const PROJECT_TEAM = "@Bismarck_Fonberz @Aleksey_Orlov @Tema_Soska";

    // ================= ID ПРЕФИКСОВ =================
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const PIN_PREFIX = 2;
    const GA_PREFIX = 12;
    const SPE_PREFIX = 11;
    const CP_PREFIX = 10;
    const CLOSE_PREFIX = 7;
    const TECH_PREFIX = 13; // Техническому специалисту (пример)

    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    $('body').append(`
        <style>
            .bbWrapper img { width: 100% !important; max-width: 100% !important; }
        </style>
    `);

    // ================= ШАБЛОНЫ =================
    const buttons = [
        // -------------------------------------------------------------
        {
            title: '--- ОСНОВНОЕ ---',
            dpstyle: 'oswald: 3px; color: #fff; background: #8B0000; box-shadow: 0 0 5px rgba(0,0,0,0.5); border: none;',
        },
        {
            title: '⏳ На рассмотрение',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FFA500; background: #222; color: #FFA500;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_WAIT + '][IMG]' + GIF_WAIT + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 165, 0)]НА РАССМОТРЕНИИ[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваша жалоба взята на рассмотрение.\nОжидайте ответа в данной теме, не создавая дубликатов.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: PIN_PREFIX,
            status: true, 
        },
        {
            title: '✅ Одобрено (Наказан)',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #00FF00; background: #222; color: #00FF00;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_OK + '][IMG]' + GIF_OK + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(50, 205, 50)]ОДОБРЕНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваша жалоба была внимательно рассмотрена.\nИгрок получит наказание в соответствии с правилами сервера.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '⛔ Отказано (Стандарт)',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]В жалобе отказано.\nПричина: Недостаточно доказательств или нарушения не выявлены.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },

        // -------------------------------------------------------------
        {
            title: '--- ПЕРЕДАЧА (БЕЗ ЛИШНИХ ССЫЛОК) ---',
            dpstyle: 'oswald: 3px; color: #fff; background: #8B0000; box-shadow: 0 0 5px rgba(0,0,0,0.5); border: none;',
        },
        {
            title: '👤 Передать ГА',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FFA500; background: #222; color: #FFF;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 69, 0)]ПЕРЕДАНО ГЛАВНОМУ АДМИНИСТРАТОРУ[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваше обращение передано на рассмотрение Главному Администратору.\nОжидайте его вердикта.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: '⚡ Передать Спец. Адм',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FFA500; background: #222; color: #FFF;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 69, 0)]ПЕРЕДАНО СПЕЦ. АДМИНИСТРАТОРУ[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Тема передана Специальному Администратору.\nПожалуйста, ожидайте, не создавая дубликатов.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]',
            prefix: SPE_PREFIX,
            status: true,
        },
        {
            title: '👑 Передать КП',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #00FFFF; background: #222; color: #00FFFF;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER]' + PROJECT_TEAM + '[/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(0, 255, 255)]ПЕРЕДАНО КОМАНДЕ ПРОЕКТА[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Тема передана для окончательного вердикта Команде Проекта.\nОжидайте ответа.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: CP_PREFIX,
            status: true,
        },
        {
            title: '🔧 Передать Тех. Спецу',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #0000FF; background: #222; color: #0000FF;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(0, 0, 255)]ПЕРЕДАНО ТЕХНИЧЕСКОМУ СПЕЦИАЛИСТУ[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваша жалоба передана на рассмотрение Техническому Специалисту.\nПроверка логов может занять некоторое время.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]',
            prefix: TECH_PREFIX,
            status: true,
        },

        // -------------------------------------------------------------
        {
            title: '--- ПРИЧИНЫ ОТКАЗА (ЖАЛОБЫ) ---',
            dpstyle: 'oswald: 3px; color: #fff; background: #8B0000; box-shadow: 0 0 5px rgba(0,0,0,0.5); border: none;',
        },
        {
            title: 'Не по форме',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваша жалоба составлена не по форме.\nПожалуйста, ознакомьтесь с правилами подачи жалоб и создайте новую тему.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]На ваших доказательствах отсутствует /time.\nВ жалобе отказано.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет Док-в',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]В вашей жалобе отсутствуют доказательства (скриншоты/видео).\nЗагрузите их на фото/видео хостинг и пересоздайте тему.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '3-е лицо',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Жалоба написана от третьего лица (не от вашего имени).\nРассмотрению не подлежит.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дубликат',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Данная тема является дубликатом вашей предыдущей жалобы.\nПожалуйста, ожидайте ответа в первой теме.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло 3 дня',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]С момента нарушения прошло более 72 часов (3 дня).\nСрок подачи жалобы истек.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },

        // -------------------------------------------------------------
        {
            title: '--- ОБЖАЛОВАНИЯ ---',
            dpstyle: 'oswald: 3px; color: #fff; background: #8B0000; box-shadow: 0 0 5px rgba(0,0,0,0.5); border: none;',
        },
        {
            title: '🔓 Сниму наказание',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #00FF00; background: #222; color: #00FF00;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_OK + '][IMG]' + GIF_OK + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(50, 205, 50)]ОДОБРЕНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваше обжалование одобрено.\nНаказание будет снято полностью.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '📉 Снижу срок',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #00FF00; background: #222; color: #00FF00;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_OK + '][IMG]' + GIF_OK + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(50, 205, 50)]НАКАЗАНИЕ СНИЖЕНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Ваше обжалование рассмотрено.\nМы решили сократить срок вашего наказания.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '⛔ Выдано верно',
            dpstyle: 'border-radius: 5px; margin-right: 5px; border: 1px solid #FF0000; background: #222; color: #FF0000;',
            content:
                '[CENTER][URL=' + BANNER + '][IMG]' + BANNER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][FONT=Courier New][SIZE=4]Доброго времени суток, уважаемый {{ user.name }}![/SIZE][/FONT][/CENTER]\n\n' +
                '[CENTER][URL=' + GIF_NO + '][IMG]' + GIF_NO + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][FONT=Courier New][SIZE=5][COLOR=rgb(255, 0, 0)]ОТКАЗАНО[/COLOR][/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][B][FONT=Courier New][SIZE=4]Администратор выдал наказание верно.\nВ обжаловании отказано.[/SIZE][/FONT][/B][/CENTER]\n\n' +
                '[CENTER][URL=' + DIVIDER + '][IMG]' + DIVIDER + '[/IMG][/URL][/CENTER]\n' +
                '[CENTER][B][SIZE=3][COLOR=rgb(255, 0, 0)]С уважением, Команда Проекта White Russia.[/COLOR][/SIZE][/B][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
    ];

    $(document).ready(() => {
        addButton('ОТВЕТЫ', 'selectAnswer', 'background: #8B0000; color: white; border: 1px solid white; margin-left: 10px;');
        const threadData = getThreadData();
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
            });
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').last().before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button ` +
                    `rippleButton" style="margin:5px; width:100%; ${btn.dpstyle}">${btn.title}</button>`,
            )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        
        let editor = document.querySelector('.fr-element.fr-view');
        if (editor) {
            editor.innerHTML = ""; 
            editor.innerHTML = template(data);
        } else {
             let textArea = document.querySelector('textarea');
             if (textArea) {
                 textArea.value = ""; 
                 textArea.value = template(data);
             }
        }

        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            setTimeout(() => {
                $('.button--icon--reply').last().trigger('click');
            }, 800);
        }
    }

    function getThreadData() {
        // Поиск автора (Hard Clean)
        const authorEl = document.querySelector('.message-inner .message-name a.username');
        let authorName = authorEl ? authorEl.innerText : "Игрок";
        authorName = authorName.replace(/<[^>]*>/g, '').trim();

        // Стиль ника
        const styledName = `[COLOR=rgb(255, 0, 0)][B][I][U]${authorName}[/U][/I][/B][/COLOR]`;
        
        return {
            user: {
                id: 0,
                name: styledName,
            }
        };
    }

    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
        const params = {
            prefix_id: prefix,
            title: threadTitle,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        };
        if(pin) params.sticky = 1; 
        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData(params),
        });
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();