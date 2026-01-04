// ==UserScript==
// @name         OMSK | CHIEF Script
// @namespace    https://forum.blackrussia.online/
// @version      1.0.4
// @description  Скрипт для Руководства сервера OMSK | по всем вопросам на счет скрипта VK - https://vk.com/la_la_knife , последнее обновление 13.10.2025
// @author       Sasha_Dodobrodel🦔
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/552251/OMSK%20%7C%20CHIEF%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/552251/OMSK%20%7C%20CHIEF%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SA_PREFIX = 11; // Добавлено: префикс для Специальной Администрации
    const GA_PREFIX = 12; // Добавлено: префикс для Главного Администратора

    // Стили для кнопок
    const addStyles = () => {
        const styles = `
            <style>
                .chief-btn {
                    background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
                    border: 2px solid #00CED1 !important;
                    border-radius: 25px !important;
                    color: white !important;
                    font-weight: bold !important;
                    padding: 10px 15px !important;
                    margin: 5px !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 4px 15px rgba(0, 206, 209, 0.3) !important;
                    position: relative !important;
                    overflow: hidden !important;
                }

                .chief-btn:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(0, 206, 209, 0.4) !important;
                    background: linear-gradient(135deg, #2a5298, #1e3c72) !important;
                }

                .chief-btn::before {
                    content: '⚡' !important;
                    margin-right: 5px !important;
                }

                .chief-btn::after {
                    content: '⚡' !important;
                    margin-left: 5px !important;
                }

                .chief-special {
                    background: linear-gradient(135deg, #00CED1, #008B8B) !important;
                    border-color: #00CED1 !important;
                }

                .chief-warning {
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
                    border-color: #ff4500 !important;
                }

                .chief-success {
                    background: linear-gradient(135deg, #00b894, #00a085) !important;
                    border-color: #228b22 !important;
                }

                .chief-modal {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef) !important;
                    border: 2px solid #00CED1 !important;
                    border-radius: 15px !important;
                    max-height: 80vh !important;
                    overflow-y: auto !important;
                }

                .chief-header {
                    background: linear-gradient(135deg, #1e3c72, #2a5298) !important;
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

                .chief-section {
                    background: rgba(0, 206, 209, 0.1) !important;
                    border: 1px solid #00CED1 !important;
                    border-radius: 10px !important;
                    padding: 10px !important;
                    margin: 10px 0 !important;
                    text-align: center !important;
                    font-weight: bold !important;
                    color: #1e3c72 !important;
                    width: 100% !important;
                    font-size: 14px !important;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    };

    const buttons = [
        {
            title: 'ПРИВЕТСТВИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER] [/CENTER][/FONT]',
            class: 'chief-special'
        },
        {
            title: ' ЖАЛОБЫ НА АДМИНИСТРАЦИЮ ',
            class: 'chief-section'
        },
        {
            title: 'ЗАПРОСИТЬ ДОКВА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Запрошу доказательства у администратора. Просьба ожидать ответа и не нужно создавать копии тем.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на сервере [COLOR=#00CED1]OMSK[/COLOR].[/CENTER][/FONT]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'НАКАЗАНИЕ ЗА ФОРУМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Игрок написал на вас жалобу, исходя из этой жалобы вам было выдано наказание.[/CENTER]<br><br>" +
                "[CENTER]Проверю верность вердикта куратора форума, ожидайте ответа.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на сервере [COLOR=#00CED1]OMSK[/COLOR].[/CENTER][/FONT]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ОТПРАВИТЬ НА РАССМОТРЕНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на сервере [COLOR=#00CED1]OMSK[/COLOR].[/CENTER][/FONT]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'БАН ПО IP',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/CENTER]<br><br>" +
                "[CENTER]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет.<br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: WATCHED_PREFIX,
            status: false,
            class: 'chief-special'
        },
        {
            title: 'ЖАЛОБА ОДОБРЕНА В СТОРОНУ ИГРОКА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: WATCHED_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'НАКАЗАТЬ АДМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба была одобрена и администратор будет наказан,Cпасибо за информацию.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: WATCHED_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ДУБЛИРОВАНИЕ ТЕМЫ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОТВЕТ В ПРОШЛОЙ ЖАЛОБЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ответ был дан в прошлой теме [/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'БЕСЕДА С АДМИНОМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]С администратором будет проведена беседа,Cпасибо за информацию.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ОШИБЛИСЬ СЕРВЕРОМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'КАЧЕСТВО ДОКВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОТСУТСТВУЕТ СКРИНШОТ ОКНА БЛОКИРОВКИ АККАУНТА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'АДМИН ПРАВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Доказательства были предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'АДМИН ПРАВ,ОПРУ НА САМООБОРОНУ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Доказательства были предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
                "[CENTER]Если Dm и вправду был ответным вы должны предоставить доказательства[/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/CENTER]<br><br>" +
                "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/CENTER]<br><br>" +
                "[CENTER]Переподайте жалобу с прикреплёнными доказательствами[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'КФ ПРАВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Проверив поданную жалобу на вас от игрока, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ЖАЛОБА НЕ ПО ФОРМЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]" +
                '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ДОКВА НЕ В ИМГУР ЯПИКС',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОТСУТСТВУЮТ ДОКАЗАТЕЛЬСТВА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НЕДОСТАТОЧНО ДОКАЗАТЕЛЬСТВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашей жалобе недостаточно доказательств.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НАПРАВИТЬ В ТЕХНИЧЕСКИЙ РАЗДЕЛ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в технический раздел.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'БОЛЕЕ 48 ЧАСОВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОТСУТСТВУЕТ СКРИНШОТ ВЫДАЧИ НАКАЗАНИЯ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашей жалобе отсутствует скриншот выдачи наказания.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ПЕРЕДАНО ЗГА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба будет передана Заместителю Главного Администратора на рассмотрение. Ожидайте его ответа.<br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ПЕРЕДАНО ГА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба будет передана Главному Администратору на рассмотрение. Ожидайте его ответа.<br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: GA_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ПЕРЕДАНО СА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной администрации[/COLOR] <br><br>" +
                "[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: SA_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ПЕРЕДАНО SAKARO',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба передана [COLOR=rgb(44, 130, 201)]Руководителю модерации Discord [/COLOR] <br><br>" +
                "[CENTER] @sakaro [/CENTER] <br><br>" +
                "[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'НАПРАВИТЬ В РАЗДЕЛ ОБЖАЛОВАНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалование наказаний.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Отказано.[/CENTER][/FONT]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'СНЯТЬ АДМИНА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Администратор будет снят со своего поста.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'БЕСЕДА С КФ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]С куратором форума будет проведена беседа, ваша жалоба будет перерассмотрена.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'НАКАЗАТЬ КФ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Куратор форума будет наказан, ваша жалоба будет перерассмотрена.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ЖАЛОБА ОТ 3 ЛИЦА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба составлена от 3-го лица.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ЖБ С РЕДАКТОМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Доказательства должны быть без обрезок/замазок.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОСКОРБИТЕЛЬНАЯ ЖАЛОБА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит.<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НЕКЛИКАБЕЛЬНАЯ ССЫЛКА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ссылка на ваше доказательство не кликабельная, создайте новую тему с нормальной ссылкой.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НЕ РАБОТАЮТ ДОКАЗАТЕЛЬСТВА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ссылка на ваше доказательство не работает, создайте новую тему с нормальной ссылкой.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НАРУШЕНИЙ ОТ АДМ НЕТУ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'СМЕНА НАКАЗАНИЯ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание будет заменено на другое.[/CENTER]<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'СНЯТЬ НАКАЗАНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание снято.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'НЕТУ ССЫЛКИ НА ЖБ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Нужно предоставить ссылку на вашу жалобу.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НЕТУ /TIME',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ЖАЛОБА ОФФТОП',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша тема никак не отностится к разделу жалобы на администрацию.<br><br>" +
                "[CENTER]Приятной игры на нашем сервера.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НАКАЗАТЬ АДМИНА И СНЯТЬ НАКАЗАНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша жалоба одобрена, администратор будет наказан.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
                '[CENTER]Приятной игры на нашем сервера.[/CENTER][/FONT]',
            prefix: WATCHED_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ПОДДЕЛКА ДОКВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: WATCHED_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: ' ОБЖАЛОВАНИЯ ',
            class: 'chief-section'
        },
        {
            title: 'ПРИВЕТСТВИЕ ОБЖ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]                       [/CENTER][/FONT]',
            class: 'chief-special'
        },
        {
            title: 'ОТПРАВИТЬ НА РАССМОТРЕНИЕ ОБЖ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
                '[CENTER][Color=Orange]Ожидайте ответа.[/CENTER][/FONT][/color]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ГРУБОЕ НАРУШЕНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В обжаловании отказано. Так как ваше наказание было слишком грубым. (Например: большое количество нарушенных правил сервреа, грубое нарушение с вашей стороны и т.д.)<br><br>" +
                '[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОБЖАЛОВАНИЕ НОНРП ОБМАН',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Если вы хотите хотите обжаловать наказание за НонРП обман вы должны сами связаться с человеком, которого обманули,После чего он должен написать на вас обжалование прикрепив доказательства договора о возврате имущества,ссылку на жалобу которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон,По другому вы никак не сможете обжаловать наказание за НонРП обман.<br><br>" +
                '[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОБЖАЛОВАНИЕ НИК',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваш аккаунт будет разблокирован ровно на 24 часа, если в течении 24 часа вы не смените свой никнейм, то вы будете заново заблокированы, для смены ника используйте /mm 10, доказательство прикрепить сюда.<br><br>" +
                '[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/color]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ЗАПРОС ССЫЛКИ ВК',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Прикрепите ссылку на ваш Вконтакте.<br><br>" +
                '[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/color]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ОБЖАЛОВАНИЕ ППВ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                '[CENTER]Восстановите пароль через группу в ВК и пересоздайте жалобу. Также приложите скриншот из ВК, что вы изменили пароль, но не забудьте замазать сам пароль.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НЕ ОСОЗНАЛИ ВИНУ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В обжалование отказано, в данный момент мы не уверены что вы осознали свой поступок.<br><br>" +
                '[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НЕ ГОТОВЫ ПОЙТИ НА ВСТРЕЧУ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание.<br><br>" +
                '[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОБЖАЛОВАНИЮ НЕ ПОДЛЕЖИТ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Данное наказание не подлежит обжалованию.<br><br>" +
                '[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОДОБРИТЬ ОБЖАЛОВАНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.[/CENTER]<br><br>" +
                '[CENTER][Color=Green]Одобрено.[/CENTER][/FONT][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ОТКАЗАТЬ ОБЖАЛОВАНИЕ',
            content: '[FONT=times new roman][CENTER] {{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В обжаловании отказано.<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'СНИЗИТЬ НАКАЗАНИЕ ДО МИНИМАЛЬНЫХ МЕР',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание будет снижено до минимальных мер.<br><br>" +
                '[CENTER][Color=#AEF359]Одобрено.[/CENTER][/FONT][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ОТСУТСТВУЮТ ДОКАЗАТЕЛЬСТВА ОБЖ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашем обжаловании отсутствуют доказательства.<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОТПИСАЛ НЕ ТОТ ИГРОК',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Вам в профиле написал не тот игрок которого вы обманули.<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОТСУТСТВУЕТ СКРИН ОКНА БАНА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]В вашем обжаловании отсутствует скриншот окна блокировки аккаунта.<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ДУБЛИРОВАНИЕ ТЕМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Если вы дальше будете дублировать темы в данном разделе, то ваш форумный аккаунт будет заблокирован.<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ДОКВА ПОДДЕЛАНЫ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
                '[CENTER]Закрыто.[/CENTER][/FONT]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'УЖЕ ЕСТЬ МИН. НАКАЗАНИЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Вам итак выдано минимальное наказание за нарушение.<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'СНИЗИТЬ ДО 30 ДНЕЙ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание будет снижено до 30 дней.<br><br>" +
                '[CENTER][Color=green]Одобрено.[/CENTER][/FONT][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'СНИЗИТЬ ДО 15 ДНЕЙ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание будет снижено до 15 дней.<br><br>" +
                '[CENTER][Color=green]Одобрено.[/CENTER][/FONT][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'СНИЗИТЬ ДО 7 ДНЕЙ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание будет снижено до 7 дней.<br><br>" +
                '[CENTER][Color=green]Одобрено.[/CENTER][/FONT][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'ОБЖАЛОВАНИЕ НЕ ПО ФОРМЕ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR].<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НАПРАВИТЬ В РАЗДЕЛ ЖБ НА АДМ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обраться в раздел жалоб на администрацию.<br><br>" +
                '[CENTER][Color=Red]Отказано.[/CENTER][/FONT][/color]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'НАПРАВИТЬ В РАЗДЕЛ ЖБ НА ТЕХ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратиться в раздел жалоб на технических специалистов (наказания выданны техническим специалистом не подлежат обжалованию.).<br><br>" +
                '[CENTER][Color=Red]Отказано.[/CENTER][/FONT][/color]',
            prefix: UNACCEPT_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ДОКАЗАТЕЛЬСТВО В СОЦ СЕТИ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
                '[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОШИБЛИСЬ СЕРВЕРОМ ОБЖ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Вы ошиблись сервером. Подайте обжалование в разделе своего форума.[/CENTER]<br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'NRP ОБМАН 24 ЧАСА',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Аккаунт будет разблокирован. если в течении 24-ех часов ущерб не будет возмещён владельцу согласно вашей договоренности акканут будет заблокирован навсегда.[/CENTER]<br><br>" +
                '[CENTER]Вы должны прислать видео доказательство возврата имущества в данную тему.[/CENTER][/FONT]',
            prefix: PIN_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ИГРОК ВЕРНУЛ УЩЕРБ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет.[/CENTER]<br><br>" +
                '[CENTER][Color=GREEN]Одобрено.[/CENTER][/FONT][/color]',
            prefix: ACCEPT_PREFIX,
            status: false,
            class: 'chief-success'
        },
        {
            title: 'МУТ/ДЖАИЛ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше наказание не столь строгое для обжалования. <br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ОБЖАЛОВАНИЕ ОФФТОП',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваша тема никак не отностится к разделу обжалования наказаний. <br><br>" +
                '[CENTER][Color=Red]Закрыто.[/CENTER][/FONT][/color]',
            prefix: CLOSE_PREFIX,
            status: false,
            class: 'chief-warning'
        },
        {
            title: 'ПЕРЕДАТЬ ГА ОБЖ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше обжалование передано Главному администратору.[/CENTER]<br><br>" +
                '[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/color]',
            prefix: GA_PREFIX,
            status: true,
            class: 'chief-special'
        },
        {
            title: 'ПЕРЕДАТЬ СА ОБЖ',
            content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
                "[CENTER]Ваше обжалование передано Специальной администрации.[/CENTER]<br><br>" +
                '[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/color]',
            prefix: SA_PREFIX,
            status: true,
            class: 'chief-special'
        },
    ];

    $(document).ready(() => {
        // Добавляем стили
        addStyles();

        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('⚡ На рассмотрение', 'pin', 'chief-btn chief-special');
        addButton('👥 КП', 'teamProject', 'chief-btn');
        addButton('✅ Одобрено', 'accepted', 'chief-btn chief-success');
        addButton('❌ Отказано', 'unaccept', 'chief-btn chief-warning');
        addButton('🔒 Закрыто', 'close', 'chief-btn chief-warning');
        addButton('⚡ Ответы', 'selectAnswer', 'chief-btn chief-special');

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, '⚡ OMSK | CHIEF Script');
            buttons.forEach((btn, id) => {
                if (id > 0 && btn.content) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else if (btn.content) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    // Функция для добавления кнопок
    function addButton(name, id, className = 'chief-btn') {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton ${className}" id="${id}" style="margin: 3px;">${name}</button>`
        );
    }

    // Разметка для модального окна
    function buttonsMarkup(buttons) {
        let currentSection = '';
        let markup = '<div class="chief-modal"><div class="chief-header">⚡ OMSK | CHIEF Script</div><div class="select_answer">';

        buttons.forEach((btn, i) => {
            if (btn.class === 'chief-section') {
                if (currentSection !== '') {
                    markup += '</div>';
                }
                markup += `<div class="chief-section">${btn.title}</div><div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 10px 0;">`;
                currentSection = btn.title;
            } else {
                markup += `<button id="answers-${i}" class="button ${btn.class || 'chief-btn'}" style="margin:5px">
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
        const threadTitle =
            $('.p-title-value')[0].lastChild.textContent;

        if (pin == false) {
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
        if (pin == true) {
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

    //Скрипт писался 12 часов. Он сделан для удобства работы руководства сервера ОМСК :)
})();