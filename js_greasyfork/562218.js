// ==UserScript==
// @name         King BLUE script
// @namespace    https://forum.kingrussia.com/index.php*
// @version      1.2.2
// @description  Версия для сервера BLUE
// @author       Mark_Belf | VK - https://vk.com/mark17babanin
// @match        https://forum.kingrussia.com/index.php*
// @include      https://forum.kingrussia.com/index.php*
// @grant        none
// @license      MIT
// @icon         https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/562218/King%20BLUE%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/562218/King%20BLUE%20script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 6; // префикс отказано
    const ACCEPT_PREFIX = 5; // префикс одобрено
    const PIN_PREFIX = 4; // префикс закрепить
    const COMMAND_PREFIX = 9; // команде проекта
    const CLOSE_PREFIX = 3; // префикс закрыто
    const DECIDED_PREFIX = 6; // префикс решено
    const WATCHED_PREFIX = 7; // рассмотрено
    const TEX_PREFIX = 10; // техническому специалисту
    const GA_PREFIX = 8; // главному админу
    const SA_PREFIX = 12; // спец админу
    const NO_PREFIX = 14;

    const biography = [
        {
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Свой ответ для жалобы✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            dpstyle: 'font-family: Oswald; font-size:10px; color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
        },
        {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]" +
                "[B][CENTER][FONT=Arial][size=14px]Ваш текст[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваш текст[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'Отказ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваш текст[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'Жалоба от 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваш текст[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0026]Закрыто.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {         
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Передано✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #DAA520; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
        },
        {
            title: 'Специальному Администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба передана[COLOR=#ff0000] Специальному Администратору[/COLOR],  пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: SA_PREFIX,
            status: true,
        },
        {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба взята на рассмотрение, пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Команде Проекта',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба передана[COLOR=#ff0000] Команде Проекта[/COLOR],  пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: COMMAND_PREFIX,
            status: true,
        },
        {
            title: 'Передано Тех. адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба передана[COLOR=#0000FF] Техническому Администратору[/COLOR], пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: TEX_PREFIX,
            status: true,
        },
        {
            title: 'Передано ГА',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба передана[COLOR=#ff0000] Главному Администратору[/COLOR], пожалуйста, ожидайте ответа и не нужно создавать повторные темы.[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: GA_PREFIX,
            status: true,
        },
        {
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Статус одобрено✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
        },
        {
            title: 'NonRP Обман',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.05. [/color] . Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| Ban 5-30 дней / PermBan[/color].[/B][/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Сторонне ПО',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками  [Color=#ff0000] | Ban 15 - 30 дней / PermBan[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Fake',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]4.11.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| PermBan[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оскорбление // Упом. родни',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Багоюз анимации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оскорбление',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][COLOR=#ff0026]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30-180 минут[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск. Адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.49.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут / Ban 1-30 дней[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск. проекта',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/FONT][/size][/COLOR][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'CapsLock',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 10-30 минут[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Flood',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 10-30 минут[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Meta Gaming',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.18.[/color] Запрещен MG(MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 10-30 минут[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Политическая // Религ. пропоганда',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000] 3.16.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выдача себя за администратора',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]3.09.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 дней + ОЧС администрации[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'OОC угрозы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][FONT=Arial][size=14px][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'ППИВ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Обман администрации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Угроза о наказании от Адм.',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Игрок будет наказан по следующему пункту правил:[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][Color=#ff0000]3.08.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут / Ban 10-30 дней / Черный Список проекта[/color].[/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Статус отказано✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
        },
        {
            title: 'Администрация не может выдать наказание',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Администрация не может выдать наказание по вашим доказательствам.[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0026]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нарушений не найдено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Нарушений со стороны данного игрока не было найдено. [/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание уже выдано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Наказание игроку уже было выдано. [/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Дубликат жалобы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Данная жалоба - дубликат вашей прошлой жалобы.[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]За повторные жалобы Ваш форумный аккаунт может быть[COLOR=#ff0000] заблокирован.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Разные ники',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Никнейм в жалобе и доказательствах отличаются.[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Из-за недостатка доказательств мы помочь не можем. [/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Без доказательств мы помочь не можем. [/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба составлена не по форме. [/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]На ваших доказательствах отсутствует /time.  [/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет time кодов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]На ваших доказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. [/FONT][/size][/CENTER]<br>" +
                "[CENTER][FONT=Arial][size=14px][COLOR=#ff0000]Примечание:[/COLOR][CENTER]Укажите таймкоды по следующему примеру:[CENTER]1) Условия сделки.[CENTER]2) Подтверждение сделки.[CENTER]3) Начало сделки.[CENTER]4) Конец сделки.[/FONT][/size][/CENTER]" +
                "[CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Более 72-х часов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения.[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва загружены не там',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Доказательства загружены в постороннем приложении. Загрузка доказательств в Соц. сетях и т.п запрещается, доказательства должны быть загружены исключительно на фото/видео хостинге (YouTube, Yapx, Imgur). [/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Условия сделки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]В ваших доказательствах отсутствуют условия сделки. [/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ознакомиться с правилами подачи жалоб на игроков можно[URL='https://forum.kingrussia.com/index.php?threads/108/'] [U] «В данном разделе»[/U][/URL][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Доказательств на нарушение от данного игрока недостаточно.[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]В данной ситуации необходим фрапс (запись экрана).[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва не открываются',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваши доказательства не открываются. [/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Отказано.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Жалоба от 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#ff0000]Закрыто.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Ошиблись сервером',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. [/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][FONT=Arial][size=14px][COLOR=#ff0000]Жалоба закрыта от ошибки в сервере и находится на рассмотрении администрации вашего сервера.[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
            status: false,
        },
    ];

    const biography2 = [
        {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Ответы Рп биографий✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
        },
        {
            title: 'Взять рп биографию на рассмотрение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша рп биография находится - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'Отказаная рп биография',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша рп биография была рассмотрена.[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Отказано..[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'Одобреная рп биография',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша рп биография была рассмотрена.[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Ответы Рп ситуаций✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
        },
        {
            title: 'Взять рп ситуацию на рассмотрение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 215, 0)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша рп ситуация находится - [COLOR=#FFA500]На рассмотрении...[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'Отказаная рп ситуация',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша рп ситуация была рассмотрена.[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Отказано[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
        {
            title: 'Одобреная рп ситуация',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
            content: "[B][CENTER][FONT=Arial][size=14px][CENTER]Приветствую, уважаемый игрок [COLOR=orange] {{ user.name }}[/color].[/FONT][/size][/CENTER]" +
                "[B][CENTER][FONT=Arial][size=14px]Ваша рп ситуация была рассмотрена.[/FONT][/size][/CENTER][/B]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]Выношу вердикт - [COLOR=#00FF00]Одобрено[/COLOR][/FONT][/size][/CENTER]<br><br>" +
                "[B][CENTER][size=14px][font=Arial]Благодарим вас за ваше обращение.[/size][/font][/CENTER]<br>" +
                "[B][CENTER][FONT=Arial][size=14px]С уважением, Старшая Администрация [COLOR=rgb(255,200,0)]King Russia[/color].[/FONT][/size][/CENTER][/B]",
        },
    ];

    const tasks = [
        {
            title: 'В заявки с ответом на игроков(отказ)',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
            prefix: UNACCEPT_PREFIX,
            move: 162,
        },
        {
            title: 'В заявки с ответом на лд(отказ)',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #8B0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
            prefix: UNACCEPT_PREFIX,
            move: 165,
        },
        {
            title: 'В заявки с ответом на игроков(одобрено)',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
            prefix: ACCEPT_PREFIX,
            move: 162,
        },
        {
            title: 'В заявки с ответом на лд(одобрено)',
            dpstyle: 'font-family: Oswald; font-size: 10px; color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
            prefix: ACCEPT_PREFIX,
            move: 165,
        },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('ОТВЕТЫ', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: 2px solid; background: #FF8C00');
        addButton('Для РП БИО/ЖБ', 'selectBiographyAnswer2', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: 2px solid; background: #483D8B');
        addButton('Главный Администратор', 'GlavAdm', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(139, 0, 0);');
        addButton('Технический Отдел', 'techspec', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
        addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 215, 0);');
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
        addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
        addButton('ПЕРЕМЕЩЕНИЕ', 'selectMoveTask', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; background: #4682B4');

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#unaccept').click(() => editThreadData2(UNACCEPT_PREFIX, false));
        $('button#accepted').click(() => editThreadData2(ACCEPT_PREFIX, false));
        $('button#pin').click(() => editThreadData2(PIN_PREFIX, true));
        $('button#GlavAdm').click(() => editThreadData2(GA_PREFIX, true));
        $('button#techspec').click(() => editThreadData2(TEX_PREFIX, true));

        $('button#selectBiographyAnswer').click(() => {
            XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
            biography.forEach((btn, id) => {
                if (id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                }
            });
        });

        $('button#selectBiographyAnswer2').click(() => {
            XF.alert(buttonsMarkup(biography2), null, 'Выберите ответ:');
            biography2.forEach((btn, id) => {
                if (id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
                }
            });
        });

        $('button#selectMoveTask').click(() => {
            XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
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

    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button ` +
                    `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
            )
            .join('')}</div>`;
    }

    function pasteContent2(id, data = {}, send = false) {
        const template = Handlebars.compile(biography[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true && biography[id].prefix) {
            editThreadData2(biography[id].prefix, biography[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent3(id, data = {}, send = false) {
        const template = Handlebars.compile(biography2[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true && biography2[id].prefix) {
            editThreadData2(biography2[id].prefix, biography2[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function getThreadData() {
        const authorElement = $('a.username')[0];
        if (!authorElement) {
            return {
                user: {
                    id: 0,
                    name: 'Игрок',
                    mention: '[USER=0]Игрок[/USER]',
                },
                greeting: () => 'Добрый день',
            };
        }
        
        const authorID = authorElement.getAttribute('data-user-id');
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

    function editThreadData2(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitleElement = $('.p-title-value')[0];
        if (!threadTitleElement) {
            console.error('Не найден элемент с заголовком темы');
            return;
        }
        
        const threadTitle = threadTitleElement.lastChild ? threadTitleElement.lastChild.textContent : threadTitleElement.textContent;

        const formData = new FormData();
        formData.append('prefix_id', prefix);
        formData.append('title', threadTitle);
        formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', document.URL.split(XF.config.url.fullBase)[1]);
        formData.append('_xfWithData', 1);
        formData.append('_xfResponseType', 'json');
        
        if (pin) {
            formData.append('sticky', 1);
        }

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: formData,
        }).then(() => location.reload());
    }

    function moveThread(prefix, type) {
        // Функция перемещения тем
        const threadTitleElement = $('.p-title-value')[0];
        if (!threadTitleElement) {
            console.error('Не найден элемент с заголовком темы');
            return;
        }
        
        const threadTitle = threadTitleElement.lastChild ? threadTitleElement.lastChild.textContent : threadTitleElement.textContent;

        const formData = new FormData();
        formData.append('prefix_id', prefix);
        formData.append('title', threadTitle);
        formData.append('target_node_id', type);
        formData.append('redirect_type', 'none');
        formData.append('notify_watchers', 1);
        formData.append('starter_alert', 1);
        formData.append('starter_alert_reason', "");
        formData.append('_xfToken', XF.config.csrf);
        formData.append('_xfRequestUri', document.URL.split(XF.config.url.fullBase)[1]);
        formData.append('_xfWithData', 1);
        formData.append('_xfResponseType', 'json');

        fetch(`${document.URL}move`, {
            method: 'POST',
            body: formData,
        }).then(() => location.reload());
    }
})();

