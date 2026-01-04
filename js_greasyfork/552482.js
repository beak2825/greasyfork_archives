// ==UserScript==
// @name         ✿ Скрипт для Насти ✿ | Омск
// @namespace    https://forum.blackrussia.online
// @version      1.0.1
// @description  Индивидуальный скрипт для Насти - ГС Госс сервера Омск | по вопросам на счет скрипта - https://vk.com/la_la_knife , последнее обновление 13.10.2025
// @author       Sasha_Dodobrodel🦔
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://sun9-76.userapi.com/impg/rEBGQfiaFZnbUofS8UOFXmokbnWSxJaLR-1Ycg/rxEn_aPc0wc.jpg?size=530x530&quality=95&sign=9ca94b62b95b588d510bc19a4290a530&type=album
// @downloadURL https://update.greasyfork.org/scripts/552482/%E2%9C%BF%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9D%D0%B0%D1%81%D1%82%D0%B8%20%E2%9C%BF%20%7C%20%D0%9E%D0%BC%D1%81%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552482/%E2%9C%BF%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9D%D0%B0%D1%81%D1%82%D0%B8%20%E2%9C%BF%20%7C%20%D0%9E%D0%BC%D1%81%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Константы префиксов
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const PINN_PREFIX = 2;
    const TEXY_PREFIX = 13;
    const OTKAZBIO_PREFIX = 4;
    const ODOBRENOBIO_PREFIX = 8;
    const NARASSMOTRENIIBIO_PREFIX = 2;
    const OTKAZRP_PREFIX = 4;
    const ODOBRENORP_PREFIX = 8;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const OTKAZORG_PREFIX = 4;
    const ODOBRENOORG_PREFIX = 8;
    const NARASSMOTRENIIORG_PREFIX = 2;

    // Стили для кнопок
    const addStyles = () => {
        const styles = `
            <style>
                .nastia-btn {
                    background: linear-gradient(135deg, #ffb6c1, #ff69b4) !important;
                    border: 2px solid #ff1493 !important;
                    border-radius: 25px !important;
                    color: white !important;
                    font-weight: bold !important;
                    padding: 10px 15px !important;
                    margin: 5px !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3) !important;
                    position: relative !important;
                    overflow: hidden !important;
                }

                .nastia-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4) !important;
                    background: linear-gradient(135deg, #ff69b4, #ff1493) !important;
                }

                .nastia-btn::before {
                    content: '✿' !important;
                    margin-right: 5px !important;
                }

                .nastia-btn::after {
                    content: '✿' !important;
                    margin-left: 5px !important;
                }

                .nastia-special {
                    background: linear-gradient(135deg, #dda0dd, #ba55d3) !important;
                    border-color: #9932cc !important;
                }

                .nastia-warning {
                    background: linear-gradient(135deg, #ffa07a, #ff6347) !important;
                    border-color: #ff4500 !important;
                }

                .nastia-success {
                    background: linear-gradient(135deg, #98fb98, #32cd32) !important;
                    border-color: #228b22 !important;
                }

                .nastia-modal {
                    background: linear-gradient(135deg, #fff0f5, #ffe4e1) !important;
                    border: 2px solid #ffb6c1 !important;
                    border-radius: 15px !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                }

                .nastia-header {
                    background: linear-gradient(135deg, #ff69b4, #ff1493) !important;
                    color: white !important;
                    text-align: center !important;
                    padding: 15px !important;
                    border-radius: 12px 12px 0 0 !important;
                    font-weight: bold !important;
                    font-size: 16px !important;
                }

                .select_answer {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    justify-content: center !important;
                    padding: 15px !important;
                    gap: 8px !important;
                }

                .nastia-section {
                    background: rgba(255, 182, 193, 0.1) !important;
                    border: 1px solid #ffb6c1 !important;
                    border-radius: 10px !important;
                    padding: 10px !important;
                    margin: 10px 0 !important;
                    text-align: center !important;
                    font-weight: bold !important;
                    color: #ff69b4 !important;
                    width: 100% !important;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    };

    const buttons = [
        {
            title: '🌸 Приветствие',
            content: `[FONT=Courier New][CENTER][COLOR=#FF69B4]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR][/CENTER]
[CENTER]╰┈➤ ❝ Желаем приятной игры на сервере Омск! ❞[/CENTER][/FONT]`,
            class: 'nastia-special'
        },
        {
            title: '🎯 ЖБ на игроков',
            class: 'nastia-section'
        },
        {
            title: '✅ Одобрено, закрыто',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG][/CENTER]
[CENTER][COLOR=#90EE90][ICODE]Жалоба рассмотрена - игрок будет наказан в соответствии с правилами.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Благодарим за вашу бдительность! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за обращение! Приятной игры на сервере Омск! 🌸[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '⏳ На рассмотрении',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Ваше обращение взято на рассмотрение администрацией сервера Омск.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Пожалуйста, ожидайте ответа и не создавайте дублирующие темы ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Ожидайте решения по вашему вопросу... ⏰[/COLOR][/CENTER]`,
            prefix: PINN_PREFIX,
            status: false,
            class: 'nastia-special'
        },
        {
            title: '❌ Отказано, закрыто',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]К сожалению, в предоставленных доказательствах недостаточно информации для принятия решения по вашему обращению.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Доказательства должны быть чёткими и показывать полный процесс ситуации ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры на сервере Омск! ✨[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '🚫 NonRP поведение',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Помните о важности качественного RolePlay! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за обращение! Приятной игры! ✨[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '🎯 ДМ (DeathMatch)',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.19. Запрещен DM (DeathMatch) - убийство или нанесение урона без веской IC причины | Jail 60 минут[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Каждая агрессия должна иметь RP-обоснование! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за вашу бдительность! 🌸[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '💥 Масс ДМ',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.20. Запрещен Mass DM - убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 3-7 дней[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Массовые нарушения караются строже! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за обращение! 🛡️[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '🐛 Багоюз',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15-30 дней / PermBan[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Честная игра - основа проекта! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за вашу бдительность! 🔍[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '🏃 Уход от РП',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Участвуйте в RolePlay процессе до конца! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за обращение! Приятной игры! ✨[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '🚗 NonRP вождение',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Соблюдайте правила дорожного движения! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за вашу бдительность! 🚦[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '🔫 ДБ (DriveBy)',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил: 2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Каждое действие должно иметь RP-обоснование! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за обращение! Приятной игры! 🚗[/COLOR][/CENTER]
[CENTER][COLOR=#32CD32]✿❯────「 Одобрено • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '❌ Отказ ЖБ',
            class: 'nastia-section'
        },
        {
            title: '🔍 Нарушений не найдено',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Нарушений со стороны данного игрока не было найдено.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Для жалобы необходимы четкие доказательства нарушений ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры на сервере Омск! 🎯[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '⏰ Более 72 часов',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]С момента получения нарушения прошло более 72 часов.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Жалобы принимаются в течение 72 часов с момента нарушения ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! ⏳[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '📹 Нужен фрапс',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]В таких случаях необходим фрапс (видеозапись процесса).[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Видеодоказательства помогают лучше разобраться в ситуации ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Прикрепите полную видеозапись и создайте тему заново! 🎥[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '📝 Форма темы',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Соблюдайте правила оформления жалоб ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! 📋[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '🕒 Нету /time',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]На ваших доказательствах отсутствует /time.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Время необходимо для проверки хронологии событий ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! ⏱️[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '⏱️ Укажите тайм-коды',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]В течении 24х часов укажите тайм-коды, иначе жалоба будет отказана.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Тайм-коды помогают быстро найти нужный момент ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Ожидаем вашего ответа! ⏳[/COLOR][/CENTER]`,
            prefix: PINN_PREFIX,
            status: true,
            class: 'nastia-special'
        },
        {
            title: '🔧 Не работают доква',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Не работают доказательства.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Проверьте работоспособность ссылок ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! 🔗[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '👥 От 3-го лица',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Жалобы от 3-их лиц не принимаются.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Жалобу должен подавать непосредственный участник ситуации ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! 👤[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '🔄 Ответный ДМ',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]В случае ответного ДМ нужна видео-запись. Пересоздайте тему и прикрепите видео-запись.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Полная видеозапись поможет разобраться в ситуации ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! 🎬[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '📧 Дублирование темы',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Дублирование темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Создавайте только одну тему по каждому вопросу ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры! 📝[/COLOR][/CENTER]
[CENTER][COLOR=#FF69B4]✿❯────「 Отказано • Закрыто 」────❮✿[/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '💫 РП ситуации',
            class: 'nastia-section'
        },
        {
            title: '✅ РП ситуация одобрена',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#90EE90][ICODE]Ваша RolePlay ситуация была проверена и получает статус - Одобрено.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Интересная RP-задумка! Удачи в развитии сюжета! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры и качественного RolePlay! 🎭[/COLOR][/CENTER]`,
            prefix: ODOBRENORP_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '❌ РП ситуация отказ',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Ваша RolePlay ситуация была проверена и получает статус - Отказано.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Внимательно ознакомьтесь с правилами создания РП ситуаций ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Вы можете исправить замечания и подать ситуацию снова! 📝[/COLOR][/CENTER]`,
            prefix: OTKAZRP_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '⏳ РП ситуация на доработке',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей РП ситуации.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Убедитесь, что ситуация соответствует всем требованиям ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Ожидаем ваших исправлений! ✏️[/COLOR][/CENTER]`,
            prefix: NARASSMOTRENIIRP_PREFIX,
            status: false,
            class: 'nastia-special'
        },
        {
            title: '🎭 РП биографии',
            class: 'nastia-section'
        },
        {
            title: '✅ РП био одобрена',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#90EE90][ICODE]Ваша RolePlay биография была проверена и получает статус - Одобрено.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Удачной игры по выбранной роли! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры на сервере Омск! 🎭[/COLOR][/CENTER]`,
            prefix: ODOBRENOBIO_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '❌ РП био отказ',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Ваша RolePlay биография была проверена и получает статус - Отказано.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Внимательно ознакомьтесь с правилами создания биографий ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Вы можете исправить замечания и подать биографию снова! 📝[/COLOR][/CENTER]`,
            prefix: OTKAZBIO_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '⏳ РП био на доработке',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей RolePlay биографии.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Убедитесь, что биография соответствует всем требованиям ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Ожидаем ваших исправлений! 📖[/COLOR][/CENTER]`,
            prefix: NARASSMOTRENIIBIO_PREFIX,
            status: false,
            class: 'nastia-special'
        },
        {
            title: '🏢 Неофициальные организации',
            class: 'nastia-section'
        },
        {
            title: '✅ Неофиц. орг. одобрена',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#90EE90][ICODE]Ваша неофициальная организация получает статус - Одобрено.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Удачи в развитии вашей организации! ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Приятной игры и успешного развития! 🏢[/COLOR][/CENTER]`,
            prefix: ODOBRENOORG_PREFIX,
            status: false,
            class: 'nastia-success'
        },
        {
            title: '❌ Неофиц. орг. отказ',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Ваша неофициальная организация получает статус - Отказано.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Внимательно ознакомьтесь с правилами создания организаций ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Вы можете исправить замечания и подать заявку снова! 📋[/COLOR][/CENTER]`,
            prefix: OTKAZORG_PREFIX,
            status: false,
            class: 'nastia-warning'
        },
        {
            title: '⏳ Неофиц. орг. на доработке',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение вашей неофициальной организации.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Убедитесь, что организация соответствует всем требованиям ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Ожидаем ваших исправлений! 🏛️[/COLOR][/CENTER]`,
            prefix: NARASSMOTRENIIORG_PREFIX,
            status: false,
            class: 'nastia-special'
        },
        {
            title: '🔄 Передачи',
            class: 'nastia-section'
        },
        {
            title: '🔧 Техническому специалисту',
            content: `[CENTER][COLOR=#FF69B4][B]Доброго времени суток, уважаемый {{ user.name }}![/B][/COLOR][/CENTER]
[CENTER][IMG]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/IMG][/CENTER]
[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение техническому специалисту.[/ICODE][/COLOR][/CENTER]
[CENTER][COLOR=#FFB6C1]╰┈➤ ❝ Ожидайте ответа от технической команды ❞[/COLOR][/CENTER]
[CENTER][COLOR=#00FFFF]Спасибо за обращение! 🔧[/COLOR][/CENTER]`,
            prefix: TEXY_PREFIX,
            status: true,
            class: 'nastia-special'
        }
    ];

    // Функция для добавления кнопок
    function addButton(name, id, className = 'nastia-btn') {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton ${className}" id="${id}" style="margin: 3px;">${name}</button>`
        );
    }

    // Разметка для модального окна
    function buttonsMarkup(buttons) {
        let currentSection = '';
        let markup = '<div class="nastia-modal"><div class="nastia-header">🌸 Выберите ответ ✿</div><div class="select_answer">';

        buttons.forEach((btn, i) => {
            if (btn.class === 'nastia-section') {
                if (currentSection !== '') {
                    markup += '</div>';
                }
                markup += `<div class="nastia-section">${btn.title}</div><div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 10px 0;">`;
                currentSection = btn.title;
            } else {
                markup += `<button id="answers-${i}" class="button ${btn.class || 'nastia-btn'}" style="margin:5px">
                    <span class="button-text">${btn.title}</span>
                </button>`;
            }
        });

        if (currentSection !== '') {
            markup += '</div>';
        }

        markup += '</div></div>';
        return markup;
    }

    $(document).ready(() => {
        // Добавляем стили
        addStyles();

        // Загрузка Handlebars
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавляем основные кнопки
        addButton('✿ На рассмотрение', 'pin', 'nastia-btn nastia-special');
        addButton('✅ Одобрено', 'accepted', 'nastia-btn nastia-success');
        addButton('❌ Отказано', 'unaccept', 'nastia-btn nastia-warning');
        addButton('🔧 Тех. Спец', 'Texy', 'nastia-btn');
        addButton('🔒 Закрыто', 'Zakrito', 'nastia-btn');
        addButton('🌸 Ответы', 'selectAnswer', 'nastia-btn nastia-special');

        // Получаем данные темы
        const threadData = getThreadData();

        // Назначаем обработчики для основных кнопок
        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
        $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

        // Обработчик для кнопки ответов
        $('button#selectAnswer').click(() => {
            XF.alert(buttonsMarkup(buttons), null, '🌸 Настя ✿');

            buttons.forEach((btn, id) => {
                if (btn.content) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
            });
        });
    });

    // Функция для вставки содержимого
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') {
            $('.fr-element.fr-view p').empty();
        }

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    // Получение данных темы
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
                4 < hours && hours <= 11 ? 'Доброе утро' :
                11 < hours && hours <= 15 ? 'Добрый день' :
                15 < hours && hours <= 21 ? 'Добрый вечер' : 'Доброй ночи',
        };
    }

    // Редактирование данных темы
    function editThreadData(prefix, pin = false) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
        const formData = new FormData();

        formData.append('prefix_id', prefix);
        formData.append('title', threadTitle);
        formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', document.URL.split(XF.config.url.fullBase)[1]);
        formData.append('_xfWithData', 1);
        formData.append('_xfResponseType', 'json');

        if (pin) {
            formData.append('pin', 1);
        }

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: formData
        }).then(() => location.reload());
    }

    // Вспомогательная функция для FormData
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

//скрипт писался 7 часов, за эту работу я получил "спасибо"
})();