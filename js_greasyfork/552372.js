// ==UserScript==
// @name         OMSK | CHIEF Script новый
// @namespace    https://forum.blackrussia.online/
// @version      1.1.2
// @description  Скрипт для Руководства сервера OMSK | По всем вопросам VK: vk.com/la_la_knife | Обновление 08.12.2025
// @author       Sasha_Dodobrodel
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/552372/OMSK%20%7C%20CHIEF%20Script%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/552372/OMSK%20%7C%20CHIEF%20Script%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SA_PREFIX = 11; // Префикс для Специальной Администрации
const GA_PREFIX = 12; // Префикс для Главного Администратора

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
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER] [/CENTER][/FONT]',
class: 'chief-special'
},

// ========== ЖАЛОБЫ НА АДМИНИСТРАЦИЮ ==========
{
title: ' ЖАЛОБЫ НА АДМИНИСТРАЦИЮ ',
class: 'chief-section'
},
{
title: 'ОТПРАВИТЬ НА РАССМОТРЕНИЕ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на сервере [COLOR=#00CED1]OMSK[/COLOR].[/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ОДОБРЕНА ЖБ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: WATCHED_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'АДМ БУДЕТ НАКАЗАН',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и администратор будет наказан, спасибо за информацию.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: WATCHED_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'ОТВЕТ В ПРОШЛОЙ ЖБ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более. Ответ был дан в прошлой теме.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'АДМ ПРАВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства были предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЖБ НЕ ПО ФОРМЕ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ДОКИ СОЦ СЕТИ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕТ ДОКОВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'МАЛО ДОКОВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе недостаточно доказательств.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЖБ НА ТЕХ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на технических специалистов.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ПРОШЛО 48Ч',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С момента выдачи наказания прошло больше 48 часов и истек срок подачи жалобы.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ОСК ЖБ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕТ СКРИНА НАКАЗАНИЯ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот выдачи наказания.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ПЕРЕДАНО ЗГА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=#FF0000]Заместителю Главного Администратора[/COLOR]. Ожидайте ответа в данной теме.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ПЕРЕДАНО ГА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба переадресована [COLOR=#FF0000]Главному Администратору[/COLOR]. Ожидайте ответа в данной теме.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: GA_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ПЕРЕДАНО СА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба переадресована [COLOR=#FF0000]Специальной администрации[/COLOR]. Ожидайте ответа в данной теме.[/CENTER]<br><br>" +
"[CENTER]Ответ может занять более 48 часов.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: SA_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ПЕРЕДАНО SAKARO',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=rgb(44, 130, 201)]Руководителю модерации Discord [/COLOR] <br><br>" +
"[CENTER] @sakaro [/CENTER] <br><br>" +
"[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'НАПРАВИТЬ В ОБЖ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалование наказаний.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'БЕСЕДА С АДМ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена беседа.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'РАБОТА С АДМ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена соответствующая работа.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере. Спасибо за информацию.[/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'НАРУШЕНИЙ АДМ НЕТ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕТ ДОКОВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'МАЛО ДОКОВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе недостаточно доказательств на нарушение администратора.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕТ СКРИНА ОКНА БАНА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
  title: 'НЕПРАВИЛЬНЫЕ ДОКИ',
  content:
    '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
    '[CENTER]<b>ДОКАЗАТЕЛЬСТВА ДОЛЖНЫ СООТВЕТСТВОВАТЬ СЛЕДУЮЩИМ УСЛОВИЯМ:</b><br><br>' +
    '• Запись или скриншоты в хорошем качестве<br>' +
    '• Отсутствие обрезки, закрашивания или редактирования<br>' +
    '• Рабочие и доступные ссылки на докозательства<br>' +
    '• Чёткая видимость нарушения и участников<br>' +
    '• Полная запись инцидента с контекстом<br><br>' +
    'Пожалуйста, создайте новую жалобу с соответствующими требованиям доказательствами.<br><br>' +
    'Приятной игры на нашем сервере.[/CENTER]<br><br>' +
    '[CENTER]Закрыто.[/CENTER][/FONT]',
  prefix: CLOSE_PREFIX,
  status: false,
  class: 'chief-warning'
},
{
title: 'ЖАЛОБА ОТ 3 ЛИЦА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-го лица.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЗАМЕНА НАКАЗАНИЯ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет заменено на другое.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'НЕТУ ССЫЛКИ НА ЖБ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нужно предоставить ссылку на вашу жалобу.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕТУ /TIME',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЖБ ОФФТОП',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша тема никак не отностится к разделу жалобы на администрацию.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ПОДДЕЛКА ДОКВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: WATCHED_PREFIX,
status: false,
class: 'chief-warning'
},

// ========== ОБЖАЛОВАНИЯ ==========
{
title: ' ОБЖАЛОВАНИЯ ',
class: 'chief-section'
},
{
title: 'ОТПРАВИТЬ НА РАССМОТРЕНИЕ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FFA500]Ожидайте ответа.[/COLOR][/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ОТКАЗАТЬ',
content:
'[FONT=times new roman][CENTER] {{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В обжаловании отказано.<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ОДОБРИТЬ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.[/CENTER]<br><br>" +
'[CENTER][COLOR=#008000]Одобрено.[/COLOR][/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'ОБЖ ППВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
'[CENTER]Восстановите пароль через группу в ВК и пересоздайте жалобу. Также приложите скриншот из ВК, что вы изменили пароль, но не забудьте замазать сам пароль.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ОБЖ НРП ОБМАН',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Если вы хотите хотите обжаловать наказание за НонРП обман вы должны сами связаться с человеком, которого обманули,После чего он должен написать на вас обжалование прикрепив доказательства договора о возврате имущества,ссылку на жалобу которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон,По другому вы никак не сможете обжаловать наказание за НонРП обман.<br><br>" +
'[CENTER][COLOR=#FF0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'СНИЗИТЬ НАКАЗАНИЕ ДО МИНИМАЛЬНЫХ МЕР',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет снижено до минимальных мер.<br><br>" +
'[CENTER][COLOR=#AEF359]Одобрено.[/COLOR][/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'НЕТ ДОКОВ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашем обжаловании отсутствуют доказательства.<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ОТПИСАЛ НЕ ТОТ ИГРОК',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вам написал не тот игрок которого вы обманули.<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕТ СКРИНА ОКНА БАНА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашем обжаловании отсутствует скриншот окна блокировки аккаунта.<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ДОКВЫ ПОДДЕЛАНЫ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'УЖЕ ЕСТЬ МИН. НАКАЗАНИЕ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вам итак выдано минимальное наказание за нарушение.<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'СНИЗИТЬ ДО 30 ДНЕЙ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет снижено до 30 дней.<br><br>" +
'[CENTER][COLOR=green]Одобрено.[/COLOR][/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'СНИЗИТЬ ДО 15 ДНЕЙ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет снижено до 15 дней.<br><br>" +
'[CENTER][COLOR=green]Одобрено.[/COLOR][/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'СНИЗИТЬ ДО 7 ДНЕЙ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет снижено до 7 дней.<br><br>" +
'[CENTER][COLOR=green]Одобрено.[/COLOR][/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'НЕ ПО ФОРМЕ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке [COLOR=rgb(226, 80, 65)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Правила подачи*[/URL][/COLOR].<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НАПРАВИТЬ В ЖБ НА АДМ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обраться в раздел жалоб на администрацию.<br><br>" +
'[CENTER][COLOR=#FF0000]Отказано.[/COLOR][/CENTER][/FONT]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ДОКИ В СОЦ СЕТИ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
'[CENTER][COLOR=#FF0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЗАПРОС ССЫЛКИ ВК',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Прикрепите ссылку на ваш Вконтакте.<br><br>" +
'[CENTER][COLOR=#FFA500]Ожидаю вашего ответа.[/COLOR][/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'NRP ОБМАН 24ч',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваш аккаунт будет разблокирован на 24 часа. Вам необходимо за этот промежуток времени зайти на сервер и вернуть имущество обманутой стороне. После чего, прикрепить видеозапись(доказательства) в эту тему.[/CENTER]<br><br>" +
"[CENTER]Если же имущество не будет возвращено - аккаунт будет вновь заблокирован.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FFA500]Ожидаю вашего ответа.[/COLOR][/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ПЕРЕДАТЬ ГА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование было передано на рассмотрение [COLOR=#FF0000]Главному Администратору[/COLOR]. Просьба не создавать дубликаты темы.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FFA500]Ожидайте ответа.[/COLOR][/CENTER][/FONT]',
prefix: GA_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ПЕРЕДАТЬ СА',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше обжалование было передано на рассмотрение [COLOR=#FF0000]Специальному Администратору[/COLOR]. Ответ может занять более 48 часов.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FFA500]Ожидайте ответа.[/COLOR][/CENTER][/FONT]',
prefix: SA_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ИГРОК ВЕРНУЛ УЩЕРБ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет.[/CENTER]<br><br>" +
'[CENTER][COLOR=GREEN]Одобрено.[/COLOR][/CENTER][/FONT]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'chief-success'
},
{
title: 'МУТ/ДЖАИЛ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание не столь строгое для обжалования. <br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ОБЖ ОФФТОП',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша тема никак не отностится к разделу обжалования наказаний. <br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЗАПРОС ПРИВЯЗОК',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Предоставьте все данные о привязках которые были на вашем аккаунте. ВК и Телеграмм необходимо предоставить по ID.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FFA500]Ожидаю вашего ответа.[/COLOR][/CENTER][/FONT]',
prefix: PIN_PREFIX,
status: true,
class: 'chief-special'
},
{
title: 'ЧУЖИЕ ПРИВЯЗКИ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]К Вашему аккаунту привязана чужая привязка. Обжалованию не подлежит.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FF0000]Закрыто.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЧЕРНЫЙ СПИСОК 6 МЕС',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Минимальный срок нахождения в Черном списке Администрации составляет 6 месяцев.[/CENTER]<br><br>" +
'[CENTER][COLOR=#FF0000]В обжаловании отказано.[/COLOR][/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ЖБ С РЕДАКТОМ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть без обрезок/замазок.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'НЕ РАБОТАЮТ ДОКИ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ссылка на ваше доказательство не работает, создайте новую тему с нормальной ссылкой.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
{
title: 'ОБЖ НЕ ПОДЛЕЖИТ',
content: '[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Данное наказание не подлежит обжалованию.<br><br>" +
'[CENTER][Color=Red]Отказано, закрыто.[/CENTER][/FONT][/color]',
prefix: CLOSE_PREFIX,
tatus: false,
class: 'chief-warning'
},

// ========== ДОПОЛНИТЕЛЬНЫЕ ОТВЕТЫ ==========
{
title: ' ДОПОЛНИТЕЛЬНЫЕ ОТВЕТЫ ',
class: 'chief-section'
},
{
title: 'БАН ПО IP',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN[/CENTER]<br><br>" +
"[CENTER]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT]',
prefix: WATCHED_PREFIX,
status: false,
class: 'chief-special'
},
{
title: 'ОШИБЛИСЬ СЕРВЕРОМ',
content:
'[FONT=times new roman][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT]',
prefix: CLOSE_PREFIX,
status: false,
class: 'chief-warning'
},
];

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

$(document).ready(() => {
    // Добавляем стили
    addStyles();

    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('⚡ На рассмотрение', 'pin', 'chief-btn chief-special');
    addButton('✅ Одобрено', 'accepted', 'chief-btn chief-success');
    addButton('❌ Отказано', 'unaccept', 'chief-btn chief-warning');
    addButton('🔒 Закрыто', 'close', 'chief-btn chief-warning');
    addButton('👥 КП', 'teamProject', 'chief-btn');
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
            if(id > 0 && btn.content) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else if (btn.content) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            }
        });
    });
});

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
    const threadTitle =
        $('.p-title-value')[0].lastChild.textContent;

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

//Скрипт писался 20 часов. Он сделан для удобства работы руководства сервера ОМСК :)
})();